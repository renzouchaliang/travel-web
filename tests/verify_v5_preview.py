from playwright.sync_api import sync_playwright
MOCK='''(() => {
window.mapChecks={queries:[],fits:[],lines:[]};
class Marker {constructor(o){this.o=o;} on(){} off(){} setzIndex(){}}
class Polyline {constructor(o){this.o=o;}}
class Map {on(n,f){if(n==='complete')queueMicrotask(f);} remove(){window.mapChecks.lines=[];} add(items){window.mapChecks.lines=items.filter(x=>x instanceof Polyline).map(x=>x.o);} setFitView(ms){window.mapChecks.fits.push(ms.map(m=>m.o.position));} setZoomAndCenter(z,p){window.mapChecks.fits.push([p]);} setStatus(){} resize(){} destroy(){}}
class Planner {constructor(o){} clear(){} search(a,b,cb){window.mapChecks.queries.push([a,b]); queueMicrotask(()=>cb('complete',{routes:[{steps:[{path:[a,b]}],time:900,distance:1000}],plans:[{segments:[{transit_mode:'SUBWAY',transit:{path:[a,b],lines:[{name:'地铁4号线'}]}}],time:1800,distance:4000}]}));}}
class Transfer extends Planner {search(a,b,cb){super.search(a,b,(status,data)=>cb(status,{plans:data.plans}));}}
window.AMap={Map,Marker,Polyline,Walking:Planner,Transfer,plugin:(n,cb)=>cb()};
})()'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [320,390,820,1440]:
  page=b.new_page(viewport={'width':width,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script(MOCK)
  page.goto('http://127.0.0.1:5173/?trip=changsha-2026-10',wait_until='domcontentloaded')
  page.wait_for_function('window.mapChecks.queries.length===2 && window.mapChecks.lines.length===2')
  assert page.get_by_role('tab').count()==4
  assert page.locator('.place-media img').count()==2
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  checks=page.evaluate('window.mapChecks')
  assert all(q[0][0]!=113.06551 and q[1][0]!=113.06551 for q in checks['queries'])
  assert all(c[0]!=113.06551 for c in checks['fits'][0])
  assert len(checks['lines'])==2
  text=page.locator('body').inner_text()
  for forbidden in ['资料来源','图源：','核查时间','评分暂无','未确认','estimate']:assert forbidden not in text,forbidden
  page.locator('.restaurant-group').first.get_by_role('button',name='再看 1 家备选').click()
  assert page.locator('.restaurant-group').first.locator('.restaurant-row').count()==4
  page.get_by_role('tab').nth(2).click();assert page.get_by_text('这一天的行程待补充').is_visible();assert page.locator('.place-card').count()==0
  page.get_by_role('tab').nth(1).click();assert page.locator('.place-card').count()>0
  page.get_by_role('tab').first.click();page.get_by_role('button',name='放大地图',exact=True).click();assert page.get_by_role('dialog').count()==1;page.keyboard.press('Escape');assert page.get_by_role('dialog').count()==0
  page.screenshot(path=f'/tmp/travel-v5-{width}.png',full_page=True)
  assert not errors,errors
  print('PASS',width,'four days, blank date, V5 media, dining, modal, real route calls, station excluded')
  page.close()
 b.close()
