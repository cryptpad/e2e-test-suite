const { expect } = require('@playwright/test');
const { test, url, mainAccountPassword, testUserPassword, testUser2Password, testUser3Password, titleDate, titleDateComma } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions, NewFileModal } = require('./fileactions.js');
const { FilePage, StoreModal, docTypes } = require('./genericfile_po');

let page1;
let cleanUp;
let userActions;
let fileActions
// let titleDate

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  await page.goto(`${url}`);
  let mobile = isMobile;
  let isBrowserstack = !!testInfo.project.name.match(/browserstack/);
  userActions = new UserActions(page);
  fileActions = new FileActions(page);
});

test('test-user account setup', async ({ page }) => {
  try {
    await userActions.register('test-user', mainAccountPassword);

    await fileActions.toSuccess('Can register test-user');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t register test-user');
  }
});

test('testuser account setup', async ({ page }) => {
  try {
    /// registering the account
    await userActions.register('testuser', testUserPassword);

    await fileActions.toSuccess('Can register testuser');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t register testuser');
  }
});

test('test-user2 account setup', async ({ page }) => {
  try {
    /// registering the account
    await userActions.register('test-user2', testUser2Password);

    await fileActions.toSuccess('Can register test-user2');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t register test-user2');
  }
});

test('test-user3 account setup', async ({ page }) => {
  try {
    /// registering the account
    await userActions.register('test-user3', testUser3Password);

    await fileActions.toSuccess('Can register test-user3');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t register test-user3');
  }
});

test('create test team', async ({ page }) => {
  try {
    await userActions.login('test-user', mainAccountPassword);

    await page.goto(`${url}/teams`);
    await fileActions.newTeam.waitFor()
    await fileActions.newTeam.click();

    await fileActions.textbox.waitFor()
    await fileActions.textbox.fill('test team');
    await fileActions.createFile.click();

    await expect(page).toHaveURL(`${url}/teams/`, { timeout: 100000 });

    await fileActions.mainFrame.getByText('tt', { exact: true }).click();

    await fileActions.toSuccess('Can create test team');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t create test team');
  }
});

test('link test-user and testuser as contacts', async ({ page, browser }, testInfo) => {
  try {
    await userActions.login('testuser', testUserPassword);
    await page.goto(`${url}/profile`);
    await fileActions.share(false);
    const testuserProfileLink = await page.evaluate('navigator.clipboard.readText()');

    // login test-user
    const context = await browser.newContext();
    page1 = await context.newPage();
    const fileActions1 = new FileActions(page1);

    const userActions2 = new UserActions(page1);
    await userActions2.login('test-user', mainAccountPassword);

    // send testuser contact request
    await page1.goto(`${testuserProfileLink}`);
    await fileActions1.contactRequest.waitFor();
    await fileActions1.contactRequest.click();
    await expect(fileActions1.cancelRequest).toBeVisible();
    await fileActions.notifications.waitFor()
    await fileActions.notifications.click();
    await fileActions.contactRequestNotif('test-user').waitFor();
    await fileActions.contactRequestNotif('test-user').click();
    await expect(fileActions.contactRequestMessage('test-user')).toBeVisible();
    await fileActions.acceptButton.waitFor();
    await fileActions.acceptButton.click();

    await page1.frameLocator('#sbox-iframe').getByText('testuser is one of your contacts').waitFor()
    await expect(page1.frameLocator('#sbox-iframe').getByText('testuser is one of your contacts')).toBeVisible();

    await fileActions.toSuccess('Can link test-user and testuser as contacts');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t link test-user and testuser as contacts');
  }
});

