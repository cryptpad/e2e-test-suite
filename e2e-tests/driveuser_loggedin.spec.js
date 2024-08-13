const { test, url, mainAccountPassword, titleDate } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');

const fs = require('fs');
const unzipper = require('unzipper');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let isMobile;
let cleanUp;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);

  isMobile = testInfo.project.use.isMobile;

  if (isMobile) {
    let userActions = new UserActions(page);
    await userActions.login('test-user', mainAccountPassword);
  }

  await page.goto(`${url}/drive`);
});

const userMenuItems = ['profile', 'contacts', 'calendar', 'support', 'teams', 'log out'];

userMenuItems.forEach(function (item) {
  test(`drive -  user menu - ${item}`, async ({ page }) => {
    try {
      await fileActions.drivemenu.waitFor();
      await fileActions.drivemenu.click();
      if (item === 'log out') {
        await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click();
        await expect(page).toHaveURL(`${url}`, { timeout: 100000 });
        await page.waitForTimeout(10000);
        await fileActions.loginLink.toBeVisible();
      } else if (item === 'support' && url !== 'https://cryptpad.fr') {
        return;
      } else {
        const pagePromise = page.waitForEvent('popup');
        await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: `${item}` }).click();
        const page1 = await pagePromise;
        await expect(page1).toHaveURL(`${url}/${item}/`, { timeout: 100000 });
      }

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `drive - user menu - ${item}`, status: 'passed', reason: `Can access ${item} from Drive menu` } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `drive -  user menu - ${item}`, status: 'failed', reason: `Can't access ${item} from Drive menu` } })}`);
    }
  });
});

test('drive -  upgrade account', async ({ page }) => {
  test.skip(local, 'no option to upgrade on local dev instance');

  try {
    const pagePromise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByText('Upgrade account').click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/accounts/#`, { timeout: 100000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - upgrade account', status: 'passed', reason: 'Can upgrade account from Drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - upgrade account', status: 'failed', reason: 'Can\'t upgrade account from Drive' } })}`);
  }
});

test('drive -  upload file', async ({ page }) => {
  try {
    const fileChooserPromise = page.waitForEvent('filechooser');

    await fileActions.newFile.locator('span').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Upload files' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/myfile.doc');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    if (await page.frameLocator('#sbox-iframe').getByText('You already have an upload in progress. Cancel it and upload your new file?').count() === 1) {
      console.log('upload in progress');
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    }

    await page.frameLocator('#sbox-iframe').getByText('Your file (myfile.doc) has been successfully uploaded and added to your').waitFor();

    await fileActions.driveContentFolder.getByText('myfile.doc').click({ button: 'right' });
    await page.waitForTimeout(10000);
    if (await fileActions.moveToTrash.isVisible()) {
      await page.waitForTimeout(10000);
      await fileActions.moveToTrash.click();
    } else {
      await page.waitForTimeout(10000);
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Remove' }).last().click();
    }
    await expect(fileActions.driveContentFolder.getByText('myfile.doc')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - upload file', status: 'passed', reason: 'Can upload a file in Drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - upload file', status: 'failed', reason: 'Can\'t upload a file in Drive' } })}`);
  }
});

test('drive -  recent files', async ({ page }) => {
  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanUserDrive('Rich text - ');

    const page1Promise = page.waitForEvent('popup');
    await fileActions.newFile.locator('span').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Rich text$/ }).locator('span').first().click();

    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create', exact: true }).click();

    const title = `Rich text - ${titleDate}`;
    await page1.waitForTimeout(10000);
    await page1.close();
    await page.reload();
    await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Recent' }).first().click();
    await expect(fileActions.driveContentFolder.getByText(title)).toBeVisible();
    await fileActions.driveContentFolder.getByText(`${title}`).click({ button: 'right' });
    await page.waitForTimeout(10000);
    await fileActions.destroy.click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - recent files', status: 'passed', reason: 'Can access recent files in Drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - recent files', status: 'failed', reason: 'Can\'t access recent files in Drive' } })}`);
  }
});

test('drive -  notifications panel', async ({ page }) => {
  try {
    await fileActions.notifications.click();
    await page.frameLocator('#sbox-iframe').getByText('Open notifications panel').waitFor();
    const pagePromise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByText('Open notifications panel').click();
    const page1 = await pagePromise;
    await page1.waitForTimeout(5000);
    await expect(page1).toHaveURL(`${url}/notifications/#all`, { timeout: 100000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - notifications panel', status: 'passed', reason: 'Can navigate to Drive and open notifications panel' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - notifications panel', status: 'failed', reason: 'Can\'t navigate to Drive and open notifications panel' } })}`);
  }
});

test('drive - filter', async ({ page }) => {
  try {
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByText('test sheet').waitFor();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByText('test whiteboard').waitFor();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Filter' }).click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Sheet' }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').getByText('test sheet')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test whiteboard')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - filter', status: 'passed', reason: 'Can filter files by file type in Drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - filter', status: 'failed', reason: 'Can\'t filter files by file type in Drive' } })}`);
  }
});

test('drive - create link', async ({ page }) => {
  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanUserDrive('Cryptpad Docs');

    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New Link' }).click({ timeout: 2000 });
    await page.frameLocator('#sbox-iframe').getByPlaceholder('My link').fill('Cryptpad Docs');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('https://example.com').fill('https://docs.cryptpad.org');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add' }).click();
    await page.frameLocator('#sbox-iframe').getByText('Cryptpad Docs').waitFor();
    await page.frameLocator('#sbox-iframe').getByText('Cryptpad Docs').click({ button: 'right' });
    await fileActions.moveToTrash.click();
    await expect(page.frameLocator('#sbox-iframe').getByText('My link')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - link', status: 'passed', reason: 'Can create link in Drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - link', status: 'failed', reason: 'Can\'t create link in Drive' } })}`);
  }
});

