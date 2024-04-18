const { test, url, mainAccountPassword, titleDate, testUser3Password, nextWeekSlashFormat } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { expect } = require('@playwright/test');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let pageOne;
let isMobile;
let browserName;
let cleanUp;
let title;
let titleName;
let contextOne;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);

  isMobile = testInfo.project.use.isMobile;
  browserName = testInfo.project.name.split(/@/)[0];

  if (isMobile) {
    await page.goto(`${url}/login`);
    await page.getByPlaceholder('Username').fill('test-user');
    await page.waitForTimeout(10000);
    await page.getByPlaceholder('Password', { exact: true }).fill(mainAccountPassword);
    const login = page.locator('.login');
    await login.waitFor({ timeout: 18000 });
    await expect(login).toBeVisible({ timeout: 1800 });
    await page.waitForTimeout(5000);
    if (await login.isVisible()) {
      await login.click();
    }
    await page.waitForTimeout(30000);
  }
  const name = testInfo.title.split(' ')[0];

  if (name === 'pad') {
    titleName = 'Rich text -';
    title = `${titleName} ${titleDate}`;
  } else if (name === 'slide') {
    titleName = 'Markdown slides -';
    title = `${titleName} ${titleDate}`;
  } else {
    titleName = name.charAt(0).toUpperCase() + name.slice(1) + ' -';
    title = `${titleName}` + ' ' + `${titleDate}`;
  }

  cleanUp = new Cleanup(page);
  await cleanUp.cleanUserDrive(titleName);

  await page.goto(`${url}/${name}`);

  await page.waitForTimeout(10000);
});

const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'];

