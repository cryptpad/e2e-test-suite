const { test, url, titleDate, dateTodayDashFormat, dateTodaySlashFormat, nextMondaySlashFormat, minutes, hours, todayStringFormat, nextMondayStringFormat } = require('../fixture.js');
const { expect } = require('@playwright/test');
const fs = require('fs');
const d3 = require('d3');
require('dotenv').config();
const { FileActions } = require('./fileactions.js');

const local = !!process.env.PW_URL.includes('localhost');

let pageOne;
let isMobile;
let browserstackMobile;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);

  isMobile = testInfo.project.use.isMobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  await page.goto(`${url}/form`);
  await page.waitForTimeout(10000);
});

test('form - submission (one time no edit)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).click({ timeout: 5000 });

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(10000);

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').waitFor();
    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').getByText('Answer anonymously').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit my responses' })).toBeHidden();
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' })).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (one time no edit)', status: 'passed', reason: 'Can anonymously create form with one time submission (no edit)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (one time no edit)', status: 'failed', reason: 'Can\'t anonymously create form with one time submission (no edit)' } })}`);
  }
});

test('form - submission (multiple times no edit)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('Multiple times', { exact: true }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).click({ timeout: 5000 });
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(10000);

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').waitFor();
    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').getByText('Answer anonymously').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit my responses' })).toBeHidden();
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' })).toBeHidden();
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Submit again' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (multiple times no edit)', status: 'passed', reason: 'Can anonymously create form with multiple submissions (no edit)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (multiple times no edit)', status: 'failed', reason: 'Can\'t anonymously create form with multiple submissions (no edit)' } })}`);
  }
});

test('form - submission (one time) - delete', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).click({ timeout: 5000 });
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(10000);

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').getByText('Answer anonymously').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Submit again' })).toBeHidden();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
    await page1.frameLocator('#sbox-iframe').getByText('Your question here?').waitFor();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('There are no responses')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (one time) - delete', status: 'passed', reason: 'Can anonymously create form with one time submission - delete' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (one time) - delete', status: 'failed', reason: 'Can\'t anonymously create form with one time submission - delete' } })}`);
  }
});

test('form - submission (multiple times) - delete', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('Multiple times and edit/delete').click();
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).click({ timeout: 5000 });
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(10000);

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').getByText('Answer anonymously').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Submit again' })).toBeVisible();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
    await page1.frameLocator('#sbox-iframe').getByText('Your question here?').waitFor();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('There are no responses')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (multiple times) - delete', status: 'passed', reason: 'Can anonymously create form with multiple submissions - delete' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (multiple times) - delete', status: 'failed', reason: 'Can\'t anonymously create form with multiple submissions - delete' } })}`);
  }
});

test('form - submission (multiple times) - edit', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('Multiple times and edit/delete').click();
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).click({ timeout: 5000 });
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(10000);

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').getByText('Answer anonymously').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit my responses' }).click();
    await page1.frameLocator('#sbox-iframe').getByText('Option 2').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Update' }).click();
    
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText(/Option 21/)).toBeVisible();

    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Submit again' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (multiple times) - edit', status: 'passed', reason: 'Can anonymously create form with multiple submissions - edit' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (multiple times) - edit', status: 'failed', reason: 'Can\'t anonymously create form with multiple submissions - edit' } })}`);
  }
});

test('form - submission (one time) - edit', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).click({ timeout: 5000 });
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(10000);

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').getByText('Answer anonymously').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit my responses' }).click();
    await page1.frameLocator('#sbox-iframe').getByText('Option 2').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Update' }).click();
    
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText(/Option 21/)).toBeVisible();

    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Submit again' })).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (one time) - edit', status: 'passed', reason: 'Can anonymously create form with one time submission - edit' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - submission (one time) - edit', status: 'failed', reason: 'Can\'t anonymously create form with one time submission - edit' } })}`);
  }
});

