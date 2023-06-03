const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');

const url = 'https://cryptpad.fr'

let browser;
let page;

test.beforeEach(async ({}, testInfo) => {
  const name = testInfo.project.name
  if (name.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (name.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }
  page = await browser.newPage();
  await page.goto(`${url}`);
  test.setTimeout(240000)
});

// test('sheet doc - anon', async () => {

//   try {
//     await page.getByRole('link', { name: 'Sheet' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/sheet/#/`), { timeout: 100000 })
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

test.afterEach(async () => {
  await browser.close()
});