const { test, url, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let page1;
let mobile;
let cleanUp;
let fileActions;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(90000);

  mobile = testInfo.project.use.mobile;

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/slide`);
  fileActions = new FileActions(page);
  await fileActions.createFile.waitFor();
});

test('loggedin - slide - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.click();
    await fileActions.fileSaved.waitFor();
    await fileActions.codeEditor.waitFor();
    await fileActions.codeEditor.click();
    await fileActions.typeTestTextCode(mobile, 'Test text');
    await fileActions.saveTemplate(mobile);
    await fileActions.textbox.waitFor('example markdown template');
    await fileActions.textbox.fill('example markdown template');
    await fileActions.okButton.waitFor();
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/slide/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await fileActions.secureFrame.getByText( 'example markdown template').click();
    await expect(fileActions.codeEditor.getByText('Test text')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example markdown template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(fileActions.secureFrame.getByText( 'example markdown template')).toHaveCount(0);
    await fileActions.toSuccess( 'Can save and use Rich Text document as template' );
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t save and use Rich Text document as template');
  }
});

test('loggedin - slide - history (previous author)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.codeEditor.click();
    await fileActions.codeEditor.type('Test text');

    await fileActions.share(mobile);
    const clipboardText = await fileActions.getLinkAfterCopyRole(/^Edit$/)

    page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1, mobile)

    await fileActions1.slideEditor.click();
    await page1.keyboard.press('Enter');
    await fileActions1.slideEditor.type('Some more test text by anon');
    await page1.keyboard.press('Enter');
    await fileActions1.slideEditor.type('And here is more text by anon');
    await page1.keyboard.press('Enter');
    await page1.waitForTimeout(5000);
    await page1.close();

    await page.keyboard.press('Enter');
    await fileActions.codeEditor.type('And yet more test text by test-user too!');
    await page.keyboard.press('Enter');
    await fileActions.codeEditor.type('Here is even more test text by test-user!');
    await page.keyboard.press('Enter');

    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();

    await expect(fileActions.codeEditor.getByText('And yet more test text by test-user!')).toHaveCount(0);
    await expect(fileActions.codeEditor.getByText('And more test text by test-user too!')).toHaveCount(0);

    await expect(fileActions.codeEditor.getByText('Some more test text by anon')).toBeVisible();
    await expect(fileActions.codeEditor.getByText('And here is more text by anon')).toBeVisible();

    await fileActions.toSuccess( 'Can create Rich Text document and view history (previous author)');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t create Rich Text document and view history (previous author)');
  }
});
