const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')

let browser;
let page;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(240000)
  await page.goto(`${url}/form`);
});

// test('form - anon', async ({ page }) => {
//   try {

//     await page.waitForTimeout(20000)
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'passed',reason: 'Can anonymously create Form'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'failed',reason: 'Can\'t anonymously create Form'}})}`);

//   }  
// });