test('link test-user and test-user3 as contacts', async ({ page, browser }, testInfo) => {
  try {
    await userActions.login('test-user3', testUser3Password);
    await page.goto(`${url}/profile`);
    await fileActions.share(false);
    const testuserProfileLink = await page.evaluate('navigator.clipboard.readText()');

    // login test-user
    const context = await browser.newContext();
    page1 = await context.newPage();
    const fileActions1 = new FileActions(page1);

    const userActions2 = new UserActions(page1);
    await userActions2.login('test-user', mainAccountPassword);

    // send testuser contact request
    await page1.goto(`${testuserProfileLink}`);
    await fileActions1.contactRequest.waitFor();
    await fileActions1.contactRequest.click();
    await expect(fileActions1.cancelRequest).toBeVisible();

    await fileActions.notifications.waitFor()
    await fileActions.notifications.click();
    await fileActions.contactRequestNotif('test-user').waitFor();
    await fileActions.contactRequestNotif('test-user').click();
    await expect(fileActions.contactRequestMessage('test-user')).toBeVisible();
    await fileActions.acceptButton.waitFor();
    await fileActions.acceptButton.click();

    await page1.frameLocator('#sbox-iframe').getByText('test-user3 is one of your contacts').waitFor()
    await expect(page1.frameLocator('#sbox-iframe').getByText('test-user3 is one of your contacts')).toBeVisible();

    await fileActions.toSuccess('Can link test-user and test-user3 as contacts');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e,  'Can\'t link test-user and test-user3 as contacts');
  }
});

test('add test-user3 to test team', async ({ page, browser }) => {
  try {
    await userActions.login('test-user', mainAccountPassword);
    await page.goto(`${url}/teams`);
    await fileActions.accessTeam()
    await fileActions.teamTab(/^Members$/).waitFor();
    await fileActions.teamTab(/^Members$/).click();
    await fileActions.inviteMembersButton.click();
    await fileActions.mainFrame.getByRole('paragraph').getByText('test-user3').click();
    await fileActions.inviteButton.click();

    ///

    page1 = await browser.newPage();
    const userActions2 = new UserActions(page1);
    await userActions2.login('test-user3', testUser3Password);
    const fileActions1 = new FileActions(page1);

    await fileActions1.notifications.click();
    await fileActions1.teamNotif.click({ timeout: 3000 });
    await expect(fileActions1.acceptButton).toBeVisible();
    await fileActions1.acceptButton.waitFor();
    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.acceptButton.click();
    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);

    await fileActions2.teamSlot.getByText('test team').waitFor();
    await page2.close();
    await expect(fileActions.teamMember('test-user3' )).toBeVisible();

    await fileActions.toSuccess('Can add test-user3 to test team');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t add test-user3 to test team');
  }
});

