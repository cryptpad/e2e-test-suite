const { test, url, mainAccountPassword, nextMondaySlashFormat, testUser3Password, titleDate, titleDateComma } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

const { expect } = require('@playwright/test');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let cleanUp;
let page1;
let contextOne;
let fileActions;
let isBrowserstack;
let mobile;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(150000);
  mobile = isMobile;
  isBrowserstack = !!testInfo.project.name.match(/browserstack/);

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/form`);
  fileActions = new FileActions(page, testInfo.title, isMobile);
  await fileActions.createFile.waitFor();
});

test('loggedin - form - share with contact (author)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.share(mobile);
    await fileActions.linkRole(/^Author$/ ).click();
    await fileActions.secureFrame.getByText('test-user3').click();
    await fileActions.shareSecureLink.click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.click();

    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.shareNotif('test-user', 'Form').first().click();

    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);

    await fileActions2.fileTitle('Form').waitFor();
    await expect(fileActions2.fileTitle('Form')).toBeVisible({ timeout: 5000 });

    /// /
    await page.bringToFront();
    if (mobile) {
      await fileActions.usersPanel.click();
    }
    await expect(fileActions.formEditor.getByText('test-user3').or(fileActions.mainFrame.getByText('1 viewer'))).toBeVisible({ timeout: 5000 });

    await fileActions.toSuccess('Can share form with contact (author)');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t share form with contact (author)' );
  }
});

test('loggedin - form - share with contact (auditor)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.share(mobile);
    await fileActions.linkRole(/^Auditor$/ ).click();
    await fileActions.secureFrame.getByText('test-user3').click();
    await fileActions.shareSecureLink.click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.click();

    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.shareNotif('test-user', 'Form').first().click()

    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);
    await fileActions2.fileTitle('Form').waitFor();
    await expect(fileActions2.fileTitle('Form')).toBeVisible({ timeout: 5000 });
    await fileActions2.thereAreNoResponses.waitFor();
    await expect(fileActions2.thereAreNoResponses).toBeVisible();

    /// /

    await page.bringToFront();
    if (mobile) {
      await fileActions.usersPanel.click();
    }
    await expect(fileActions.formEditor.getByText('test-user3').or(fileActions.mainFrame.getByText('1 viewer'))).toBeVisible({ timeout: 5000 });

    await fileActions.toSuccess('Can share form with contact (auditor)');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t share form with contact (auditor)');
  }
});

test('loggedin - form - share with contact (participant)', async ({ page, browser }) => {
  try {

    await fileActions.createFile.waitFor();
    await fileActions.createFile.click();

    await fileActions.share(mobile);
    await fileActions.linkRole(/^Participant$/ ).click();
    await fileActions.secureFrame.getByText('test-user3').click();
    await fileActions.shareSecureLink.click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.click();

    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.shareNotif('test-user', 'Form').first().click()
    const page2 = await page2Promise;

    const fileActions2 = new FileActions(page2);
    await page2.frameLocator('#sbox-iframe').getByText('Please choose how you would').waitFor();
    await expect(page2.frameLocator('#sbox-iframe').getByText('Please choose how you would')).toBeVisible();

    /// /

    await page.bringToFront();
    if (mobile) {
      await fileActions.usersPanel.click();
    }
    await expect(fileActions.formEditor.getByText('test-user3').or(fileActions.mainFrame.getByText('1 viewer'))).toBeVisible({ timeout: 5000 });

    await fileActions.toSuccess('Can share form with contact (to view)');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t share form with contact (to view)');
  }
});

test('loggedin - form - (guest) access - blocked', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.openFormSettings()
    await fileActions.mainFrame.getByText('Blocked').waitFor();
    await fileActions.mainFrame.getByText('Blocked').click();
    await fileActions.closeModal.click();
    await fileActions.copyPublicLink.click();
    await page.waitForTimeout(1000);

    const clipboardText = await fileActions.getLinkAfterCopyForm()

    const context = await browser.newContext();
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(1000);
    const fileActions1 = new FileActions(page1)
    await fileActions1.mainFrame.getByText(/^Guest responses are blocked for this form/).waitFor({ timeout: 60000 });

    await expect(fileActions1.mainFrame.getByText(/^Guest responses are blocked for this form/)).toBeVisible();

    const userActions = new UserActions(page1);
    await userActions.login('test-user3', testUser3Password);
    await fileActions1.notifications.waitFor();
    await page1.goto(`${clipboardText}`);

    await fileActions1.mainFrame.getByText('Option 1').click();
    await fileActions1.formContainer.getByText('test-user3').click({timeout: 3000});
    await expect(fileActions1.submitButton).toBeVisible();

    await fileActions.toSuccess( 'Can create and answer question with blocked guest access in a Form');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t create and answer question with blocked guest access in a Form');
  }
});

test('loggedin - form - view history (different authors)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.textbox.click();
    await fileActions.textbox.dblclick();
    await fileActions.textbox.fill('text by test-user');
    await fileActions.textbox.press('Enter');
    await fileActions.share(mobile);
    const clipboardText = await fileActions.getLinkAfterCopyRole(/^Author$/, mobile)

    const context = await browser.newContext();
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(1000);
    const fileActions1 = new FileActions(page1)
    await fileActions.textButton.click();
    await fileActions1.textbox.nth(1).click();
    await fileActions1.textbox.nth(1).dblclick();
    await fileActions1.textbox.nth(1).fill('some text by anon');
    await fileActions1.textbox.nth(1).press('Enter');

    await fileActions.textButton.click();
    await fileActions.textbox.nth(3).click({
      clickCount: 3
    });
    await fileActions.textbox.nth(3).fill('some more text by test user');
    await fileActions.textbox.nth(3).press('Enter');

    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await fileActions.historyPrevLast.click();

    await expect(fileActions.textbox.nth(3)).toBeHidden();
    await fileActions.toSuccess('')
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t view history of different authors\' contributions in a Form');
  }
});

test('loggedin - form - create quick scheduling poll', async ({ page, browser }) => {
  try {
    await fileActions.mainFrame.getByText('Quick Scheduling Poll').click();
    await fileActions.createFile.click();
    await fileActions.choiceGridAnswer(/^Poll$/ ).waitFor();
    await expect(fileActions.choiceGridAnswer(/^Poll$/ )).toBeVisible();
    await expect(fileActions.mainFrame.getByText(`${nextMondaySlashFormat}`)).toBeVisible();

    await fileActions.copyPublicLink.click();
    const clipboardText = await fileActions.getLinkAfterCopy()
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.pollCell.waitFor();
    await fileActions1.pollCell.click();
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.oneTotalResponse).toBeVisible();
    await expect(fileActions.mainFrame.getByText(/Total1\(0\)0\(0\)/)).toBeVisible();

    await fileActions.toSuccess('Can create quick scheduling poll');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create quick scheduling poll');
  }
});

test('loggedin - form - protect with password', async ({ page, browser }) => {
  try {
    await fileActions.creationOption('Add a password' ).click();
    await fileActions.creationPassword.fill('password');
    await fileActions.createFile.click();

    await fileActions.share(mobile);
    await page.waitForTimeout(5000);

    const clipboardText = await fileActions.getLinkAfterCopyRole('Participant', mobile)

    if (mobile) {
      contextOne = browser;
    } else {
      contextOne = await browser.newContext();
    }

    const page1 = await contextOne.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1, mobile)

    await fileActions1.newPasswordMessage.waitFor();

    await expect(fileActions1.newPasswordMessage).toBeVisible({ timeout: 30000 });
    await fileActions1.typePassword.click();
    await fileActions1.typePassword.fill('password');
    await fileActions1.submitButton.click();
    await page1.waitForTimeout(5000);
    await expect(fileActions1.mainFrame.getByText('Your question here?')).toBeVisible({ timeout: 5000 });

    await page.bringToFront();
    await fileActions.access(mobile);

    await expect(fileActions.changePasswordInput).toBeHidden();

    await fileActions.toSuccess( 'Can protect Form with password');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t protect Form with password' );
  }
});

test('loggedin - form - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.editQuestion.first().click();
    await fileActions.formTextInput.click();
    await fileActions.formTextInput.fill('example text');
    await fileActions.textbox.fill('example question?');
    await page.keyboard.press('Enter');
    await fileActions.editQuestion.click();
    await fileActions.editOption.click();
    await fileActions.editOption.fill('test option one');
    await fileActions.optionPlaceholder('Option 2').click();
    await fileActions.optionPlaceholder('Option 2').fill('test option two');
    await fileActions.addOption.click();
    await fileActions.optionPlaceholder('New option').fill('test option three');

    await fileActions.saveTemplate(mobile);
    await fileActions.templateName.fill('example form template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/form/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await fileActions.secureFrame.getByText('example form template').click();

    await expect(fileActions.mainFrame.getByText('example text')).toBeVisible();
    await expect(fileActions.textbox).toHaveValue('example question?');
    await expect(fileActions.mainFrame.getByText('test option one')).toBeVisible(0);
    await expect(fileActions.mainFrame.getByText('test option two')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('test option three')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example form template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(fileActions.secureFrame.getByText('example form template')).toHaveCount(0);
    await fileActions.toSuccess( 'Can save and use Form document as template ');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t save and use Form document as template' );
  }
});
