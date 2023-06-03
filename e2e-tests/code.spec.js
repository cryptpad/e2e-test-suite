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
  test.setTimeout(240000);
});

// test('code doc - anon', async () => {
//  
//   try {
//     await page.getByRole('link', { name: 'Code' }).click();
//     // await page.waitForLoadState('networkidle');
//     // await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/code/#/`), { timeout: 100000 })
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code', status: 'passed',reason: 'Can anonymously create Code document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code', status: 'failed',reason: 'Can\'t anonymously create Code document'}})}`);

//   }  
// });


test.afterEach(async () => {
  await browser.close()
});