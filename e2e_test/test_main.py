import time

from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestCounterApp:
    """Mirrors the TypeScript test: e2e_test/test/specs/main-test.e2e.ts"""

    def test_increment_counter(self, driver):
        """Should increment the counter when tapping the plus button."""
        time.sleep(3)

        wait = WebDriverWait(driver, 10)

        # Flutter's semanticsLabel maps to accessibility id on both iOS and Android
        counter = wait.until(
            EC.presence_of_element_located(
                (AppiumBy.ACCESSIBILITY_ID, "counter: 0")
            )
        )
        assert counter is not None

        # Tap the FAB — tooltip "Increment" is the accessibility id on both platforms
        button = wait.until(
            EC.presence_of_element_located(
                (AppiumBy.ACCESSIBILITY_ID, "Increment")
            )
        )
        button.click()

        # Verify counter incremented — wait for the new accessibility id to appear
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located(
                (AppiumBy.ACCESSIBILITY_ID, "counter: 1")
            )
        )

    def test_dump_page_source(self, driver):
        """Dump page source to see available elements."""
        time.sleep(5)

        source = driver.page_source
        print("\n=== PAGE SOURCE START ===")
        print(source)
        print("=== PAGE SOURCE END ===")
