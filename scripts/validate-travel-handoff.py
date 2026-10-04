#!/usr/bin/env python3
"""Validate structure and references without rewriting or researching travel data."""
import argparse,json,sys
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
import jsonschema
parser=argparse.ArgumentParser()
parser.add_argument('file',type=Path)
parser.add_argument('--require-ready',action='store_true')
args=parser.parse_args()
schema_path=Path(__file__).resolve().parents[1]/'docs/handoff-v1/travel-handoff.schema.json'
if not schema_path.exists():schema_path=Path(__file__).resolve().parents[1]/'travel-handoff.schema.json'
schema=json.loads(schema_path.read_text())
data=json.loads(args.file.read_text())
errors=[f"{'.'.join(map(str,e.absolute_path)) or '<root>'}: {e.message}" for e in jsonschema.Draft202012Validator(schema,format_checker=jsonschema.FormatChecker()).iter_errors(data)]
if errors:
 print('\n'.join(errors));sys.exit(1)
t=data['trip'];seen=set();places=t['places'];sources={s['id'] for s in t['sources']};warnings=[]
def err(path,message):errors.append(f'{path}: {message}')
def unique(value,path):
 if value in seen:err(path,'duplicate global ID '+value)
 seen.add(value)
def place(value,path):
 if value not in places:err(path,'missing place '+value)
def refs(values,path):
 for value in values:
  if value not in sources:err(path,'missing source '+value)
def bounds(value,path):
 if value and value['min']>value['max']:err(path,'min exceeds max')
unique(t['id'],'trip.id')
try:ZoneInfo(t['timezone'])
except ZoneInfoNotFoundError:err('trip.timezone','unknown IANA timezone')
existing=set()
if args.require_ready:
 for candidate in (Path(__file__).resolve().parents[1]/'src/trips').rglob('*.json'):
  try:
   stored=json.loads(candidate.read_text());stored_trip=stored.get('trip',stored)
   if isinstance(stored_trip,dict) and stored_trip.get('id'):existing.add(stored_trip['id'])
  except (OSError,ValueError):pass
 if data['publishAction']=='create' and t['id'] in existing:err('trip.id','create would overwrite existing trip; choose new ID or explicitly use update')
 if data['publishAction']=='update' and t['id'] not in existing:err('trip.id','update target not found in stored trip JSON; verify registry before publishing')
if args.require_ready and data['handoffStatus']!='ready':err('handoffStatus','publishing requires ready; reference/draft must not be published')
for i,s in enumerate(t['sources']):unique(s['id'],f'trip.sources.{i}.id')
for key,p in places.items():
 path='trip.places.'+key;unique(p['id'],path+'.id')
 if key!=p['id']:err(path,'dictionary key must match id')
 for fact in ['opening','ticket','booking']:
  if fact in p:refs(p[fact]['sourceIds'],path+'.'+fact+'.sourceIds')
 for field in ['photos','links']:
  for i,item in enumerate(p[field]):unique(item['id'],f'{path}.{field}.{i}.id')
 bounds(p.get('suggestedStayMinutes'),path+'.suggestedStayMinutes')
 if 'rating'in p and p['rating']['value']>p['rating']['scale']:err(path+'.rating','rating exceeds scale')
 if p.get('coordinate',{}).get('crs') not in [None,'GCJ02']:warnings.append(path+': map skips non-GCJ02 coordinates')
for i,d in enumerate(t['days']):
 path=f'trip.days.{i}';unique(d['id'],path+'.id');stop_ids=[s['id'] for s in d['stops']]
 if args.require_ready and not d.get('date'):err(path+'.date','publishing requires each day date')
 for j,s in enumerate(d['stops']):
  sp=f'{path}.stops.{j}';unique(s['id'],sp+'.id');place(s['placeId'],sp+'.placeId');bounds(s.get('stayMinutes'),sp+'.stayMinutes')
 for j,l in enumerate(d['legs']):
  lp=f'{path}.legs.{j}';unique(l['id'],lp+'.id');refs(l['sourceIds'],lp+'.sourceIds');bounds(l.get('plannedMinutes'),lp+'.plannedMinutes')
  for field in ['fromStopId','toStopId']:
   if l[field] not in stop_ids:err(lp+'.'+field,'missing stop '+l[field])
  if all(l[k] in stop_ids for k in ['fromStopId','toStopId']) and stop_ids.index(l['fromStopId'])>=stop_ids.index(l['toStopId']):err(lp,'origin must precede destination')
  for field in ['routingFromPlaceId','routingToPlaceId']:
   if field in l:place(l[field],lp+'.'+field)
  for value in l.get('viaPlaceIds',[]):place(value,lp+'.viaPlaceIds')
  if l.get('mapDisplay')!='text-only':
   endpoints=[]
   for stop_key,override in [('fromStopId','routingFromPlaceId'),('toStopId','routingToPlaceId')]:
    sid=l[stop_key];pid=l.get(override) or next((s['placeId'] for s in d['stops'] if s['id']==sid),None);p=places.get(pid,{})
    endpoints.append(p)
   if any(p.get('coordinate',{}).get('crs')!='GCJ02' for p in endpoints):warnings.append(lp+': map routing lacks exact GCJ02 endpoints; keep text')
   if l['mode']=='transit' and any(not p.get('providerIds',{}).get('amapCity') for p in endpoints):warnings.append(lp+': transit city metadata missing; keep text')
 for j,g in enumerate(d['restaurantGroups']):
  gp=f'{path}.restaurantGroups.{j}';unique(g['id'],gp+'.id');place(g['anchorPlaceId'],gp+'.anchorPlaceId')
  for k,c in enumerate(g['candidates']):
   cp=f'{gp}.candidates.{k}';place(c['placeId'],cp+'.placeId')
   if c.get('distance'):place(c['distance']['originPlaceId'],cp+'.distance.originPlaceId')
   if c['placeId'] in places and places[c['placeId']]['kind']!='restaurant':err(cp+'.placeId','candidate must refer to restaurant')
 for value in d['nearbyPlaceIds']:place(value,path+'.nearbyPlaceIds')
 if 'returnPlaceId'in d:place(d['returnPlaceId'],path+'.returnPlaceId')
 if d.get('visual',{}).get('poem',{}).get('lines') and any(len(line)>14 for line in d['visual']['poem']['lines']):warnings.append(path+'.visual.poem: long lines should be reviewed for mobile layout')
dates=[d['date'] for d in t['days'] if d.get('date')]
if len(set(dates))!=len(dates) or dates!=sorted(dates):err('trip.days','dates must be unique and ordered')
for value in errors:print('ERROR',value)
for value in warnings:print('NOTE',value)
if errors:sys.exit(1)
print('PASS schema and references; status='+data['handoffStatus']+'; factual verification remains upstream')
