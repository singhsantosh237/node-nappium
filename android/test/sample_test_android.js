var assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

var buildDriver = function() {
  return new Builder()
    .usingServer('http://127.0.0.1:4723/wd/hub')
    .build();
};

async function bstackSampleTest () {
  let driver =  buildDriver();
  try {
    let { width, height } = await driver.manage().window().getRect();
    console.log(`Screen size: width=${width}, height=${height}`);

    // Define swipe coordinates
    let startX = width / 2;      // Center of the screen horizontally
    let startY = height * 0.8;   // Start from 80% of the screen height (near the bottom)
    let endY = height * 0.2;     // End at 20% of the screen height (near the top)

    // Perform swipe down gesture using actions API
    const actions = driver.actions({ bridge: true }); // Use { bridge: true } for Appium compatibility
    await actions
      .move({ x: startX, y: startY }) // Move to the starting position
      .press()                        // Press down
      .move({ x: startX, y: endY })   // Move to the ending position
      .release()                      // Release
      .perform();                     // Perform the action
    console.log('Swipe down gesture completed');


    await driver.wait(
      until.elementLocated(
        By.xpath(
          '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.support.v4.view.ViewPager/android.view.ViewGroup/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.TextView'
        )
      ), 30000
    ).click();

    var insertTextSelector = await driver.wait(
      until.elementLocated(
        By.xpath(
          '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup/android.widget.LinearLayout/android.support.v7.widget.LinearLayoutCompat/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.AutoCompleteTextView'
        ), 30000
      )
    );
    await insertTextSelector.sendKeys('BrowserStack');
    await driver.sleep(5000);

    var allProductsName = await driver.findElements(
      By.xpath(
        '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout[1]/android.widget.FrameLayout[2]/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ListView/android.widget.LinearLayout'
      )
    );

    assert(allProductsName.length > 0);
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Search in Wikipedia done correctly"}}'
    );
  } catch (e) {
    console.error('Test failed with error:', e.message);
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some elements failed to load"}}'
    );
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

bstackSampleTest();
