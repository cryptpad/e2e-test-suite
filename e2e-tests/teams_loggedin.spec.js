const { test, url, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

const fs = require('fs');
const unzipper = require('unzipper');

let page1;
let mobile;
let browserName;
let cleanUp;
let browserstackMobile;
let fileActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);

  mobile = isMobile;
  browserName = testInfo.project.name.split(/@/)[0];
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);

  await page.goto(`${url}/teams`);
  fileActions = new FileActions(page);
});

test('loggedin - user menu - make and delete team', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    await fileActions.newTeam.click();

    await fileActions.textbox.fill('example team');
    await fileActions.createFile.click();
    await fileActions.mainFrame.getByText('example team').first().waitFor({ timeout: 10000 });
    await fileActions.mainFrame.getByText('example team').first().click();
    await fileActions.driveSideBar.hover();
    await fileActions.teamTab(/^Administration$/).click();
    await fileActions.deleteButton.click();
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await expect(fileActions.mainFrame.getByText('example team', { exact: true })).toHaveCount(0);

    await fileActions.toSuccess( 'Can create a team');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t create a team' );
  }
});


test('loggedin - can access team public signing key', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    await fileActions.accessTeam()

    await fileActions.mainFrame.locator('div').filter({ hasText: /^Administration$/ }).waitFor();
    await fileActions.mainFrame.locator('div').filter({ hasText: /^Administration$/ }).click();

    const key = await fileActions.textbox.first().inputValue();
    if (key.indexOf('test team@') !== -1) {
      await fileActions.toSuccess( 'Can access team public signing key');
    } else {
      await fileActions.toFailure(e,  'Can\'t access team public signing key');
    }
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t access team public signing key');
  }
});

test('screenshot loggedin - change team avatar', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    // access team administration panel
    await fileActions.accessTeam()
    await fileActions.teamTab(/^Administration$/).waitFor();
    await fileActions.teamTab(/^Administration$/).click();

    // upload new avatar
    const fileChooserPromise = page.waitForEvent('filechooser');
    await fileActions.mainFrame.getByLabel('Upload a new file to your').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/teamavatar.png');
    await fileActions.okButton.waitFor();
    await fileActions.okButton.click();
    await page.waitForTimeout(5000);
    await page.goto(`${url}/teams`);
    await fileActions.teamSlot.getByText('test team').waitFor();
    if (browserName === 'chrome') {
      await expect(page).toHaveScreenshot( { maxDiffPixels: 10000 });
    } else {
      await expect(page).toHaveScreenshot( { maxDiffPixels: 100 });
    }

    await fileActions.accessTeam()
    await fileActions.teamTab(/^Administration$/).waitFor();
    await fileActions.teamTab(/^Administration$/).click();

    // change avatar back to original
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    // await fileActions.mainFrame.getByLabel('Upload a new file to your').waitFor();

    await fileActions.mainFrame.getByLabel('Upload a new file to your').click();
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles('testdocuments/teamavatar-empty.png');
    // await fileActions.okButton.waitFor();
    // await fileActions.okButton.click();
    await page.waitForTimeout(5000);
    await page.goto(`${url}/teams`);
    await fileActions.teamSlot.getByText('test team').waitFor();
    if (browserName === 'chrome') {
      await expect(page).toHaveScreenshot( { maxDiffPixels: 9000 });
    } else {
      await expect(page).toHaveScreenshot( { maxDiffPixels: 100 });
    }

    await fileActions.toSuccess( 'Can change team avatar');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t change team avatar' );
  }
});

test('loggedin - can download team drive', async ({ page }) => {
  test.skip()
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');

  try {
    await fileActions.accessTeam()

    // access administration panel
    await fileActions.teamTab(/^Administration$/).waitFor();
    await fileActions.teamTab(/^Administration$/).click();

    // download drive
    await fileActions.download.click();
    await fileActions.areYouSureButton.click();
    const downloadPromise = page.waitForEvent('download');
    await fileActions.download.click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/myteamdrivecontents.zip');

    await expect(fileActions.mainFrame.getByText('Your download is ready!')).toBeVisible();

    // verify contents
    const expectedFiles = ['Drive/', 'Drive/test code.md', 'Drive/test form.json', 'Drive/test kanban.json', 'Drive/test pad.html', 'Drive/test slide.md', 'Drive/test sheet.xlsx', 'Drive/test whiteboard.png', 'Drive/test diagram.drawio'];

    const actualFiles = [];

    async function unzipDownload () {
      return new Promise((resolve) => {
        fs.createReadStream('/tmp/myteamdrivecontents.zip')
          .pipe(unzipper.Parse())
          .on('entry', function (entry) {
            const fileName = entry.path;
            actualFiles.push(fileName);
            console.log(fileName);
          })
          .on('finish', resolve);
      });
    }

    async function compareFiles () {
      await unzipDownload();
      const checker = (arr, target) => target.every(v => arr.includes(v));
      console.log(actualFiles);
      const check = checker(actualFiles, expectedFiles);
      if (check) {
        return true;
      } else {
        return false;
      }
    }
    const files = await compareFiles();
    if (files) {
      await fileActions.toSuccess( 'Can download team drive contents');
    } else {
      await fileActions.toFailure('Can\'t download team drive contents');
    }
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t download team drive contents');
  }
});

