const { test, url, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');
let mobile;
let pageOne;
let cleanUp;
let fileActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(210000);
  mobile = isMobile;

  if (mobile) {
    const userActions = new UserActions(page);
    await userActions.login('test-user', mainAccountPassword);
  }

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/code`);
  fileActions = new FileActions(page);
  // await page.waitForTimeout(10000);
});

test('code - save as and import template', async ({ page }) => {
  try {
    // // await page.waitForTimeout(3000);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await fileActions.filesaved.waitFor();
    await fileActions.codeeditor.waitFor();
    await fileActions.codeeditor.click();
    await fileActions.typeTestTextCode(mobile, 'example template content');

    await expect(fileActions.codeeditor.getByText('example template content')).toBeVisible();
    await fileActions.saveTemplate(mobile, local);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example code template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/code/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);
    await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example code template' }).nth(1).click();
    await expect(fileActions.codeeditor.getByText('example template content')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    // await page.waitForTimeout(1000);
    await fileActions.driveContentFolder.getByText('example code template').click({ button: 'right' });
    // await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    // await page.waitForTimeout(1000);
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - save as template', status: 'passed', reason: 'Can save and use Code document as template' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - save as template', status: 'failed', reason: 'Can\'t save and use Codedocument as template' } })}`);
  }
});

test('code - history (previous author)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();
    await fileActions.filesaved.waitFor();
    await fileActions.codeeditor.waitFor();
    await fileActions.codeeditor.click();
    await fileActions.typeTestTextCode(mobile, 'Test text by test-user');
    await expect(fileActions.codeeditor.getByText('Test text by test-user')).toBeVisible();

    await fileActions.share(mobile);
    await fileActions.clickLinkTab(mobile);
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await fileActions.shareCopyLink.click();
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    await page.waitForTimeout(5000);

    pageOne = await browser.newPage();
    await pageOne.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(pageOne);
    await pageOne.waitForTimeout(5000);
    await fileActions1.codeeditor.click();
    await pageOne.keyboard.press('Enter');
    await fileActions1.codeeditor.click();
    await fileActions1.typeTestTextCode(mobile, 'Some more test text by anon');
    await pageOne.keyboard.press('Enter');
    await pageOne.waitForTimeout(5000);
    await expect(fileActions.codeeditor.getByText('Some more test text by anon')).toBeVisible();
    await pageOne.close();

    await fileActions.history(mobile);

    await fileActions.historyPrev.click();
    console.log('visible?', await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Some more test text by anon').isVisible())
    if (await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Some more test text by anon').isVisible()) {
      await fileActions.historyPrev.click();
    }
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Some more test text by anon')).toHaveCount(0);

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text by test-user')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - history (previous author)', status: 'passed', reason: 'Can create code document and view history (previous author)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - history (previous author)', status: 'failed', reason: 'Can\'t create code document and view history (previous author)' } })}`);
  }
});
