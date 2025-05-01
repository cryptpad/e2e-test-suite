const { test, url, mainAccountPassword, titleDate, titleDateComma } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');
const { FilePage, StoreModal, docTypes } = require('./genericfile_po');

const fs = require('fs');
const unzipper = require('unzipper');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let mobile;
let cleanUp;
let fileActions;
let filePage
let userActions;
let isBrowserstack;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  mobile = isMobile;
  isBrowserstack = !!testInfo.project.name.match(/browserstack/);
  test.setTimeout(90000);
  mobile = isMobile;

  fileActions = new FileActions(page);
  userActions = new UserActions(page);
  cleanUp = new Cleanup(page);
  await page.goto(`${url}/drive`);
});

const userMenuItems = ['profile', 'contacts', 'calendar', 'support', 'teams', 'log out'];


userMenuItems.forEach(function (item) {
  test(`drive -  user menu - ${item}`, async ({ page }) => {
    try {
      await fileActions.drivemenu.waitFor();
      await fileActions.drivemenu.click();
      if (item === 'log out') {
        await fileActions.driveMenuItem(item).nth(1).click();
        await expect(page).toHaveURL(`${url}`, { timeout: 100000 });
        await expect(fileActions.loginLink).toBeVisible();
      } else if (item === 'support' && url !== 'https://cryptpad.fr') {
        return;
      } else {
        const pagePromise = page.waitForEvent('popup');
        await fileActions.driveMenuItem(item).click();
        const page1 = await pagePromise;
        await expect(page1).toHaveURL(`${url}/${item}/`, { timeout: 100000 });
      }

      await fileActions.toSuccess(`Can access ${item} from Drive menu`);
    } catch (e) {
      await fileActions.toFailure(e, `Can't access ${item} from Drive menu`);
    }
  });
});

test('drive -  upgrade account', async ({ page }) => {

  var notFlagship = (url === 'https://cryptpad.fr') ? false : true
  test.skip(notFlagship, 'no option to upgrade on local dev instance');

  try {
    await fileActions.mainFrame.getByText('Upgrade account').waitFor()
    const pagePromise = page.waitForEvent('popup');
    await fileActions.mainFrame.getByText('Upgrade account').click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/accounts/#`, { timeout: 100000 });

    await fileActions.toSuccess( 'Can upgrade account from Drive');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t upgrade account from Drive');
  }
});

test('drive -  upload file', async ({ page }) => {
  try {

    await cleanUp.cleanUserDrive('myfile.doc');
    const fileChooserPromise = page.waitForEvent('filechooser');

    await fileActions.newFile.locator('span').first().click();
    await fileActions.driveAddMenuItem('Upload files').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/myfile.doc');
    await fileActions.okButton.waitFor();
    await fileActions.okButton.click();
    if (await fileActions.mainFrame.getByText('You already have an upload in progress. Cancel it and upload your new file?').count() === 1) {
      console.log('upload in progress');
      await fileActions.okButton.click();
    }

    await fileActions.mainFrame.getByText('Your file (myfile.doc) has been successfully uploaded and added to your').waitFor();
    await fileActions.fileUploadClose.click()
    await fileActions.driveContentFolder.getByText('myfile.doc').click({ button: 'right' });
    await fileActions.trash.click();
 
    await expect(fileActions.driveContentFolder.getByText('myfile.doc')).toHaveCount(0);

    await fileActions.toSuccess('Can upload a file in Drive');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t upload a file in Drive');
  }
});

test('drive -  recent files', async ({ page }) => {
  try {
    await cleanUp.cleanUserDrive('Rich text - ');

    const page1Promise = page.waitForEvent('popup');
    await fileActions.newFile.locator('span').first().click();
    await fileActions.newDriveFile(/^Rich text$/).click();
    const page1 = await page1Promise;
    const fileActions1 = new FileActions(page1)
    await fileActions1.createFile.click();

    await fileActions1.fileSaved.waitFor();
    await page1.close();
    await page.reload();
    await fileActions.driveSideBarItem('Recent').first().click();
    await expect(fileActions.driveFileTitle('Rich text')).toBeVisible();
    await fileActions.driveFileTitle('Rich text').click({ button: 'right' });
    if (await fileActions.destroyItem.isVisible()) {
      await fileActions.destroyItem.click();
      await fileActions.okButton.click();
    } else {
      await fileActions.moveToTrash.click();
    }

    await fileActions.toSuccess('Can access recent files in Drive');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t access recent files in Drive');
  }
});

