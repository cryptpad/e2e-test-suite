const { test, url, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let pageOne;
let mobile;
let cleanUp;
let contextOne;
let fileActions

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(210000);
  mobile = isMobile

  if (mobile) {
    let userActions = new UserActions(page);
    await userActions.login('test-user', mainAccountPassword);
  }

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/pad`);
  fileActions = new FileActions(page);
  await page.waitForTimeout(10000);
});

test('pad - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await fileActions.padeditor.locator('html').click();
    await fileActions.padeditor.locator('body').fill('example template content');
    await fileActions.saveTemplate(mobile);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example pad template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/pad/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example pad template' }).nth(1).click();
    await expect(fileActions.padeditor.getByText('example template content')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await page.waitForTimeout(3000);
    await fileActions.driveContentFolder.getByText('example pad template').click({ button: 'right' });
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example pad template')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad > save as template', status: 'passed', reason: 'Can save and use Rich Text document as template' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad > save as template', status: 'failed', reason: 'Can\'t save and use Rich Text document as template' } })}`);
  }
});

test('pad - history (previous author)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.padeditor.locator('html').click();
    await fileActions.padeditor.locator('body').type('Test text by test-user');

    await fileActions.share(mobile);
    await fileActions.clickLinkTab(mobile)
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Copy link' }).click();
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');

    if (mobile) {
      contextOne = await browser.launchBrowser({ locale: 'en-GB', permissions: ['clipboard-read', 'clipboard-write'] });
    } else {
      contextOne = await browser.newContext();
    }
    pageOne = await contextOne.newPage();
    await pageOne.goto(`${clipboardText}`);
    let fileActions1 = new FileActions(pageOne);
    await pageOne.waitForTimeout(5000);
    await fileActions1.padeditor.locator('body').click();
    await pageOne.keyboard.press('Enter');
    await fileActions1.padeditor.locator('body').type('Some more test text by anon');
    await pageOne.keyboard.press('Enter');
    await pageOne.waitForTimeout(5000);

    await fileActions1.padeditor.locator('body').type('And here is more text by anon');
    await pageOne.keyboard.press('Enter');
    await pageOne.waitForTimeout(5000);

    await page.keyboard.press('Enter');
    await fileActions.padeditor.locator('body').type('And yet more test text by test-user too!');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    await fileActions.padeditor.locator('body').type('Here is even more test text by test-user!');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);

    await fileActions.filemenuClick(mobile);
    await fileActions.history(mobile);
    await fileActions.historyPrev.click()
    await expect(fileActions.padeditor.getByText('And yet more test text by test-user!')).toHaveCount(0);
    await expect(fileActions.padeditor.getByText('And more test text by test-user too!')).toHaveCount(0);

    await expect(fileActions.padeditor.getByText('Some more test text by anon')).toBeVisible();
    await expect(fileActions.padeditor.getByText('And here is more text by anon')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad - file menu - history (previous author)', status: 'passed', reason: 'Can create Rich Text document and view history (previous author)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad - file menu - history (previous author)', status: 'failed', reason: 'Can\'t create Rich Text document and view history (previous author)' } })}`);
  }
});
