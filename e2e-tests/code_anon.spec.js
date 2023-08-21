const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url } = require('../browserstack.config.js')

var fs = require('fs');

let page;
let pageOne;
let browser;

test.beforeEach(async ({  }, testInfo) => {
  
  test.setTimeout(2400000);
  const name = testInfo.project.name
  if (name.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (name.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  page = await browser.newPage();
  await page.goto(`${url}/code`)
  await page.waitForTimeout(5000)
});

// test(`anon - code - input text`, async ({ }), testInfo) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` code - add to team drive`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` code - add to team drive`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - code - file menu - history`, async ({ }), testInfo) => {

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

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` code - add to team drive`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` code - add to team drive`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - pad - toggle toolbar`, async ({ }), testInfo) => {

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

// test(`anon - code - toggle preview`, async ({ }), testInfo) => {

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

// test(`anon - code -  make a copy`, async ({ }), testInfo) => {

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

// test(`anon - code - import file`, async ({ }), testInfo) => {

//   try {

//     const fileChooserPromise = page.waitForEvent('filechooser');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

//     const fileChooser = await fileChooserPromise;
//     await fileChooser.setFiles('testdocuments/myfile.html');

//     await page.waitForTimeout(3000)

//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text here')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text here')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - toggle preview`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - toggle preview`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

//   test(`anon - code - export (md)`, async ({ }) => {

//     try {

//       await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//       await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//       await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();

//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test code');
      
//       const downloadPromise = page.waitForEvent('download');
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//       const download = await downloadPromise;

//       await download.saveAs('/tmp/test code');

//       const readData = fs.readFileSync("/tmp/test code", "utf8");
//       if (readData == "Test text") {
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create comment in Rich Text document'}})}`);

//       } else {
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

//       }

//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

//     }  
// });

// test(`code - save as and import template`, async ({}) => {

//   try {

//     await page.goto(`${url}/login/`)
//     await page.getByPlaceholder('Username').fill('test-user');
//     await page.waitForTimeout(10000)
//     await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//     const login = page.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//       await login.click()
//     }
//     await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })

//     await page.goto(`${url}/code/`)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('example template content');
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('example template content')).toBeVisible();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example code template');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await page.waitForTimeout(3000)
//     await page.goto(`${url}/code/`);
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example code template' }).nth(1).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('example template content')).toBeVisible();

//     await page.goto(`${url}/drive/`);
//     await page.frameLocator('#sbox-iframe').getByText('Templates').click();
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example code template').click({button: 'right'});
//     await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await expect(page.frameLocator('#sbox-secure-iframe').getByText('example template')).toHaveCount(0)
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'passed',reason: 'Can save and use Rich Text document as template'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'failed',reason: 'Can\'t save and use Rich Text document as template'}})}`);

//   }  
// });

// test(`code - share at a moment in history`, async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('One moment in history')
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('')
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('Another moment in history');
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('');
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('Yet another moment in history');
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('One moment in history')).toBeVisible();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
//     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

//     const clipboardText = await page.evaluate("navigator.clipboard.readText()");
//     const page1 = await browser.newPage();
//     await page1.goto(`${clipboardText}`)

//     await expect(page1.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('One moment in history')).toBeVisible();



//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - share at a moment in history', status: 'passed',reason: 'Can share code document at a specific moment in history'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - share at a moment in history', status: 'failed',reason: 'Can share code document at a specific moment in history'}})}`);

//   }  
// });

// test(`code - history (previous author)`, async ({ }, testInfo) => {

//   try {

//     await page.goto(`${url}/login/`)
//     await page.getByPlaceholder('Username').fill('test-user');
//     await page.waitForTimeout(10000)
//     await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//     const login = page.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//       await login.click()
//     }
//     await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//     await page.goto(`${url}/code`)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text by test-user');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
//     await page.frameLocator('#sbox-secure-iframe').getByRole('button', {name: 'Copy link'}).click();
//     const clipboardText = await page.evaluate("navigator.clipboard.readText()");

//     pageOne = await browser.newPage();
//     await pageOne.goto(`${clipboardText}`)
//     await pageOne.waitForTimeout(5000)
//     await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click()
//     await pageOne.keyboard.press('Enter')
//     await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Some more test text by anon');
//     await pageOne.keyboard.press('Enter')
//     await pageOne.waitForTimeout(5000)

//     await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And here is more text by anon');
//     await pageOne.keyboard.press('Enter')
//     await pageOne.waitForTimeout(5000)
//     await pageOne.close()

//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And yet more test text by test-user too!');
//     await page.keyboard.press('Enter')
//     await page.waitForTimeout(5000)
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Here is even more test text by test-user!');
//     await page.keyboard.press('Enter')
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And yet more test text by test-user!')).toHaveCount(0)
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And more test text by test-user too!')).toHaveCount(0)

//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Some more test text by anon')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And here is more text by anon')).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - file menu - history (previous author)`, status: 'passed',reason: 'Can create code document and view history (previous author)'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - file menu - history (previous author)`, status: 'failed',reason: 'Can\'t create code document and view history (previous author)'}})}`);

//   }  
// });



test.afterEach(async ({  }) => {
  await browser.close()
});