test('drive -  notifications panel', async ({ page }) => {
  try {
    await fileActions.notifications.click();
    await fileActions.notifPanel.waitFor();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.notifPanel.click();
    const page1 = await pagePromise;
    await page1.waitForTimeout(5000);
    await expect(page1).toHaveURL(`${url}/notifications/#all`, { timeout: 100000 });

    await fileActions.toSuccess( 'Can navigate to Drive and open notifications panel' );
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t navigate to Drive and open notifications panel');
  }
});

test('drive - filter', async ({ page }) => {
  try {
    await fileActions.mainFrame.getByText('test sheet').waitFor();
    await fileActions.mainFrame.getByText('test whiteboard').waitFor();
    await fileActions.filterDrive.click();
    await fileActions.dropDownItem( ' Sheet' ).click()
    await expect(fileActions.mainFrame.getByText('test sheet')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('test whiteboard')).toHaveCount(0);

    await fileActions.toSuccess( 'Can filter files by file type in Drive');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t filter files by file type in Drive');
  }
});

test('drive - create link', async ({ page }) => {
  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanUserDrive('Cryptpad Docs');
    await fileActions.newItem.waitFor();
    await fileActions.newItem.click();
    await fileActions.dropDownItem( ' New Link' ).click();
    await fileActions.mainFrame.getByPlaceholder('My link').fill('Cryptpad Docs');
    await fileActions.mainFrame.getByPlaceholder('https://example.com').fill('https://docs.cryptpad.org');

    await fileActions.addButton.click();
    await fileActions.mainFrame.getByText('Cryptpad Docs').waitFor();
    await fileActions.mainFrame.getByText('Cryptpad Docs').click({ button: 'right' });
    await fileActions.mainFrame.getByText('Move to trash').click();
    await expect(fileActions.mainFrame.getByText('My link')).toHaveCount(0);

    await fileActions.toSuccess( 'Can create link in Drive' );
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t create link in Drive');
  }
});

