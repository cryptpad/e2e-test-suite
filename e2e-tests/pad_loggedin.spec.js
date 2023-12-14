const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { caps, patchCaps, url, titleDate } = require('../browserstack.config.js')

var fs = require('fs');


let page;
let pageOne;
let browser;
let browserName;
let context;

test.beforeEach(async ({ playwright }, testInfo) => {
  
  test.setTimeout(180000);
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
    context = await browser.newContext({ storageState: 'auth/mainuser.json' }, testInfo.project.use);
  }
  page = await context.newPage();
  await page.goto(`${url}/pad`)
});


test(`pad - save as and import template`, async ({}) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('example template content');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example pad template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000)
    await page.goto(`${url}/pad/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example pad template' }).nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('example template content')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').getByText('Templates').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example pad template').click({button: 'right'});
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000)
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example pad template')).toHaveCount(0)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'passed',reason: 'Can save and use Rich Text document as template'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'failed',reason: 'Can\'t save and use Rich Text document as template'}})}`);

  }  
});

test(`pad - history (previous author) - (FF clipboard incompatibility)`, async ({ }, testInfo) => {

  try {

       //test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

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
    if ( await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.isVisible()) {
       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('And yet more test text by test-user!')).toHaveCount(0)
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('And more test text by test-user too!')).toHaveCount(0)

    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Some more test text by anon')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('And here is more text by anon')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author)`, status: 'passed',reason: 'Can create Rich Text document and view history (previous author)'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author) - (FF clipboard incompatibility)`, status: 'failed',reason: 'Can\'t create Rich Text document and view history (previous author) - (FF clipboard incompatibility)'}})}`);

  }  
});

test.afterEach(async ({  }) => {
    await browser.close()
  });