const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { patchCaps, caps, url } = require('../browserstack.config.js')

let browser;
let page;
let browserName;
let context;

test.beforeEach(async ({ playwright }, testInfo) => {
  
  test.setTimeout(2400000);
  const isMobile = testInfo.project.name.match(/browserstack-mobile/);
  if (isMobile) {
    patchMobileCaps(
      testInfo.project.name,
      `${testInfo.file} - ${testInfo.title}`
    );
    device = await playwright._android.connect(
      `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
        JSON.stringify(caps)
      )}`
    );
    await device.shell("am force-stop com.android.chrome");
    context = await device.launchBrowser();
  } else {
    patchCaps(testInfo.project.name, `${testInfo.title}`);
    delete caps.osVersion;
    delete caps.deviceName;
    delete caps.realMobile;
    browser = await playwright.chromium.connect({
      wsEndpoint:
        `wss://cdp.browserstack.com/playwright?caps=` +
        `${encodeURIComponent(JSON.stringify(caps))}`,
    });
    context = await browser.newContext(testInfo.project.use);
  }
  page = await context.newPage();

  await page.goto(`${url}/whiteboard`)
  await page.waitForTimeout(15000)

});

test('anon - can draw on whiteboard (default settings)', async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor()
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down()
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up()
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await page.mouse.down()
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await page.mouse.up()

    await expect(page).toHaveScreenshot();
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - can draw on whiteboard (default settings)', status: 'failed',reason: 'Can\'t draw on whiteboard (default settings)'}})}`);

    
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - can draw on whiteboard (default settings)', status: 'passed',reason: 'Can draw on whiteboard (default settings)'}})}`);

  }  
});

test.afterEach(async ({  }) => {
  await browser.close()
});