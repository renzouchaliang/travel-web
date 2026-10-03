"""Production browser checks. Run npm run build and npm run preview first."""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://127.0.0.1:4173')
args=parser.parse_args()
base=args.base.rstrip('/')
out=Path('/tmp/changsha-verification');out.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True)
    for width in (390,820,1440):
        page=browser.new_page(viewport={'width':width,'height':900},has_touch=width<1024)
        errors=[];requests=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append(r.url))
        response=page.goto(base+'/?trip=changsha-2026-10')
        assert response.status==200
        page.get_by_role('heading',name='长沙旅行攻略',exact=True).wait_for()
        assert page.get_by_role('tab').count()==4
        assert page.locator('#stop-d1-arrival').is_visible()
        assert page.locator('#stop-d1-arrival').inner_text().find('13:00')>=0
        assert page.get_by_text('13:00抵达南站，交通估算60–90分钟；14:00到酒店只覆盖最短估算，最长估算为14:30。',exact=True).is_visible()
        assert page.locator('.place-card').count()==6
        assert page.locator('.transit-leg').count()==5
        assert page.locator('.restaurant-group').count()==3
        assert page.locator('.restaurant-row').count()==9
        for group in page.locator('.restaurant-group').all():
            group.get_by_role('button',name='展开更多候选（4）').click()
        assert page.locator('.restaurant-row').count()==12
        assert '起点：湖南大学地铁站2号口' in page.locator('#dining').inner_text()
        assert '直线约600米' in page.locator('#dining').inner_text()
        assert '评分暂无' in page.locator('#dining').inner_text()
        assert page.locator('img').count()==0
        assert not any('img.rednet.cn' in url or '__local/6/55/57' in url for url in requests)
        assert page.locator('a[href="https://hn.rednet.cn/content/2022/10/12/11928392.html"]').count()>0
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        mapbox=page.locator('.map-panel').bounding_box();line=page.locator('.itinerary').bounding_box()
        assert line['y']>mapbox['y'] if width<1024 else line['x']>mapbox['x']
        page.evaluate('window.scrollTo(0,0)')
        page.screenshot(path=str(out/f'phone-desktop-{width}.png'),full_page=True)
        page.get_by_role('tab').nth(1).click()
        assert page.locator('#stop-d2-mountain').is_visible()
        assert '上午' in page.locator('#stop-d2-mountain').inner_text()
        assert page.locator('.transit-leg').count()==0
        assert page.locator('.restaurant-row').count()==0
        assert page.locator('#stop-d1-arrival').count()==0
        page.get_by_role('tab').nth(2).click()
        assert page.get_by_text('当天行程尚未确认，按原始资料留空。',exact=True).is_visible()
        assert page.locator('.place-card').count()==0
        assert page.locator('.transit-leg').count()==0
        assert page.locator('.restaurant-row').count()==0
        page.get_by_role('tab').nth(3).click()
        departure=page.locator('#stop-d4-departure')
        assert departure.is_visible()
        assert '20:40' in departure.inner_text()
        assert '13:00' not in departure.inner_text() and '先去酒店' not in departure.inner_text()
        assert '计划：' not in departure.inner_text()
        assert page.locator('#stop-d4-orange').is_visible()
        assert page.locator('.transit-leg').count()==0
        if width<768:
            assert page.locator('.mobile-quick-nav').get_by_role('button',name='去终点',exact=True).is_visible()
        page.get_by_role('button',name='放大地图',exact=True).click()
        assert page.get_by_role('dialog',name='当天地图').is_visible()
        assert page.locator('.map-canvas').count()==1
        page.keyboard.press('Escape')
        assert page.get_by_role('dialog').count()==0
        assert not errors,errors
        print(f'PASS {width}px: dates, stop/leg order, dining, unknown day, return time, photo rights, layout and modal')
        page.close()
    page=browser.new_page()
    page.goto(base+'/trips/changsha-2026-10/')
    page.get_by_role('heading',name='长沙旅行攻略',exact=True).wait_for()
    page.goto(base+'/')
    page.get_by_role('button',name='Day 2',exact=True).click()
    assert page.get_by_text('Day 2: Choose a new route.').is_visible()
    page.goto(base+'/?template=travel-template-v1')
    page.get_by_role('heading',name='长沙第一天 · 模板演示（待核查）').wait_for()
    print('PASS independent trip path, original setup demo and optional template demo')
    browser.close()
