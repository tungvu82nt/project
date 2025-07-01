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
    format='%(asctime)s | %(levelname)s | %(message)s',
    handlers=[
        logging.FileHandler('automation.log'),
        logging.StreamHandler()
    ]
)

class WebAutomation:
    def __init__(self):
        load_dotenv()
        self.fake = Faker()
        self.test_data = {
            "email": self.fake.email(),
            "password": "Test@1234!"
        }
        
    async def init_browser(self):
        return await BrowserSession.create(
            headless=False,
            slow_mo=1000,  # Giảm tốc độ để quan sát
            device="Desktop Chrome",
            viewport={"width": 1280, "height": 720}
        )

    async def test_workflow(self):
        try:
            # Khởi tạo trình duyệt
            browser = await self.init_browser()
            actions = browser.actions()
            
            # 1. Test trang chủ
            await self.test_homepage(actions)
            
            # 2. Test đăng ký
            await self.test_registration(actions)
            
            # 3. Test đăng nhập
            await self.test_login(actions)
            
            # 4. Test điều hướng
            await self.test_navigation(actions)
            
            logging.info("✅ Automation hoàn thành!")
            
        except Exception as e:
            logging.error(f"❌ Lỗi nghiêm trọng: {str(e)}")
            await browser.take_screenshot("error")
            raise
        finally:
            if 'browser' in locals():
                await browser.close()

    async def test_homepage(self, actions):
        """Test trang chủ và phân tích bằng AI"""
        logging.info("🌐 Truy cập trang chủ...")
        await actions.navigate("http://localhost:5173")
        await actions.take_screenshot("homepage")
        
        # Phân tích bằng DeepSeek
        if os.getenv("DEEPSEEK_API_KEY"):
            deepseek = DeepSeekChat(api_key=os.getenv("DEEPSEEK_API_KEY"))
            content = await actions.get_visible_text()[:2000]
            response = await deepseek.chat([{
                "role": "user",
                "content": f"Phân tích nội dung trang web sau:\n{content}"
            }])
            logging.info(f"🤖 AI Phân tích:\n{response['choices'][0]['message']['content']}")

    async def test_registration(self, actions):
        """Test quy trình đăng ký"""
        logging.info("📝 Bắt đầu đăng ký tài khoản...")
        await actions.click('a:has-text("Đăng ký")')
        
        await actions.fill('input[name="email"]', self.test_data["email"])
        await actions.fill('input[name="password"]', self.test_data["password"])
        await actions.fill('input[name="confirmPassword"]', self.test_data["password"])
        await actions.click('button:has-text("Đăng ký")')
        
        await actions.wait_for_selector(".toast-success", timeout=5000)
        await actions.take_screenshot("after_register")
        logging.info(f"🎉 Đăng ký thành công với email: {self.test_data['email']}")

    async def test_login(self, actions):
        """Test quy trình đăng nhập"""
        logging.info("🔑 Thực hiện đăng nhập...")
        await actions.click('a:has-text("Đăng xuất")')
        await actions.click('a:has-text("Đăng nhập")')
        
        await actions.fill('input[name="email"]', self.test_data["email"])
        await actions.fill('input[name="password"]', self.test_data["password"])
        await actions.click('button:has-text("Đăng nhập")')
        
        await actions.wait_for_selector(".user-menu", timeout=5000)
        await actions.take_screenshot("after_login")
        logging.info("🔓 Đăng nhập thành công!")

    async def test_navigation(self, actions):
        """Test điều hướng trang"""
        test_pages = [
            ("/profile", "Hồ sơ"),
            ("/products", "Sản phẩm"),
            ("/cart", "Giỏ hàng")
        ]
        
        for path, name in test_pages:
            logging.info(f"🧭 Đang truy cập trang {name}...")
            await actions.navigate(f"http://localhost:5173{path}")
            await actions.wait_for_selector(f"h1:has-text('{name}')", timeout=3000)
            await actions.take_screenshot(f"page_{name}")

if __name__ == "__main__":
    automation = WebAutomation()
    asyncio.run(automation.test_workflow())