import asyncio
import os
from browser_use.browser import BrowserSession
from browser_use.llm.deepseek import DeepSeekChat
from dotenv import load_dotenv
from faker import Faker
import logging

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('automation.log'),
        logging.StreamHandler()
    ]
)

class WebTester:
    def __init__(self):
        load_dotenv()
        self.fake = Faker()
        self.credentials = {
            "email": self.fake.email(),
            "password": "Test@1234!"
        }
        
    async def start_session(self):
        return await BrowserSession.create(
            headless=False,
            slow_mo=1000,
            device="Desktop Chrome"
        )

    async def run_tests(self):
        browser = await self.start_session()
        try:
            actions = browser.actions()
            
            # Test trang chủ
            await actions.navigate("http://localhost:5173")
            await actions.take_screenshot("homepage")
            
            # Test đăng ký
            await actions.click('a:has-text("Register")')
            await actions.fill('input[name="email"]', self.credentials["email"])
            await actions.fill('input[name="password"]', self.credentials["password"])
            await actions.click('button:has-text("Sign Up")')
            
            # Test đăng nhập
            await actions.click('a:has-text("Login")')
            await actions.fill('input[name="email"]', self.credentials["email"])
            await actions.fill('input[name="password"]', self.credentials["password"])
            await actions.click('button:has-text("Sign In")')
            
            logging.info("✅ All tests passed!")
            
        finally:
            await browser.close()

if __name__ == "__main__":
    tester = WebTester()
    asyncio.run(tester.run_tests())
