const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { caps, patchCaps, url, titleDate } = require('../browserstack.config.js')

var fs = require('fs');


let page;
let pageOne;
let browser;
let browserName;
let context

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
    context = await browser.newContext(testInfo.project.use, { storageState: 'auth/mainuser.json' });
  }
  // browser = await firefox.launch({
  //   firefoxUserPrefs: {
  //     'dom.events.asyncClipboard.readText': true,
  //     'dom.events.testing.asyncClipboard': true,
  //   },
  //   locale: 'en-GB',
  // })
  // context = await browser.newContext({ storageState: 'auth/mainuser.json' })
  page = await context.newPage();

  await page.goto(`${url}/code`)
  await page.waitForTimeout(15000)
});

test(`code - save as and import template`, async ({}) => {

    try {
  
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
      await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
      await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('example template content');
      await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('example template content')).toBeVisible();
  
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
      await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example code template');
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.waitForTimeout(3000)
      await page.goto(`${url}/code/`);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
      await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example code template' }).nth(1).click();
      await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('example template content')).toBeVisible();
  
      await page.goto(`${url}/drive/`);
      await page.frameLocator('#sbox-iframe').getByText('Templates').click();
      await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example code template').click({button: 'right'});
      await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await expect(page.frameLocator('#sbox-secure-iframe').getByText('example template')).toHaveCount(0)
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - save as template', status: 'passed',reason: 'Can save and use Code document as template'}})}`);
  
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - save as template', status: 'failed',reason: 'Can\'t save and use Codedocument as template'}})}`);
  
    }  
  });

test(`code - history (previous author) - (FF clipboard incompatibility)`, async ({ }, testInfo) => {

  try {

    // console.log(context.permissions)
       //test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text by test-user');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', {name: 'Copy link'}).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    pageOne = await browser.newPage();
    await pageOne.goto(`${clipboardText}`)
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click()
    await pageOne.keyboard.press('Enter')
    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Some more test text by anon');
    await pageOne.keyboard.press('Enter')
    await pageOne.waitForTimeout(5000)

    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And here is more text by anon');
    await pageOne.keyboard.press('Enter')
    await pageOne.waitForTimeout(5000)
    await pageOne.close()

    await page.keyboard.press('Enter')
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And yet more test text by test-user too!');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Here is even more test text by test-user!');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click({force: true, timeout: 3000});

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And yet more test text by test-user!')).toHaveCount(0)
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And more test text by test-user too!')).toHaveCount(0)

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Some more test text by anon')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And here is more text by anon')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - history (previous author)`, status: 'passed',reason: 'Can create code document and view history (previous author)'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - history (previous author) - (FF clipboard incompatibility)`, status: 'failed',reason: 'Can\'t create code document and view history (previous author) - (FF clipboard incompatibility)'}})}`);

  }  
});
  

test.afterEach(async ({  }) => {
    await browser.close()
  });