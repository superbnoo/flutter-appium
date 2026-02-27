import pytest
from appium import webdriver
from appium.options.android.uiautomator2.base import UiAutomator2Options
from appium.options.ios.xcuitest.base import XCUITestOptions

# -- Paths (update these to match your local build outputs) --
PROJECT_ROOT = "/Users/vutr/00.cursor-projects/flutter/flutter_appium"
IOS_APP = f"{PROJECT_ROOT}/build/ios/iphonesimulator/Runner.app"
ANDROID_APP = f"{PROJECT_ROOT}/build/app/outputs/flutter-apk/app-debug.apk"

APPIUM_SERVER = "http://127.0.0.1:4723"


def pytest_addoption(parser):
    parser.addoption(
        "--platform",
        action="store",
        default="ios",
        choices=["ios", "android"],
        help="Target platform: ios or android",
    )


@pytest.fixture(scope="session")
def platform(request):
    return request.config.getoption("--platform")


@pytest.fixture(scope="session")
def driver(platform):
    if platform == "ios":
        options = XCUITestOptions()
        options.platform_name = "iOS"
        options.device_name = "iPhone 16 Pro Max"
        options.platform_version = "18.5"
        options.app = IOS_APP
        options.no_reset = True
    else:
        options = UiAutomator2Options()
        options.platform_name = "Android"
        options.device_name = "Medium_Phone_API_36"
        options.avd = "Medium_Phone_API_36"
        options.app = ANDROID_APP
        options.no_reset = True
        # Force reinstall the app every session (matches enforceAppInstall: true)
        options.set_capability("appium:enforceAppInstall", True)

    drv = webdriver.Remote(APPIUM_SERVER, options=options)
    yield drv
    drv.quit()
