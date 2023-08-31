const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')
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
  await page.goto(`${url}/slide`)
  await page.waitForTimeout(5000)
});

// test('markdown - anon - input text into editor and create slide', async ({  }) => {
  
//   try {


//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

//   }  
// });

// test('markdown - anon - create new slide', async ({  }) => {
  
//   try {


//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await page.keyboard.press('Enter')
//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('---');
//     await page.keyboard.press('Enter')
//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('More test text');
//     await page.keyboard.press('Enter')
//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Not now' }).click();
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').filter({ hasText: 'Test text' }).click();
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-right span').hover();
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-right span').click();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('More test text')).toBeVisible();
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

//   }  
// });

// test('markdown - toggle toolbar', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeHidden();
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown - input text into editor', status: 'passed',reason: 'Can input '}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown - input text into editor', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

//   }  
// });



// test('markdown - toggle preview', async ({  }) => {
  
//   try {


//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeHidden();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

//   }  
// });


// test('anon - pad - make a copy', async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
//     const page1 = await page1Promise;

//     await expect(page1).toHaveURL(new RegExp(`^${url}/slide`), { timeout: 100000 })
//     await page1.waitForTimeout(5000)

//     await expect(page1.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

//   }  
// });

// test(`pad - save as and import template`, async ({}) => {

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
//     await page.waitForTimeout(10000)

//     await page.goto(`${url}/slide/`)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await page.waitForTimeout(5000)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example markdown template');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await page.waitForTimeout(3000)
//     await page.goto(`${url}/slide/`);
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example markdown template' }).nth(1).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();

//     await page.goto(`${url}/drive/`);
//     await page.frameLocator('#sbox-iframe').getByText('Templates').click();
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example markdown template').click({button: 'right'});
//     await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await expect(page.frameLocator('#sbox-secure-iframe').getByText('example markdown template')).toHaveCount(0)
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'passed',reason: 'Can save and use Rich Text document as template'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'failed',reason: 'Can\'t save and use Rich Text document as template'}})}`);

//   }  
// });

// test(`pad - export (md)`, async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test markdown');
    
//     const downloadPromise = page.waitForEvent('download');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     const download = await downloadPromise;

//     await download.saveAs('/tmp/test markdown');

//     const readData = fs.readFileSync("/tmp/test markdown", "utf8");
//     if (readData == "Test text") {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'passed',reason: 'Can export Rich Text document as .md'}})}`);

//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'failed',reason: 'Can\'t export Rich Text document as .md'}})}`);

//     }

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'failed',reason: 'Can\'t export Rich Text document as .md'}})}`);

//   }  
// });

// test(`pad - share at a moment in history`, async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('One moment in history');
//     await page.waitForTimeout(5000)
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('');
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Another moment in history');
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('');
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Yet another moment in history');
//     await page.waitForTimeout(5000)
    

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('One moment in history')).toBeVisible();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
//     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

//     const clipboardText = await page.evaluate("navigator.clipboard.readText()");
//     const page1 = await browser.newPage();
//     await page1.goto(`${clipboardText}`)

//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('One moment in history')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - share at a moment in history', status: 'passed',reason: 'Can share Rich Text at a specific moment in history'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - share at a moment in history', status: 'failed',reason: 'Can share Rich Text at a specific moment in history'}})}`);

//   }  
// });

// test(`pad - history (previous version)`, async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Test text')).toHaveCount(0)

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous version)`, status: 'passed',reason: 'Can create Rich Text document and view history'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous version)`, status: 'failed',reason: 'Can\'t create Rich Text document and view history'}})}`);

//   }  
// });

// test(`pad - history (previous author)`, async ({ }, testInfo) => {

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
//     await page.goto(`${url}/slide`)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
//     await page.waitForTimeout(5000)

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
//     // await pageOne.waitForTimeout(5000)
//     await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And here is more text by anon');
//     await pageOne.keyboard.press('Enter')
//     await pageOne.waitForTimeout(5000)
//     await pageOne.close()

//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And yet more test text by test-user too!');
//     await page.keyboard.press('Enter')
//     // await page.waitForTimeout(5000)
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

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author)`, status: 'passed',reason: 'Can create Rich Text document and view history (previous author)'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author)`, status: 'failed',reason: 'Can\'t create Rich Text document and view history (previous author)'}})}`);

//   }  
// });


test(`markdown - import file`, async ({ }) => {

  try {

    const fileChooserPromise = page.waitForEvent('filechooser');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/testslide.md');

    await page.waitForTimeout(3000)
    const cont = await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').textContent()

    console.log(cont)
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('1test text2​3---4​5new text')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - import file`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - import file`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

  }  
});

test.afterEach(async ({  }) => {
  await browser.close()
});