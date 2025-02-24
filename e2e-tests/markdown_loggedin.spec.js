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
let fileActions;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);

  mobile = testInfo.project.use.mobile;

  if (mobile) {
    const userActions = new UserActions(page);
    await userActions.login('test-user', mainAccountPassword);
  }

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/slide`);
  // await page.waitForTimeout(10000);
  fileActions = new FileActions(page);
});

test('slide - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.click();
    await fileActions.filesaved.waitFor();
    await fileActions.codeeditor.waitFor();
    await fileActions.codeeditor.click();
    await fileActions.typeTestTextCode(mobile, 'Test text');
    // await page.waitForTimeout(5000);
    await fileActions.saveTemplate(mobile);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example markdown template');
    await fileActions.okButton.click();
    // await page.waitForTimeout(3000);
    await page.goto(`${url}/slide/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example markdown template' }).nth(1).click();
    await expect(fileActions.codeeditor.getByText('Test text')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    // await page.waitForTimeout(3000);
    await fileActions.driveContentFolder.getByText('example markdown template').click({ button: 'right' });
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example markdown template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide > save as template', status: 'passed', reason: 'Can save and use Rich Text document as template' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide > save as template', status: 'failed', reason: 'Can\'t save and use Rich Text document as template' } })}`);
  }
});

test('slide - history (previous author)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.codeeditor.click();
    await fileActions.codeeditor.type('Test text');
    // await page.waitForTimeout(5000);

    await fileActions.shareLink.click();
    await fileActions.clickLinkTab(mobile);
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await fileActions.shareCopyLink.click();
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');

    pageOne = await browser.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(5000);
    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await pageOne.keyboard.press('Enter');
    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Some more test text by anon');
    await pageOne.keyboard.press('Enter');
    // await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('And here is more text by anon');
    await pageOne.keyboard.press('Enter');
    await pageOne.waitForTimeout(5000);
    await pageOne.close();

    await page.keyboard.press('Enter');
    await fileActions.codeeditor.type('And yet more test text by test-user too!');
    await page.keyboard.press('Enter');
    // // await page.waitForTimeout(5000);
    await fileActions.codeeditor.type('Here is even more test text by test-user!');
    await page.keyboard.press('Enter');
    // await page.waitForTimeout(5000);

    await fileActions.history(mobile);
    await fileActions.historyPrev.click();

    await expect(fileActions.codeeditor.getByText('And yet more test text by test-user!')).toHaveCount(0);
    await expect(fileActions.codeeditor.getByText('And more test text by test-user too!')).toHaveCount(0);

    await expect(fileActions.codeeditor.getByText('Some more test text by anon')).toBeVisible();
    await expect(fileActions.codeeditor.getByText('And here is more text by anon')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - file menu - history (previous author)', status: 'passed', reason: 'Can create Rich Text document and view history (previous author)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - file menu - history (previous author)', status: 'failed', reason: 'Can\'t create Rich Text document and view history (previous author)' } })}`);
  }
});
