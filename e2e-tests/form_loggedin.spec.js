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

  // if (mobile) {
  //   const userActions = new UserActions(page);
  //   await userActions.login('test-user', mainAccountPassword);
  // }

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/form`);
  fileActions = new FileActions(page);
  // await page.waitForTimeout(10000);
});

test('form - share with contact (author)', async ({ page, browser }) => {
  try {
    const title = `Form - ${titleDate}`;
    const titleComma = `Form - ${titleDateComma}`;
    await fileActions.createFile.waitFor();
    await fileActions.createFile.click();

    await fileActions.share(mobile);
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Author$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
    await fileActions.shareSecureLink.click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    fileActions = new FileActions(page1);
    await fileActions.notifications.click();

    const page2Promise = page1.waitForEvent('popup');
    // if (await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).count() > 1) {
      await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).first().click();
    // } else {
    //   await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click();
    // }
    const page2 = await page2Promise;

    await page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`)).waitFor();
    await expect(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible({ timeout: 5000 });

    /// /

    await page.bringToFront();
    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer').or(page.frameLocator('#sbox-iframe').locator('#cp-app-form-editor').getByText('test-user3'))).toBeVisible({ timeout: 5000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (author)', status: 'passed', reason: 'Can share form with contact (author)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (author)', status: 'failed', reason: 'Can\'t share form with contact (author)' } })}`);
  }
});

test('form - share with contact (auditor)', async ({ page, browser }) => {
  try {
    const title = `Form - ${titleDate}`;
    const titleComma = `Form - ${titleDateComma}`;

    await fileActions.createFile.waitFor();
    await fileActions.createFile.click();

    await fileActions.share(mobile);
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Auditor$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
    await fileActions.shareSecureLink.click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    fileActions = new FileActions(page1);
    await fileActions.notifications.click();

    const page2Promise = page1.waitForEvent('popup');
    // if (await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).count() > 1) {
      await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).first().click();
    // } else {
    //   await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click();
    // }
    const page2 = await page2Promise;

    await page2.frameLocator('#sbox-iframe').getByRole('heading', { name: title }).or(page2.frameLocator('#sbox-iframe').getByRole('heading', { name: titleComma })).waitFor();
    await expect(page2.frameLocator('#sbox-iframe').getByRole('heading', { name: title }).or(page2.frameLocator('#sbox-iframe').getByRole('heading', { name: titleComma }))).toBeVisible({ timeout: 5000 });
    await page2.frameLocator('#sbox-iframe').getByText('There are no responses').waitFor();
    await expect(page2.frameLocator('#sbox-iframe').getByText('There are no responses')).toBeVisible();

    /// /

    await page.bringToFront();
    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer').or(page.frameLocator('#sbox-iframe').locator('#cp-app-form-editor').getByText('test-user3'))).toBeVisible({ timeout: 5000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (auditor)', status: 'passed', reason: 'Can share form with contact (auditor)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (auditor)', status: 'failed', reason: 'Can\'t share form with contact (auditor)' } })}`);
  }
});

test('form - share with contact (participant)', async ({ page, browser }) => {
  try {
    const title = `Form - ${titleDate}`;
    const titleComma = `Form - ${titleDateComma}`;

    await fileActions.createFile.waitFor();
    await fileActions.createFile.click();

    await fileActions.share(mobile);
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Participant$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
    await fileActions.shareSecureLink.click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    fileActions = new FileActions(page1);
    await fileActions.notifications.click();

    const page2Promise = page1.waitForEvent('popup');
    // if (await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).count() > 1) {
      await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).first().click();
    // } else {
    //   await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click();
    // }
    const page2 = await page2Promise;

    await page2.frameLocator('#sbox-iframe').getByRole('heading', { name: title }).or(page2.frameLocator('#sbox-iframe').getByRole('heading', { name: titleComma })).waitFor();
    await expect(page2.frameLocator('#sbox-iframe').getByRole('heading', { name: title }).or(page2.frameLocator('#sbox-iframe').getByRole('heading', { name: titleComma }))).toBeVisible({ timeout: 5000 });
    await page2.frameLocator('#sbox-iframe').getByText('Please choose how you would').waitFor();
    await expect(page2.frameLocator('#sbox-iframe').getByText('Please choose how you would')).toBeVisible();

    /// /

    await page.bringToFront();
    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer').or(page.frameLocator('#sbox-iframe').locator('#cp-app-form-editor').getByText('test-user3'))).toBeVisible({ timeout: 5000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (to view)', status: 'passed', reason: 'Can share form with contact (to view)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (to view)', status: 'failed', reason: 'Can\'t share form with contact (to view)' } })}`);
  }
});