test('form - share (link) - auditor', async ({ page, context }) => {
  try {
    const title = `Form - ${titleDate}`;

    let fileActions = new FileActions(page);
    await fileActions.share(isMobile);

    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Auditor$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).waitFor();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click({ timeout: 5000 });

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(10000);

    await page1.frameLocator('#sbox-iframe').getByRole('heading', { name: title }).waitFor();
    await expect(page1.frameLocator('#sbox-iframe').getByRole('heading', { name: title })).toBeVisible({ timeout: 5000 });
    await page1.frameLocator('#sbox-iframe').getByText('There are no responses').waitFor();
    await expect(page1.frameLocator('#sbox-iframe').getByText('There are no responses')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share (link - auditor)', status: 'passed', reason: 'Can anonymously create form and share link (auditor)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form- share (link - auditor)', status: 'failed', reason: 'Can\'t anonymously create form and share link (auditor)' } })}`);
  }
});

test('form - share (link) - author', async ({ page, context }) => {
  try {
    const title = `Form - ${titleDate}`;

    let fileActions = new FileActions(page);
    await fileActions.share(isMobile);

    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).waitFor();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click({ timeout: 5000 });

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    await page1.waitForTimeout(10000);

    await page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).waitFor();
    await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible();

    await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - share (link - author)', status: 'passed', reason: 'Can anonymously create form and share link (author)' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form- share (link - author)', status: 'failed', reason: 'Can\'t anonymously create form and share link (author)' } })}`);
  }
});

test('form - add and respond to checkbox question', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What box do you choose?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('box1');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('box2');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).fill('box3');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(15000);

    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'box2' }).locator('span').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'box2' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText(/box10 box21 box30/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to checkbox question', status: 'passed', reason: 'Can create and answer checkbox question in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to checkbox question', status: 'failed', reason: 'Can\'t create and answer checkbox question in a Form' } })}`);

    console.log(e);
  }
});

test('form - close and open', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.waitForTimeout(5000);

    const visible = await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).isVisible();

    if (visible === false) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({ force: true });
    }

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByLabel(`${todayStringFormat}`).click();
    await page.waitForTimeout(3000);

    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill(`${hours}`);
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill(`${minutes}`);

    if (isMobile && parseInt(hours) < 12 && await page.frameLocator('#sbox-iframe').locator('.flatpickr-am-pm').isVisible()) {
      await page.frameLocator('#sbox-iframe').locator('.flatpickr-am-pm').click();
    }
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();

    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form was closed on ${dateTodaySlashFormat}`)).toBeVisible();

    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(15000);
    await pageOne.frameLocator('#sbox-iframe').getByText('Your question here?').waitFor();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Your question here?')).toBeVisible();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText(`This form was closed on ${dateTodaySlashFormat}`)).toBeVisible();
    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeHidden();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open', exact: true }).click();
    await page.waitForTimeout(1000);
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('This form is open')).toBeVisible();

    await pageOne.reload();
    await pageOne.bringToFront();
    await pageOne.waitForTimeout(30000);
    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - open and close', status: 'passed', reason: 'Can close and open Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - open and close', status: 'failed', reason: 'Can\'t close and open Form' } })}`);

    console.log(e);
  }
});

test('form - set future closing date and open', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();

    const visible = await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).isVisible();

    if (visible === false) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({ force: true });
    }

    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByLabel(`${nextMondayStringFormat}`).click();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form will close on ${nextMondaySlashFormat}`).waitFor();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form will close on ${nextMondaySlashFormat}`)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).dblclick();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');

    // mocks future date in new context
    const mockedDate = new Date();
    mockedDate.setDate(mockedDate.getDate() + 30);
    await context.addInitScript(`{
      Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(${mockedDate.getTime()})
          } else {
            super(...args)
          }
        }
      }
      
      const __DateNowOffset = ${mockedDate.getTime()} - Date.now()
      const __DateNow = Date.now
      Date.now = () => __DateNow() + __DateNowOffset
    }`);

    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(15000);
    await pageOne.frameLocator('#sbox-iframe').getByText(`This form was closed on ${nextMondaySlashFormat}`).waitFor();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText(`This form was closed on ${nextMondaySlashFormat}`)).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Remove closing date', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('This form is open')).toBeVisible();

    await pageOne.reload();
    await pageOne.waitForTimeout(15000);

    await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('This form was closed on')).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - set closing date and open', status: 'passed', reason: 'Can set closing date for and open Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - set closing date and open', status: 'failed', reason: 'Can\'t set closing date for and open Form' } })}`);
    console.log(e);
  }
});

