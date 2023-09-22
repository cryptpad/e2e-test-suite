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

  page = await browser.newPage();
  await page.goto(`${url}/kanban`)
  if (browserName.indexOf('firefox') !== -1 ) {
    await page.waitForTimeout(15000)
  } else {
    await page.waitForTimeout(5000)
  }
});


test(`kanban - save as and import template`, async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('example item');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example kanban template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000)
    await page.goto(`${url}/kanban/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('example kanban template').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').getByText('Templates').click();
    await page.frameLocator('#sbox-iframe').getByText('example kanban template').click({button: 'right'});
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example kanban template')).toHaveCount(0)
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - save as template', status: 'passed',reason: 'Can save and use Kanban document as template'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - save as template', status: 'failed',reason: 'Can\'t save and use Kanban document as template'}})}`);

  }  
});

test(`kanban - history (previous author) - THIS TEST WILL FAIL - (FF clipboard incompatibility)`, async ({ }, testInfo) => {

  try {
    
    test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('test text by test-user');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await page.waitForTimeout(5000)


    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', {name: 'Copy link'}).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    pageOne = await browser.newPage();
    await pageOne.goto(`${clipboardText}`)
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('some test text by anon');
    await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('some more test text by anon!');
    await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await pageOne.waitForTimeout(9000)

    await pageOne.close()

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('and some more test text by test user');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('and some more text by test user here');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('and some more test text by test user')).toHaveCount(0)
    await expect(page.frameLocator('#sbox-iframe').getByText('and some more text by test user here')).toHaveCount(0)

    await expect(page.frameLocator('#sbox-iframe').getByText('some test text by anon')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('some more test text by anon!')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `kanban - history (previous author)`, status: 'passed',reason: 'Can create Kanban document and view history (previous author)'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `kanban - history (previous author) - THIS TEST WILL FAIL - (FF clipboard incompatibility)`, status: 'failed',reason: 'Can\'t create Kanban document and view history (previous author) - THIS TEST WILL FAIL - (FF clipboard incompatibility)'}})}`);

  }  
});


test.afterEach(async ({  }) => {
    await browser.close()
});