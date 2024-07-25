const { test, url, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');

require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');
let isMobile;
let pageOne;
let cleanUp;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);

  isMobile = testInfo.project.use.isMobile;

  if (isMobile) {
    let userActions = new UserActions(page);
    await userActions.login('test-user', mainAccountPassword);
  }

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/code`);
  await page.waitForTimeout(10000);
});

test('code - save as and import template', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('example template content');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('example template content')).toBeVisible();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example code template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/code/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }

    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
    }
    await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example code template' }).nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('example template content')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree').getByText('Templates').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example code template').click({ button: 'right' });
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - save as template', status: 'passed', reason: 'Can save and use Code document as template' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - save as template', status: 'failed', reason: 'Can\'t save and use Codedocument as template' } })}`);
  }
});

test('code - history (previous author)', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text by test-user');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Copy link' }).click();
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');

    pageOne = await browser.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(5000);
    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await pageOne.keyboard.press('Enter');
    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Some more test text by anon');
    await pageOne.keyboard.press('Enter');
    await pageOne.waitForTimeout(5000);

    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And here is more text by anon');
    await pageOne.keyboard.press('Enter');
    await pageOne.waitForTimeout(5000);
    await pageOne.close();

    await page.keyboard.press('Enter');
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And yet more test text by test-user too!');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Here is even more test text by test-user!');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (!local) {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' History' }).locator('a').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And yet more test text by test-user!')).toHaveCount(0);
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And more test text by test-user too!')).toHaveCount(0);

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Some more test text by anon')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('And here is more text by anon')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - history (previous author)', status: 'passed', reason: 'Can create code document and view history (previous author)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - history (previous author)', status: 'failed', reason: 'Can\'t create code document and view history (previous author)' } })}`);
  }
});
