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
let contextOne;
let fileActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);
  mobile = isMobile;

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/pad`);
  fileActions = new FileActions(page);
  await fileActions.createFile.waitFor();
  await fileActions.createFile.click();
});

test('loggedin - pad - save as and import template', async ({ page }) => {
  try {
    
    await fileActions.padEditorHTML.click();
    await fileActions.padEditorBody.fill('example template content');
    await fileActions.saveTemplate(mobile);
    await fileActions.textbox.fill('example pad template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/pad/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await fileActions.secureFrame.getByText('example pad template').click();
    await expect(fileActions.padEditor.getByText('example template content')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example pad template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example pad template')).toHaveCount(0);

    await fileActions.toSuccess( 'Can save and use Rich Text document as template');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t save and use Rich Text document as template');
  }
});

test('loggedin - pad - history (previous author)', async ({ page, browser }) => {
  try {

    await fileActions.padEditorHTML.click();
    await fileActions.padEditorBody.type('Test text by test-user');

    await fileActions.share(mobile);
    const clipboardText = await fileActions.getLinkAfterCopyRole(/^Edit$/)

    if (mobile) {
      contextOne = await browser.launchBrowser({ locale: 'en-GB', permissions: ['clipboard-read', 'clipboard-write'] });
    } else {
      contextOne = await browser.newContext();
    }
    page1 = await contextOne.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.padEditorBody.waitFor()
    await fileActions1.padEditorBody.click();
    await page1.keyboard.press('Enter');
    await fileActions1.padEditorBody.type('Some more test text by anon');
    await page1.keyboard.press('Enter');

    await fileActions1.padEditorBody.type('And here is more text by anon');
    await page1.keyboard.press('Enter');

    await page.keyboard.press('Enter');
    await fileActions.padEditorBody.type('And yet more test text by test-user too!');
    await page.keyboard.press('Enter');
    await fileActions.padEditorBody.type('Here is even more test text by test-user!');
    await page.keyboard.press('Enter');

    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await expect(fileActions.padEditor.getByText('Here is even more test text by test-user!')).toHaveCount(0);

    await fileActions.toSuccess('Can create Rich Text document and view history (previous author)');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create Rich Text document and view history (previous author)');
  }
});