test('form - anonymize responses', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');

    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);

    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByText('Please choose how you would like to answer this form:').waitFor();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Please choose how you would like to answer this form:')).toBeVisible({ timeout: 15000 });

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first().click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
    await page.waitForTimeout(5000);

    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Responses to this form are anonymized').first()).toBeVisible();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Answer as')).toBeHidden();

    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.bringToFront();
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Show individual answers' }).click();
    await page.frameLocator('#sbox-iframe').getByText(/^Anonymous answer/).click();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anonymize responses', status: 'passed', reason: 'Can anonymize Form responses' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anonymize responses', status: 'failed', reason: 'Can\'t anonymize Form responses' } })}`);

    console.log(e);
  }
});

test('form - publish responses', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');

    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);

    await pageOne.waitForTimeout(5000);

    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: ' View all responses (1)' })).toBeHidden();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Publish responses' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();

    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: ' View all responses (1)' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByText(/Your question here\?Option 11 Option 20/).click();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - publish responses', status: 'passed', reason: 'Can publish Form responses' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - publish responses', status: 'failed', reason: 'Can\'t publish Form responses' } })}`);

    console.log(e);
  }
});

test('form - view history and share at a specific moment in history', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('new option');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }

    await page.waitForTimeout(3000);

    if (local) {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' History' }).locator('a').click();
    }
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText('new option')).toHaveCount(0);
    let fileActions = new FileActions(page);
    await fileActions.share(isMobile);
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);

    await expect(pageOne.frameLocator('#sbox-iframe').getByText('new option')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - view history and share at a specific moment in history', status: 'passed', reason: 'Can view Form history and share at a specific moment in history' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - view history and share at a specific moment in history', status: 'failed', reason: 'Can\'t view Form history and share at a specific moment in history' } })}`);
  }
});

test('form - import file', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.frameLocator('#sbox-iframe').getByText('Import').click();

    const fileChooser = await fileChooserPromise;
    await page.waitForTimeout(5000);
    await fileChooser.setFiles('testdocuments/testform.json');
    await page.waitForTimeout(3000);

    await expect(page.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('What to do today?');
    await expect(page.frameLocator('#sbox-iframe').getByText('Surf')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - import file', status: 'passed', reason: 'Can import a Form from a .json' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - import file', status: 'failed', reason: 'Can\'t import a Form from a .json' } })}`);
  }
});

test('form - make a copy', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
    await page.waitForTimeout(5000);

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What to do today?');
    await page.waitForTimeout(5000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('Surf');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('Cinema');
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form', exact: true }).click();
    await page.waitForTimeout(5000);
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    const pageOnePromise = page.waitForEvent('popup');
    if (!local) {
      await page.frameLocator('#sbox-iframe').getByText('Make a copy').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
    }
    await page.waitForTimeout(5000);
    pageOne = await pageOnePromise;
    await pageOne.waitForTimeout(10000);
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox').waitFor();

    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('What to do today?');
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Surf')).toBeVisible();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - make a copy', status: 'passed', reason: 'Can create a copy of a Form' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - make a copy', status: 'failed', reason: 'Can\'t create a copy of a Form' } })}`);
  }
});

test('form - export file', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');

  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('example text');

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByText('Export').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    await download.saveAs('/tmp/test form');

    const actualFormJSONObject = JSON.parse(fs.readFileSync('/tmp/test form'));

    const actualFormJSONString = JSON.stringify(actualFormJSONObject);

    const testFormJSONString = /^{"form":{"1":{"type":"md","opts":{"text":"example text"}},"2":{"type":"radio","opts":{"values":\[{"uid":"([a-z0-9]{10,11})","v":"test option one"},{"uid":"([a-z0-9]{10,11})","v":"test option two"},{"uid":"([a-z0-9]{10,11})","v":"test option three"}]},"q":"example question\?"}},"order":\["1","2"],"version":1}$/;

    if (testFormJSONString.test(actualFormJSONString)) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - export file', status: 'passed', reason: 'Can create and export a Form into a .json' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - export file', status: 'failed', reason: 'Can\'t create and export a Form into a .json' } })}`);
    }
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - export file', status: 'failed', reason: 'Can\'t create and export a Form into a .json' } })}`);

    console.log(e);
  }
});

test('form - add description', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('New description');
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);

    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByText('New description').waitFor();

    await expect(pageOne.frameLocator('#sbox-iframe').getByText('New description')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add description', status: 'passed', reason: 'Can create Form with a description' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add description', status: 'failed', reason: 'Can\'t create Form with a description' } })}`);

    console.log(e);
  }
});

