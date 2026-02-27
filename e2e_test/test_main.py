import time

from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestCounterApp:
    """Mirrors the TypeScript test: e2e_test/test/specs/main-test.e2e.ts"""

    def test_increment_counter(self, driver, platform):
        """Should increment the counter when tapping the plus button."""
        time.sleep(3)

        wait = WebDriverWait(driver, 10)

        # Find the counter element using platform-specific selectors
        # Android: content-desc attribute, matched via UiAutomator
        # iOS: label attribute, matched via predicate string
        if platform == "ios":
            counter = wait.until(
                EC.presence_of_element_located(
                    (AppiumBy.IOS_PREDICATE, 'label CONTAINS "counter:"')
                )
            )
        else:
            counter = wait.until(
                EC.presence_of_element_located(
                    (
                        AppiumBy.ANDROID_UIAUTOMATOR,
                        'new UiSelector().descriptionContains("counter:")',
                    )
                )
            )

        # On Android the accessibility attribute is 'content-desc', on iOS it's 'label'
        label_attr = "label" if platform == "ios" else "content-desc"
        assert counter.get_attribute(label_attr) == "counter: 0"

        # FAB tooltip sets the accessibility label to "Increment" on both platforms
        # The ACCESSIBILITY_ID selector matches on both Android and iOS
        button = wait.until(
            EC.presence_of_element_located(
                (AppiumBy.ACCESSIBILITY_ID, "Increment")
            )
        )
        button.click()

        # Verify counter incremented
        def counter_is_one(_):
            return counter.get_attribute(label_attr) == "counter: 1"

        WebDriverWait(driver, 5).until(counter_is_one)
        assert counter.get_attribute(label_attr) == "counter: 1"

    def test_dump_page_source(self, driver):
        """Dump page source to see available elements."""
        time.sleep(5)

        source = driver.page_source
        print("\n=== PAGE SOURCE START ===")
        print(source)
        print("=== PAGE SOURCE END ===")
