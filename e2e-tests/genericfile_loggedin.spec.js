const { test, url, mainAccountPassword, testUser3Password, nextWeekSlashFormat, titleDate, titleDateComma } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');
const { FilePage, StoreModal, docTypes } = require('./genericfile_po');


const { expect } = require('@playwright/test');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let page1;
let mobile;
let browserName;
let cleanUp;
let title;
let titleComma
let filePage
let titleName;
let contextOne;
let fileActions;
let isBrowserstack;
let titles

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);

  mobile = isMobile;
  browserName = testInfo.project.name.split(/@/)[0];
  isBrowserstack = !!testInfo.project.name.match(/browserstack/);

  fileActions = new FileActions(page);
  filePage = new FilePage(page, testInfo.title, isMobile);
  const name = testInfo.title.split(' ')[2];
  titles = fileActions.getTitle(name)

  cleanUp = new Cleanup(page);
  await cleanUp.cleanFiles(titles);
  await page.goto(`${url}/${name}`);
  await fileActions.createFile.waitFor();

});

const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram', 'doc', 'presentation'];
// const docNames = ['doc'];


docNames.forEach(function (name) {
  test(`loggedin - ${name} - create without owner`, async ({ page }) => {
    try {
      
      await fileActions.creationOption('Owned document').click();
      await fileActions.createFile.click();
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 });
      await fileActions.access(mobile);
      await expect(fileActions.ownersGrid('test-user')).toBeHidden();

      await fileActions.toSuccess(`Can create ${name} without owner`);
    } catch (e) {
      await fileActions.toFailure(e, `Can't create ${name} without owner`);
    }
  });

  // test(`${name} - create with destruction date`, async ({ page, context }) => {
  //   try {
  //     console.log(nextWeekSlashFormat);

  //     await fileActions.mainFrame.locator('label').filter({ hasText: 'Destruction date' }).locator('span').first().click();
  //     await fileActions.mainFrame.locator('#cp-creation-expire-val').click();
  //     await fileActions.mainFrame.locator('#cp-creation-expire-val').fill('7');
  //     await fileActions.mainFrame.locator('#cp-creation-expire-unit').selectOption('day');
  //     await fileActions.createFile.click();
  //     await fileActions.mainFrame.getByRole('button', { name: ' Access' }).click();

  //     await expect(fileActions.secureFrame.getByText(`Destruction date${nextWeekSlashFormat}`)).toBeVisible();

  //     await fileActions.closeButtonSecure.click();
  //     await fileActions.mainFrame.getByRole('button', { name: ' Share' }).click();
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

  //     await fileActions1.mainFrame.getByText(/^This document has reached/).waitFor();
  //     await expect(fileActions1.mainFrame.getByText(/^This document has reached/)).toBeVisible();

  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - create with destruction date`, status: 'passed', reason: `Can create ${name} with destruction date` } })}`);
  //   } catch (e) {
  //     console.log(e);
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `${name} - create with destruction date`, status: 'failed', reason: `Can't create ${name} with destruction date` } })}`);
  //   }
  // });

  test(`loggedin - ${name} - tag`, async ({ page }) => {
    try {
      await fileActions.createFile.click();
      await (new StoreModal(filePage)).storeButton.click();

      await fileActions.filemenuClick(mobile);
      await fileActions.clickTags(local);
      await fileActions.tagInput.click();
      await fileActions.tagInput.fill('testtag');
      await fileActions.addButton.click();
      await fileActions.okButton.click();
      await page.waitForTimeout(2000);
      
      await page.goto(`${url}/drive/#`);
      await fileActions.driveSideMenu.getByText('Tags').click();
      await fileActions.tag.click();
      if (mobile) {
        await fileActions.tag.click();
      }

      await fileActions.driveFileTitle(name).waitFor();
      await expect(fileActions.driveFileTitle(name)).toBeVisible();

      await fileActions.driveFileTitle(name).click({ button: 'right' });
      await fileActions.destroy.click();
      await fileActions.okButton.click();
      await expect(fileActions.driveFileTitle(name)).toHaveCount(0);

      await fileActions.toSuccess(`Can tag ${name} document`);
    } catch (e) {
      await fileActions.toFailure(e,  `Can't tag ${name} document`);
    }
  });

  test(`loggedin - ${name} - edit document owners #1264`, async ({ page, browser }) => {
    // test.fixme(name === 'whiteboard' | name === 'diagram', 'diagram/whiteboard participant status bug');
    try {
      await fileActions.createFile.click();

      // add test-user3 as owner
      await fileActions.filemenu.waitFor();

      await expect(fileActions.fileTitle(name)).toBeVisible();
      await fileActions.access(mobile);
      await fileActions.owners.click();
      await fileActions.secureFrame.getByText('test-user3').nth(1).waitFor()
      await fileActions.secureFrame.getByText('test-user3').nth(1).click({ timeout: 5000 });
      await fileActions.addOwner.waitFor()
      await fileActions.addOwner.click({ timeout: 5000 });
      await fileActions.okButtonSecure.waitFor()
      await fileActions.okButtonSecure.click();

      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      page1 = await context.newPage();
      await page1.goto(`${url}/drive`);
      const fileActions1 = new FileActions(page1);
      await fileActions1.notifications.waitFor();
      await fileActions1.notifications.click();

      // accept ownership invitation
      await fileActions1.ownershipNotif('test-user', name).first().click();

      const pagePromise2 = page1.waitForEvent('popup');
      await fileActions1.mainFrame.getByText('Open the document in a new tab').click();
      const page2 = await pagePromise2;
      await fileActions1.acceptButton.click();
      await page2.bringToFront();
      const fileActions2 = new FileActions(page2);
      await fileActions2.filemenu.waitFor();

      await expect(fileActions2.fileTitle(name)).toBeVisible();
      await fileActions2.access(mobile);
      await expect(fileActions2.ownersGrid('test-user3').first()).toBeVisible()

      await page.bringToFront();
      await fileActions.closeButtonSecure.click();
      await fileActions.access(mobile);

      await fileActions.owners.click();
      await fileActions.removeOwner('test-user3').click();
      await fileActions.okButtonSecure.click();
      await fileActions.closeButtonSecure.click();

      await page2.reload();
      await fileActions2.access(mobile);

      await expect(fileActions2.ownersGrid('test-user3')).toBeHidden()

      await fileActions.toSuccess( `Can edit ${name} document owners`);
    } catch (e) {
      await fileActions.toFailure(e, `Can't edit ${name} document owners`);
    }
  });

  test(`loggedin - ${name} - add to team drive`, async ({ page }) => {
    test.skip(browserName === 'edge', 'microsoft edge incompatibility');

    try {
      await fileActions.createFile.click();
      await fileActions.share(mobile);
      await fileActions.secureFrame.getByText('test team').click();
      await fileActions.shareSecureLink.click();

      await page.waitForTimeout(2000);
      await page.goto(`${url}/teams/`);
      await fileActions.teamSlot.getByText('test team').click();

      await fileActions.driveFileTitle(name).first().click({ button: 'right' });

      await fileActions.moveToTrash.click();
      await page.waitForTimeout(5000);

      await fileActions.toSuccess( 'Can create document and add to team drive');
    } catch (e) {
      await fileActions.toFailure(e,  'Can\'t acreate document and add to team drive');
    }
  });

  test(`loggedin - ${name} - move to trash and empty`, async ({ page }) => {
    try {
      await fileActions.createFile.click();
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 });

      await (new StoreModal(filePage)).storeButton.click();

      await fileActions.filemenuClick(mobile);
      await fileActions.moveToTrash.click()
      await fileActions.okButton.click();
      await fileActions.movedToTrash.waitFor()
      // await expect(fileActions.movedToTrash).toBeVisible({ timeout: 10000 });
      await fileActions.okButton.click();

      await page.goto(`${url}/drive`);
      await fileActions.trash.click();
      await fileActions.emptyTrash.click();
      if (mobile) {
        await fileActions.emptyTrash.click();
      }
      if (await fileActions.destroyButton.isVisible()) {
        await fileActions.destroyButton.click()
      } else {
        await fileActions.removeButton.click();
      }

      await page.waitForTimeout(2000)

      await fileActions.toSuccess(`Can create ${name} and move to trash`);
    } catch (e) {
      await fileActions.toFailure(e, `Can't create ${name} and move to trash`);
    }
  });

  if (name !== 'form') {
    test(`loggedin - ${name} - protect with and edit password`, async ({ page, browser }) => {
      try {
        await fileActions.creationOption('Add a password').click();
        await fileActions.creationPassword.fill('password');
        await fileActions.createFile.click();
        await fileActions.fileTitle(name).waitFor();
        await expect(fileActions.fileTitle(name)).toBeVisible();

        await fileActions.share(mobile);
        const clipboardText = await fileActions.getLinkAfterCopyRole('View')

        if (mobile) {
          contextOne = browser;
        } else {
          contextOne = await browser.newContext();
        }

        const page1 = await contextOne.newPage();

        await page1.goto(`${clipboardText}`);
        const fileActions1 = new FileActions(page1);

        await fileActions1.newPasswordMessage.waitFor();

        await expect(fileActions1.newPasswordMessage).toBeVisible({ timeout: 30000 });
        await fileActions1.typePassword.click();
        await fileActions1.typePassword.fill('password');
        await fileActions1.submitButton.click();
        await fileActions1.fileTitle(name).waitFor()
        await expect(fileActions1.fileTitle(name)).toBeVisible({ timeout: 5000 });

        await page.bringToFront();
        await fileActions.access(mobile);

        await fileActions.changePasswordInput.waitFor();
        await fileActions.changePasswordInput.fill('newpassword');
        await fileActions.submitButtonSecure.waitFor();
        await fileActions.submitButtonSecure.click();
        await fileActions.okButtonSecure.waitFor();
        await fileActions.okButtonSecure.click();
        await fileActions.passwordChangeSuccess.waitFor()
        await fileActions.okButtonSecure.waitFor();
        await fileActions.okButtonSecure.click();
        await fileActions.share(mobile)

        const clipboardText1 = await fileActions.getLinkAfterCopyRole('View')

        await page1.bringToFront();
        await page1.goto(`${clipboardText1}`);

        await fileActions1.newPasswordMessage.waitFor();
        await expect(fileActions1.newPasswordMessage).toBeVisible();
        await fileActions1.typePassword.click({ timeout: 5000 });
        await fileActions1.typePassword.fill('newpassword');
        await fileActions1.submitButton.click();
        
        await expect(fileActions1.fileTitle(name)).toBeVisible({ timeout: 5000 });

        await fileActions.toSuccess( `Can protect ${name} document with and edit password`);
      } catch (e) {
        await fileActions.toFailure(e,  `Can't protect ${name} document with and edit password`);
      }
    });

    test(`loggedin - ${name} - share with contact (to view)`, async ({ page, browser }) => {
      try {
        await fileActions.createFile.click();
        await fileActions.shareWithContact(/^View$/, 'test-user3');

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        page1 = await context.newPage();
        await page1.goto(`${url}/drive`);
        const fileActions1 = new FileActions(page1);

        await fileActions1.notifications.click();

        const page2Promise = page1.waitForEvent('popup');
        await fileActions1.shareNotif('test-user', name).first().click()
        const page2 = await page2Promise;
        const fileActions2 = new FileActions(page2);
        await fileActions2.fileTitle(name).waitFor()
        await expect(fileActions2.fileTitle(name)).toBeVisible({ timeout: 5000 });
        await expect(fileActions2.readOnly).toBeVisible({ timeout: 5000 });

        /// /

        await page.bringToFront();
        if (mobile) {
          await fileActions.usersPanel.click();
        }
        await expect(fileActions.mainFrame.getByText('1 viewer')).toBeVisible();

        await fileActions.toSuccess( `Can share ${name} with contact (to view)`);
      } catch (e) {
        await fileActions.toFailure(e,  `Can't share ${name} with contact (to view)`);
      }
    });

    test(`loggedin - ${name} - share with contact - edit #1264`, async ({ page, browser }) => {
      test.fixme(name === 'whiteboard' | name === 'diagram', 'diagram/whiteboard participant status bug');
      try {
        await fileActions.createFile.click();
        await fileActions.shareWithContact('Edit', 'test-user3');

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        page1 = await context.newPage();
        await page1.goto(`${url}/drive`);
        const fileActions1 = new FileActions(page1);
        await fileActions1.notifications.waitFor();
        await fileActions1.notifications.click();
        const page2Promise = page1.waitForEvent('popup');
        await fileActions1.shareNotif('test-user', name).first().click()
        const page2 = await page2Promise;

        const fileActions2 = new FileActions(page2);

        await fileActions2.filemenu.waitFor();
        await expect(fileActions2.fileTitle(name)).toBeVisible();
        await expect(fileActions2.readOnly).toBeHidden();

        await page.bringToFront();
        if (mobile) {
          await fileActions.usersPanel.click();
        }
        if (name === 'pad') {
          await expect(fileActions.padEditorContainer.getByText('test-user3')).toBeVisible();
        } else if (name === 'sheet') {
          await expect(fileActions.sheetEditorContainer.getByText('test-user3')).toBeVisible();
        } else if (name === 'diagram') {
          await expect(fileActions.diagramEditorContainer.getByText('test-user3')).toBeVisible();
        } else if (name === 'code') {
          await expect(fileActions.codeEditorContainer.getByText('test-user3')).toBeVisible();
        } else if (name === 'slide') {
          await expect(fileActions.slideEditorContainer.getByText('test-user3')).toBeVisible();
        } else if (name === 'whiteboard') {
          await expect(fileActions.whiteBoardEditorContainer.getByText('test-user3')).toBeVisible();
        } else if (name === 'kanban') {
          await expect(fileActions.kanbanEditorContainer.getByText('test-user3')).toBeVisible();
        }

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: `share ${name} with contact (to edit)`, status: 'passed', reason: `Can share ${name} with contact (to edit)` } })}`);
      } catch (e) {
        await fileActions.toFailure(e, `Can't share ${name} with contact (to edit)`);
      }
    });

    test(`loggedin - ${name} - share with contact - view and delete`, async ({ page, browser }) => {
      try {
        await fileActions.createFile.click();
        await fileActions.shareWithContact('View', 'test-user3', true);

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        page1 = await context.newPage();
        await page1.goto(`${url}/drive`);
        const fileActions1 = new FileActions(page1);
        await fileActions1.notifications.waitFor()
        await fileActions1.notifications.click();

        const page2Promise = page1.waitForEvent('popup');
        await fileActions1.shareNotif('test-user', name).first().click()
        const page2 = await page2Promise;
        const fileActions2 = new FileActions(page2);

        await fileActions2.viewAndDelete.click();
        await fileActions2.fileTitle(name).waitFor()
        await expect(fileActions2.fileTitle(name)).toBeVisible();
        await expect(fileActions2.readOnly).toBeVisible();
        await page2.waitForTimeout(1000)
        await page2.reload();
        await fileActions2.destroyedByOwner.waitFor();
        await expect(fileActions2.destroyedByOwner).toBeVisible();

        /// /
        await fileActions.destroyedByOwner.waitFor();
        await expect(fileActions.destroyedByOwner).toBeVisible();

        await fileActions.toSuccess(`Can share ${name} with contact (to view once and delete)`);
      } catch (e) {
        await fileActions.toFailure(e, `Can't share ${name} with contact (to view once and delete)`);
      }
    });

    test(`loggedin - ${name} - share (link) - view and delete`, async ({ page, browser }) => {
      test.skip(name === 'diagram' | name === 'whiteboard', 'copy link button doesn\'t display #1878')
      try {
        await fileActions.createFile.click();

        await fileActions.share(mobile);
        await fileActions.clickLinkTab(mobile);
        await fileActions.viewOnce.click({ timeout: 3000 });
        await fileActions.createLink.waitFor();
        await fileActions.createLink.click();
        await fileActions.shareCopyLink.waitFor();
        await fileActions.shareCopyLink.click();

        const clipboardText = await page.evaluate('navigator.clipboard.readText()');

        ///
        const contextOne = await browser.newContext();
        const page1 = await contextOne.newPage();
        const fileActions1 = new FileActions(page1);
        await page1.goto(`${clipboardText}`);
        await fileActions1.viewAndDelete.waitFor();
        await fileActions1.viewAndDelete.click();
        await fileActions1.fileTitle(name).waitFor()
        await expect(fileActions1.fileTitle(name)).toBeVisible();
        await page1.waitForTimeout(1000)

        await page1.reload();
        await fileActions1.destroyedByOwner.waitFor();
        await expect(fileActions1.destroyedByOwner).toBeVisible();

        await fileActions.toSuccess(`Can share link to ${name} (to view once and delete)`);
      } catch (e) {
        await fileActions.toFailure(e, `Can't share link to ${name} (to view once and delete)`);
      }
    });

    test(`loggedin - ${name} - enable and add to access list`, async ({ page, browser }) => {
      test.skip()
      try {
        await fileActions.createFile.click();

        // enable access list and add test-user3 to it
        await fileActions.fileSaved.waitFor()

        await expect(fileActions.fileTitle(name)).toBeVisible();
        await fileActions.access(mobile);
        await fileActions.accessList.click();
        await fileActions.enableAccessList.click();
        await fileActions.secureFrame.getByText('test-user3').first().waitFor()
        await fileActions.secureFrame.getByText('test-user3').first().click();
        await fileActions.addToAccessList.waitFor()
        await fileActions.addToAccessList.click();
        await fileActions.closeButtonSecure.waitFor()
        await fileActions.closeButtonSecure.click();

        // share link and attempt to access document anonymously
        await fileActions.share(mobile);
        const clipboardText = await fileActions.getLinkAfterCopyRole('View')

        // const context = await browser.newContext();
        page1 = await browser.newPage();
        await page1.goto(`${clipboardText}`);
        const fileActions1 = new FileActions(page1)
        await page1.bringToFront();
        await fileActions1.notAuthorisedToAccess.waitFor();
        await expect(fileActions1.notAuthorisedToAccess).toBeVisible();

        // access document as test-user3
        const contextTwo = await browser.newContext({ storageState: 'auth/testuser3.json' });
        const page2 = await contextTwo.newPage();
        const fileActions2 = new FileActions(page2)
        await page2.goto(`${clipboardText}`);
        await fileActions2.filemenu.waitFor();

        await expect(fileActions2.fileTitle(name)).toBeVisible();

        // remove test-user3 from access list
        await fileActions.access(mobile);
        await fileActions.accessList.click();
        await fileActions.removeFromAccessList.click();
        await fileActions.closeButtonSecure.click();

        const context3 = await browser.newContext({ storageState: 'auth/testuser3.json' });
        const page3 = await context3.newPage();
        const fileActions3 = new FileActions(page3)
        await page3.goto(`${clipboardText}`);
        await fileActions3.notAuthorisedToAccess.waitFor();
        await expect(fileActions3.notAuthorisedToAccess).toBeVisible();

        await fileActions.toSuccess( `Can enable and add to access list in ${name} document`);
      } catch (e) {
        await fileActions.toFailure(e,  `Can't enable and add to access list in ${name} document`);
      }
    });
  }
});
