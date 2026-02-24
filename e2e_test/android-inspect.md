+ Layout
```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<hierarchy index="0" class="hierarchy" rotation="0" width="1080" height="2400">

  <android.widget.FrameLayout
      index="0"
      package="com.example.flutter_appium"
      class="android.widget.FrameLayout"
      bounds="[0,0][1080,2400]"
      displayed="true">

    <android.widget.LinearLayout
        index="0"
        package="com.example.flutter_appium"
        class="android.widget.LinearLayout"
        bounds="[0,0][1080,2400]"
        displayed="true">

      <android.widget.FrameLayout
          index="0"
          package="com.example.flutter_appium"
          class="android.widget.FrameLayout"
          resource-id="android:id/content"
          bounds="[0,0][1080,2400]"
          displayed="true">

        <android.widget.FrameLayout
            index="0"
            package="com.example.flutter_appium"
            class="android.widget.FrameLayout"
            bounds="[0,0][1080,2400]"
            displayed="true"
            pane-title="Flutter Demo Home Page">

          <android.view.View
              index="0"
              package="com.example.flutter_appium"
              class="android.view.View"
              bounds="[0,0][1080,2400]"
              displayed="true">

            <!-- App Bar Title -->
            <android.view.View
                index="0"
                package="com.example.flutter_appium"
                class="android.view.View"
                content-desc="Flutter Demo Home Page"
                bounds="[42,100][689,173]"
                displayed="true" />

            <!-- Description Text -->
            <android.view.View
                index="1"
                package="com.example.flutter_appium"
                class="android.view.View"
                content-desc="You have pushed the button this many times:"
                bounds="[160,1232][920,1284]"
                displayed="true" />

            <!-- Counter Text -->
            <android.view.View
                index="2"
                package="com.example.flutter_appium"
                class="android.view.View"
                content-desc="counter: 0"
                bounds="[519,1284][561,1379]"
                displayed="true" />

            <!-- Increment Button -->
            <android.widget.Button
                index="3"
                package="com.example.flutter_appium"
                class="android.widget.Button"
                content-desc="Increment"
                tooltip-text="Increment"
                clickable="true"
                enabled="true"
                bounds="[891,2148][1038,2295]"
                displayed="true" />

          </android.view.View>
        </android.widget.FrameLayout>

      </android.widget.FrameLayout>
    </android.widget.LinearLayout>
  </android.widget.FrameLayout>

</hierarchy>
```

### Android code explaination

Here's a line-by-line explanation of the test, tied directly to the page layout dump you provided:

---

### Line 5 — `await browser.pause(3000)`

Waits **3 seconds** before doing anything. This is a hard pause to give the Flutter app time to fully render after launch. Without it, the test might try to find elements before they exist on screen.

---

### Line 7 — `const counter = await $('android=new UiSelector().descriptionContains("counter:")')`

This is the line you asked about specifically. Let's break it down:

- **`$(...)`** — WebDriverIO's element selector shorthand (find one element).
- **`android=new UiSelector()...`** — This tells WebDriverIO to use Android's native **UiAutomator** selector engine (not CSS or XPath).
- **`.descriptionContains("counter:")`** — This searches for an element whose **`content-desc`** attribute **contains** the substring `"counter:"`.

**Why `descriptionContains` instead of an exact match?** Because the counter's `content-desc` value **changes dynamically** — it starts as `"counter: 0"` and later becomes `"counter: 1"`, `"counter: 2"`, etc. If you used `.description("counter: 0")` (exact match), the selector would **stop finding the element** after the counter increments. By using `descriptionContains("counter:")`, the selector matches the element regardless of the number, since all values contain the prefix `"counter:"`.

In your layout dump, this matches:

```xml
<android.view.View
    content-desc="counter: 0"
    ... />
```

The string `"counter: 0"` **contains** `"counter:"` ✅

---

### Line 8 — `await counter.waitForExist({ timeout: 10000 })`

Waits up to **10 seconds** for that counter element to appear in the DOM. This is a **smart wait** (unlike the hard `pause` on line 5) — it polls repeatedly and returns as soon as the element exists, or throws an error after 10 seconds.

---

### Line 9 — `expect(await counter.getAttribute('content-desc')).toBe('counter: 0')`

Reads the `content-desc` attribute of the counter element and **asserts** it equals exactly `"counter: 0"`. This verifies the initial state — the counter starts at zero. In the layout dump, you can see `content-desc="counter: 0"` on that element.

---

### Line 11 — `const button = await $('~Increment')`

Finds the increment button. The **`~`** prefix is WebDriverIO shorthand for **accessibility id** selector, which on Android maps to the **`content-desc`** attribute. So `~Increment` finds an element with `content-desc="Increment"`.

In your layout dump, this matches:

```xml
<android.widget.Button
    content-desc="Increment"
    clickable="true"
    ... />
```

**Why `~` here but `UiSelector` for the counter?** Because the button's `content-desc` is a **fixed, exact value** (`"Increment"`) that never changes, so a simple accessibility id selector works perfectly. The counter's `content-desc` changes, so it needed the more flexible `descriptionContains`.

---

### Line 12 — `await button.click()`

Taps the increment button, which should trigger the counter to go from 0 → 1.

---

### Lines 14–17 — `await browser.waitUntil(...)`

```4:18:e2e_test/test/specs/test.e2e.ts
        await browser.waitUntil(
            async () => (await counter.getAttribute('content-desc')) === 'counter: 1',
            { timeout: 5000, timeoutMsg: 'Counter did not increment to 1' }
        )
```

This **polls** the counter's `content-desc` attribute repeatedly until it equals `"counter: 1"`, with a **5-second timeout**. This is better than a hard `pause` because:

- It returns **immediately** once the condition is met.
- It provides a **clear error message** (`'Counter did not increment to 1'`) if the counter doesn't update in time.

Note that the `counter` variable (from line 7) still works here because it was found using `descriptionContains("counter:")`, which matches both `"counter: 0"` and `"counter: 1"`.

---

### Summary of selector strategies used

| Line | Selector | Strategy | Why |
|------|----------|----------|-----|
| 7 | `android=new UiSelector().descriptionContains("counter:")` | UiAutomator partial match on `content-desc` | Value changes dynamically (`counter: 0` → `counter: 1`) |
| 11 | `~Increment` | Accessibility ID (exact `content-desc`) | Value is static and never changes |