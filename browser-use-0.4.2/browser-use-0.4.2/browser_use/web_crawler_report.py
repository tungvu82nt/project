import aiofiles
import asyncio
from playwright.async_api import async_playwright

REPORT_FILE = 'web_report.txt'

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Mở trình duyệt ở chế độ hiển thị
        page = await browser.new_page()
        await page.goto('http://localhost:5173')
        
        report = []
        # Lấy tiêu đề trang
        title = await page.title()
        report.append(f'Tiêu đề trang: {title}')
        
        # Lấy các liên kết chính trên trang
        links = await page.query_selector_all('a')
        hrefs = []
        for link in links:
            href = await link.get_attribute('href')
            text = await link.inner_text()
            if href and href not in hrefs:
                hrefs.append(href)
                report.append(f'Link: {text} -> {href}')
        
        # Vào từng trang, dừng 5 giây cho mỗi trang
        for href in hrefs:
            if href.startswith('http'):
                url = href
            else:
                url = f'http://localhost:5173{href}' if not href.startswith('/') else f'http://localhost:5173{href}'
            await page.goto(url)
            sub_title = await page.title()
            print(f'\n---\nĐang ở: {url}\nTiêu đề: {sub_title}')
            await asyncio.sleep(5)  # Dừng 5 giây trước khi sang trang tiếp theo
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