test('create test files in test-user drive', async ({ page }) => {
  try {
    test.setTimeout(510000);

    await userActions.login('test-user', mainAccountPassword);

    cleanUp = new Cleanup(page);
    const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'];
    for (const i in docNames) {
      const name = `test ${docNames[i]}`;
      await cleanUp.cleanTeamDrive(name);
    }

    await page.goto(`${url}/sheet/`);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await (new StoreModal(fileActions)).storeButton.waitFor()
    await (new StoreModal(fileActions)).storeButton.click();
    await expect(fileActions.fileTitle('sheet')).toBeVisible();
    await fileActions.fileSaved.waitFor();
    await fileActions.titleEditBox.click();
    await fileActions.fileTitleEdit('sheet').fill('test sheet');
    await fileActions.fileSaved.waitFor()
    await fileActions.saveTitle.waitFor()
    await fileActions.saveTitle.click();
    await expect(fileActions.mainFrame.getByText('test sheet')).toBeVisible();

    await page.goto(`${url}/kanban/`);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await (new StoreModal(fileActions)).storeButton.waitFor()
    await (new StoreModal(fileActions)).storeButton.click();
    await expect(fileActions.fileTitle('kanban')).toBeVisible();
    await fileActions.titleEditBox.click();
    await fileActions.fileTitleEdit('kanban').fill('test kanban');
    await fileActions.saveTitle.click();
    await expect(fileActions.mainFrame.getByText('test kanban')).toBeVisible();

    await page.goto(`${url}/pad/`);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await (new StoreModal(fileActions)).storeButton.waitFor();
    await (new StoreModal(fileActions)).storeButton.click();
    await fileActions.fileTitle('pad').waitFor()
    await fileActions.titleEditBox.waitFor()
    await fileActions.titleEditBox.click();
    await fileActions.fileTitleEdit('pad').fill('test pad');
    await fileActions.fileSaved.waitFor()
    await fileActions.saveTitle.waitFor()
    await fileActions.saveTitle.click();
    await expect(fileActions.mainFrame.getByText('test pad')).toBeVisible();


    await page.goto(`${url}/code/`);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await (new StoreModal(fileActions)).storeButton.waitFor()
    await (new StoreModal(fileActions)).storeButton.click();
    await expect(fileActions.fileTitle('code')).toBeVisible();
    await fileActions.titleEditBox.waitFor()
    await fileActions.titleEditBox.click();
    await fileActions.fileTitleEdit('code').fill('test code');
    await fileActions.fileSaved.waitFor()
    await fileActions.saveTitle.waitFor()
    await fileActions.saveTitle.click();
    await expect(fileActions.mainFrame.getByText('test code')).toBeVisible();

    await page.goto(`${url}/slide/`);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await (new StoreModal(fileActions)).storeButton.waitFor()
    await (new StoreModal(fileActions)).storeButton.click();
    await expect(fileActions.fileTitle('slide')).toBeVisible();
    await fileActions.titleEditBox.waitFor()
    await fileActions.titleEditBox.click();
    await fileActions.fileTitleEdit('slide').fill('test slide');
    await fileActions.fileSaved.waitFor()
    await fileActions.saveTitle.waitFor()
    await fileActions.saveTitle.click();
    await expect(fileActions.mainFrame.getByText('test slide')).toBeVisible();

    await page.goto(`${url}/form/`);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await (new StoreModal(fileActions)).storeButton.waitFor()
    await (new StoreModal(fileActions)).storeButton.click();
    await expect(fileActions.fileTitle('form')).toBeVisible();
    await fileActions.titleEditBox.waitFor()
    await fileActions.titleEditBox.click();
    await fileActions.fileTitleEdit('form').fill('test form');
    await fileActions.saveTitle.waitFor()
    await fileActions.saveTitle.click();
    await expect(fileActions.mainFrame.getByText('test form')).toBeVisible();

    await page.goto(`${url}/whiteboard/`);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await (new StoreModal(fileActions)).storeButton.waitFor()
    await (new StoreModal(fileActions)).storeButton.click();
    await expect(fileActions.fileTitle('whiteboard')).toBeVisible();
    await fileActions.fileSaved.waitFor();
    await fileActions.titleEditBox.click();
    await fileActions.fileTitleEdit('whiteboard').fill('test whiteboard');
    await fileActions.saveTitle.waitFor()
    await fileActions.saveTitle.click();
    await expect(fileActions.mainFrame.getByText('test whiteboard')).toBeVisible();

    await page.goto(`${url}/diagram/`);
    await fileActions.createFile.waitFor()
    await fileActions.createFile.click();
    await (new StoreModal(fileActions)).storeButton.waitFor()
    await (new StoreModal(fileActions)).storeButton.click();
    await expect(fileActions.fileTitle('diagram')).toBeVisible();
    await fileActions.titleEditBox.waitFor()
    await fileActions.titleEditBox.click();
    await fileActions.fileTitleEdit('diagram').fill('test diagram');
    await fileActions.saveTitle.waitFor()
    await fileActions.saveTitle.click();
    await expect(fileActions.mainFrame.getByText('test diagram')).toBeVisible();

    await page.goto(`${url}/drive`);
    await fileActions.mainFrame.getByText('test diagram').waitFor()
    await expect(fileActions.driveContentFolder.getByText('test diagram')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test whiteboard')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test form')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test sheet')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test pad')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test code')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test slide')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test kanban')).toBeVisible();

    await fileActions.toSuccess('Can create test files in test-user drive');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t create test files in test-user drive');
  }
});

