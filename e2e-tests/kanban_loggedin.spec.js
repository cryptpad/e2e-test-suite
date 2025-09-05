const { test, url, mainAccountPassword } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions, StoreModal } = require('./fileactions.js');

const { expect } = require('@playwright/test');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let page1;
let mobile;
let cleanUp;
let fileActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);
  mobile = isMobile;

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/kanban`);
  fileActions = new FileActions(page);
  await fileActions.createFile.waitFor();
});

test('loggedin - kanban - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.addItem.first().waitFor();
    await fileActions.addItem.first().click();
    await fileActions.editItem.fill('example item');
    await fileActions.editItem.press('Enter');
    await expect(fileActions.mainFrame.getByText('example item')).toBeVisible();
    await fileActions.saveTemplate(mobile);
    await fileActions.textbox.fill('example kanban template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/kanban/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await fileActions.secureFrame.getByText('example kanban template').click();
    await expect(fileActions.mainFrame.getByText('example item')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();

    await fileActions.mainFrame.getByText('example kanban template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(fileActions.mainFrame.getByText('example kanban template')).toHaveCount(0);
    await fileActions.toSuccess( 'Can save and use Kanban document as template');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t save and use Kanban document as template');
  }
});

if (!mobile) {
  test('loggedin - kanban - history (previous author)', async ({ page, browser }) => {
    try {
      await fileActions.createFile.click();

      await fileActions.addItem.first().waitFor();
      await fileActions.addItem.first().click();
      await fileActions.editItem.fill('test text by test-user');
      await fileActions.editItem.press('Enter');

      await fileActions.share(mobile);
      const clipboardText = await fileActions.getLinkAfterCopyRole(/^Edit$/, mobile)
      page1 = await browser.newPage();
      await page1.goto(`${clipboardText}`);
      const fileActions1 = new FileActions(page1, mobile)

      await fileActions1.addItem.first().click();
      await fileActions1.editItem.fill('some test text by anon');
      await fileActions1.editItem.press('Enter');
      await fileActions1.addItem.first().click();
      await fileActions1.addItem.first().click();
      await fileActions1.editItem.fill('some more test text by anon!');
      await fileActions1.editItem.press('Enter');
      await page1.waitForTimeout(9000);

      await page1.close();
      await (new StoreModal(fileActions)).dismissButton.click();
      await fileActions.addItem.first().click();
      await fileActions.editItem.fill('and some more test text by test user');
      await fileActions.editItem.press('Enter');
      await fileActions.addItem.first().click();
      await fileActions.addItem.first().click();
      await fileActions.editItem.fill('and some more text by test user here');
      await fileActions.editItem.press('Enter');

      await fileActions.history(mobile);
      await fileActions.historyPrevLast.click();

      await expect(fileActions.mainFrame.getByText('and some more text by test user here')).toHaveCount(0);

      await fileActions.toSuccess( 'Can create Kanban document and view history (previous author)');
    } catch (e) {
      await fileActions.toFailure(e, 'Can\'t create Kanban document and view history (previous author)');
    }
  });
}
