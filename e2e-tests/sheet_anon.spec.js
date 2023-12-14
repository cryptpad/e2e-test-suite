const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { patchCaps, caps, url, titleDate } = require('../browserstack.config.js')

let browser;
let page;
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

  await page.goto(`${url}/sheet`)
  await page.waitForTimeout(15000)

});

// test('sheet doc - anon', async ({ page }) => {

//   try {
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })
//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay')).toBeVisible()
//     // await page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay').click({
//     //   position: {
//     //     x: 69,
//     //     y: 27
//     //   }
//     // });
//     // await page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay').click({
//     //   position: {
//     //     x: 131,
//     //     y: 27
//     //   }
//     // });
//     // await page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay').click({
//     //   position: {
//     //     x: 67,
//     //     y: 46
//     //   }
//     // });
//     // await page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay').click({
//     //   position: {
//     //     x: 143,
//     //     y: 47
//     //   }
//     // });
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'sheet', status: 'passed',reason: 'Can anonymously create Sheet'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'sheet', status: 'failed',reason: 'Can\'t anonymously create Sheet'}})}`);

//   }  
// });
