const { test, expect } = require('@playwright/test');
const { chromium } = require('@playwright/test');


// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'


// // ANONYMOUS USER


let browser;
let page;

// test.beforeEach(async () => {
//   browser = await chromium.launch();
//   page = await browser.newPage();
//   await page.goto(`${url}`);
// });

// test('sheet doc - anon', async ({ }) => {
//   const browser = await chromium.launch();
//   const page = await browser.newPage();
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
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

// test.afterEach(async () => {
//   await browser.close()
// });