test('drive - create folder', async ({ page }) => {
  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanUserDrive('My test folder');

    await fileActions.newFile.click();
    await fileActions.driveAddMenuItem(/^Folder$/ ).click({ timeout: 2000 });
    await fileActions.mainFrame.getByPlaceholder('New folder').fill('My test folder');
    await page.keyboard.press('Enter');
    await expect(fileActions.driveContentFolder.getByText('My test folder')).toBeVisible();
    await fileActions.driveContentFolder.getByText('My test folder').click({ button: 'right', timeout: 3000 });
    await fileActions.trash.click();

    await fileActions.toSuccess( 'Can create folder in Drive');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t create folder in Drive');
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
//     // await page.waitForTimeout(5000);
//     await fileActions.okButton.waitFor()
//     await fileActions.okButton.click();
//     // await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').waitFor()
//     await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder')).toBeVisible(5000)
//     // await page.waitForTimeout(5000);

//     await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').click({button: 'right'});
//     // await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByText('Share', { exact: true }).click();
//     // await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByText('test-user3', { exact: true }).click();
//     // await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     // await page.waitForTimeout(5000);
//     await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').click({button: 'right'})
//     // await page.waitForTimeout(5000);
//     await fileActions.destroyItem.waitFor()
//     // await page.waitForTimeout(5000);
//     await fileActions.destroyItem.click()
//     // await page.waitForTimeout(5000);
//     await fileActions.okButton.waitFor()
//     // await page.waitForTimeout(5000);
//     await fileActions.okButton.click();
//     // await page.waitForTimeout(5000);

//     // await page.reload()
//     // await expect(page.frameLocator('#sbox-iframe').getByText('Your shared folder My shared folder is no longer available.')).toBeVisible()
//     // await fileActions.deleteButton.click();
//     // // await page.waitForTimeout(5000);

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - shared folder', status: 'passed',reason: `Can create shared folder in Drive`}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - shared folder', status: 'failed',reason: `Can\'t create shared folder in Drive`}})}`);

//   }
// });

test('drive - toggle sidebar', async ({ page }) => {
  try {

    await cleanUp.cleanUserDrive('my file');
    await cleanUp.cleanUserDrive('my file');
    await fileActions.filesButton.click();
    await fileActions.filesButton.click();
    await expect(fileActions.mainFrame.getByText('Search...')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('Recent')).toBeVisible();
    await expect(fileActions.driveSideBarItem('Drive').nth(3)).toBeVisible();
    await expect(fileActions.driveSideBarItem('Templates').first()).toBeVisible();
    await expect(fileActions.driveSideBarItem('Trash').first()).toBeVisible();
    await fileActions.filesButton.click();
    await expect(fileActions.mainFrame.getByText('Search...')).toBeHidden();
    await expect(fileActions.mainFrame.getByText('Recent')).toBeHidden();
    await expect(fileActions.driveSideBarItem('Drive').nth(3)).toBeHidden();
    await expect(fileActions.driveSideBarItem('Templates').first()).toBeHidden();
    await expect(fileActions.driveSideBarItem('Trash').first()).toBeHidden();

    await fileActions.toSuccess( 'Can toggle sidebar in Drive');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t toggle sidebar in Drive');
  }
});

test('drive - search', async ({ page }) => {
  try {
    await fileActions.mainFrame.getByText('test sheet').waitFor();
    await fileActions.mainFrame.getByText('test whiteboard').waitFor();
    await fileActions.driveSideBarItem('Search...' ).first().click();
    await fileActions.mainFrame.getByPlaceholder('Search').fill('test sheet');
    await fileActions.mainFrame.getByPlaceholder('Search').press('Enter');
    await fileActions.mainFrame.getByText('test sheet').first().waitFor();
    await expect(fileActions.mainFrame.getByText('test whiteboard')).toHaveCount(0);

    await fileActions.toSuccess( 'Can search files in Drive');
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive - search', status: 'failed', reason: 'Can\'t search files in Drive' } })}`);
  }
});

test('can download drive contents', async ({ page }) => {
test.skip()
  try {
    const menu = fileActions.drivemenu;
    await menu.click();
    await expect(fileActions.settings).toBeVisible();

    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });
    await page1.waitForTimeout(6000);
    const fileActions1 = new FileActions(page1)
    await fileActions1.driveSideBar.getByText('CryptDrive').click();

    await fileActions1.downloadCryptDrive.click()

    await fileActions1.textbox.fill('/tmp/mydrivecontents.zip');
    const download1Promise = page1.waitForEvent('download');
    await fileActions1.okButton.click();
    const download1 = await download1Promise;

    await download1.saveAs('/tmp/mydrivecontents.zip');

    await expect(fileActions1.mainFrame.getByText('Your download is ready!')).toBeVisible();

    const expectedFiles = ['Drive/', 'Drive/test code.md', 'Drive/test form.json', 'Drive/test kanban.json', 'Drive/test pad.html', 'Drive/test markdown.md', 'Drive/test sheet.xlsx', 'Drive/test whiteboard.png', 'Drive/test diagram.drawio'];
    const actualFiles = [];

    async function unzipDownload () {
      return new Promise((resolve) => {
        fs.createReadStream('/tmp/mydrivecontents.zip')
          .pipe(unzipper.Parse())
          .on('entry', function (entry) {
            const fileName = entry.path;
            actualFiles.push();
            // console.log(fileName);
          })
          .on('finish', resolve);
      });
    }

    async function compareFiles () {
      await unzipDownload();
      const checker = (arr, target) => target.every(v => arr.includes(v));
      console.log('act', actualFiles);
      console.log('exp', expectedFiles)
      const check = checker(actualFiles, expectedFiles);
      if (check) {
        return true;
      } else {
        return false;
      }
    }
    const files = await compareFiles();
    if (files) {
      await fileActions.toSuccess('Can download drive contents');
    } else {
      await fileActions.toFailure(e,  'Can\'t download drive contents');
    }
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t download drive contents');
  }
});
