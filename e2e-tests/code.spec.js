const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url } = require('../browserstack.config.js')

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
  await page.goto(`${url}/code`);
  await page.waitForTimeout(5000)
  test.setTimeout(240000);
});

// test(`anon - code - input text`, async ({}, testInfo) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - code - add to team drive`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - code - add to team drive`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - code - file menu - history`, async ({}, testInfo) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toHaveCount(0)
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeHidden()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - code - add to team drive`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - code - add to team drive`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - pad - toggle toolbar`, async ({}, testInfo) => {

//   try {
//     await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeHidden()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - toggle toolbar`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - toggle toolbar`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - code - toggle preview`, async ({}, testInfo) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Preview' }).click();

//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeHidden()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - code - toggle preview`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - code - toggle preview`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - code -  make a copy`, async ({}, testInfo) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
//     const page1 = await page1Promise;

//     await expect(page1).toHaveURL(new RegExp(`^${url}/code`), { timeout: 100000 })

//     await page1.waitForTimeout(4000)
//     await expect(page1.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - toggle preview`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - toggle preview`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

test(`anon - code - `, async ({}, testInfo) => {

  try {

    

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - toggle preview`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - toggle preview`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

  }  
});

test.afterEach(async () => {
  await browser.close()
});