test('form - add submission message', async ({ page, context }) => {
  try {
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    }

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Add submit message' }).click();
    await page.waitForTimeout(1000);

    await page.frameLocator('#sbox-iframe').locator('pre').nth(1).fill('Thank you for submitting your answer!');
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').waitFor();

    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1000);
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Thank you for submitting your answer!')).toBeVisible();
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add submission message', status: 'passed', reason: 'Can create Form with a submission message' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add submission message', status: 'failed', reason: 'Can\'t create Form with a submission message' } })}`);

    console.log(e);
  }
});

test('form - anon (guest) access - allowed', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What to do today?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('sleep');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('eat');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().waitFor();

    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByRole('heading', { name: 'Total responses: 1' })).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Show individual answers' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/^Anonymous answer/)).toBeVisible();
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - allowed', status: 'passed', reason: 'Can create and answer question with permitted guest access in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - anon (guest) access - allowed', status: 'failed', reason: 'Can\'t create and answer question with permitted guest access in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to text question', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What is your name?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('input[type="text"]').waitFor();

    await pageOne.frameLocator('#sbox-iframe').locator('input[type="text"]').click();
    await pageOne.frameLocator('#sbox-iframe').locator('input[type="text"]').fill('Guest');
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await pageOne.waitForTimeout(3000);
    await pageOne.close();
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('Guest', { exact: true })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to text question', status: 'passed', reason: 'Can create and answer text question in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to text question', status: 'failed', reason: 'Can\'t create and answer text question in a Form' } })}`);

    console.log(e);
  }
});

test('form - edit response', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await page.waitForTimeout(3000);

    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').waitFor();
    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await pageOne.frameLocator('#sbox-iframe').getByText('Answer anonymously').click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit my responses' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByText('Option 2').click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Update' }).click();
    
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText(/Option 21/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - edit response', status: 'passed', reason: 'Can edit response in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - edit response', status: 'failed', reason: 'Can\'t edit response in a Form' } })}`);
    console.log(e);
  }
});

test('form - delete response', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await page.waitForTimeout(3000);

    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').waitFor();
    await pageOne.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await pageOne.frameLocator('#sbox-iframe').getByText('Answer anonymously').click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText(/Option 11/)).toBeVisible();

    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByText('Your question here?').waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Editor' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('There are no responses')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - delete response', status: 'passed', reason: 'Can edit response in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - delete response', status: 'failed', reason: 'Can\'t edit response in a Form' } })}`);
    console.log(e);
  }
});

