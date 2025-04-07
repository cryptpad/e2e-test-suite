const { test, url, titleDate, titleDateComma } = require('../fixture.js');
const { expect } = require('@playwright/test');
require('dotenv').config();
const { FileActions } = require('./fileactions.js');
const { FilePage, StoreModal, docTypes } = require('./genericfile_po');


const local = !!process.env.PW_URL.includes('localhost');
let mobile;
let fileActions;
let isBrowserstack;
let filePage

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  mobile = isMobile;
  isBrowserstack = !!testInfo.project.name.match(/browserstack/);
  test.setTimeout(90000);
  mobile = isMobile;
  await page.goto(`${url}/drive`);
  fileActions = new FileActions(page);
    filePage = new FilePage(page);

});

const userMenuItems = ['settings', 'documentation', 'about', 'home page', 'pricing', 'donate', 'log in', 'sign up'];

userMenuItems.forEach(function (item) {
  test(`drive - anon - user menu - ${item}`, async ({ page, context }) => {
    if (item === 'pricing') {
      test.skip(local, 'pricing not available on dev instance');
    }
    try {
      await fileActions.drivemenu.waitFor();
      await fileActions.drivemenu.click();
      if (item === 'about') {
        await fileActions.driveMenuItem(item, true).click()
        if (url === 'https://cryptpad.fr') {
          await expect(fileActions.mainFrame.getByText('CryptPad.fr is the official instance of the open-source CryptPad project. It is ')).toBeVisible();
        } else {
          await expect(fileActions.mainFrame.getByText('This is an independent community instance of CryptPad')).toBeVisible();
        }
      } else if (item === 'log in') {
        await fileActions.driveMenuItem(item, true).click()
        await expect(page).toHaveURL(new RegExp(`^${url}/login/`), { timeout: 100000 });
      } else if (item === 'sign up') {
        await fileActions.driveMenuItem(item, true).click()
        await expect(page).toHaveURL(new RegExp(`^${url}/register/`), { timeout: 100000 });
      } else {
        const pagePromise = page.waitForEvent('popup');
        if (item === 'documentation') {
          await fileActions.driveMenuItem(item, true).click()
        } else {
          await fileActions.driveMenuItem(item).click()
        }
        const page1 = await pagePromise;
        if (item === 'home page') {
          await expect(page1).toHaveURL(`${url}/index.html`, { timeout: 100000 });
        } else if (item === 'pricing') {
          await expect(page1).toHaveURL(`${url}/features.html`, { timeout: 100000 });
        } else if (item === 'donate') {
          page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.accept().catch(() => {});
          });
          await expect(page1).toHaveURL(/#https%3A%2F%2Fopencollective.com%2Fcryptpad%2F$/, { timeout: 100000 });
        } else if (item === 'documentation') {
          await expect(page1).toHaveURL('https://docs.cryptpad.org/en/', { timeout: 100000 });
        } else if (item === 'settings') {
          await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });
        } else {
          await expect(page1).toHaveURL(`${url}/${item}/`, { timeout: 100000 });
        }
      }

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `anon drive > ${item}`, status: 'passed', reason: `Can anonymously navigate to Drive and access ${item}` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `anon drive > ${item}`, status: 'failed', reason: `Can't anonymously navigate to Drive and access ${item}` } })}`);
    }
  });
});

// test('drive - anon - erase all', async ({ page, context }) => {

//   try {

//     //create file
//     await fileActions.driveadd.click();
//     const page1Promise = page.waitForEvent('popup');
//     await fileActions.driveAddMenuItem('Rich text').click();
//     const page1 = await page1Promise;

//     //check that file is visible in drive
//     await page1.waitForTimeout(10000)
//     const fileActions1 = new FileActions(page1);

//     await fileActions1.fileTitle('Rich text').waitFor()
//     await expect(fileActions1.fileTitle('Rich text')).toBeVisible()
//     await page1.close()
//     await page.reload()
//     await fileActions.driveFileTitle('Rich text').waitFor()
//     await expect(fileActions.driveFileTitle('Rich text')).toBeVisible()

//     //erase
//     await fileActions.eraseDrive.click();
//     await fileActions.okButton.waitFor()
//     await fileActions.okButton.click();

//     //check file is erased
//     await expect(fileActions.driveFileTitle('Rich text')).toHaveCount(0)

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - erase', status: 'passed',reason: 'Can navigate to Drive and erase all'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - erase', status: 'failed',reason: 'Can\'t navigate to Drive and erase all'}})}`);
//   }