test('form - (guest) access - blocked', async ({ page, browser }) => {
  try {
    await fileActions.createFile.waitFor();
    await fileActions.createFile.click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    // // await page.waitForTimeout(5000);
    const visible = await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Blocked' }).locator('span').first().isVisible();

    if (visible === false) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByText('Blocked').waitFor();
    await page.frameLocator('#sbox-iframe').getByText('Blocked').click();
    // await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
    // await page.waitForTimeout(1000);
    await fileActions.copyPublicLink.click();
    await page.waitForTimeout(1000);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    if (clipboardText === "") {
      await page.waitForTimeout(2000);
      await fileActions.share(mobile);
      await fileActions.shareCopyLink.click();
    }


    const context = await browser.newContext();
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(1000);
    await page1.frameLocator('#sbox-iframe').getByText(/^Guest responses are blocked for this form/).waitFor({ timeout: 60000 });

    await expect(page1.frameLocator('#sbox-iframe').getByText(/^Guest responses are blocked for this form/)).toBeVisible();
    // await page.waitForTimeout(1000);
    // await page1.frameLocator('#sbox-iframe').getByRole('link', { name: 'log in' }).click();

    const userActions = new UserActions(page1);
    await userActions.login('test-user3', testUser3Password);
    await page.waitForTimeout(3000);

    await page1.goto(`${clipboardText}`);

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('test-user3').click({timeout: 3000});
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - blocked', status: 'passed', reason: 'Can create and answer question with blocked guest access in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - blocked', status: 'failed', reason: 'Can\'t create and answer question with blocked guest access in a Form' } })}`);
    console.log(e);
  }
});

test('form - view history (different authors)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.waitFor();
    await fileActions.createFile.click();

    await fileActions.textbox.click();
    await fileActions.textbox.dblclick();
    await fileActions.textbox.fill('text by test-user');
    await fileActions.textbox.press('Enter');
    // await page.waitForTimeout(5000);

    await fileActions.share(mobile);

    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Author$/ }).locator('span').first().click();
    await fileActions.linkTab.click()
    await fileActions.shareCopyLink.waitFor();
    await fileActions.shareCopyLink.click({ timeout: 5000 });
    // await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    if (clipboardText === "") {
      await page.waitForTimeout(2000);
      await fileActions.share(mobile);
      await fileActions.shareCopyLink.click();
    }


    const context = await browser.newContext();
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(1000);

    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).dblclick();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('some text by anon');
    await page1.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');
    // await page.waitForTimeout(7000);

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await fileActions.textbox.nth(3).click({
      clickCount: 3
    });
    await fileActions.textbox.nth(3).fill('some more text by test user');
    await fileActions.textbox.nth(3).press('Enter');
    // await page.waitForTimeout(5000);

    await fileActions.history(mobile);
    await fileActions.historyPrev.click();
    await fileActions.historyPrev.click();

    await expect(fileActions.textbox.nth(3)).toBeHidden();

  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - blocked', status: 'failed', reason: 'Can\'t view history of different authors\' contributions in a Form' } })}`);
    console.log(e);
  }
});