test('loggedin - add contact to team as viewer and remove them', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    // login as other user
    const context = await browser.newContext({ storageState: 'auth/testuser.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);

    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.waitFor();
    await fileActions1.notifications.click();

    if (await fileActions1.teamRemovalNotification.first().isVisible()) {
      await fileActions1.dismissNotification.click();
    }
    await fileActions1.notifications.click();

    // invite contact to team
    await fileActions.inviteMembersButton.click();
    await fileActions.contactToInvite('testuser').click();
    await fileActions.inviteButton.click();
    await fileActions1.notifications.click();

    // contact accepts team invitation
    await fileActions1.teamNotif.click();
    await fileActions1.acceptButton.waitFor();
    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.acceptButton.click();
    const page2 = await page2Promise;

    await page.reload();
    await fileActions.accessTeam()
    await fileActions.teamTab(/^Members$/).waitFor();
    await fileActions.teamTab(/^Members$/).click();
    await expect(fileActions.teamMember('testuser')).toBeVisible({ timeout: 100000 });

    const fileActions2 = new FileActions(page2)
    await fileActions2.accessTeam()
    await page2.waitForTimeout(5000);
    const page3Promise = page2.waitForEvent('popup');
    await fileActions2.driveContentFolder.locator('[data-original-title="test pad"]').dblclick();
    if (mobile) {
      await fileActions2.driveContentFolder.locator('[data-original-title="test pad"]').dblclick();
    }

    const page3 = await page3Promise;
    // await page3.waitForTimeout(5000)
    // check viewer can't add members or access admin panel
    await fileActions2.teamTab(/^Chat$/).click();
    await expect(fileActions2.mainFrame.getByText('Invite members')).toBeHidden();
    await expect(fileActions2.mainFrame.getByText('Administration')).toBeHidden();
    // check team docs are read only for viewer
    const fileActions3 = new FileActions(page3);
    await fileActions3.fileName.getByText('test pad').waitFor();
    await expect(fileActions3.readOnly).toBeVisible();
    await page3.close();

    await page2.close();
    await page.bringToFront();
    await fileActions.removeMember('testuser')
    await expect(fileActions.memberRemovalNotification('testuser')).toBeVisible();
    await fileActions.okButton.click();
    await expect(fileActions.teamMemberContainer('testuser')).toBeHidden({ timeout: 3000 });

    await page1.reload();
    await fileActions1.notifications.waitFor();
    await fileActions1.notifications.click();

    if (await fileActions1.teamRemovalNotification.first().isVisible()) {
      await fileActions1.dismissNotification.click();
    }

    await fileActions.toSuccess('Can add contact to team as viewer and remove them');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t add contact to team as viewer and remove them' );
  }
});

//fixme
test('loggedin - promote team viewer to member', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    // promote viewer to member
    await fileActions.promoteTestUser3()
    if (!await fileActions.demoteTestUser3Arrow.isVisible()) {
      await fileActions.promoteTestUser3()
    }

    /// log in other user
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    const fileActions1 = new FileActions(page1);
    await page1.goto(`${url}/teams`);
    await fileActions1.accessTeam()
    await fileActions1.driveContentFolder.getByText('test pad').waitFor()
    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.driveContentFolder.getByText('test pad').dblclick();
    await fileActions1.driveContentFolder.getByText('test pad').dblclick();
    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);

    // check member can't add members or access admin panel
    await fileActions1.teamTab(/^Members$/).click();
    await expect(fileActions1.inviteMembers).toBeHidden();
    await expect(fileActions1.teamTab(/^Administration$/)).toHaveCount(0);

    // check member can send team messages
    await fileActions1.teamTab(/^Chat$/).click();
    const dateTimeStamp = new Date();
    await fileActions1.typeMessage.click();
    await fileActions1.typeMessage.fill(`hello at ${dateTimeStamp}`);
    await fileActions1.typeMessage.press('Enter');

    // check member can edit team docs
    await page2.bringToFront();
    await fileActions2.fileName.getByText('test pad').waitFor();
    await expect(fileActions2.readOnly).toBeHidden();
    await page2.close();
    await page1.close();

    await page.reload();
    await fileActions.accessTeam()
    // check messages sent by member are visible to team
    await fileActions.teamTab(/^Chat$/).click();
    await expect(fileActions.mainFrame.getByText(`hello at ${dateTimeStamp}`)).toBeVisible();

    // demote member back to viewer
    await fileActions.teamTab(/^Members$/).waitFor();
    await fileActions.teamTab(/^Members$/).click();
    await expect(fileActions.teamMember('test-user3')).toBeVisible({ timeout: 5000 });
    await fileActions.demoteTestUser3()

    await fileActions.toSuccess( 'Can promote team viewer to member and demote them');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t promote team viewer to member and demote them');
  }
});