// });

test('drive - anon - list/grid view', async ({ page, context }) => {
  try {
    await fileActions.driveadd.waitFor();
    await fileActions.driveadd.click();
    const page1Promise = page.waitForEvent('popup');
    await fileActions.driveAddMenuItem('Rich text').click();
    const page1 = await page1Promise;

    await page.reload();
    await fileActions.driveFileTitle('Rich text').waitFor()
    await expect(fileActions.driveFileTitle('Rich text')).toBeVisible();

    await page.bringToFront();
    await fileActions.changeDriveView.click();

    if (mobile) {
      await expect(fileActions.driveContentList).toBeVisible();
    } else {
      console.log(await fileActions.driveListViewSpan('Type'))
      await expect(await fileActions.driveListViewSpan('Type')).toBeVisible();
      await expect(await fileActions.driveListViewSpan('Last access')).toBeVisible();
      await expect(await fileActions.driveListViewSpan('Creation')).toBeVisible();
    }

    await fileActions.changeDriveView.click();

    if (mobile) {
      await expect(fileActions.driveContentGrid).toBeVisible();
    } else {
      await expect(fileActions.driveListViewSpan('Type')).toBeHidden();
      await expect(fileActions.driveListViewSpan('Last access')).toBeHidden();
      await expect(fileActions.driveListViewSpan('Creation')).toBeHidden();
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon drive > list/grid view', status: 'passed', reason: 'Can anonymously navigate to Drive and change the view to list/grid' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon drive > list/grid view', status: 'failed', reason: 'Can\'t anonymously navigate to Drive and change the view to list/grid' } })}`);
  }
});

test('drive - anon - history', async ({ page, context }) => {
  try {
    await fileActions.driveadd.waitFor();
    await fileActions.driveadd.click();
    const page1Promise = page.waitForEvent('popup');
    await fileActions.driveAddMenuItem('Rich text' ).click();
    const page1 = await page1Promise;
    const fileActions1 = new FileActions(page1);
    await fileActions1.fileSaved.waitFor()

    await page.reload();
    await fileActions.driveFileTitle('Rich text').waitFor()
    await expect(fileActions.driveFileTitle('Rich text')).toBeVisible();

    await fileActions.driveHistory.click();
    await fileActions.historyPrevLast.click({
      clickCount: 3
    });

    await expect(fileActions.driveFileTitle('Rich text')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon drive > history', status: 'passed', reason: 'Can anonymously navigate to Drive and view history' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon drive > history', status: 'failed', reason: 'Can\'t anonymously navigate to Drive and view history' } })}`);
  }
});

test('drive - anon - notifications', async ({ page, context }) => {
  try {
    await fileActions.notifications.waitFor();
    await fileActions.notifications.click();

    await expect(fileActions.noNotifications).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon drive - notifications', status: 'passed', reason: 'Can check notifications' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon drive - notifications', status: 'failed', reason: 'Can\'t check notifications' } })}`);
  }
});

test('drive - anon - sign up from drive page', async ({ page, context }) => {
  try {
    await fileActions.notLoggedIn.waitFor();
    await fileActions.registerLink.waitFor();
    await fileActions.registerLink.click();
    await expect(page).toHaveURL(`${url}/register/`, { timeout: 100000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive > sign up', status: 'passed', reason: 'Can anonymously navigate to Drive and find link to sign up' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive > sign up', status: 'failed', reason: 'Can\'t anonymously navigate to Drive and find link to sign up' } })}`);
  }
});

test('drive - anon - log in from drive page', async ({ page, context }) => {
  try {
    await fileActions.notLoggedIn.waitFor();
    await fileActions.loginLink.waitFor();
    await fileActions.loginLink.click();
    await expect(page).toHaveURL(`${url}/login/`, { timeout: 100000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive > log in', status: 'passed', reason: 'Can anonymously navigate to Drive and find link to log in' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive > log in', status: 'failed', reason: 'Can\'t anonymously navigate to Drive and find link to log in' } })}`);
  }
});