test('form - create quick scheduling poll', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByText('Quick Scheduling Poll').click();
    await fileActions.createFile.click();
    // await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Poll$/ }).locator('span').waitFor();
    await expect(page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Poll$/ }).locator('span')).toBeVisible();
    // await page.waitForTimeout(10000);
    await expect(page.frameLocator('#sbox-iframe').getByText(`${nextMondaySlashFormat}`)).toBeVisible();

    await fileActions.copyPublicLink.click();
    await page.waitForTimeout(1000);
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    if (clipboardText === "") {
      await page.waitForTimeout(2000);
      await fileActions.share(mobile);
      await fileActions.shareCopyLink.click();
    }


    // await page.waitForTimeout(1000);
    const page1 = await browser.newPage();
    await page1.waitForTimeout(1000);
    await page1.goto(`${clipboardText}`);

    await page1.waitForTimeout(5000);
    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().waitFor();
    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    // await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Responses' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('heading', { name: 'Total responses: 1' })).toBeVisible();
    // await page.waitForTimeout(10000);
    await expect(page.frameLocator('#sbox-iframe').getByText(/Total1\(0\)0\(0\)/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - quick scheduling poll', status: 'passed', reason: 'Can create quick scheduling poll' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - quick scheduling poll', status: 'failed', reason: 'Can\'t create quick scheduling poll' } })}`);
  }
});

test('form - protect with password', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Add a password' }).locator('span').first().click();
    await page.frameLocator('#sbox-iframe').locator('#cp-creation-password-val').fill('password');
    await fileActions.createFile.click();

    await fileActions.share(mobile);
    await fileActions.clickLinkTab(mobile);
    await page.frameLocator('#sbox-secure-iframe').getByText('Participant').click({ timeout: 3000 });
    await fileActions.shareCopyLink.click();
    // await page.waitForTimeout(5000);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    if (clipboardText === "") {
      await page.waitForTimeout(2000);
      await fileActions.share(mobile);
      await fileActions.shareCopyLink.click();
    }


    if (mobile) {
      contextOne = browser;
    } else {
      contextOne = await browser.newContext();
    }

    const page1 = await contextOne.newPage();

    await page1.goto(`${clipboardText}`);

    await page1.frameLocator('#sbox-iframe').getByText(/^This document is protected with a new password/).waitFor();

    await expect(page1.frameLocator('#sbox-iframe').getByText(/^This document is protected with a new password/)).toBeVisible({ timeout: 30000 });
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('password');
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.waitForTimeout(5000);
    await expect(page1.frameLocator('#sbox-iframe').getByText('Your question here?')).toBeVisible({ timeout: 5000 });

    await page.bringToFront();
    await fileActions.access(mobile);

    await expect(page.frameLocator('#sbox-secure-iframe').locator('#cp-app-prop-change-password')).toBeHidden();
    await expect(page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Submit' })).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - protect with password', status: 'passed', reason: 'Can protect Form with password' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - protect with password', status: 'failed', reason: 'Can\'t protect Form with password' } })}`);
  }
});

test('form - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('example text');
    // await page.waitForTimeout(3000);
    await fileActions.textbox.fill('example question?');
    await page.keyboard.press('Enter');
    // await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await fileActions.addOption.click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');
    // await page.waitForTimeout(3000);

    await fileActions.saveTemplate(mobile);
    await page.frameLocator('#sbox-iframe').locator('.dialog').getByRole('textbox').fill('example form template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/form/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await page.frameLocator('#sbox-secure-iframe').getByText('example form template').click();

    await expect(page.frameLocator('#sbox-iframe').getByText('example text')).toBeVisible();
    await expect(fileActions.textbox).toHaveValue('example question?');
    await expect(page.frameLocator('#sbox-iframe').getByText('test option one')).toBeVisible(0);
    await expect(page.frameLocator('#sbox-iframe').getByText('test option two')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test option three')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    // await page.waitForTimeout(3000);
    await fileActions.driveContentFolder.getByText('example form template').click({ button: 'right' });
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example form template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - save as template', status: 'passed', reason: 'Can save and use Form document as template ' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - save as template', status: 'failed', reason: 'Can\'t save and use Form document as template' } })}`);
  }
});
