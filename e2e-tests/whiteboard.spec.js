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


// test('whiteboard - anon', async ({  }) => {
//   
//   
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
//     await page.getByRole('link', { name: 'Whiteboard' }).click();
//     await expect(page).toHaveURL(new RegExp(`^${url}/whiteboard/#/`), { timeout: 10000 })
//     // await page.waitForLoadState('networkidle');
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'whiteboard', status: 'passed',reason: 'Can anonymously create Whiteboard'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'whiteboard', status: 'failed',reason: 'Can\'t anonymously create Whiteboard'}})}`);

//   }  

// });

// test.afterEach(async () => {
//   await browser.close()
// });