docNames.forEach(function (name) {
  test(`${name} - create without owner`, async ({ page }) => {
    try {
      await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Owned document' }).locator('span').first().waitFor();
      await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Owned document' }).locator('span').first().click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 });
      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      }
      await expect(page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user.cp-share-column.cp-access').getByLabel('Owners')).toBeHidden();

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `drive - ${name} - create without owner`, status: 'passed', reason: `Can create ${name} without owner` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `drive - ${name} - create without owner`, status: 'failed', reason: `Can't create ${name} without owner` } })}`);
    }
  });

  test(`${name} - create with destruction date`, async ({ page, context }) => {
    try {
      console.log(nextWeekSlashFormat);

      await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Destruction date' }).locator('span').first().click();
      await page.frameLocator('#sbox-iframe').locator('#cp-creation-expire-val').click();
      await page.frameLocator('#sbox-iframe').locator('#cp-creation-expire-val').fill('7');
      await page.frameLocator('#sbox-iframe').locator('#cp-creation-expire-unit').selectOption('day');
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();

      await expect(page.frameLocator('#sbox-secure-iframe').getByText(`Destruction date${nextWeekSlashFormat}`)).toBeVisible();

      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
      await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
      await page.waitForTimeout(3000);
      const clipboardText = await page.evaluate('navigator.clipboard.readText()');

      // mocks future date in new context
      const mockedDate = new Date('March 14 2042').getTime();
      await context.addInitScript(`{
        Date = class extends Date {
          constructor(...args) {
            if (args.length === 0) {
              super(${mockedDate})
            } else {
              super(...args)
            }
          }
        }
        
        const __DateNowOffset = ${mockedDate} - Date.now()
        const __DateNow = Date.now
        Date.now = () => __DateNow() + __DateNowOffset
      }`);

      const pageOne = await context.newPage();
      await pageOne.goto(`${clipboardText}`);
      await pageOne.waitForTimeout(15000);

      await pageOne.frameLocator('#sbox-iframe').getByText(/^This document has reached/).waitFor();
      await expect(pageOne.frameLocator('#sbox-iframe').getByText(/^This document has reached/)).toBeVisible();

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - create with destruction date`, status: 'passed', reason: `Can create ${name} with destruction date` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - create with destruction date`, status: 'failed', reason: `Can't create ${name} with destruction date` } })}`);
    }
  });

  test(`${name} - tag`, async ({ page }) => {
    try {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
      await page.waitForTimeout(5000);
      if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).isVisible()) {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
      } else {
        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
        }
        if (local) {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tags', exact: true }).click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Tags' }).locator('a').click();
        }
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      }

      await page.waitForTimeout(5000);
      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
      }
      if (local) {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tags', exact: true }).click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Tags' }).locator('a').click();
      }
      await page.frameLocator('#sbox-iframe').locator('.token-input.ui-autocomplete-input').click();
      await page.frameLocator('#sbox-iframe').locator('.token-input.ui-autocomplete-input').fill('testtag');
      await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.waitForTimeout(3000);

      await page.goto(`${url}/drive/#`);
      await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree').getByText('Tags').click();
      await page.frameLocator('#sbox-iframe').getByRole('link', { name: '#testtag' }).click();
      if (isMobile) {
        await page.frameLocator('#sbox-iframe').getByRole('link', { name: '#testtag' }).click();
      }

      await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${title}`).waitFor();
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${title}`)).toBeVisible();

      await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${title}`).click({ button: 'right' });
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Destroy' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${title}`)).toHaveCount(0);

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - tag`, status: 'passed', reason: `Can tag ${name} document` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - tag`, status: 'failed', reason: `Can't tag ${name} document` } })}`);
    }
  });

  test(`${name} - edit document owners #1264`, async ({ page, browser }) => {
    try {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

      // add test-user3 as owner
      await page.waitForTimeout(5000);
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(5000);
      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      }
      await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'Owners' }).first().click();
      await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').nth(1).click({ timeout: 5000 });
      await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid > .btn').nth(1).click({ timeout: 5000 });
      await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click();

      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/drive`);
      await pageOne.waitForTimeout(10000);
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click();

      // accept ownership invitation

      if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).count() > 1) {
        await pageOne.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).first().click();
      } else {
        await pageOne.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).click();
      }

      const pagePromise = pageOne.waitForEvent('popup');
      await pageOne.frameLocator('#sbox-iframe').getByText('Open the document in a new tab').click();
      const pageTwo = await pagePromise;
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
      await pageTwo.bringToFront();
      await pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).waitFor();
      await expect(pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible();
      await page.bringToFront();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();
      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
      }
      await page.frameLocator('#sbox-iframe').getByText('tetest-user3', { exact: true }).waitFor();
      await expect(page.frameLocator('#sbox-iframe').getByText('tetest-user3', { exact: true })).toBeVisible();

      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      }

      await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'Owners' }).first().click();
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user.large').filter({ hasText: 'test-user3' }).locator('.fa.fa-times').click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();

      await pageTwo.reload();
      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      }
      await expect(pageTwo.frameLocator('#sbox-iframe').locator('#cp-app-pad-editor').getByText('test-user3')).toBeHidden({ timeout: 5000 });

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - edit document owners`, status: 'passed', reason: `Can edit ${name} document owners` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - edit document owners`, status: 'failed', reason: `Can't edit ${name} document owners` } })}`);
    }
  });

  test(`${name} - add to team drive`, async ({ page }) => {
    test.skip(browserName === 'edge', 'microsoft edge incompatibility');

    try {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();
      await page.waitForTimeout(10000);

      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
      }

      await page.frameLocator('#sbox-secure-iframe').getByText('test team').click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

      await page.waitForTimeout(5000);
      await page.goto(`${url}/teams/`);
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();

      if (await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).count() > 1) {
        await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).first().click({ button: 'right' });
      } else {
        await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).click({ button: 'right' });
      }

      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).click();
      await page.waitForTimeout(5000);

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ` ${name} - add to team drive`, status: 'passed', reason: 'Can create document and add to team drive' } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ` ${name} - add to team drive`, status: 'failed', reason: 'Can\'t acreate document and add to team drive' } })}`);
    }
  });

  test(`${name} - move to trash and empty`, async ({ page }) => {
    try {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 });

      await page.waitForTimeout(3000);
      if (name === 'sheet') {
        await page.waitForTimeout(5000);
      }

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
      await page.waitForTimeout(2000);
      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
      }

      if (local) {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Move to trash', exact: true }).click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Move to trash' }).click();
      }

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
      if (name === 'diagram') {
        await page.waitForTimeout(8000);
      } else {
        await page.waitForTimeout(3000);
      }

      await expect(page.frameLocator('#sbox-iframe').getByText(/^That document has been moved to the trash/, { exact: true })).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(2000);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
      await page.waitForTimeout(3000);

      await page.goto(`${url}/drive`);
      await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-iframe').getByText('Trash', { exact: true }).click();
      await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Empty the trash' }).click();
      if (isMobile) {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Empty the trash' }).click();
      }
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove' }).click();

      await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(title)).toBeHidden();

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - move to trash`, status: 'passed', reason: `Can create ${name} and move to trash` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - move to trash`, status: 'failed', reason: `Can't create ${name} and move to trash` } })}`);
    }
  });

  if (name !== 'form') {
    test(`${name} - protect with and edit password`, async ({ page, browser }) => {
      try {
        await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Add a password' }).locator('span').first().waitFor();
        await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Add a password' }).locator('span').first().click();
        await page.frameLocator('#sbox-iframe').locator('#cp-creation-password-val').fill('password');
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

        await page.waitForTimeout(5000);
        await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });

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
        await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({ timeout: 3000 });
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
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });

        await page.bringToFront();
        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
        }

        await page.frameLocator('#sbox-secure-iframe').locator('#cp-app-prop-change-password').fill('newpassword');
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Submit' }).click({ timeout: 3000 });
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click({ timeout: 3000 });
        if (name === 'sheet') {
          await page.waitForTimeout(30000);
        } else {
          await page.waitForTimeout(5000);
        }

        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click({ timeout: 30000 });

        await page.waitForTimeout(5000);
        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        }
        await page.frameLocator('#sbox-secure-iframe').getByLabel('Link').click();

        await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({ timeout: 3000 });
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

        const clipboardText1 = await page.evaluate('navigator.clipboard.readText()');

        await page1.bringToFront();
        await page1.goto(`${clipboardText1}`);

        await page1.frameLocator('#sbox-iframe').getByText(/^This document is protected with a new password/).waitFor();
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^This document is protected with a new password/)).toBeVisible();
        await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click({ timeout: 5000 });
        await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('newpassword');
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `protect ${name} document with and edit password`, status: 'passed', reason: `Can protect ${name} document with and edit password` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `protect ${name} document with and edit password`, status: 'failed', reason: `Can't protect ${name} document with and edit password` } })}`);
      }
    });

    test(`${name} - share with contact (to view)`, async ({ page, browser }) => {
      try {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();

        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        }
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^View$/ }).locator('span').first().click();
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
        await expect(pageTwo.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible({ timeout: 5000 });

        /// /

        await page.bringToFront();
        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
        }
        await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer')).toBeVisible({ timeout: 5000 });

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - share with contact (to view)`, status: 'passed', reason: `Can share ${name} with contact (to view)` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - share with contact (to view)`, status: 'failed', reason: `Can't share ${name} with contact (to view)` } })}`);
      }
    });

    test(`${name} - share with contact - edit #1264`, async ({ page, browser }) => {
      try {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();
        await page.waitForTimeout(3000);

        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        }
        await page.waitForTimeout(3000);
        await page.frameLocator('#sbox-secure-iframe').getByText('Edit').click();
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        pageOne = await context.newPage();
        await pageOne.goto(`${url}/drive`);
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').waitFor();
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click();
        const page1Promise = pageOne.waitForEvent('popup');
        if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).count() > 1) {
          await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
        } else {
          await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click();
        }
        const page1 = await page1Promise;

        await page1.waitForTimeout(10000);
        await page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).waitFor();
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });
        await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden();

        await page.waitForTimeout(3000);
        await page.bringToFront();
        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
        }
        if (name === 'pad') {
          await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-pad-editor').getByText('test-user3')).toBeVisible();
        } else if (name === 'sheet') {
          await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-oo-container').getByText('test-user3')).toBeVisible();
        } else if (name === 'diagram') {
          await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-diagram-editor').getByText('test-user3')).toBeVisible();
        } else if (name === 'code') {
          await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-editor').getByText('test-user3')).toBeVisible();
        } else if (name === 'slide') {
          await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-editor').getByText('test-user3')).toBeVisible();
        } else if (name === 'whiteboard') {
          await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-whiteboard-canvas-area').getByText('test-user3')).toBeVisible();
        } else if (name === 'kanban') {
          await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-kanban-editor').getByText('test-user3')).toBeVisible();
        }

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `share ${name} with contact (to edit)`, status: 'passed', reason: `Can share ${name} with contact (to edit)` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `share ${name} with contact (to edit)`, status: 'failed', reason: `Can't share ${name} with contact (to edit)` } })}`);
      }
    });

    test(`${name} - share with contact - view and delete`, async ({ page, browser }) => {
      try {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();

        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();

        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        }
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^View$/ }).locator('span').first().click();
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: 'View once and self-destruct' }).locator('span').first().click();
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        pageOne = await context.newPage();
        await pageOne.goto(`${url}/drive`);
        await pageOne.waitForTimeout(10000);
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click();

        const page1Promise = pageOne.waitForEvent('popup');
        if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).count() > 1) {
          await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
        } else {
          await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click();
        }
        const page1 = await page1Promise;

        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'view and delete' }).click();
        await page1.waitForTimeout(20000);
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });
        await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible();
        await page1.reload();
        await page1.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner').waitFor();
        await expect(page1.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner')).toBeVisible();

        /// /
        await page.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner').waitFor();
        await expect(page.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner')).toBeVisible();

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ` ${name} - share with contact - view once and delete`, status: 'passed', reason: `Can share ${name} with contact (to view once and delete)` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ` ${name} - share with contact - view once and delete`, status: 'failed', reason: `Can't share ${name} with contact (to view once and delete)` } })}`);
      }
    });

    test(`${name} - share (link) - view and delete`, async ({ page, browser }) => {
      try {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();

        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();

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
        await page.frameLocator('#sbox-secure-iframe').getByText('View once and self-destruct').click({ timeout: 3000 });
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Create link' }).click();
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

        const clipboardText = await page.evaluate('navigator.clipboard.readText()');

        ///
        const contextOne = await browser.newContext();
        const pageOne = await contextOne.newPage();
        await pageOne.goto(`${clipboardText}`);
        await pageOne.waitForTimeout(60000);

        await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'view and delete' }).click();
        await pageOne.waitForTimeout(20000);
        await expect(pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });

        await pageOne.reload();
        await pageOne.waitForTimeout(20000);
        await pageOne.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner').waitFor();
        await expect(pageOne.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner')).toBeVisible();
        // await pageOne.close()

        /// /

        if (!isMobile) {
          await expect(page.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner')).toBeVisible();
        }

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ` ${name} - share link - view once and delete`, status: 'passed', reason: `Can share link to ${name} (to view once and delete)` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ` ${name} - share link - view once and delete`, status: 'failed', reason: `Can't share link to ${name} (to view once and delete)` } })}`);
      }
    });

    test(`${name} - enable and add to access list`, async ({ page, browser }) => {
      try {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).waitFor();

        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

        // enable access list and add test-user3 to it
        await page.waitForTimeout(5000);
        await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });
        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
        }
        await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'List' }).first().click();
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: 'Enable access list' }).locator('span').first().click();
        await page.waitForTimeout(5000);
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').first().click();
        await page.waitForTimeout(3000);
        await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid.cp-overlay-container').locator('.btn.btn-primary.cp-access-add').click();
        await page.waitForTimeout(3000);
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();

        // share link and attempt to access document anonymously
        await page.waitForTimeout(3000);
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
        await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({ timeout: 3000 });
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
        const clipboardText = await page.evaluate('navigator.clipboard.readText()');

        // const context = await browser.newContext();
        pageOne = await browser.newPage();
        await pageOne.goto(`${clipboardText}`);
        await pageOne.waitForTimeout(30000);
        await pageOne.bringToFront();
        await pageOne.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/).waitFor();
        await expect(pageOne.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/)).toBeVisible();

        // access document as test-user3
        await pageOne.goto(`${url}/login`);
        await pageOne.getByPlaceholder('Username').fill('test-user3');
        await pageOne.waitForTimeout(2000);
        await pageOne.getByPlaceholder('Password', { exact: true }).fill(testUser3Password);
        const login = pageOne.locator('.login');
        await login.waitFor({ timeout: 18000 });
        await expect(login).toBeVisible({ timeout: 1800 });
        if (await login.isVisible()) {
          await login.click();
        }
        await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 });
        await pageOne.goto(`${clipboardText}`);
        await page.waitForTimeout(10000);
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).waitFor();

        await expect(pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible();

        // remove test-user3 from access list
        await page.waitForTimeout(30000);
        if (isMobile) {
          await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
        } else {
          await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
        }
        await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'List' }).first().click();
        await page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user > .fa').first().click();
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();

        await pageOne.reload();
        await pageOne.waitForTimeout(5000);
        await pageOne.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/).waitFor();
        await expect(pageOne.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/)).toBeVisible();

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - enable and add to access list`, status: 'passed', reason: `Can enable and add to access list in ${name} document` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - enable and add to access list`, status: 'failed', reason: `Can't enable and add to access list in ${name} document` } })}`);
      }
    });
  }
});
