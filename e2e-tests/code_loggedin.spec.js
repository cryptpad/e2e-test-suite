const { test, url, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');
let mobile;
let page1;
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

  await page.goto(`${url}/code`);
  fileActions = new FileActions(page);
  await fileActions.createFile.waitFor();
});

test('code - save as and import template', async ({ page }) => {
  try {

    await fileActions.createFile.click();
    await fileActions.fileSaved.waitFor();
    await fileActions.codeEditor.waitFor();
    await fileActions.codeEditor.click();
    await fileActions.typeTestTextCode(mobile, 'example template content');

    await expect(fileActions.codeEditor.getByText('example template content')).toBeVisible();
    await fileActions.saveTemplate(mobile, local);
    await fileActions.templateName.fill('example code template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/code/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);
    await fileActions.templateSpan('example code template').click();
    await fileActions.codeEditor.getByText('example template content').waitFor()
    await expect(fileActions.codeEditor.getByText('example template content')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example code template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example template')).toHaveCount(0);
    await fileActions.toSuccess('Can save and use Code document as template');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t save and use Codedocument as template');
  }
});

test('code - history (previous author)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();
    await fileActions.fileSaved.waitFor();
    await fileActions.codeEditor.waitFor();
    await fileActions.codeEditor.click();
    await fileActions.typeTestTextCode(mobile, 'Test text by test-user');
    await expect(fileActions.codeEditor.getByText('Test text by test-user')).toBeVisible();

    await fileActions.share(mobile);
    const clipboardText = await fileActions.getLinkAfterCopyRole(/^Edit$/)

    page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1);
    await page1.waitForTimeout(5000);
    await fileActions1.codeEditor.click();
    await page1.keyboard.press('Enter');
    await fileActions1.codeEditor.click();
    await fileActions1.typeTestTextCode(mobile, 'Some more test text by anon');
    await page1.keyboard.press('Enter');
    await page1.waitForTimeout(5000);
    await expect(fileActions.codeEditor.getByText('Some more test text by anon')).toBeVisible();
    await page1.close();

    await fileActions.history(mobile);

    await fileActions.historyPrevLast.click();
    if (await fileActions.slideEditor.getByText('Some more test text by anon').isVisible()) {
      await fileActions.historyPrevLast.click();
    }
    await expect(fileActions.slideEditor.getByText('Some more test text by anon')).toHaveCount(0);

    await expect(fileActions.slideEditor.getByText('Test text by test-user')).toBeVisible();

    await fileActions.toSuccess( 'Can create code document and view history (previous author)' );
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create code document and view history (previous author)');
  }
});