test('form - add and respond to paragraph question', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Paragraph' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container textarea').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container textarea').fill('Tell me about yourself');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('textarea').waitFor();

    await pageOne.frameLocator('#sbox-iframe').locator('textarea').click();
    await pageOne.frameLocator('#sbox-iframe').locator('textarea').fill('I am a guest');
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('I am a guest')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - respond to paragraph question', status: 'passed', reason: 'Can create and answer paragraph question in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - respond to paragraph question', status: 'failed', reason: 'Can\'t create and answer paragraph question in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to choice question (optional)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choice' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your choice?');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').first().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').first().fill('test option one');
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(1).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(1).fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(2).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(2).fill('test option three');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText(/test option one1/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to choice question (optional)', status: 'passed', reason: 'Can create and answer choice question (optional) in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to choice question (optional)', status: 'failed', reason: 'Can\'t create and answer choice question (optional) in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to choice question (required)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choice' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your choice?');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();

    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').first().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').first().fill('test option one');
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(1).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(1).fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(2).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(2).fill('test option three');
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('.cp-checkmark-label').getByText('Required').nth(0).click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByText('The following questions require an answer:Question 1.').waitFor();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('The following questions require an answer:Question 1.')).toBeVisible();
    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeDisabled();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await page.waitForTimeout(3000);
    await expect(page.frameLocator('#sbox-iframe').getByText(/test option one1/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to choice question (required)', status: 'passed', reason: 'Can create and answer choice question (required) in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to choice question (required)', status: 'failed', reason: 'Can\'t create and answer choice question (required) in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to choice grid question', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choice Grid' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your choice grid?');
    await page.keyboard.press('Enter');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').first().fill('General');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').first().fill('Choice1');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').nth(1).fill('Particular');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(1).fill('Choice2');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);

    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^GeneralGeneral$/ }).locator('span').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^GeneralGeneral$/ }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^ParticularParticular$/ }).locator('span').nth(2).click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByText(/Choice10 Choice21/).waitFor();
    await expect(page.frameLocator('#sbox-iframe').getByText(/Choice10 Choice21/)).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText(/Choice11 Choice20/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form -add and respond to choice grid question', status: 'passed', reason: 'Can create and answer choice grid question in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to choice grid question', status: 'failed', reason: 'Can\'t create and answer choice grid question in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to date question', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Date' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().fill('What is today\'s date?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);

    await pageOne.frameLocator('#sbox-iframe').locator('input[type="text"]').waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('input[type="text"]').click({ timeout: 10000 });
    await pageOne.frameLocator('#sbox-iframe').getByLabel(`${todayStringFormat}`).click({ timeout: 10000 });
    await pageOne.keyboard.press('Enter');
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Responses' }).click();
    await page.waitForTimeout(50000);
    await page.frameLocator('#sbox-iframe').getByText(`${dateTodayDashFormat}`).waitFor();
    await expect(page.frameLocator('#sbox-iframe').getByText(`${dateTodayDashFormat}`)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to date question', status: 'passed', reason: 'Can create and answer date question in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to date question', status: 'failed', reason: 'Can\'t create and answer date question in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to checkbox grid question', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox Grid' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('Which checkbox grid do you choose?');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').press('Enter');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').first().fill('General');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').nth(1).fill('Particular');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').first().fill('Box1');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(1).fill('Box2');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(2).fill('Box3');
    await page.waitForTimeout(20000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);

    await pageOne.frameLocator('#sbox-iframe').locator('label:nth-child(5) > .cp-checkmark-mark').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label:nth-child(4) > .cp-checkmark-mark').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label:nth-child(4) > .cp-checkmark-mark').nth(1).click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }

    await expect(page.frameLocator('#sbox-iframe').getByText(/GeneralBox10 Box21 Box31/)).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText(/ParticularBox10 Box21 Box30/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to checkbox grid question', status: 'passed', reason: 'Can create and answer checkbox grid question in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to checkbox grid question', status: 'failed', reason: 'Can\'t create and answer checkbox grid question in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to ordered list question (schulze method)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Ordered list' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your preference?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('test option 1');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('test option 2');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option 3');

    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByText(/^\?test option/).first().waitFor();
    const firstOption = await pageOne.frameLocator('#sbox-iframe').getByText(/^\?test option/).first().textContent();
    const thirdOption = await pageOne.frameLocator('#sbox-iframe').getByText(/^\?test option/).nth(2).textContent();

    await pageOne.frameLocator('#sbox-iframe').getByText(`${thirdOption}`).hover();
    await pageOne.mouse.down();
    await pageOne.mouse.move(0, 100);
    await pageOne.frameLocator('#sbox-iframe').getByText(`${firstOption}`).hover();
    await pageOne.mouse.up();

    const firstOption2 = await pageOne.frameLocator('#sbox-iframe').getByText(/^test option/).first().textContent();
    const secondOption2 = await pageOne.frameLocator('#sbox-iframe').getByText(/^test option/).nth(1).textContent();
    const thirdOption2 = await pageOne.frameLocator('#sbox-iframe').getByText(/^test option/).nth(2).textContent();

    const answerOrder = {};
    answerOrder[firstOption2] = 3;
    answerOrder[secondOption2] = 2;
    answerOrder[thirdOption2] = 1;

    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }

    const expectedAnswer = `test option 1${answerOrder['test option 1']} test option 2${answerOrder['test option 2']} test option 3${answerOrder['test option 3']}`;
    const expectedAnswerRegex = new RegExp(expectedAnswer);
    const results = await page.frameLocator('#sbox-iframe').locator('.cp-form-creator-results-content').textContent();

    if (expectedAnswerRegex.test(results)) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to ordered list question', status: 'passed', reason: 'Can create and answer ordered list question in a Form' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to ordered list question', status: 'failed', reason: 'Can\'t create and answer ordered list question in a Form' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to ordered list question', status: 'failed', reason: 'Can\'t create and answer ordered list question in a Form' } })}`);
  }
});

test('form - add and respond to ordered list question', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Ordered list' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your preference?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('test option 1');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('test option 2');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option 3');

    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').getByText(/^\?test option/).first().waitFor();
    const firstOption = await pageOne.frameLocator('#sbox-iframe').getByText(/^\?test option/).first().textContent();
    const thirdOption = await pageOne.frameLocator('#sbox-iframe').getByText(/^\?test option/).nth(2).textContent();

    await pageOne.frameLocator('#sbox-iframe').getByText(`${thirdOption}`).hover();
    await pageOne.mouse.down();
    await pageOne.mouse.move(0, 100);
    await pageOne.frameLocator('#sbox-iframe').getByText(`${firstOption}`).hover();
    await pageOne.mouse.up();

    const firstOption2 = await pageOne.frameLocator('#sbox-iframe').getByText(/^test option/).first().textContent();
    const secondOption2 = await pageOne.frameLocator('#sbox-iframe').getByText(/^test option/).nth(1).textContent();
    const thirdOption2 = await pageOne.frameLocator('#sbox-iframe').getByText(/^test option/).nth(2).textContent();

    const answerOrder = {};
    answerOrder[firstOption2] = 3;
    answerOrder[secondOption2] = 2;
    answerOrder[thirdOption2] = 1;

    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }

    const expectedAnswer = `test option 1${answerOrder['test option 1']} test option 2${answerOrder['test option 2']} test option 3${answerOrder['test option 3']}`;
    const expectedAnswerRegex = new RegExp(expectedAnswer);
    const results = await page.frameLocator('#sbox-iframe').locator('.cp-form-creator-results-content').textContent();

    if (expectedAnswerRegex.test(results)) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to ordered list question', status: 'passed', reason: 'Can create and answer ordered list question in a Form' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to ordered list question', status: 'failed', reason: 'Can\'t create and answer ordered list question in a Form' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to ordered list question', status: 'failed', reason: 'Can\'t create and answer ordered list question in a Form' } })}`);
  }
});

