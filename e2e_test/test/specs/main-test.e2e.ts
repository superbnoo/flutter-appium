import { expect, browser, $ } from '@wdio/globals'

describe('Counter app', () => {
    it('should increment the counter when tapping the plus button', async () => {
        await browser.pause(3000)

        const isIOS = (browser.capabilities as Record<string, any>).platformName?.toLowerCase() === 'ios'

        // Find the counter element using platform-specific selectors
        // Android: content-desc attribute, matched via UiAutomator
        // iOS: label attribute, matched via predicate string
        const counter = isIOS
            ? await $('-ios predicate string:label CONTAINS "counter:"')
            : await $('android=new UiSelector().descriptionContains("counter:")')

        await counter.waitForExist({ timeout: 10000 })

        // On Android the accessibility attribute is 'content-desc', on iOS it's 'label'
        const labelAttr = isIOS ? 'label' : 'content-desc'
        expect(await counter.getAttribute(labelAttr)).toBe('counter: 0')

        // FAB tooltip sets the accessibility label to "Increment" on both platforms
        // The ~ selector matches accessibility id on both Android and iOS
        const button = await $('~Increment')
        await button.click()

        // Verify counter incremented
        await browser.waitUntil(
            async () => (await counter.getAttribute(labelAttr)) === 'counter: 1',
            { timeout: 5000, timeoutMsg: 'Counter did not increment to 1' }
        )
    })

    it('dump page source to see available elements', async () => {
        // Wait for the app to fully load
        await browser.pause(5000)

        // Dump the full page source so we can see all elements and their attributes
        const source = await browser.getPageSource()
        console.log('=== PAGE SOURCE START ===')
        console.log(source)
        console.log('=== PAGE SOURCE END ===')
    })
})
