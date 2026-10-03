"""Run with Vite dev server on port 5173; uses externally installed Playwright."""
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE='http://127.0.0.1:5173'
OUT=Path('/tmp/travel-template-verification'); OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True)
    for width in (320,390,820,1440):
        page=browser.new_page(viewport={'width':width,'height':900},has_touch=width<1024)
        errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(BASE+'/?template=travel-template-v1')
        page.get_by_text('地图未配置：完整文字行程仍可使用。').wait_for()
        assert page.locator('.date-strip').count()==1 and page.get_by_role('tab').count()==0
        assert page.locator('.place-card').count()==7
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        box=page.locator('.map-canvas-wrap').bounding_box()
        assert (220<=box['height']<=320) if width<768 else (320<=box['height']<=400) if width<1024 else True
        map_box=page.locator('.map-panel').bounding_box(); timeline=page.locator('.itinerary').bounding_box()
        assert timeline['y']>map_box['y'] if width<1024 else timeline['x']>map_box['x']
        groups=page.locator('.restaurant-group')
        assert groups.nth(0).locator('.restaurant-row').count()==3
        groups.nth(0).get_by_role('button',name='展开更多候选（4）').click()
        assert groups.nth(0).locator('.restaurant-row').count()==4
        assert groups.nth(1).locator('.restaurant-row').count()==3
        page.locator('#stop-s3').get_by_role('button',name='在地图看',exact=True).click()
        assert 'selected' in page.locator('#stop-s3').get_attribute('class')
        page.locator('.place-preview').get_by_role('button',name='查看行程',exact=True).click()
        page.wait_for_function("document.getElementById('stop-s3').getBoundingClientRect().top < 100")
        expand=page.get_by_role('button',name='放大地图',exact=True);expand.click()
        assert page.get_by_role('dialog',name='当天地图').count()==1
        assert page.locator('.map-canvas').count()==1
        assert page.evaluate('document.body.style.overflow')=='hidden'
        page.keyboard.press('Escape')
        assert page.get_by_role('dialog').count()==0
        assert expand.evaluate('(el)=>el===document.activeElement')
        page.get_by_role('button',name='收起地图',exact=True).click()
        assert page.locator('.map-canvas-wrap').bounding_box()['height']==0
        page.get_by_role('button',name='展开地图',exact=True).click()
        if width<768:
            assert page.locator('.mobile-quick-nav').is_visible()
            page.get_by_role('button',name='操作地图',exact=True).click()
            assert page.locator('.map-canvas').evaluate('(el)=>getComputedStyle(el).touchAction')=='none'
            page.get_by_role('button',name='完成',exact=True).click()
            assert page.locator('.map-canvas').evaluate('(el)=>getComputedStyle(el).touchAction')=='pan-y'
            page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            assert page.locator('.sources').bounding_box()['y']+page.locator('.sources').bounding_box()['height']<=page.locator('.mobile-quick-nav').bounding_box()['y']
        page.evaluate('window.scrollTo(0,0)')
        page.screenshot(path=str(OUT/f'template-{width}.png'),full_page=True)
        assert not errors,errors
        print(f'PASS {width}px: layout, no configuration, cards, independent dining, modal focus, overflow, safe bottom nav')
        page.close()
    page=browser.new_page(viewport={'width':1440,'height':900})
    for query in ('&mapSide=right','&layout=stacked'):
        page.goto(BASE+'/?template=travel-template-v1'+query)
        page.get_by_role('heading',name='当天行程').wait_for()
        a=page.locator('.map-panel').bounding_box();b=page.locator('.itinerary').bounding_box()
        assert a['x']>b['x'] if 'right' in query else b['y']>a['y']
    page.goto(BASE+'/')
    page.get_by_role('button',name='Day 2',exact=True).click()
    assert page.get_by_text('Day 2: Choose a new route.').is_visible()
    print('PASS alternate desktop layouts and original demo')
    touch=browser.new_page(viewport={'width':390,'height':900},has_touch=True,is_mobile=True)
    touch.goto(BASE+'/?template=travel-template-v1')
    touch.locator('.map-canvas').scroll_into_view_if_needed()
    touch.wait_for_timeout(100)
    session=touch.context.new_cdp_session(touch)
    bounds=touch.locator('.map-canvas').bounding_box()
    x=bounds['x']+bounds['width']/2; y=bounds['y']+bounds['height']*.8
    initial=touch.evaluate('scrollY')
    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
    for offset in (20,40,60,80,100):
        session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-offset}]})
    session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    touch.wait_for_timeout(200)
    assert touch.evaluate('scrollY')>initial
    touch.close()
    print('PASS emulated native touch scrolling over inactive map (not physical-device validation)')
    page.goto(BASE+'/tests/harness.html')
    page.wait_for_function('window.fixture && window.fixture.requests.length===3')
    page.wait_for_function("window.adapterTests === 'passed'")
    assert page.locator('img[src="/never-embed-unknown.jpg"]').count()==0
    assert page.get_by_role('link',name='不安全链接').count()==0
    assert page.get_by_role('link',name='在开发示例平台搜索 ↗').count()==1
    page.locator('#stop-s3').get_by_role('button',name='查看大图：开发示意图，不是真实景点').click()
    assert page.get_by_role('dialog',name='图片大图').count()==1
    page.keyboard.press('Escape')
    assert page.get_by_role('dialog').count()==0
    page.evaluate("window.fixture.select('hotel')")
    assert page.locator('.place-preview').get_by_role('button',name='查看行程').count()==2
    assert 'selected' in page.locator('#stop-s2').get_attribute('class')
    page.wait_for_timeout(100)
    y=page.evaluate('scrollY')
    page.evaluate("window.fixture.select('academy')")
    page.wait_for_timeout(100)
    assert page.evaluate('scrollY')==y
    page.evaluate('window.fixture.drag()')
    page.wait_for_timeout(100)
    fits=page.evaluate('window.fixture.fits.length')
    page.evaluate("window.fixture.resolve('l1',true)")
    page.get_by_text('路线不可用（test-failure），不绘制猜测路径。').wait_for()
    assert page.evaluate('window.fixture.fits.length')==fits
    assert page.get_by_text('开发测试地图（非高德线上地图）').is_visible()
    page.get_by_role('button',name='重试路线',exact=True).click()
    page.wait_for_function('window.fixture.requests.length===6')
    page.get_by_role('tab').nth(1).click()
    page.wait_for_function("window.fixture.requests.includes('f2l1')")
    page.evaluate("window.fixture.resolve('l2'); window.fixture.resolve('l3'); window.fixture.resolve('f2l1')")
    page.wait_for_timeout(150)
    assert page.locator('.place-preview').count()==0
    assert page.evaluate("window.fixture.renders.at(-1).places.every(id=>['hotel','optional'].includes(id))")
    assert page.evaluate("window.fixture.renders.at(-1).legs.every(id=>id==='f2l1')")
    assert page.evaluate('window.fixture.mounted')==1
    page.get_by_role('button',name='放大地图',exact=True).click();page.keyboard.press('Escape')
    assert page.evaluate('window.fixture.mounted')==1
    page.get_by_role('tab').nth(0).click()
    page.wait_for_timeout(100)
    page.get_by_role('tab').nth(1).click()
    page.wait_for_timeout(100)
    assert page.evaluate("window.fixture.requests.filter(id=>id==='f2l1').length") == 1
    page.get_by_role('tab').nth(0).click()
    page.get_by_role('button',name='餐饮点',exact=True).click()
    page.wait_for_function("window.fixture.renders.at(-1).places.includes('food1')")
    page.get_by_role('tab').nth(1).click()
    assert page.get_by_role('button',name='餐饮点',exact=True).get_attribute('aria-pressed')=='true'
    page.wait_for_function("window.fixture.renders.at(-1).places.includes('food1') && !window.fixture.renders.at(-1).places.includes('station')")
    page.get_by_role('tab').nth(1).focus();page.keyboard.press('ArrowLeft')
    assert page.get_by_role('tab').nth(0).get_attribute('aria-selected')=='true'
    group=page.locator('.restaurant-group').nth(0)
    group.get_by_label('距离上限（米）').fill('500')
    assert group.locator('.restaurant-row').count()==0
    assert group.get_by_text('没有满足筛选条件的候选。').is_visible()
    group.get_by_label('距离上限（米）').fill('')
    assert group.locator('.restaurant-row').count()==3
    print('PASS map test adapter: same-place stops, no surprise scroll, error retention/retry, late response race, single map instance, session cache, image and link guards')
    page.goto(BASE+'/tests/harness.html?fail=sdk')
    page.get_by_text('地图 SDK 加载失败。').wait_for()
    page.evaluate('window.fixture.failMount=false')
    page.get_by_role('button',name='重试地图',exact=True).click()
    page.get_by_text('开发测试地图（非高德线上地图）').wait_for()
    assert page.evaluate('window.fixture.destroyed')==1
    print('PASS simulated SDK retry and AMap boundary normalization, partial geometry, CRS guard, cancellation')
    page.close();browser.close()