test('form - add and respond to poll question', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Poll' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What do you want to do?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().fill('Hiking');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('Yoga');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('Campfire');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').getByText(/Total1\(0\)0\(0\)/)).toBeVisible();
    await page.waitForTimeout(10000);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to poll question', status: 'passed', reason: 'Can create and answer poll question in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to poll question', status: 'failed', reason: 'Can\'t create and answer poll question in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to form with page break', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().fill('Question one');
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Page break' }).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('Question two');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(10000);
    await pageOne.frameLocator('#sbox-iframe').getByText('Question one').waitFor();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Question one')).toBeVisible();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Question two')).toBeHidden();
    await pageOne.frameLocator('#sbox-iframe').locator('.btn.btn-secondary.cp-next').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Question one')).toBeHidden();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Question two')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to page break', status: 'passed', reason: 'Can create and answer Form with a page break' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to page break', status: 'failed', reason: 'Can\'t create and answer Form with a page break' } })}`);

    console.log(e);
  }
});

test('form - add and respond to conditional section question (OR)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Conditional section' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add OR condition' }).click();
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Choose a question ' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Choose a value ' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'test option one' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add OR condition' }).click();
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Choose a question ' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Choose a value ' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'test option three' }).click();
    await page.waitForTimeout(1000);

    await page.frameLocator('#sbox-iframe').locator('.btn.cp-form-creator-inline-add').nth(2).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').locator('.cptools.cptools-form-text').nth(2).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('example question two?');
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible();

    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option two' }).locator('span').first().click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('example question two?')).toBeHidden();

    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option three' }).locator('span').first().click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to conditional question (or)', status: 'passed', reason: 'Can create and respond to conditional section question (OR) in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to conditional question (or)', status: 'failed', reason: 'Can\'t create and respond to conditional section question (OR) in a Form' } })}`);

    console.log(e);
  }
});

