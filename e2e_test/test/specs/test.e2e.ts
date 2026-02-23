import { expect, $ } from '@wdio/globals'

describe('Counter app', () => {
    it('increments the counter when tapping the plus button', async () => {
        const counter = await $('//android.widget.TextView[@text="0"]')
        await counter.waitForExist({ timeout: 10000 })

        const incrementButton = await $('~Increment')
        await incrementButton.waitForExist({ timeout: 5000 })
        await incrementButton.click()

        const updatedCounter = await $('//android.widget.TextView[@text="1"]')
        await updatedCounter.waitForExist({ timeout: 5000 })
        await expect(updatedCounter).toBeExisting()
    })
})

