const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url } = require('../browserstack.config.js')

var fs = require('fs');

let page;
let pageOne;
let browser;
let browserName;

test.beforeEach(async ({  }, testInfo) => {
  
  test.setTimeout(2400000);
  browserName = testInfo.project.name
  if (browserName.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (browserName.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext();
  if (browserName.indexOf('firefox') == -1 ) {
    context.grantPermissions(['clipboard-read', "clipboard-write"]);
  } 
  page = await context.newPage();
  await page.goto(`${url}/code`)
  if (browserName.indexOf('firefox') !== -1 ) {
    await page.waitForTimeout(15000)
  } else {
    await page.waitForTimeout(5000)
  }
});

test(`anon - code - input text`, async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` code - input text`, status: 'passed',reason: 'Can create Code document and input text'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - input text`, status: 'failed',reason: 'Can\'t acreate Code document and input text'}})}`);

  }  
});

test(`code - file menu - history`, async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toHaveCount(0)
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeHidden()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - file menu - history`, status: 'passed',reason: 'Can view Code document history'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - file menu - history`, status: 'failed',reason: 'Can\'t view Code document history'}})}`);

  }  
});

test(`code - toggle toolbar`, async ({ }) => {

  try {
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeHidden()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - toggle toolbar`, status: 'passed',reason: 'Can toggle toolbar in Code document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - toggle toolbar`, status: 'failed',reason: 'Can\'t toggle toolbar in Code document'}})}`);

  }  
});

test(`code - toggle preview`, async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Preview' }).click();

    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeHidden()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - code - toggle preview`, status: 'passed',reason: 'Can toggle preview in Code document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - code - toggle preview`, status: 'failed',reason: 'Can\'t toggle preview in Code document'}})}`);

  }  
});

test(`code -  make a copy`, async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
    const page1 = await page1Promise;

    await expect(page1).toHaveURL(new RegExp(`^${url}/code`), { timeout: 100000 })

    await page1.waitForTimeout(4000)
    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();
    

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - toggle preview`, status: 'passed',reason: 'Can toggle preview in Code document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - toggle preview`, status: 'failed',reason: 'Can\'t toggle preview in Code document'}})}`);

  }  
});

test(`code - import file`, async ({ }) => {

  try {

    const fileChooserPromise = page.waitForEvent('filechooser');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/myfile.html');

    await page.waitForTimeout(3000)

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text here')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text here')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - import file`, status: 'passed',reason: 'Can import file into Code document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - import file`, status: 'failed',reason: 'Can\'t import file into Code document'}})}`);

  }  
});

  test(`code - export (md) - `, async ({ }) => {

    try {

      await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
      await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
      await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
      await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test code');
      
      const downloadPromise = page.waitForEvent('download');
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      const download = await downloadPromise;

      await download.saveAs('/tmp/test code');

      const readData = fs.readFileSync("/tmp/test code", "utf8");
      if (readData.trim() == "Test text") {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - export (md)', status: 'passed',reason: 'Can export Code document as .md'}})}`);

      } else {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - export (md)', status: 'failed',reason: 'Can\'t export Code document as .md'}})}`);

      }

    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - export (md)', status: 'failed',reason: 'Can\'t export Code document as .md'}})}`);

    }  
});

  
test(`code - share at a moment in history - (FF clipboard incompatibility)`, async ({ }) => {

  try {

    test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('One moment in history')

    await page.waitForTimeout(7000)
    await page.keyboard.press("Meta+A");
    await page.keyboard.press("Backspace");
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('Another moment in history');
    await page.waitForTimeout(7000)

    await page.keyboard.press("Meta+A");
    await page.keyboard.press("Backspace");
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('Yet another moment in history');
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('One moment in history')).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)

    await expect(page1.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('One moment in history')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - share at a moment in history', status: 'passed',reason: 'Can share code document at a specific moment in history'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - share at a moment in history - (FF clipboard incompatibility)', status: 'failed',reason: 'Can share code document at a specific moment in history - (FF clipboard incompatibility)'}})}`);

  }  
});
  







test.afterEach(async ({  }) => {
  await browser.close()
});