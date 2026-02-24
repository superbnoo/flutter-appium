import { expect, browser, $ } from '@wdio/globals'

describe('Counter app', () => {
    it('should increment the counter when tapping the plus button', async () => {
        await browser.pause(3000)

        // content-desc will be "counter: 0" (from semanticsLabel)
        const counter = await $('android=new UiSelector().descriptionContains("counter:")')
        await counter.waitForExist({ timeout: 10000 })
        expect(await counter.getAttribute('content-desc')).toBe('counter: 0')

        // FAB tooltip sets content-desc="Increment"
        const button = await $('~Increment')
        await button.click()

        // Verify counter incremented
        await browser.waitUntil(
            async () => (await counter.getAttribute('content-desc')) === 'counter: 1',
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
