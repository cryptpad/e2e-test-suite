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
  await page.goto(`${url}/pad`)
  await page.waitForTimeout(5000)
});



// test('anon - rich text pad - comment', async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('TEST TEXT').click({
//       clickCount: 3
//     });
//     await page.frameLocator('#sbox-iframe').locator('.cp-comment-bubble').locator('button').click()
//     await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Comment' }).fill('Test comment');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Test comment', { exact: true })).toBeVisible();
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create comment in Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

//   }  
// });

// test('anon - rich text pad - create and open snapshot', async ({ }) => {

//   try { 

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Snapshot title').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Snapshot title').fill('snap1');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New snapshot' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New snapshot' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByText('snap1').waitFor()
//     await page.frameLocator('#sbox-iframe').getByText('snap1').click();
//     await page.waitForTimeout(10000)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('TEST TEXT').waitFor()
//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible()
    
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > create and open snapshot', status: 'passed',reason: 'Can create and open snapshot in Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > anon > create and open snapshot', status: 'failed',reason: 'Can\'t create and open snapshot in Rich Text document'}})}`);

//   }  
// });

// test(`pad - history (previous version)`, async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('Test text');

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

test(`pad - history (previous author)`, async ({ }, testInfo) => {

  try {

    await page.goto(`${url}/login/`)
    await page.getByPlaceholder('Username').fill('test-user');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await page.goto(`${url}/pad`)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').type('Test text by test-user');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', {name: 'Copy link'}).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    pageOne = await browser.newPage();
    await pageOne.goto(`${clipboardText}`)
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').click()
    await pageOne.keyboard.press('Enter')
    await pageOne.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').type('Some more test text by anon');
    await pageOne.keyboard.press('Enter')
    await pageOne.waitForTimeout(5000)

    await pageOne.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').type('And here is more text by anon');
    await pageOne.keyboard.press('Enter')
    await pageOne.waitForTimeout(5000)
    await pageOne.close()

    await page.keyboard.press('Enter')
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').type('And yet more test text by test-user too!');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').type('Here is even more test text by test-user!');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('And yet more test text by test-user!')).toHaveCount(0)
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('And more test text by test-user too!')).toHaveCount(0)

    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Some more test text by anon')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('And here is more text by anon')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author)`, status: 'passed',reason: 'Can create Rich Text document and view history (previous author)'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author)`, status: 'failed',reason: 'Can\'t create Rich Text document and view history (previous author)'}})}`);

  }  
});

// test(`anon - pad - toggle tools`, async ({ }) => {

//   try {

//     await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeVisible()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeHidden()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - toggle tools`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - toggle tools`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - pad - import file`, async ({ }) => {

//   try {

//     const fileChooserPromise = page.waitForEvent('filechooser');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

//     const fileChooser = await fileChooserPromise;
//     await fileChooser.setFiles('testdocuments/myfile.html');

//     await page.waitForTimeout(3000)

//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Test text here')).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - import file`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - import file`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test('anon - pad - make a copy', async ({ }) => {

//   try {



//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//     await page.waitForTimeout(5000)
//     const text = await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').textContent()
//     if (text !== 'TEST TEXT') {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);
//     }

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
//     const page1 = await page1Promise;

//     await expect(page1).toHaveURL(new RegExp(`^${url}/pad`), { timeout: 100000 })
//     await page1.waitForTimeout(5000)

//     if (text !== 'TEST TEXT') {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create comment in Rich Text document'}})}`);
//     }
    

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

//   }  
// });



// test(`pad - export (html)`, async ({}) => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test pad');
    
//     const downloadPromise = page.waitForEvent('download');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     const download = await downloadPromise;

//     await download.saveAs('/tmp/test pad');

//     const readData = fs.readFileSync("/tmp/test pad", "utf8");
//     if (readData == "TEST TEXT") {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (html)', status: 'passed',reason: 'Can export Rich Text document as HTML'}})}`);

//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (html)', status: 'failed',reason: 'Can\'t export Rich Text document as HTML'}})}`);

//     }

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export', status: 'failed',reason: 'Can\'t export Rich Text document as HTML'}})}`);

//   }  
// });

// test(`pad - export (doc)`, async ({}) => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test pad');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' .html' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('link', { name: '.doc' }).click();
    
//     const downloadPromise = page.waitForEvent('download');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     const download = await downloadPromise;

//     await download.saveAs('/tmp/test pad');

//     const readData = fs.readFileSync("/tmp/test pad", "utf8");
//     if (readData == "TEST TEXT") {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (html)', status: 'passed',reason: 'Can export Rich Text document as HTML'}})}`);

//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (html)', status: 'failed',reason: 'Can\'t export Rich Text document as HTML'}})}`);

//     }

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export', status: 'failed',reason: 'Can\'t export Rich Text document as HTML'}})}`);

//   }  
// });

// test(`pad - export (md)`, async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test pad');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' .html' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('link', { name: '.md' }).click();
    
//     const downloadPromise = page.waitForEvent('download');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     const download = await downloadPromise;

//     await download.saveAs('/tmp/test pad');

//     const readData = fs.readFileSync("/tmp/test pad", "utf8");
//     if (readData == "TEST TEXT") {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'passed',reason: 'Can export Rich Text document as .md'}})}`);

//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'failed',reason: 'Can\'t export Rich Text document as .md'}})}`);

//     }

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'failed',reason: 'Can\'t export Rich Text document as .md'}})}`);

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

//     await page.goto(`${url}/pad/`)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('example template content');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example pad template');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await page.waitForTimeout(3000)
//     await page.goto(`${url}/pad/`);
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example pad template' }).nth(1).click();
//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('example template content')).toBeVisible();

//     await page.goto(`${url}/drive/`);
//     await page.frameLocator('#sbox-iframe').getByText('Templates').click();
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example template').click({button: 'right'});
//     await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await expect(page.frameLocator('#sbox-secure-iframe').getByText('example pad template')).toHaveCount(0)
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'passed',reason: 'Can save and use Rich Text document as template'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'failed',reason: 'Can\'t save and use Rich Text document as template'}})}`);

//   }  
// });


// test(`pad - import template`, async ({}) => {

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

//     await page.goto(`${url}/pad/`)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('#cp-filepicker-dialog').getByText('test template').dblclick();

//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Test template content')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > upload template', status: 'passed',reason: 'Can upload template in Rich Text document'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > upload template', status: 'failed',reason: 'Can\'t upload template in Rich Text document'}})}`);

//   }  
// });

// test(`pad - share at a moment in history`, async ({ }) => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('One moment in history')
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history').click({
//       clickCount: 3
//     });
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history').fill('Another moment in history');
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Another moment in history').click({
//       clickCount: 3
//     });
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Another moment in history').fill('Yet another moment in history');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history')).toBeVisible();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
//     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

//     const clipboardText = await page.evaluate("navigator.clipboard.readText()");
//     const page1 = await browser.newPage();
//     await page1.goto(`${clipboardText}`)

//     await expect(page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history')).toBeVisible();



//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - share at a moment in history', status: 'passed',reason: 'Can share Rich Text at a specific moment in history'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - share at a moment in history', status: 'failed',reason: 'Can share Rich Text at a specific moment in history'}})}`);

//   }  
// });

test.afterEach(async ({  }) => {
  await browser.close()
});