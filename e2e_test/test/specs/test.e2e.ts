import { expect, browser, $ } from '@wdio/globals'

describe('Counter app', () => {
    it('should increment the counter when tapping the plus button', async () => {
        await browser.pause(3000)

        const counter = await $('android=new UiSelector().descriptionContains("counter:")')
        await counter.waitForExist({ timeout: 10000 })
        expect(await counter.getAttribute('content-desc')).toBe('counter: 0')

        const button = await $('~Increment')
        await button.click()

        await browser.waitUntil(
            async () => (await counter.getAttribute('content-desc')) === 'counter: 1',
            { timeout: 5000, timeoutMsg: 'Counter did not increment to 1' }
        )
    })
})
