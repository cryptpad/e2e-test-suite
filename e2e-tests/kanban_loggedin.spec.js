const { test, url, mainAccountPassword } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

const { expect } = require('@playwright/test');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let pageOne;
let mobile;
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

  await page.goto(`${url}/kanban`);
  fileActions = new FileActions(page);
  // await page.waitForTimeout(10000);
});

test('kanban - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.waitFor();
    await fileActions.createFile.click();

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('example item');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toBeVisible();
    await fileActions.saveTemplate(mobile);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example kanban template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/kanban/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await page.frameLocator('#sbox-secure-iframe').getByText('example kanban template').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    // await page.waitForTimeout(3000);

    await page.frameLocator('#sbox-iframe').getByText('example kanban template').click({ button: 'right' });
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example kanban template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - save as template', status: 'passed', reason: 'Can save and use Kanban document as template' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - save as template', status: 'failed', reason: 'Can\'t save and use Kanban document as template' } })}`);
  }
});

if (!mobile) {
  test('kanban - history (previous author)', async ({ page, browser }) => {
    try {
      await fileActions.createFile.waitFor();
      await fileActions.createFile.click();

      await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
      await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('test text by test-user');
      await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
      // await page.waitForTimeout(5000);

      await fileActions.share(mobile);
      await fileActions.clickLinkTab(mobile);
      await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
      await fileActions.shareCopyLink.click();
      const clipboardText = await page.evaluate('navigator.clipboard.readText()');

      pageOne = await browser.newPage();
      await pageOne.goto(`${clipboardText}`);
      await pageOne.waitForTimeout(5000);
      await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
      await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('some test text by anon');
      await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
      await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
      await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
      await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('some more test text by anon!');
      await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
      await pageOne.waitForTimeout(9000);

      await pageOne.close();

      await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
      await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('and some more test text by test user');
      await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
      await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
      await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
      await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('and some more text by test user here');
      await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
      // await page.waitForTimeout(5000);

      await fileActions.history(mobile);
      await fileActions.historyPrev.click();

      await expect(page.frameLocator('#sbox-iframe').getByText('and some more text by test user here')).toHaveCount(0);

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - history (previous author)', status: 'passed', reason: 'Can create Kanban document and view history (previous author)' } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - history (previous author)', status: 'failed', reason: 'Can\'t create Kanban document and view history (previous author)' } })}`);
    }
  });
}
