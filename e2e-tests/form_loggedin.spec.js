const { test, url, mainAccountPassword, nextMondaySlashFormat, titleDate } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');

const { expect } = require('@playwright/test');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let isMobile;
let cleanUp;
let pageOne;
let contextOne;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(2400000);

  isMobile = testInfo.project.use.isMobile;

  if (isMobile) {
    let userActions = new UserActions(page);
    await userActions.login('test-user', mainAccountPassword);
  }

  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/form`);
  await page.waitForTimeout(10000);
});

test('form - share with contact (author)', async ({ page, browser }) => {
  try {
    const title = `Form - ${titleDate}`;

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    }
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Author$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/drive`);
    await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click();

    const page2Promise = pageOne.waitForEvent('popup');
    if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).count() > 1) {
      await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
    } else {
      await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click();
    }
    const pageTwo = await page2Promise;

    await pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).waitFor();
    await expect(pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });

    /// /

    await page.bringToFront();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer')).toBeVisible({ timeout: 5000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (author)', status: 'passed', reason: 'Can share form with contact (author)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (author)', status: 'failed', reason: 'Can\'t share form with contact (author)' } })}`);
  }
});

test('form - share with contact (auditor)', async ({ page, browser }) => {
  try {
    const title = `Form - ${titleDate}`;

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    }
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Auditor$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/drive`);
    await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click();

    const page2Promise = pageOne.waitForEvent('popup');
    if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).count() > 1) {
      await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
    } else {
      await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click();
    }
    const pageTwo = await page2Promise;

    await pageTwo.frameLocator('#sbox-iframe').getByRole('heading', { name: title }).waitFor();
    await expect(pageTwo.frameLocator('#sbox-iframe').getByRole('heading', { name: title })).toBeVisible({ timeout: 5000 });
    await pageTwo.frameLocator('#sbox-iframe').getByText('There are no responses').waitFor();
    await expect(pageTwo.frameLocator('#sbox-iframe').getByText('There are no responses')).toBeVisible();

    /// /

    await page.bringToFront();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer')).toBeVisible({ timeout: 5000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (auditor)', status: 'passed', reason: 'Can share form with contact (auditor)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (auditor)', status: 'failed', reason: 'Can\'t share form with contact (auditor)' } })}`);
  }
});

test('form - share with contact (participant)', async ({ page, browser }) => {
  try {
    const title = `Form - ${titleDate}`;

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    }
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Participant$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

    ///
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/drive`);
    await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click();

    const page2Promise = pageOne.waitForEvent('popup');
    if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).count() > 1) {
      await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
    } else {
      await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click();
    }
    const pageTwo = await page2Promise;

    await pageTwo.frameLocator('#sbox-iframe').getByRole('heading', { name: title }).waitFor();
    await expect(pageTwo.frameLocator('#sbox-iframe').getByRole('heading', { name: title })).toBeVisible({ timeout: 5000 });
    await pageTwo.frameLocator('#sbox-iframe').getByText('Please choose how you would').waitFor();
    await expect(pageTwo.frameLocator('#sbox-iframe').getByText('Please choose how you would')).toBeVisible();

    /// /

    await page.bringToFront();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer')).toBeVisible({ timeout: 5000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (to view)', status: 'passed', reason: 'Can share form with contact (to view)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share with contact (to view)', status: 'failed', reason: 'Can\'t share form with contact (to view)' } })}`);
  }
});

test('form - (guest) access - blocked', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({ force: true });
    // await page.waitForTimeout(5000);
    const visible = await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Blocked' }).locator('span').first().isVisible();

    if (visible === false) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({ force: true });
    }
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Blocked' }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Blocked' }).locator('span').first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click({ force: true });
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const context = await browser.newContext();
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByText(/^Guest responses are blocked for this form/).waitFor({ timeout: 60000 });

    await expect(pageOne.frameLocator('#sbox-iframe').getByText(/^Guest responses are blocked for this form/)).toBeVisible();
    await page.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByRole('link', { name: 'log in' }).click();
    await page.waitForTimeout(3000);

    let userActions = new UserActions(pageOne);
    await userActions.login('test-user', mainAccountPassword);

    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('test-user').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - blocked', status: 'passed', reason: 'Can create and answer question with blocked guest access in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - blocked', status: 'failed', reason: 'Can\'t create and answer question with blocked guest access in a Form' } })}`);
    console.log(e);
  }
});

test('form - view history (different authors)', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').dblclick();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('text by test-user');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').press('Enter');
    await page.waitForTimeout(5000);

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    }

    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Author$/ }).locator('span').first().click();

    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).waitFor();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click({ timeout: 5000 });
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const context = await browser.newContext();
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);

    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).dblclick();
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('some text by anon');
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');
    await page.waitForTimeout(7000);

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).click({
      clickCount: 3
    });
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).fill('some more text by test user');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).press('Enter');
    await page.waitForTimeout(5000);

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (!local) {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' History' }).locator('a').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click()

    await expect(page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3)).toBeHidden();
    const question = await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).textContent();

    if (question === 'some text by anon') {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - blocked', status: 'passed', reason: 'Can view history of different authors\' contributions in a Form' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - blocked', status: 'failed', reason: 'Can\'t view history of different authors\' contributions in a Form' } })}`);
    }
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - blocked', status: 'failed', reason: 'Can\'t view history of different authors\' contributions in a Form' } })}`);
    console.log(e);
  }
});

test('form - create quick scheduling poll', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByText('Quick Scheduling Poll').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Poll$/ }).locator('span').waitFor();
    await expect(page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Poll$/ }).locator('span')).toBeVisible();
    await page.waitForTimeout(10000);
    await expect(page.frameLocator('#sbox-iframe').getByText(`${nextMondaySlashFormat}`)).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(1000);
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    await page.waitForTimeout(1000);
    const page1 = await browser.newPage();
    await page1.waitForTimeout(1000);
    await page1.goto(`${clipboardText}`);

    await page1.waitForTimeout(5000);
    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().waitFor();
    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Responses' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('heading', { name: 'Total responses: 1' })).toBeVisible();
    await page.waitForTimeout(10000);
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
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    }

    if (isMobile) {
      await page.frameLocator('#sbox-secure-iframe').getByLabel('Link').click();
    } else {
      await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
    }
    await page.frameLocator('#sbox-secure-iframe').getByText('Participant').click({ timeout: 3000 });
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
    await page.waitForTimeout(5000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    if (isMobile) {
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
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
    }

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
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('example text');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');
    await page.waitForTimeout(3000);

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
    }
    await page.frameLocator('#sbox-iframe').locator('.dialog').getByRole('textbox').fill('example form template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/form/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
    }
    await page.frameLocator('#sbox-secure-iframe').getByText('example form template').click();

    await expect(page.frameLocator('#sbox-iframe').getByText('example text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('example question?');
    await expect(page.frameLocator('#sbox-iframe').getByText('test option one')).toBeVisible(0);
    await expect(page.frameLocator('#sbox-iframe').getByText('test option two')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test option three')).toBeVisible();

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree').getByText('Templates').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example form template').click({ button: 'right' });
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example form template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - save as template', status: 'passed', reason: 'Can save and use Form document as template ' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - save as template', status: 'failed', reason: 'Can\'t save and use Form document as template' } })}`);
  }
});
