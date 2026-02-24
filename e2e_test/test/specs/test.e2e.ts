import { expect, browser, $ } from '@wdio/globals'

describe('Counter app', () => {
    it('increments the counter when tapping the plus button', async () => {
        // Wait for the app to fully load
        await browser.pause(3000)

        // Counter has content-desc="counter-value\n0" (Semantics label merged with Text)
        // Use descriptionContains to find it, then read value from content-desc
        const counter = await $('android=new UiSelector().descriptionContains("counter-value")')
        await counter.waitForExist({ timeout: 10000 })

        const initialDesc = (await counter.getAttribute('content-desc')) ?? ''
        const initialValue = initialDesc.split('\n')[1]
        expect(initialValue).toBe('0')

        // The inner button has content-desc="Increment" and clickable=true
        const incrementButton = await $('~Increment')
        await incrementButton.waitForExist({ timeout: 5000 })
        await incrementButton.click()

        // Wait for counter to update and verify
        await browser.waitUntil(
            async () => {
                const desc = (await counter.getAttribute('content-desc')) ?? ''
                return desc.split('\n')[1] === '1'
            },
            {
                timeout: 5000,
                timeoutMsg: 'expected counter to be 1 after increment'
            }
        )

        const updatedDesc = (await counter.getAttribute('content-desc')) ?? ''
        expect(updatedDesc.split('\n')[1]).toBe('1')
    })
})