test('loggedin - promote team viewer to admin', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    await fileActions.promoteTestUser3()
    await fileActions.promoteTestUser3()

    /// log in other user
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    const fileActions1 = new FileActions(page1);
    await page1.goto(`${url}/teams`);
    await fileActions1.accessTeam()
    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.driveContentFolder.getByText('test pad').dblclick({ timeout: 5000 });
    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);

    // check member can't add members or access admin panel
    await fileActions1.teamTab(/^Members$/).click();
    await expect(fileActions1.inviteMembers).toBeVisible();
    await expect(fileActions1.teamTab(/^Administration$/)).toHaveCount(0);
    await fileActions1.teamTab(/^Chat$/).click();

    const dateTimeStamp = new Date();
    await fileActions1.typeMessage.click();
    await fileActions1.typeMessage.fill(`hello at ${dateTimeStamp}`);
    await fileActions1.typeMessage.press('Enter');

    await page2.bringToFront();
    await fileActions2.fileName.getByText('test pad').waitFor();
    await expect(fileActions2.readOnly).toBeHidden();
    await page2.close();
    await page1.close();

    await page.reload();
    await fileActions.accessTeam()

    await fileActions.teamTab(/^Chat$/).click();
    await expect(fileActions.mainFrame.getByText(`hello at ${dateTimeStamp}`)).toBeVisible();

    await fileActions.teamTab(/^Members$/).waitFor();
    await fileActions.teamTab(/^Members$/).click();
    await expect(fileActions.teamMember('test-user3')).toBeVisible({ timeout: 5000 });
    await fileActions.demoteTestUser3()
    await fileActions.demoteTestUser3()

    await fileActions.toSuccess( 'Can promote team viewer to admin and demote them');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t promote team viewer to admin and demote them');
  }
});

test('loggedin - promote team viewer to owner', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    await fileActions.promoteTestUser3()
    await fileActions.promoteTestUser3()
    await fileActions.offerOwnershipTestUser3Arrow.click()
    await expect(fileActions.mainFrame.getByText(/^Co-owners can modify or delete the team/)).toBeVisible();
    await fileActions.okButton.waitFor()
    await fileActions.okButton.click();

    // user 2: log in
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.waitFor();
    await fileActions1.notifications.click();

    // user 2: team viewer accepts promotion to owner
    await page1.frameLocator('#sbox-iframe').getByText('test-user wants you to be an owner of test team').first().waitFor();
    await page1.frameLocator('#sbox-iframe').getByText('test-user wants you to be an owner of test team').first().click();
    await fileActions1.acceptButton.waitFor();
    await fileActions1.acceptButton.click();
    await page.waitForTimeout(2000);
    await page1.goto(`${url}/teams`);
    await fileActions1.accessTeam()

    // user 2: check team docs are editable for new owner
    await fileActions1.driveContentFolder.getByText('test pad').waitFor()
    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.driveContentFolder.getByText('test pad').dblclick({ timeout: 5000 });
    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);

    await fileActions1.teamTab(/^Chat$/).click();
    const dateTimeStamp = new Date();
    await fileActions1.typeMessage.click();
    await fileActions1.typeMessage.fill(`hello at ${dateTimeStamp}`);
    await fileActions1.typeMessage.press('Enter');

    // check member can add members and access admin panel
    await expect(fileActions1.teamTab(/^Administration$/)).toBeVisible();
    await fileActions1.teamTab(/^Members$/).click();
    await expect(fileActions1.inviteMembers).toBeVisible();

    await page2.bringToFront();
    await fileActions2.fileName.getByText('test pad').waitFor();
    await expect(fileActions2.readOnly).toBeHidden();
    await page2.close();

    await fileActions.teamTab(/^Chat$/).click();
    await expect(fileActions.mainFrame.getByText(`hello at ${dateTimeStamp}`)).toBeVisible();
    await page.reload();
    await fileActions.accessTeam()

    await fileActions.teamTab(/^Members$/).waitFor();
    await fileActions.teamTab(/^Members$/).click();
    await expect(fileActions.teamMember('test-user3')).toBeVisible({ timeout: 5000 });
    await fileActions.demoteTestUser3()
    await fileActions.demoteTestUser3()
    await fileActions.demoteTestUser3()

    await page1.reload();
    await fileActions1.notifications.waitFor();
    await fileActions1.notifications.click();

    expect(page1.frameLocator('#sbox-iframe').getByText('test-user has removed your ownership of test team').first()).toBeVisible()
    await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();

    await fileActions.toSuccess('Can add contact to team as owner and demote them' );
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t add contact to team as owner and demote them');
  }
});