test('form - add and respond to conditional section question (AND)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Conditional section' }).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add OR condition' }).click();
    await page.waitForTimeout(1000);
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Choose a question ' }).click();
    }
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    await page.waitForTimeout(1000);
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Choose a value ' }).click();
    }
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Option 1' }).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add AND condition' }).click();
    await page.waitForTimeout(1000);
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Choose a question ' }).click();
    }
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    await page.waitForTimeout(1000);
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Choose a value ' }).click();
    }
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Option 3' }).click();
    await page.waitForTimeout(1000);

    await page.frameLocator('#sbox-iframe').locator('.btn.cp-form-creator-inline-add').nth(2).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').locator('.cptools.cptools-form-text').nth(2).click();
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('example question two?');

    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('example question two?')).toBeHidden();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 3' }).locator('span').first().click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to conditional question (and)', status: 'passed', reason: 'Can create and respond to conditional section question (AND) in a Form' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - add and respond to conditional question (and)', status: 'failed', reason: 'Can\'t create and respond to conditional section question (AND) in a Form' } })}`);

    console.log(e);
  }
});

test('form - export responses as .csv', async ({ page, context }) => {
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');

  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    const UTChours = new Date().getUTCHours();
    const UTCminutes = new Date().getUTCMinutes();

    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export' }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: 'Export to CSV' }).click();
    const download = await downloadPromise;
    await download.saveAs('/tmp/form responses');

    const csv = fs.readFileSync('/tmp/form responses', 'utf8');
    const data = d3.csvParse(csv);
    const responseJSON = `'${JSON.stringify(data)}'`;
    console.log('csv', responseJSON);
    const regexString = new RegExp(`\\[{"Time":"${dateTodayDashFormat}T${UTChours}:${UTCminutes}:[0-9]{2}.[0-9]{3}Z","Participant":"Guest","Your question here\\?":"Option 1"}]`);

    if (regexString.test(responseJSON)) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form  - export responses as .csv', status: 'passed', reason: 'Can export Form reponses as .csv' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form  - export responses as .csv', status: 'failed', reason: 'Can\'texport Form reponses as .csv' } })}`);
    }
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - export responses as .csv', status: 'failed', reason: 'Can\'t export Form reponses as .csv' } })}`);

    console.log(e);
  }
});

test('form - export responses as .json', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    const UTChours = new Date().getUTCHours();
    const UTCminutes = new Date().getUTCMinutes();

    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export' }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: 'Export to JSON' }).click();
    const download = await downloadPromise;
    await download.saveAs('/tmp/form responses');

    const responseJSONObject = JSON.parse(fs.readFileSync('/tmp/form responses'));
    const responseJSONString = `'${JSON.stringify(responseJSONObject)}'`;
    console.log('json', responseJSONString);

    const regexString = new RegExp(`{"questions":{"q1":"Your question here\\?"},"responses":\\[{"_time":"${dateTodayDashFormat}T${UTChours}:${UTCminutes}:[0-9]{2}.[0-9]{3}Z","_name":"Guest","q1":\\["Option 1"]}]}`);

    if (regexString.test(responseJSONString)) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form  - export responses as .json', status: 'passed', reason: 'Can export Form responses as .json' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form  - export responses as .json', status: 'failed', reason: 'Can\'t export Form responses as .json' } })}`);
    }
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - export responses as .json', status: 'failed', reason: 'Can\'t export Form responses as .json' } })}`);

    console.log(e);
  }
});

test('form - export responses (to sheet document)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000);

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    pageOne = await context.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(1000);
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().waitFor();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await pageOne.close();

    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    }
    const page2Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export to Sheet' }).click({ timeout: 3000 });
    const page2 = await page2Promise;

    await expect(page2).toHaveURL(new RegExp(`^${url}/sheet`), { timeout: 100000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form  - export responses (to sheet document)', status: 'passed', reason: 'Can export Form responses to Sheet document' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - export responses (to sheet document)', status: 'failed', reason: 'Can\'t export Form reponses to Sheet document' } })}`);

    console.log(e);
  }
});