test('drive - create folder', async ({ page }) => {
  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanUserDrive('My test folder');

    await fileActions.newFile.click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Folder$/ }).click({ timeout: 2000 });
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New folder').fill('My test folder');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10000);
    await expect(fileActions.driveContentFolder.getByText('My test folder')).toBeVisible();
    await fileActions.driveContentFolder.getByText('My test folder').click({ button: 'right', timeout: 3000 });
    await fileActions.moveToTrash.click();
    await page.waitForTimeout(3000);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - folder', status: 'passed', reason: 'Can create folder in Drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - folder', status: 'failed', reason: 'Can\'t create folder in Drive' } })}`);
  }
});

// //this tests a functionality which is unstable and can interfere with other tests - leave commented out/don't include in test runs
// test('drive - create shared folder' , async ({ }) => {

//   try {

//     await fileActions.newFile.waitFor()
//     await fileActions.newFile.click();
//     await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Shared folder$/ }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Shared folder$/ }).click({force: true});
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('New folder').fill('My shared folder');
//     await page.frameLocator('#sbox-iframe').getByLabel('Protect this folder with a password (optional)').fill('folderpassword');
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').waitFor()
//     await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder')).toBeVisible(5000)
//     await page.waitForTimeout(5000);

//     await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').click({button: 'right'});
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByText('Share', { exact: true }).click();
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByText('test-user3', { exact: true }).click();
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').click({button: 'right'})
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByText('Destroy').waitFor()
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByText('Destroy').click()
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).waitFor()
//     await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await page.waitForTimeout(5000);

//     // await page.reload()
//     // await expect(page.frameLocator('#sbox-iframe').getByText('Your shared folder My shared folder is no longer available.')).toBeVisible()
//     // await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
//     // await page.waitForTimeout(5000);

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - shared folder', status: 'passed',reason: `Can create shared folder in Drive`}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - shared folder', status: 'failed',reason: `Can\'t create shared folder in Drive`}})}`);

//   }
// });

test('drive - toggle sidebar', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Files' }).click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Files' }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').getByText('Search...')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('Recent')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Drive' }).nth(3)).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Templates' }).first()).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Trash' }).first()).toBeVisible();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Files' }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').getByText('Search...')).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').getByText('Recent')).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Drive' }).nth(3)).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Templates' }).first()).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Trash' }).first()).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - toggle sidebar', status: 'passed', reason: 'Can toggle sidebar in Drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - toggle sidebar', status: 'failed', reason: 'Can\'t toggle sidebar in Drive' } })}`);
  }
});

test('drive - search', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByText('test sheet').waitFor();
    await page.frameLocator('#sbox-iframe').getByText('test whiteboard').waitFor();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Search...' }).first().click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Search').fill('test sheet');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Search').press('Enter');
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByText('test sheet').first().waitFor();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').getByText('test whiteboard')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - search', status: 'passed', reason: 'Can search files in Drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - search', status: 'failed', reason: 'Can\'t search files in Drive' } })}`);
  }
});

test('can download drive contents', async ({ page }) => {
  try {
    const menu = fileActions.drivemenu
    await menu.click();
    await page.waitForTimeout(6000);
    await expect(fileActions.settings).toBeVisible();

    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-leftside').getByText('CryptDrive').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Download my CryptDrive' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox').fill('/tmp/mydrivecontents.zip');
    const download1Promise = page1.waitForEvent('download');
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download1 = await download1Promise;

    await download1.saveAs('/tmp/mydrivecontents.zip');

    await expect(page1.frameLocator('#sbox-iframe').getByText('Your download is ready!')).toBeVisible();

    const expectedFiles = ['Drive/', 'Drive/test code.md', 'Drive/test form.json', 'Drive/test kanban.json', 'Drive/test pad.html', 'Drive/test markdown.md', 'Drive/test sheet.xlsx', 'Drive/test whiteboard.png', 'Drive/test diagram.drawio'];
    const actualFiles = [];

    async function unzipDownload () {
      return new Promise((resolve) => {
        fs.createReadStream('/tmp/mydrivecontents.zip')
          .pipe(unzipper.Parse())
          .on('entry', function (entry) {
            const fileName = entry.path;
            actualFiles.push(fileName);
          })
          .on('finish', resolve);
      });
    }

    async function compareFiles () {
      unzipDownload()
      const checker = (arr, target) => target.every(v => arr.includes(v));
      const check = checker(actualFiles, expectedFiles);
      if (check) {
        return true;
      } else {
        return false;
      }
    }

    if (compareFiles()) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'can download drive contents', status: 'passed', reason: 'Can download drive contents' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'can download drive contents ', status: 'failed', reason: 'Can\'t download drive contents' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'can download drive contents', status: 'failed', reason: 'Can\'t download drive contents' } })}`);
  }
});
