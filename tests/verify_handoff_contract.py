"""Exercise schema, reference failures, update identity and the offline artifact."""
import copy,json,subprocess,tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
base=json.loads((root/'docs/handoff-v1/trip-changsha-reference.json').read_text())
def check(data,expected,required=False):
 with tempfile.NamedTemporaryFile(mode='w',suffix='.json') as f:
  json.dump(data,f);f.flush()
  cmd=['python3',str(root/'scripts/validate-travel-handoff.py'),f.name]
  if required:cmd+=['--require-ready']
  result=subprocess.run(cmd,text=True,capture_output=True)
  assert (result.returncode==0)==expected,result.stdout+result.stderr
  return result.stdout
check(base,True)
for mutation,fragment in [
 (lambda d:d['trip']['days'][0]['legs'][0].update(routingToPlaceId='missing-place'),'missing place'),
 (lambda d:d['trip']['days'][0]['legs'][0].update(toStopId=d['trip']['days'][0]['legs'][0]['fromStopId']),'origin must precede'),
 (lambda d:d['trip']['days'][0].update(visual={'themeColor':'bad'}),'themeColor'),
 (lambda d:d['trip']['places']['hotel'].update(coordinate=None),'coordinate'),
]:
 d=copy.deepcopy(base);mutation(d);assert fragment in check(d,False)
d=copy.deepcopy(base);d['handoffStatus']='ready';d['publishAction']='create';assert 'overwrite existing' in check(d,False,True)
d['publishAction']='update';check(d,True,True)
d['trip']['id']='new-unregistered-trip';assert 'target not found' in check(d,False,True)
d['publishAction']='create';check(d,True,True)
print('PASS handoff schema, missing references, route order, create/update collisions')
