const { test, url, mainAccountPassword, titleDate } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./test-pages.spec.js');

var fs = require('fs');
require('dotenv').config();

const local = process.env.PW_URL.includes('localhost') ? true : false

let pageOne;
let isMobile;
let browserName;
let cleanUp

test.beforeEach(async ({ page }, testInfo) => {

  test.setTimeout(210000)

  isMobile = testInfo.project.use['isMobile']  
  browserName = testInfo.project.name.split(/@/)[0]

  if (isMobile) {
    await page.goto(`${url}/login`)
    await page.getByPlaceholder('Username').fill('test-user');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill(mainAccountPassword);
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    await page.waitForTimeout(5000)
    if (await login.isVisible()) {
      await login.click()
    }
    await page.waitForTimeout(10000)
  }

  const template = testInfo.title.match(/import template/)
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/pad`)
  await page.waitForTimeout(10000)

});

test(`pad - save as and import template`, async ({ page }) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('example template content');
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example pad template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000)
    await page.goto(`${url}/pad/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
    await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example pad template' }).nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('example template content')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree').getByText('Templates').click();
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


test(`pad - history (previous author)`, async ({ page, browser }) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').type('Test text by test-user');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    }
    if (isMobile) {
      await page.frameLocator('#sbox-secure-iframe').getByLabel('Link').click();
    } else {
      await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();

    }
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', {name: 'Copy link'}).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    if (isMobile) {
      contextOne = await device.launchBrowser({ locale: 'en-GB', permissions: ["clipboard-read", "clipboard-write"] });
    } else {
      contextOne = await browser.newContext();
    }
    pageOne = await contextOne.newPage()
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
    // await pageOne.close()

    await page.keyboard.press('Enter')
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').type('And yet more test text by test-user too!');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').type('Here is even more test text by test-user!');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(5000)

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (!local) {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' History' }).locator('a').click()
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
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author)`, status: 'failed',reason: 'Can\'t create Rich Text document and view history (previous author)'}})}`);

  }  
});

