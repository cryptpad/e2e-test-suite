const { test, url, mainAccountPassword, testUser3Password, nextWeekSlashFormat, titleDate, titleDateComma } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

const { expect } = require('@playwright/test');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let page1;
let mobile;
let browserName;
let cleanUp;
let title;
let titleComma
let titleName;
let contextOne;
let fileActions;
let isBrowserstack;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(210000);

  mobile = isMobile;
  browserName = testInfo.project.name.split(/@/)[0];
  isBrowserstack = !!testInfo.project.name.match(/browserstack/);

  // if (mobile) {
  //   const userActions = new UserActions(page);
  //   await userActions.login('test-user', mainAccountPassword);
  // }
  fileActions = new FileActions(page);
  const name = testInfo.title.split(' ')[0];
  if (name === 'pad') {
    titleName = 'Rich text -';
    title = `${titleName} ${titleDate}`;
    titleComma = `${titleName} ${titleDateComma}`
  } else if (name === 'slide') {
    titleName = 'Markdown slides -';
    title = `${titleName} ${titleDate}`;
    titleComma = `${titleName} ${titleDateComma}`
  } else {
    titleName = name.charAt(0).toUpperCase() + name.slice(1) + ' -';
    title = `${titleName}` + ' ' + `${titleDate}`;
    titleComma = `${titleName}` + ' ' + `${titleDateComma}`;
  }

  cleanUp = new Cleanup(page);
  // await cleanUp.cleanUserDrive(titleName);
  await cleanUp.cleanFiles(title);
  await cleanUp.cleanFiles(titleComma);
  await page.goto(`${url}/${name}`);

  // await page.waitForTimeout(10000);
});

const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'];
// const docNames = ['pad'];

