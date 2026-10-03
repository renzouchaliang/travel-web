"""Vite dev-server integration test using the real adapter and a simulated AMap SDK."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True)
 for width in (390,1440):
  page=browser.new_page(viewport={'width':width,'height':900})
  errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  page.goto('http://127.0.0.1:5173/tests/amap-sequence.html')
  page.wait_for_function('window.mapTest && window.mapTest.markers.length===4')
  assert page.evaluate('window.mapTest.lines.length')==1
  assert page.evaluate('window.mapTest.lines[0].options.path.length')==4
  assert page.evaluate('window.mapTest.lines[0].options.strokeStyle')=='dashed'
  if width<768:
   page.get_by_role('button',name='操作地图',exact=True).click()
   assert page.evaluate('window.mapTest.interactive')
  page.locator('.map-canvas').get_by_role('button',name='长沙南站',exact=True).click()
  page.wait_for_function("window.mapTest.popup.includes('13:00')")
  assert '先去酒店' in page.evaluate('window.mapTest.popup')
  page.get_by_role('tab').nth(1).click()
  page.wait_for_function('window.mapTest.markers.length===0 && window.mapTest.lines.length===0')
  assert page.evaluate('window.mapTest.popup')==''
  page.get_by_role('tab').nth(2).click()
  assert page.evaluate('window.mapTest.markers.length')==0
  page.get_by_role('tab').nth(3).click()
  page.wait_for_function('window.mapTest.markers.length===1')
  page.locator('.map-canvas').get_by_role('button',name='长沙南站',exact=True).click()
  page.wait_for_function("window.mapTest.popup.includes('20:40')")
  assert '13:00' not in page.evaluate('window.mapTest.popup')
  assert '时间未确认' in page.evaluate('window.mapTest.popup')
  page.get_by_role('button',name='放大地图',exact=True).click()
  page.keyboard.press('Escape')
  assert page.evaluate('window.mapTest.mounts')==1
  page.get_by_role('tab').nth(0).click()
  page.get_by_role('button',name='餐饮点',exact=True).click()
  page.wait_for_function('window.mapTest.markers.length===8')
  assert page.evaluate('window.mapTest.lines[0].options.path.length')==4
  assert page.evaluate('window.mapTest.plannerCalls')==0
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  print(f'PASS {width}px: real adapter markers, dashed sequence, popup times, day clearing, layers, single instance, zero route calls')
  page.close()
 browser.close()
