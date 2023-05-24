const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { Browser } = require('selenium-webdriver');
// const { chromium} = require('@playwright/test');



// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'


// // ANONYMOUS USER


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
});


// test('rich text pad - anon - input text', async ({}, testInfo) => {
//   console.log(testInfo.project.name)
//   test.setTimeout(240000)
//   try {

//     await page.getByRole('link', { name: 'Rich Text' }).click();
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })
//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body')).toBeVisible()
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('Hello');
//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('Hello')).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad', status: 'passed',reason: 'Can anonymously create Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad', status: 'failed',reason: 'Can\'t anonymously create Rich Text document'}})}`);

//   }  

// });

// test('rich text pad - anon - comment', async () => {
//   test.setTimeout(240000)
//   try {
    
//     await page.getByRole('link', { name: 'Rich Text' }).click();
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT').click({
//       clickCount: 3
//     });
//     await page.frameLocator('#sbox-iframe').locator('.cp-comment-bubble').locator('button').click()
//     await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Comment' }).fill('Test comment');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Test comment', { exact: true })).toBeVisible();
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > comment', status: 'passed',reason: 'Can create comment in Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

//   }  

// });

// test('rich text pad - anon - create and open snapshot', async () => {
//   test.setTimeout(240000)
//   try {
    
//     await page.getByRole('link', { name: 'Rich Text' }).click();
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Snapshot title').fill('snap1');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New snapshot' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByText('snap1').click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).click();
//     await page.waitForTimeout(20000)
//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible()
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - anon - create and open snapshot', status: 'passed',reason: 'Can create and open snapshot in Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - anon - create and open snapshot', status: 'failed',reason: 'Can\'t create and open snapshot in Rich Text document'}})}`);

//   }  

// });


test.afterEach(async () => {
  await browser.close()
});