docNames.forEach(function (name) {
  test(`${name} - create without owner`, async ({ page }) => {
    try {
      
      await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Owned document' }).locator('span').first().waitFor();
      await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Owned document' }).locator('span').first().click();
      await fileActions.createFile.click();
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 });
      await fileActions.access(mobile);
      await expect(page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user.cp-share-column.cp-access').getByLabel('Owners')).toBeHidden();

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `drive - ${name} - create without owner`, status: 'passed', reason: `Can create ${name} without owner` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `drive - ${name} - create without owner`, status: 'failed', reason: `Can't create ${name} without owner` } })}`);
    }
  });

  // test(`${name} - create with destruction date`, async ({ page, context }) => {
  //   try {
  //     console.log(nextWeekSlashFormat);

  //     await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Destruction date' }).locator('span').first().click();
  //     await page.frameLocator('#sbox-iframe').locator('#cp-creation-expire-val').click();
  //     await page.frameLocator('#sbox-iframe').locator('#cp-creation-expire-val').fill('7');
  //     await page.frameLocator('#sbox-iframe').locator('#cp-creation-expire-unit').selectOption('day');
  //     await fileActions.createFile.click();
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();

  //     await expect(page.frameLocator('#sbox-secure-iframe').getByText(`Destruction date${nextWeekSlashFormat}`)).toBeVisible();

  //     await fileActions.closeButtonSecure.click();
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
  //     await fileActions.shareLink.click();
  //     await fileActions.shareCopyLink.click();
  //     // await page.waitForTimeout(3000);
  //     const clipboardText = await page.evaluate('navigator.clipboard.readText()');

  //     // mocks future date in new context
  //     const mockedDate = new Date('March 14 2042').getTime();
  //     await context.addInitScript(`{
  //       Date = class extends Date {
  //         constructor(...args) {
  //           if (args.length === 0) {
  //             super(${mockedDate})
  //           } else {
  //             super(...args)
  //           }
  //         }
  //       }

  //       const __DateNowOffset = ${mockedDate} - Date.now()
  //       const __DateNow = Date.now
  //       Date.now = () => __DateNow() + __DateNowOffset
  //     }`);

  //     const page1 = await context.newPage();
  //     await page1.goto(`${clipboardText}`);
  //     await page1.waitForTimeout(15000);

  //     await page1.frameLocator('#sbox-iframe').getByText(/^This document has reached/).waitFor();
  //     await expect(page1.frameLocator('#sbox-iframe').getByText(/^This document has reached/)).toBeVisible();

  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - create with destruction date`, status: 'passed', reason: `Can create ${name} with destruction date` } })}`);
  //   } catch (e) {
  //     console.log(e);
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - create with destruction date`, status: 'failed', reason: `Can't create ${name} with destruction date` } })}`);
  //   }
  // });

  test(`${name} - tag`, async ({ page }) => {
    try {
      await fileActions.createFile.click();
      // await page.waitForTimeout(5000);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
      // if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).isVisible()) {
      //   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
      // } else {
      //   await fileActions.filemenuClick(mobile);
      //   await fileActions.clickTags(local);

      //   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
      //   await fileActions.okButton.click();
      // }

      // await page.waitForTimeout(5000);
      await fileActions.filemenuClick(mobile);
      await fileActions.clickTags(local);
      await page.frameLocator('#sbox-iframe').locator('.token-input.ui-autocomplete-input').click();
      await page.frameLocator('#sbox-iframe').locator('.token-input.ui-autocomplete-input').fill('testtag');
      // await page.waitForTimeout(3000);
      await fileActions.addButton.click();
      await fileActions.okButton.click();
      if (browserName === 'playwright-firefox' || browserName === 'edge' ) {
        await page.waitForTimeout(1000);
      }
      

      await page.goto(`${url}/drive/#`);
      // await page.waitForTimeout(3000);
      await fileActions.driveSideMenu.getByText('Tags').click();
      await page.frameLocator('#sbox-iframe').getByRole('link', { name: '#testtag' }).click();
      if (mobile) {
        await page.frameLocator('#sbox-iframe').getByRole('link', { name: '#testtag' }).click();
      }

      await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${title}`).or(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${titleComma}`)).waitFor();
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${title}`).or(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${titleComma}`))).toBeVisible();

      await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${title}`).or(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${titleComma}`)).click({ button: 'right' });
      await fileActions.destroy.click();
      await fileActions.okButton.click();
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${title}`).or(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(`${titleComma}`))).toHaveCount(0);

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - tag`, status: 'passed', reason: `Can tag ${name} document` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - tag`, status: 'failed', reason: `Can't tag ${name} document` } })}`);
    }
  });

  test(`${name} - edit document owners #1264`, async ({ page, browser }) => {
    test.fixme(name === 'whiteboard' | name === 'diagram', 'diagram/whiteboard participant status bug');
    try {
      await fileActions.createFile.click();

      // add test-user3 as owner
      // await page.waitForTimeout(5000);
      await fileActions.filemenu.waitFor();

      await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).first().or(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`).first())).toBeVisible();
      // await page.waitForTimeout(5000);
      await fileActions.access(mobile);
      await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'Owners' }).first().click();
      // await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').nth(1).waitFor()
      await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').nth(1).click({ timeout: 5000 });
      // await page.waitForTimeout(3000);
       await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid > .btn').nth(1).waitFor()
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid > .btn').nth(1).click({ timeout: 5000 });
      // await page.waitForTimeout(3000);
      await fileActions.okButtonSecure.waitFor()
      await fileActions.okButtonSecure.click();

      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      page1 = await context.newPage();
      await page1.goto(`${url}/drive`);
      await page1.waitForTimeout(10000);
      const fileActions1 = new FileActions(page1);
      await fileActions1.notifications.click();

      // accept ownership invitation
      // console.log(await page1.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).count())
      // console.log(await page1.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${titleComma}`).count())

      // if (await page1.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${titleComma}`)).count() > 1) {
        await page1.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${titleComma}`)).first().click();
      // } else {
      //   await page1.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${titleComma}`)).click();
      // }

      const pagePromise = page1.waitForEvent('popup');
      await page1.frameLocator('#sbox-iframe').getByText('Open the document in a new tab').click();
      const page2 = await pagePromise;
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
      await page2.bringToFront();
      const fileActions2 = new FileActions(page2);
      await fileActions2.filemenu.waitFor();

      await expect(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible();
      await page.bringToFront();
      await fileActions.closeButtonSecure.click();
      if (mobile) {
        await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
      }
      await page.frameLocator('#sbox-iframe').getByText('tetest-user3', { exact: true }).waitFor();
      await expect(page.frameLocator('#sbox-iframe').getByText('tetest-user3', { exact: true })).toBeVisible();
      await fileActions.access(mobile);

      await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'Owners' }).first().click();
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user.large').filter({ hasText: 'test-user3' }).locator('.fa.fa-times').click();
      await fileActions.okButtonSecure.click();
      await fileActions.closeButtonSecure.click();

      await page2.reload();
      await fileActions.access(mobile);
      await expect(page2.frameLocator('#sbox-iframe').locator('#cp-app-pad-editor').getByText('test-user3')).toBeHidden({ timeout: 5000 });

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - edit document owners`, status: 'passed', reason: `Can edit ${name} document owners` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - edit document owners`, status: 'failed', reason: `Can't edit ${name} document owners` } })}`);
    }
  });

  test(`${name} - add to team drive`, async ({ page }) => {
    test.skip(browserName === 'edge', 'microsoft edge incompatibility');

    try {
      await fileActions.createFile.waitFor();
      await fileActions.createFile.click();
      // await page.waitForTimeout(10000);

      await fileActions.share(mobile);
      await page.frameLocator('#sbox-secure-iframe').getByText('test team').click();
      await fileActions.shareSecureLink.click();

      await page.waitForTimeout(2000);
      await page.goto(`${url}/teams/`);
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();

      // if (await fileActions.driveContentFolder.getByText(`${title}`).count() > 1) {
      //   await fileActions.driveContentFolder.getByText(`${title}`).first().click({ button: 'right' });
      // } else {
        await fileActions.driveContentFolder.getByText(`${title}`).first().or(fileActions.driveContentFolder.getByText(`${titleComma}`)).first().click({ button: 'right' });
      // }

      await page.frameLocator('#sbox-iframe').getByText('Move to trash').click();
      await page.waitForTimeout(5000);

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ` ${name} - add to team drive`, status: 'passed', reason: 'Can create document and add to team drive' } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ` ${name} - add to team drive`, status: 'failed', reason: 'Can\'t acreate document and add to team drive' } })}`);
    }
  });

  test(`${name} - move to trash and empty`, async ({ page }) => {
    try {
      await fileActions.createFile.waitFor();
      await fileActions.createFile.click();
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 });

      // await page.waitForTimeout(3000);
      if (name === 'sheet') {
        // await page.waitForTimeout(5000);
      }

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
      // await page.waitForTimeout(2000);

      await fileActions.filemenuClick(mobile);

      await fileActions.moveToTrash(local);

      await fileActions.okButton.click();
      if (name === 'diagram') {
        // await page.waitForTimeout(8000);
      } else {
        // await page.waitForTimeout(3000);
      }

      await expect(page.frameLocator('#sbox-iframe').getByText(/^That document has been moved to the trash/, { exact: true })).toBeVisible({ timeout: 10000 });
      // await page.waitForTimeout(2000);
      await fileActions.okButton.click();
      // await page.waitForTimeout(3000);

      await page.goto(`${url}/drive`);
      // await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-iframe').getByText('Trash', { exact: true }).click();
      // await page.waitForTimeout(3000);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Empty the trash' }).click();
      if (mobile) {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Empty the trash' }).click();
      }
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove' }).click();

      await expect(fileActions.driveContentFolder.getByText(title)).toBeHidden();

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
        await fileActions.createFile.click();

        // await page.waitForTimeout(5000);
        await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`)).waitFor();

        await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible();

        await fileActions.share(mobile);

        await fileActions.clickLinkTab(mobile);
        await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({ timeout: 3000 });
        await fileActions.shareCopyLink.click();
        // await page.waitForTimeout(5000);

        const clipboardText = await page.evaluate('navigator.clipboard.readText()');
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
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({ timeout: 5000 });

        await page.bringToFront();
        await fileActions.access(mobile);

        await page.frameLocator('#sbox-secure-iframe').locator('#cp-app-prop-change-password').fill('newpassword');
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Submit' }).click({ timeout: 3000 });
        await fileActions.okButtonSecure.waitFor();
        await fileActions.okButtonSecure.click();
        // if (name === 'sheet') {
        //   await page.waitForTimeout(30000);
        // } else {
          await page.waitForTimeout(5000);
        // }
        await fileActions.okButtonSecure.waitFor();
        await fileActions.okButtonSecure.click();

        await page.waitForTimeout(3000);
        await fileActions.share(mobile);
        await page.frameLocator('#sbox-secure-iframe').getByLabel('Link').click();

        await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({ timeout: 3000 });
        await fileActions.shareCopyLink.click();

        const clipboardText1 = await page.evaluate('navigator.clipboard.readText()');

        await page1.bringToFront();
        await page1.goto(`${clipboardText1}`);

        await page1.frameLocator('#sbox-iframe').getByText(/^This document is protected with a new password/).waitFor();
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^This document is protected with a new password/)).toBeVisible();
        await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click({ timeout: 5000 });
        await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('newpassword');
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
        // const fileActions1 = new FileActions(page1);
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible({ timeout: 5000 });

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `protect ${name} document with and edit password`, status: 'passed', reason: `Can protect ${name} document with and edit password` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `protect ${name} document with and edit password`, status: 'failed', reason: `Can't protect ${name} document with and edit password` } })}`);
      }
    });

    test(`${name} - share with contact (to view)`, async ({ page, browser }) => {
      try {
        await fileActions.createFile.waitFor();
        await fileActions.createFile.click();

        await fileActions.share(mobile);
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^View$/ }).locator('span').first().click();
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
        await fileActions.shareSecureLink.click();

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        page1 = await context.newPage();
        await page1.goto(`${url}/drive`);
        const fileActions1 = new FileActions(page1);

        await fileActions1.notifications.click();

        const page2Promise = page1.waitForEvent('popup');
        if (await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).count() > 1) {
          await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).first().click();
        } else {
          await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).click();
        }
        const page2 = await page2Promise;
        // await page.waitForTimeout(5000)
        const fileActions2 = new FileActions(page2);
        await page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`)).waitFor()
        await expect(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible();
        await expect(page2.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible({ timeout: 5000 });

        /// /

        await page.bringToFront();
        if (mobile) {
          await page.frameLocator('#sbox-iframe').locator('.fa.fa-users').nth(1).click();
        }
        await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer')).toBeVisible();

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - share with contact (to view)`, status: 'passed', reason: `Can share ${name} with contact (to view)` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - share with contact (to view)`, status: 'failed', reason: `Can't share ${name} with contact (to view)` } })}`);
      }
    });

    test(`${name} - share with contact - edit #1264`, async ({ page, browser }) => {
      test.fixme(name === 'whiteboard' | name === 'diagram', 'diagram/whiteboard participant status bug');
      try {
        await fileActions.createFile.click();
        // await page.waitForTimeout(3000);

        await fileActions.share(mobile);
        // await page.waitForTimeout(3000);
        await page.frameLocator('#sbox-secure-iframe').getByText('Edit').click();
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
        await fileActions.shareSecureLink.click();

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        page1 = await context.newPage();
        await page1.goto(`${url}/drive`);
        const fileActions1 = new FileActions(page1);
        await fileActions1.notifications.waitFor();
        await fileActions1.notifications.click();
        const page1Promise = page1.waitForEvent('popup');
        if (await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).count() > 1) {
          await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).first().click();
        } else {
          await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).click();
        }
        const page1 = await page1Promise;

        await page1.waitForTimeout(10000);
        const fileActions2 = new FileActions(page1);

        await fileActions2.filemenu.waitFor();
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible();
        await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden();

        // await page.waitForTimeout(3000);
        await page.bringToFront();
        if (mobile) {
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
        await fileActions.createFile.waitFor();

        await fileActions.createFile.click();

        await fileActions.share(mobile);
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^View$/ }).locator('span').first().click();
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: 'View once and self-destruct' }).locator('span').first().click();
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
        await fileActions.shareSecureLink.click();

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        page1 = await context.newPage();
        await page1.goto(`${url}/drive`);
        await page1.waitForTimeout(10000);
        const fileActions1 = new FileActions(page1);

        await fileActions1.notifications.click();

        const page2Promise = page1.waitForEvent('popup');
        if (await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).count() > 1) {
          await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).first().click();
        } else {
          await page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).or(page1.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${titleComma}`)).click();
        }
        const page2 = await page2Promise;
        const fileActions2 = new FileActions(page2);

        await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'view and delete' }).click();
        await page2.waitForTimeout(20000);
        await expect(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible();
        await expect(page2.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible();
        await page2.reload();
        await page2.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner').waitFor();
        await expect(page2.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner')).toBeVisible();

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
        await fileActions.createFile.waitFor();

        await fileActions.createFile.click();

        await fileActions.share(mobile);

        await fileActions.clickLinkTab(mobile);
        await page.frameLocator('#sbox-secure-iframe').getByText('View once and self-destruct').click({ timeout: 3000 });
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Create link' }).click();
        await fileActions.shareCopyLink.click();

        const clipboardText = await page.evaluate('navigator.clipboard.readText()');

        ///
        const contextOne = await browser.newContext();
        const page1 = await contextOne.newPage();
        const fileActions1 = new FileActions(page1);
        await page1.goto(`${clipboardText}`);
        await page1.waitForTimeout(60000);

        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'view and delete' }).click();
        await page1.waitForTimeout(20000);
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible();

        await page1.reload();
        await page1.waitForTimeout(20000);
        await page1.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner').waitFor();
        await expect(page1.frameLocator('#sbox-iframe').getByText('This document was destroyed by an owner')).toBeVisible();
        // await page1.close()

        /// /

        if (!mobile) {
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
        await fileActions.createFile.waitFor();

        await fileActions.createFile.click();

        // enable access list and add test-user3 to it
        // await page.waitForTimeout(5000);
        await fileActions.fileSaved.waitFor()
        await fileActions.filemenu.waitFor();

        await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible();
        await fileActions.access(mobile);
        await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'List' }).first().click();
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: 'Enable access list' }).locator('span').first().click();
        // await page.waitForTimeout(5000);
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').first().waitFor()
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').first().click();
        // await page.waitForTimeout(3000);
        await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid.cp-overlay-container').locator('.btn.btn-primary.cp-access-add').waitFor()
        await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid.cp-overlay-container').locator('.btn.btn-primary.cp-access-add').click();
        await page.waitForTimeout(3000);
        await fileActions.closeButtonSecure.waitFor()
        await fileActions.closeButtonSecure.click();

        // share link and attempt to access document anonymously
        // await page.waitForTimeout(3000);
        await fileActions.share(mobile);
        await fileActions.clickLinkTab(mobile);
        await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({ timeout: 3000 });
        await fileActions.shareCopyLink.click();
        const clipboardText = await page.evaluate('navigator.clipboard.readText()');

        // const context = await browser.newContext();
        page1 = await browser.newPage();
        await page1.goto(`${clipboardText}`);
        await page1.waitForTimeout(30000);
        await page1.bringToFront();
        await page1.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/).waitFor();
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/)).toBeVisible();

        // access document as test-user3
        const contextTwo = await browser.newContext({ storageState: 'auth/testuser3.json' });
        const page2 = await contextTwo.newPage();
        await page2.goto(`${clipboardText}`);
        // await page2.waitForTimeout(10000);
        const fileActions1 = new FileActions(page2);
        await fileActions1.filemenu.waitFor();

        await expect(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).or(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${titleComma}`))).toBeVisible();

        // remove test-user3 from access list
        // await page.waitForTimeout(30000);
        await fileActions.access(mobile);
        await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'List' }).first().click();
        await page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user > .fa').first().click();
        await fileActions.closeButtonSecure.click();

        const contextThree = await browser.newContext({ storageState: 'auth/testuser3.json' });
        const pageThree = await contextThree.newPage();
        await pageThree.goto(`${clipboardText}`);
        await pageThree.waitForTimeout(5000);
        await pageThree.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/).waitFor();
        await expect(pageThree.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/)).toBeVisible();

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - enable and add to access list`, status: 'passed', reason: `Can enable and add to access list in ${name} document` } })}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - enable and add to access list`, status: 'failed', reason: `Can't enable and add to access list in ${name} document` } })}`);
      }
    });
  }
});
