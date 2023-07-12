const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')

let browser;
let page;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(240000)
  await page.goto(`${url}/sheet`);
  
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
