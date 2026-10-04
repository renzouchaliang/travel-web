from playwright.sync_api import sync_playwright
MOCK='''(() => {
window.mapChecks={queries:[],fits:[],lines:[],markers:[],zoom:12,events:{},popups:0,interactive:false};
class Marker {constructor(o){this.o=o;} on(){} off(){} setzIndex(){} show(){if(this.o.content)this.o.content.hidden=false;} hide(){if(this.o.content)this.o.content.hidden=true;}}
class Polyline {constructor(o){this.o=o;}}
class Map {constructor(el){this.el=el;} on(n,f){if(n==='complete')queueMicrotask(f);window.mapChecks.events[n]=f;} off(n){delete window.mapChecks.events[n];} getZoom(){return window.mapChecks.zoom;} getZooms(){return [3,20];} setZoom(z){window.mapChecks.zoom=z;window.mapChecks.events.zoomend?.();} remove(){window.mapChecks.lines=[];this.el.replaceChildren();} add(items){window.mapChecks.lines=items.filter(x=>x instanceof Polyline).map(x=>x.o);window.mapChecks.markers=items.filter(x=>x instanceof Marker).map(x=>x.o); for(const marker of window.mapChecks.markers)if(marker.content)this.el.append(marker.content);} setFitView(ms){window.mapChecks.fits.push(ms.map(m=>m.o.position));} setZoomAndCenter(z,p){window.mapChecks.zoom=z;window.mapChecks.fits.push([p]);window.mapChecks.events.zoomend?.();} setStatus(s){window.mapChecks.interactive=s.dragEnable&&s.touchZoom;} resize(){} destroy(){this.el.replaceChildren();}}
class InfoWindow {constructor(){window.mapChecks.popups++;} setContent(){} open(){} close(){}}

class Planner {constructor(o){} clear(){} search(a,b,cb){window.mapChecks.queries.push([a,b]); queueMicrotask(()=>cb('complete',{routes:[{steps:[{path:[a,b]}],time:900,distance:1000}],plans:[{segments:[{transit_mode:'SUBWAY',transit:{path:[a,b],lines:[{name:'地铁4号线'}]}}],time:1800,distance:4000}]}));}}
class Transfer extends Planner {search(a,b,cb){super.search(a,b,(status,data)=>cb(status,{plans:data.plans}));}}
window.AMap={Map,Marker,Polyline,InfoWindow,Walking:Planner,Transfer,plugin:(n,cb)=>cb()};
})()'''
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [320,390,820,1440]:
  page=b.new_page(viewport={'width':width,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script(MOCK)
  page.goto('http://127.0.0.1:5173/?trip=changsha-2026-10',wait_until='domcontentloaded')
  page.wait_for_function('window.mapChecks.queries.length===2 && window.mapChecks.lines.length===2')
  assert page.locator('.day-tabs [role=tab]').count()==4
  colors=page.locator('.day-tabs [role=tab]').evaluate_all('(els)=>els.map(e=>getComputedStyle(e).getPropertyValue("--day-tab-color"))')
  assert len(set(colors))==4
  assert page.locator('.map-controls button').all_inner_texts()==['总览','餐饮点','探索','全屏']
  boxes=[button.bounding_box() for button in page.locator('.map-controls button').all()]
  assert len(set(round(box['y']) for box in boxes))==1
  assert page.locator('.map-equivalent').get_attribute('open') is None
  assert page.locator('.nearby-pin').count()==0
  page.locator('.route-chips button').nth(1).click()
  assert page.locator('.nearby-pin').count()==0
  page.get_by_role('button',name='探索',exact=True).click()
  assert page.locator('.nearby-pin').count()==3
  page.locator('.map-equivalent summary').click()
  page.locator('.map-equivalent button').filter(has_text='自卑亭').click()
  page.get_by_role('button',name='探索',exact=True).click()
  assert page.locator('.nearby-pin').count()==0
  assert page.get_by_role('button',name='探索',exact=True).get_attribute('aria-pressed')=='false'
  page.get_by_role('button',name='探索',exact=True).click()
  page.locator('.day-tabs [role=tab]').nth(1).click()
  page.locator('.day-tabs [role=tab]').first.click()
  assert page.get_by_role('button',name='探索',exact=True).get_attribute('aria-pressed')=='false'
  assert page.locator('.nearby-pin').count()==0
  assert page.get_by_role('link',name='美团 ↗').count()==4
  assert page.locator('#stop-d1-academy .ticket-actions').count()==0
  header_texts=[]
  header_colors=[]
  header_heights=[]
  for tab in page.locator('.day-tabs [role=tab]').all():
   tab.click()
   accent=tab.evaluate('(e)=>getComputedStyle(e).getPropertyValue("--day-tab-color").trim()')
   header_colors.append(page.locator('.trip-header').evaluate('(e)=>getComputedStyle(e).backgroundColor'))
   header_heights.append(page.locator('.trip-header').bounding_box()['height'])
   header_texts.append(page.locator('.trip-header').inner_text())
   assert page.locator('.trip-header').evaluate('(e)=>e.style.backgroundColor')==tab.evaluate('(e)=>{const d=document.createElement("div");d.style.color=getComputedStyle(e).getPropertyValue("--day-tab-color");return d.style.color}')
  assert len(set(header_texts))==1
  assert '4 天 · 2026年10月2日—10月5日' in header_texts[0]
  assert '希尔顿' not in header_texts[0] and '长沙南站' not in header_texts[0]
  assert len(set(header_colors))==4
  assert len(set(header_heights))==1
  assert header_heights[0]==(192 if width<768 else 208 if width<1024 else 224)
  assert page.locator('.map-heading h2, .map-sequence-note').count()==0
  location_link=page.locator('a.location-link').first
  assert ' '.join(location_link.inner_text().split())=='地图APP打开 📍'
  assert location_link.evaluate('(e)=>getComputedStyle(e).borderStyle')=='solid'
  assert location_link.bounding_box()['height']==page.locator('.place-card button.compact-map-button').first.bounding_box()['height']
  if width<768:
   assert page.locator('.mobile-quick-nav button').first.bounding_box()['height']==36
   assert page.locator('.mobile-quick-nav button').first.evaluate('(e)=>getComputedStyle(e).fontWeight')=='700'
   assert page.locator('.mobile-quick-nav button').first.evaluate('(e)=>getComputedStyle(e).borderRadius')=='0px'
  assert page.locator('#nearby .nearby-photo').count()==0
  page.locator('.day-tabs [role=tab]').first.click()
  assert page.get_by_role('button',name='展开地图',exact=True).count()==0
  assert page.get_by_role('button',name='收起地图',exact=True).count()==0
  from urllib.parse import urlparse,parse_qs
  navs=page.locator('.transit-leg a[href*="uri.amap.com/navigation"]')
  assert navs.count()==4
  for a in navs.all():
   query=parse_qs(urlparse(a.get_attribute('href')).query)
   assert query['from'] and query['to'] and query['mode'][0] in ['walk','bus']
   assert '高德地图导航' in a.inner_text()
  assert parse_qs(urlparse(page.locator('#leg-d1-l2 a').get_attribute('href')).query)['mode']==['bus']
  assert parse_qs(urlparse(page.locator('#leg-d1-l3 a').get_attribute('href')).query)['mode']==['walk']
  assert page.locator('.place-card a[href*="uri.amap.com/navigation"], .restaurant-row a[href*="uri.amap.com/navigation"], #nearby a[href*="uri.amap.com/navigation"]').count()==0
  assert page.locator('.place-card a[href*="uri.amap.com/marker"]').count()>0
  assert page.locator('body').inner_text().find('从当前位置出发')==-1
  assert page.locator('.day-summary .day-route').is_visible()
  assert '长沙南站' in page.locator('.day-summary .day-route').inner_text()
  assert '按所在位置选一家' not in page.locator('#dining').inner_text()
  if width<768:assert page.locator('.mobile-quick-nav button').first.evaluate('(e)=>getComputedStyle(e).fontSize')=='14px'
  assert page.evaluate('window.mapChecks.interactive')
  assert page.locator('.map-canvas').evaluate('(e)=>getComputedStyle(e).touchAction')=='none'
  assert page.get_by_role('button',name='操作地图',exact=True).count()==0
  page.get_by_role('button',name='探索',exact=True).click()
  assert page.locator('.nearby-pin').count()==3
  assert page.locator('.map-equivalent').get_attribute('open') is None
  assert len(page.evaluate('window.mapChecks.lines'))==2
  page.get_by_role('button',name='探索',exact=True).click()
  assert page.locator('.nearby-pin').count()==0
  assert page.locator('.restaurant-row h4 button, .restaurant-row h4 a').count()==0
  assert '大众点评 · 大众点评' not in page.locator('.restaurant-group').inner_text()
  assert page.locator('.place-media img').count()==2
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  checks=page.evaluate('window.mapChecks')
  assert all(q[0][0]!=113.06551 and q[1][0]!=113.06551 for q in checks['queries'])
  assert all(c[0]!=113.06551 for c in checks['fits'][0])
  assert len(checks['lines'])==2
  text=page.locator('body').inner_text()
  for forbidden in ['资料来源','图源：','核查时间','评分暂无','未确认','estimate']:assert forbidden not in text,forbidden
  assert page.locator('.route-chips').inner_text().find('希尔顿') == -1
  assert page.locator('.travel-map-label').filter(has_text='酒店').count()==1
  page.evaluate('window.mapChecks.zoom=12;window.mapChecks.events.zoomend()')
  page.get_by_role('button',name='餐饮点',exact=True).click()
  page.locator('.travel-map-dining').first.wait_for(state='attached')
  assert page.locator('.travel-map-dining:visible').count()==4
  assert page.locator('.travel-map-dining:visible').count()==4
  assert page.locator('.travel-map-dining .travel-map-label:visible').count()==0
  page.evaluate("window.mapChecks.zoom=14;window.mapChecks.events.zoomend()")
  assert page.locator('.travel-map-dining .travel-map-label:visible').count()==4
  assert '（' not in page.locator('.travel-map-dining').first.inner_text()
  page.locator('.dining-tabs [role=tab]').nth(1).click()
  assert page.locator('.restaurant-group').count()==1
  assert page.locator('.restaurant-group .restaurant-row').count()==4
  page.locator('#stop-d1-academy button.compact-map-button').click()
  assert page.locator('.travel-map-pin.active').count()==1
  assert page.evaluate('window.mapChecks.popups')==0
  assert page.locator('.place-preview').count()==0
  before_zoom=page.evaluate('window.mapChecks.zoom')
  page.get_by_role('button',name='放大一级',exact=True).click()
  assert page.evaluate('window.mapChecks.zoom')==before_zoom+1
  page.get_by_role('button',name='缩小一级',exact=True).click()
  assert page.evaluate('window.mapChecks.zoom')==before_zoom
  page.locator('.dining-tabs [role=tab]').nth(2).click()
  actions=page.locator('.restaurant-group .restaurant-row').first.locator('.card-actions')
  assert [' '.join(e.inner_text().split()) for e in actions.locator('a, button').all()]==['大众点评 ↗','美团 ↗','地图APP打开 📍','在地图看']
  page.locator('.restaurant-group button.compact-map-button').first.click()
  assert page.evaluate('window.mapChecks.zoom')==16
  assert page.locator('.travel-map-dining.active .travel-map-label').is_visible()
  assert page.evaluate('window.mapChecks.popups')==0
  assert page.locator('#leg-d1-l2').evaluate('(e)=>getComputedStyle(e).backgroundColor')!='rgba(0, 0, 0, 0)'
  assert page.locator('#stop-d1-academy .place-title-button').count()==0
  page.locator('.day-tabs [role=tab]').nth(2).click();assert page.get_by_text('这一天的行程待补充').is_visible();assert page.locator('.place-card').count()==0
  page.locator('.day-tabs [role=tab]').nth(1).click();assert page.locator('.place-card').count()>0
  page.locator('.day-tabs [role=tab]').first.click();page.get_by_role('button',name='全屏',exact=True).click();assert page.get_by_role('dialog').count()==1; assert page.get_by_role('button',name='退出全屏').is_visible(); assert page.locator('.map-canvas-wrap').bounding_box()['height']>650; page.get_by_role('button',name='放大一级').click(); assert page.evaluate('window.mapChecks.zoom')>=16; page.screenshot(path=f'/tmp/travel-map-full-{width}.png');page.keyboard.press('Escape');assert page.get_by_role('dialog').count()==0
  page.get_by_role('button',name='全屏',exact=True).click()
  assert page.locator('.map-controls button').all_inner_texts()==['总览','餐饮点','探索','退出全屏']
  boxes=[e.bounding_box() for e in page.locator('.map-controls button').all()]
  assert len(set(round(box['y']) for box in boxes))==1
  page.get_by_role('button',name='退出全屏',exact=True).click()
  assert page.get_by_role('dialog').count()==0
  page.screenshot(path=f'/tmp/travel-v5-{width}.png',full_page=True)
  if width==390:
   page.set_viewport_size({'width':844,'height':390})
   page.get_by_role('button',name='全屏',exact=True).click()
   assert page.locator('.map-canvas-wrap').bounding_box()['height']>280
   boxes=[e.bounding_box() for e in page.locator('.map-controls button').all()]
   assert len(set(round(box['y']) for box in boxes))==1
   page.get_by_role('button',name='退出全屏').click()
   assert page.get_by_role('dialog').count()==0
  page.locator('.day-tabs [role=tab]').nth(3).click()
  assert page.get_by_text('20:40 出发',exact=True).is_visible()
  assert page.locator('#nearby .nearby-row').count()==3
  page.locator('#nearby .nearby-row').nth(1).locator('summary').click()
  page.locator('#nearby .nearby-row').nth(1).get_by_role('button',name='在地图看',exact=True).click()
  assert page.locator('.day-tabs [role=tab]').first.get_attribute('aria-selected')=='true'
  assert page.get_by_role('button',name='探索').get_attribute('aria-pressed')=='true'
  assert page.locator('.nearby-pin.active .travel-map-label').inner_text()=='自卑亭'
  page.get_by_role('button',name='总览',exact=True).click()
  assert not page.locator('.travel-map-pin.active').count()
  if width==1440:
   page.route('**/__test_nearby.svg',lambda r:r.fulfill(status=200,content_type='image/svg+xml',body='<svg xmlns="http://www.w3.org/2000/svg" width="112" height="84"><rect width="112" height="84" fill="green"/></svg>'))
   page.evaluate("""async () => {
     const moduleUrl=performance.getEntriesByType('resource').find((e)=>e.name.includes('/changsha-2026/adapter.ts')).name;
     const {changshaTrip}=await import(moduleUrl);
     changshaTrip.days[0].visual={themeColor:'#ddbb66',headerImage:{src:'https://example.org/test-header.jpg',alt:'测试代表性图片',focalPoint:{x:35,y:60}}};
     changshaTrip.places.zibei.photos=[{id:'nearby-test',src:'/__test_nearby.svg',alt:'周边代表图测试',rights:'owned'}];
     for(const platform of ['美团','飞猪','携程']) changshaTrip.places.academy.links.push({id:'test-'+platform,platform,action:'booking',targetType:'detail',label:'买票',url:'https://example.org/ticket/'+encodeURIComponent(platform)});
   }""")
   page.locator('.day-tabs [role=tab]').nth(1).click()
   page.locator('.day-tabs [role=tab]').first.click()
   assert page.locator('.trip-header').evaluate('(e)=>e.style.backgroundColor')=='rgb(221, 187, 102)'
   assert 'test-header.jpg' in page.locator('.trip-header').evaluate('(e)=>e.style.backgroundImage')
   assert page.locator('.trip-header').bounding_box()['height']==224
   assert page.locator('.trip-header').evaluate('(e)=>e.style.backgroundPosition')=='35% 60%'
   row=page.locator('#nearby .nearby-row').nth(1)
   if row.get_attribute('open') is None:row.locator('summary').click()
   photo=row.locator('.nearby-photo')
   photo.scroll_into_view_if_needed()
   page.wait_for_function('document.querySelector(".nearby-photo").naturalWidth>0')
   assert photo.bounding_box()['width']==112 and photo.bounding_box()['height']==84
   assert photo.bounding_box()['x']>row.locator('.nearby-detail > div').bounding_box()['x']
   photo.dispatch_event('error')
   assert row.locator('.nearby-photo').count()==0
   assert row.locator('.nearby-detail').evaluate('(e)=>getComputedStyle(e).display')=='block'
   assert page.locator('#stop-d1-academy .ticket-actions a').count()==3
   assert [a.inner_text().strip() for a in page.locator('#stop-d1-academy .ticket-actions a').all()]==['美团 ↗','飞猪 ↗','携程 ↗']
   assert page.locator('#stop-d1-academy .place-media a[href*="example.org/ticket"]').count()==0
   page.locator('.day-tabs [role=tab]').nth(1).click()
   assert page.locator('.trip-header').evaluate('(e)=>e.style.backgroundImage')==''
  assert not errors,errors
  print('PASS',width,'four days, blank date, V5 media, dining, modal, real route calls, station excluded')
  page.close()
 b.close()