test('loggedin - add contact to team and contact leaves team', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    const newContext = await browser.newContext({ storageState: 'auth/testuser.json' });
    page1 = await newContext.newPage();
    await page1.goto(`${url}/drive`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.waitFor();
    await fileActions1.notifications.click();
    if (await fileActions1.teamRemovalNotification.first().isVisible()) {
      await fileActions1.dismissNotification.click();
    }
    await fileActions1.notifications.click();

    await fileActions.inviteMembersButton.click();
    await fileActions.contactToInvite('testuser').click();
    await fileActions.inviteButton.click();

    ///

    await fileActions1.notifications.click();
    await fileActions1.teamNotif.click({ timeout: 3000 });
    await fileActions1.acceptButton.waitFor();
    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.acceptButton.click();
    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);
    await fileActions2.accessTeam()
    await fileActions2.teamTab(/^Chat$/).click();
    await fileActions2.teamTab(/^Members$/).click();

    await fileActions2.leaveTeam.click();
    await expect(fileActions2.mainFrame.getByText(/^If you leave this team you will lose access/)).toBeVisible();
    await fileActions2.okButton.click();

    await page2.waitForTimeout(3000);
    await expect(fileActions.teamSlot.getByText('test team')).toHaveCount(0);

    await expect(fileActions.teamMemberFilter('testuser')).toHaveCount(0);

    await fileActions.toSuccess( 'Can add contact to team and contact can leave team');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t add contact to team / contact can\'t leave team');
  }
});

test('loggedin - invite contact to team and cancel', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    await fileActions.inviteMembers.click();
    await fileActions.contactToInvite('testuser').click();
    await fileActions.inviteButton.click();
    await fileActions.mainFrame.getByText('tetestuser', { exact: true }).waitFor();
    await expect(fileActions.mainFrame.getByText('tetestuser', { exact: true })).toBeVisible();
    await fileActions.removeMember('testuser')
    await expect(fileActions.memberRemovalNotification('testuser')).toBeVisible();
    await fileActions.okButton.click();
    await expect(fileActions.teamMember('testuser')).toBeHidden({ timeout: 100000 });

    await fileActions.toSuccess('Can invite contact to team and cancel invite');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t invite contact to team and cancel invite' );
  }
});

test('loggedin - can change team name', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    // access team admin panel
    await fileActions.accessTeam()
    await fileActions.teamTab(/^Administration$/).waitFor();
    await fileActions.teamTab(/^Administration$/).click();

    // change team name
    await fileActions.displayNamePlaceholder.click();
    await fileActions.displayNamePlaceholder.fill('');
    await fileActions.displayNamePlaceholder.fill('example team');
    await fileActions.saveButton.click();
    await page.waitForTimeout(5000);
    await page.reload();
    await fileActions.mainFrame.getByText('example team').waitFor();
    await fileActions.mainFrame.getByText('example team').click();

    await fileActions.teamTab(/^Administration$/).waitFor();
    await fileActions.teamTab(/^Administration$/).click();

    // change team name back
    await fileActions.displayNamePlaceholder.click();
    await fileActions.displayNamePlaceholder.fill('');
    await fileActions.displayNamePlaceholder.fill('test team');
    await fileActions.saveButton.click();
    await page.waitForTimeout(5000);

    await page.reload();
    await fileActions.teamSlot.getByText('test team').waitFor();
    await expect(fileActions.teamSlot.getByText('test team')).toBeVisible();

    await fileActions.toSuccess( 'Can change team name');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t change team name');
  }
});