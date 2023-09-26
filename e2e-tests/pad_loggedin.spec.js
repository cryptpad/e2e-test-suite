const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')

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

  const context = await browser.newContext({ storageState: 'auth/mainuser.json' });
  if (browserName.indexOf('firefox') == -1 ) {
    context.grantPermissions(['clipboard-read', "clipboard-write"]);
  } 
  page = await context.newPage();
  await page.goto(`${url}/pad`)
  if (browserName.indexOf('firefox') !== -1 ) {
    await page.waitForTimeout(15000)
  } else {
    await page.waitForTimeout(5000)
  }
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

    test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

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
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author) - (FF clipboard incompatibility)`, status: 'failed',reason: 'Can\'t create Rich Text document and view history (previous author) - (FF clipboard incompatibility)'}})}`);

  }  
});

test.afterEach(async ({  }) => {
    await browser.close()
  });