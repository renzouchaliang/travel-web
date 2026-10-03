"""Validate the immutable source export and cross-check its companion; no network."""
import hashlib
import json
import re
from pathlib import Path
from collections import Counter
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'src/trips/changsha-2026/trip-changsha-2026.json'
MD=ROOT/'src/trips/changsha-2026/trip-changsha-2026.md'
def unique_keys(pairs):
    result={}
    for key,value in pairs:
        assert key not in result, f'Duplicate JSON object key: {key}'
        result[key]=value
    return result
x=json.loads(DATA.read_text(), object_pairs_hook=unique_keys)
assert x['schemaVersion']=='1.0'
t=x['trip']; days=t['days']; sources={s['id'] for s in x['sources']}
assert [d['date'] for d in days]==['2026-10-02','2026-10-03','2026-10-04','2026-10-05']
assert (t['startDate'],t['endDate'])==(days[0]['date'],days[-1]['date'])
assert len(sources)==len(x['sources'])
assert t['returnTransport']['departureTime']=='20:40'
assert t['hotel']['nights']==3
stop_ids=[];links=[];missing_stops=[];missing_food=[];coordinates=0;dining_count=0
for day in days:
    assert day['status'] in ('confirmed','tentative','unknown')
    if day['stops'] is None:
        assert day['status']=='unknown'
        continue
    stops=day['stops']; ids=[s['id'] for s in stops]; stop_ids+=ids
    for s in stops:
        assert s['status'] in ('confirmed','tentative','unknown')
        assert set(s['sourceIds'])<=sources
        assert isinstance(s['imageUrls'],list) and not s['imageUrls'], 'No publishable images supplied'
        for field in ('arrivalTime','departureTime'):
            assert s[field] is None or re.fullmatch(r'(?:[01]\d|2[0-3]):[0-5]\d',s[field])
        if s['nextStopId'] is not None:
            assert ids.index(s['nextStopId'])==ids.index(s['id'])+1
        if s['nextLegId'] is not None:
            leg=next(l for l in t['routeLegs'] if l['id']==s['nextLegId'])
            assert (leg['fromStopId'],leg['toStopId'])==(s['id'],s['nextStopId'])
        if s['lat'] is None or s['lng'] is None:
            assert s['lat'] is None and s['lng'] is None
            missing_stops.append(s['id'])
        else:
            assert -90<=s['lat']<=90 and -180<=s['lng']<=180
            c=s['coordinateReference'];assert (c['lat'],c['lng'],c['crs'])==(s['lat'],s['lng'],'GCJ02')
            coordinates+=1
    for field in ('startLocationId','endLocationId'):
        assert day[field] is None or day[field] in ids
    for group in day['dining'] or []:
        assert group['initialVisible']==3
        for r in group['restaurants']:
            dining_count+=1
            assert set(r['sourceIds'])<=sources
            assert r['selectionStatus']=='candidate'
            assert r['rating'] is None and r['businessStatus'] is None
            if r['lat'] is None or r['lng'] is None:
                assert r['lat'] is None and r['lng'] is None
                missing_food.append(r['id'])
            else: assert -90<=r['lat']<=90 and -180<=r['lng']<=180
            if r['distance']:
                assert r['distance']['kind'] in ('straight','walking','driving')
                assert r['distance']['meters']>=0 and r['distance']['origin']
assert not [k for k,n in Counter(stop_ids).items() if n>1]
assert len({l['id'] for l in t['routeLegs']})==len(t['routeLegs'])
for leg in t['routeLegs']:
    ids=[s['id'] for s in days[leg['day']-1]['stops']]
    assert ids.index(leg['fromStopId'])<ids.index(leg['toStopId'])
    assert set(leg['sourceIds'])<=sources
    assert leg['geometry'] is None
md=MD.read_text();scalar_count=0;null_count=0
# Validate every exported scalar against the companion; the JSON remains authoritative.
def walk(value,path=''):
    global scalar_count,null_count
    if isinstance(value,dict):
        for key,v in value.items(): walk(v,path+'.'+key)
    elif isinstance(value,list):
        for i,v in enumerate(value):walk(v,f'{path}[{i}]')
    else:
        scalar_count+=1;null_count+=value is None
        assert json.dumps(value,ensure_ascii=False) in md, f'Companion mismatch: {path}'
        if isinstance(value,str) and value.startswith(('https://','http://')):
            u=urlparse(value);assert u.hostname and not u.username and not u.password
            links.append(value)
walk(x)
assert set(missing_stops)==set(x['validation']['missingCoordinates'])
assert len(missing_food)==8 and dining_count==12
assert x['validation']['timeValidationComplete'] is False
assert days[2]['stops'] is None and days[2]['dining'] is None
assert days[3]['stops'][-1]['arrivalTime'] is None and days[3]['stops'][-1]['departureTime'] is None
print(json.dumps({'result':'passed','days':len(days),'stops':len(stop_ids),'routeLegs':len(t['routeLegs']),'diningCandidates':dining_count,'missingStopCoordinates':missing_stops,'missingRestaurantCoordinates':missing_food,'nullValuesPreserved':null_count,'companionScalarsChecked':scalar_count,'uniqueProvidedUrls':len(set(links)),'sourceTimeWarnings':x['validation']['timeConflicts'],'sha256':hashlib.sha256(DATA.read_bytes()).hexdigest()},ensure_ascii=False,indent=2))