test('create test files in team drive and add avatar', async ({ page }) => {
  try {
    test.setTimeout(2100000);

    await userActions.login('test-user', mainAccountPassword);

    await page.goto(`${url}/teams`);
    await fileActions.teamSlot.getByText('test team').waitFor();
    await fileActions.teamSlot.getByText('test team').click();

    cleanUp = new Cleanup(page);
    const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'];
    for (const i in docNames) {
      const name = `test ${docNames[i]}`;
      await cleanUp.cleanTeamDrive(name);
    }

    console.log('1')
    await fileActions.driveContentFolder.getByText('New').click();
    const page2Promise = page.waitForEvent('popup');
    await fileActions.newDriveFile('Rich text').click()
    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);

    await fileActions2.createFile.click();
    await page2.waitForTimeout(5000)
    if (await fileActions2.okButton.isVisible()) {
      await fileActions2.okButton.click();
    
    }
    await expect(fileActions2.fileTitle('pad')).toBeVisible();
    await fileActions2.fileSaved.waitFor();
    await fileActions2.titleEditBox.click();
    await fileActions2.fileTitleEdit('pad').fill('test pad');
    await fileActions2.saveTitle.waitFor();
    await fileActions2.saveTitle.click({force: true});
    await expect(fileActions2.mainFrame.getByText('test pad')).toBeVisible();
    await page2.close();
    console.log('1')
    await fileActions.driveContentFolder.getByText('New').click();
    const page3Promise = page.waitForEvent('popup');
    await fileActions.newDriveFile('Sheet').click();
    const page3 = await page3Promise;
    const fileActions3 = new FileActions(page3);
    await fileActions3.createFile.click();
    await page3.waitForTimeout(5000)
    if (await fileActions3.okButton.isVisible()) {
      await fileActions3.okButton.click();
    
    }
    await expect(fileActions3.fileTitle('sheet')).toBeVisible();
    await fileActions3.fileSaved.waitFor();
    await fileActions3.titleEditBox.click();
    await fileActions3.fileTitleEdit('sheet').fill('test sheet');
    await fileActions3.saveTitle.waitFor();
    await fileActions3.saveTitle.click({force: true});
    await expect(fileActions3.mainFrame.getByText('test sheet')).toBeVisible();
    await page3.close();
    console.log('1')
    await fileActions.driveContentFolder.getByText('New').click();
    const page4Promise = page.waitForEvent('popup');
    await fileActions.newDriveFile('Code').click();
    const page4 = await page4Promise;
    const fileActions4 = new FileActions(page4);
    await fileActions4.createFile.click();
    await page4.waitForTimeout(5000)
    if (await fileActions4.okButton.isVisible()) {
      await fileActions4.okButton.click();
    
    }
    await expect(fileActions4.fileTitle('code')).toBeVisible();
    await fileActions4.fileSaved.waitFor();
    await fileActions4.titleEditBox.click();
    await fileActions4.fileTitleEdit('code').fill('test code');
    await fileActions4.saveTitle.waitFor();
    await fileActions4.saveTitle.click({force: true});
    await expect(fileActions4.mainFrame.getByText('test code')).toBeVisible();
    await page4.close();
    console.log('1')
    await fileActions.driveContentFolder.getByText('New').click();
    const page5Promise = page.waitForEvent('popup');
    
    await fileActions.newDriveFile('Markdown slides').click();
    const page5 = await page5Promise;
    const fileActions5 = new FileActions(page5);
    await fileActions5.createFile.click();
    await page5.waitForTimeout(5000)
    if (await fileActions5.okButton.isVisible()) {
      await fileActions5.okButton.click();
    
    }
    await expect(fileActions5.fileTitle('slide')).toBeVisible();
    await fileActions5.fileSaved.waitFor();
    await fileActions5.titleEditBox.click();
    await fileActions5.fileTitleEdit('slide').fill('test slide');
    await fileActions5.saveTitle.waitFor();
    await fileActions5.saveTitle.click({force: true});
    await expect(fileActions5.mainFrame.getByText('test slide')).toBeVisible();
    await page5.close();
    console.log('1')
    await page.reload();
    await fileActions.teamSlot.getByText('test team').waitFor();
    await fileActions.teamSlot.getByText('test team').click({ timeout: 3000 });

    await fileActions.driveContentFolder.getByText('New').click();
    const page6Promise = page.waitForEvent('popup');
    await fileActions.newDriveFile('Form' ).click();
    const page6 = await page6Promise;
    const fileActions6 = new FileActions(page6);
    await fileActions6.createFile.click();
    await page6.waitForTimeout(5000)
    if (await fileActions6.okButton.isVisible()) {
      await fileActions6.okButton.click();
    
    }
    await expect(fileActions6.fileTitle('form')).toBeVisible();
    await fileActions6.fileSaved.waitFor();
    await fileActions6.titleEditBox.click();
    await fileActions6.fileTitleEdit('form').fill('test form');
    await fileActions6.saveTitle.waitFor();
    await fileActions6.saveTitle.click({force: true});
    await expect(fileActions6.mainFrame.getByText('test form')).toBeVisible();
    await page6.close();
    console.log('1')
    await page.reload();
    await fileActions.teamSlot.getByText('test team').waitFor();
    await fileActions.teamSlot.getByText('test team').click({ timeout: 3000 });

    await fileActions.driveContentFolder.getByText('New').click();
    const page7Promise = page.waitForEvent('popup');
    await fileActions.newDriveFile('Whiteboard').click();
    const page7 = await page7Promise;
    const fileActions7 = new FileActions(page7);
    await fileActions7.createFile.click();
    await page7.waitForTimeout(5000)
    if (await fileActions7.okButton.isVisible()) {
      await fileActions7.okButton.click();
    
    }
    await expect(fileActions7.fileTitle('whiteboard')).toBeVisible();
    await fileActions7.fileSaved.waitFor();
    await fileActions7.titleEditBox.click();
    await fileActions7.fileTitleEdit('whiteboard').fill('test whiteboard');
    await fileActions7.saveTitle.waitFor();
    await fileActions7.saveTitle.click({force: true});
    await expect(fileActions7.mainFrame.getByText('test whiteboard')).toBeVisible();
    await page7.close();
    console.log('1')
    await page.reload();
    await fileActions.teamSlot.getByText('test team').waitFor();
    await fileActions.teamSlot.getByText('test team').click({ timeout: 3000 });

    await fileActions.driveContentFolder.getByText('New').click();
    const page8Promise = page.waitForEvent('popup');
    await fileActions.newDriveFile('Diagram').click();
    const page8 = await page8Promise;
    const fileActions8 = new FileActions(page8);
    await fileActions8.createFile.click();
    await page8.waitForTimeout(5000)
    if (await fileActions8.okButton.isVisible()) {
      await fileActions8.okButton.click();
    
    }
    await expect(fileActions8.fileTitle('diagram')).toBeVisible();
    await fileActions8.fileSaved.waitFor();
    await fileActions8.titleEditBox.click();
    await fileActions8.fileTitleEdit('diagram').fill('test diagram');
    await fileActions8.saveTitle.waitFor();
    await fileActions8.saveTitle.click({force: true});
    await expect(fileActions8.mainFrame.getByText('test diagram')).toBeVisible();
    await page8.close();
    console.log('1')
    await fileActions.driveContentFolder.getByText('New').click();
    const page9Promise = page.waitForEvent('popup');
    await fileActions.newDriveFile('Kanban').click();
    const page9 = await page9Promise;
    const fileActions9 = new FileActions(page9);
    await fileActions9.createFile.click();
    await page9.waitForTimeout(5000)
    if (await fileActions9.okButton.isVisible()) {
      await fileActions9.okButton.click();
    
    }
    await expect(fileActions9.fileTitle('kanban')).toBeVisible();
    await fileActions9.fileSaved.waitFor();
    await fileActions9.titleEditBox.click();
    await fileActions9.fileTitleEdit('kanban').fill('test kanban');
    await fileActions9.saveTitle.waitFor();
    await fileActions9.saveTitle.click({force: true});
    await expect(fileActions9.mainFrame.getByText('test kanban')).toBeVisible();

    await expect(fileActions.driveContentFolder.getByText('test diagram')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test whiteboard')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test form')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test sheet')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test pad')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test code')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test slide')).toBeVisible();
    await expect(fileActions.driveContentFolder.getByText('test kanban')).toBeVisible();

    await fileActions.teamTab(/^Administration$/).waitFor();
    await fileActions.teamTab(/^Administration$/).click();
    const fileChooserPromise = page.waitForEvent('filechooser');
    await fileActions.mainFrame.getByLabel('Upload a new file to your').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('e2e-test-suite/testdocuments/teamavatar-empty.png');
    await fileActions.okButton.click();
    await page.waitForTimeout(5000);

    await fileActions.toSuccess( 'Can create test files in team drive');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t create test files in team drive');
  }
});
