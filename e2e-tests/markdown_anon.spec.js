const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { patchCaps, caps, url, titleDate } = require('../browserstack.config.js')
var fs = require('fs');


let page;
let pageOne;
let browser;
let browserName;
let context;

test.beforeEach(async ({ playwright }, testInfo) => {
  
  test.setTimeout(2400000);
  const isMobile = testInfo.project.name.match(/browserstack-mobile/);
  if (isMobile) {
    patchMobileCaps(
      testInfo.project.name,
      `${testInfo.file} - ${testInfo.title}`
    );
    device = await playwright._android.connect(
      `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
        JSON.stringify(caps)
      )}`
    );
    await device.shell("am force-stop com.android.chrome");
    context = await device.launchBrowser();
  } else {
    patchCaps(testInfo.project.name, `${testInfo.title}`);
    delete caps.osVersion;
    delete caps.deviceName;
    delete caps.realMobile;
    browser = await playwright.chromium.connect({
      wsEndpoint:
        `wss://cdp.browserstack.com/playwright?caps=` +
        `${encodeURIComponent(JSON.stringify(caps))}`,
    });
    context = await browser.newContext(testInfo.project.use);
  }
  page = await context.newPage();

  await page.goto(`${url}/slide`)
  await page.waitForTimeout(15000)

});

test('markdown - anon - input text into editor and create slide', async ({  }) => {
  
  try {


    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

  }  
});

test('markdown - anon - create new slide', async ({  }) => {
  
  try {


    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('---');
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('More test text');
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).click()
    }
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Not now' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).click();

    }

    await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').filter({ hasText: 'Test text' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-right span').hover();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-right span').click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('More test text')).toBeVisible();
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

  }  
});

test('markdown - toggle toolbar', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeHidden();
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown - input text into editor', status: 'passed',reason: 'Can input '}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown - input text into editor', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

  }  
});



test('markdown - toggle preview', async ({  }) => {
  
  try {


    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeHidden();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

  }  
});


test('anon - slide - make a copy', async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
    const page1 = await page1Promise;

    await expect(page1).toHaveURL(new RegExp(`^${url}/slide`), { timeout: 100000 })
    await page1.waitForTimeout(5000)

    await expect(page1.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - slide > comment', status: 'failed',reason: 'Can\'t create comment in Markdown document'}})}`);

  }  
});


test(`slide - export (md)`, async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test markdown');
    
    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/test markdown');

    const readData = fs.readFileSync("/tmp/test markdown", "utf8");
    if (readData.trim() == "Test text") {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'slide - export (md)', status: 'passed',reason: 'Can export Markdown document as .md'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'slide - export (md)', status: 'failed',reason: 'Can\'t export Markdown document as .md'}})}`);

    }

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'slide - export (md)', status: 'failed',reason: 'Can\'t export Markdown document as .md'}})}`);

  }  
});

test(`slide - share at a moment in history - (FF clipboard incompatibility)`, async ({ }) => {

  try {

       //test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('One moment in history');
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('');
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Another moment in history');
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('');
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Yet another moment in history');
    await page.waitForTimeout(5000)
    

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    if ( await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.isVisible()) {
       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('One moment in history')).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('One moment in history').waitFor()
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Another moment in history')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'slide - share at a moment in history', status: 'passed',reason: 'Can share Markdown at a specific moment in history'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'slide - share at a moment in history - (FF clipboard incompatibility)', status: 'failed',reason: 'Can share Markdown at a specific moment in history - (FF clipboard incompatibility)'}})}`);

  }  
});

test(`slide - history (previous version)`, async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    if ( await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.isVisible()) {
       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Test text')).toHaveCount(0)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `slide - file menu - history (previous version)`, status: 'passed',reason: 'Can create Markdown document and view history'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `slide - file menu - history (previous version)`, status: 'failed',reason: 'Can\'t create Markdown document and view history'}})}`);

  }  
});


test(`markdown - import file`, async ({ }) => {

  try {

    const fileChooserPromise = page.waitForEvent('filechooser');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/testslide.md');

    await page.waitForTimeout(3000)

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('1test text2​3---4​5new text')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `slide - import file`, status: 'passed',reason: 'Can import file into Slide document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `slide - import file`, status: 'failed',reason: 'Can\'t import file into Slide document'}})}`);

  }  
});

test.afterEach(async ({  }) => {
  await browser.close()
});