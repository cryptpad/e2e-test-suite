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
  test.setTimeout(210000);

  mobile = isMobile;
  browserName = testInfo.project.name.split(/@/)[0];
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);

  // if (mobile) {
  //   const userActions = new UserActions(page);
  //   await userActions.login('test-user', mainAccountPassword);
  // }
  await page.goto(`${url}/teams`);
  fileActions = new FileActions(page);
});

test('user menu - make and delete team', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    await page.frameLocator('#sbox-iframe').getByText('Available team slotNew').first().click();

    await fileActions.textbox.fill('example team');
    await fileActions.createFile.click();
    // await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').getByText('example team').first().waitFor({ timeout: 10000 });
    await page.frameLocator('#sbox-iframe').getByText('example team').first().click();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-leftside').hover();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await expect(page.frameLocator('#sbox-iframe').getByText('example team', { exact: true })).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'make team', status: 'passed', reason: 'Can create a team' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'make team', status: 'failed', reason: 'Can\'t create a team' } })}`);
  }
});

test('can change team name', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    // access team admin panel
    await fileActions.accessTeam()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();

    // change team name
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('example team');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    // await page.waitForTimeout(5000);
    await page.reload();
    await page.frameLocator('#sbox-iframe').getByText('example team').waitFor();
    await page.frameLocator('#sbox-iframe').getByText('example team').click();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();

    // change team name back
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('test team');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    // await page.waitForTimeout(5000);
    await page.reload();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'change team name', status: 'passed', reason: 'Can change team name' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'change team name', status: 'failed', reason: 'Can\'t change team name' } })}`);
  }
});

test(' can access team public signing key', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    await fileActions.accessTeam()

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();

    const key = await fileActions.textbox.first().inputValue();
    if (key.indexOf('test team@') !== -1) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access team public signing key', status: 'passed', reason: 'Can access team public signing key' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access team public signing key', status: 'failed', reason: 'Can\'t access team public signing key' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access team public signing key', status: 'failed', reason: 'Can\'t access team public signing key' } })}`);
  }
});

test('(screenshot) change team avatar', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    // access team administration panel
    await fileActions.accessTeam()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();

    // upload new avatar
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.frameLocator('#sbox-iframe').getByLabel('Upload a new file to your').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/teamavatar.png');
    await fileActions.okButton.waitFor();
    await fileActions.okButton.click();
    await page.waitForTimeout(5000);
    // await page.waitForTimeout(10000);
    await page.goto(`${url}/teams`);
    // await page.waitForTimeout(20000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    if (browserName === 'chrome') {
      await expect(page).toHaveScreenshot( { maxDiffPixels: 9000 });
    } else {
      await expect(page).toHaveScreenshot( { maxDiffPixels: 100 });
    }

    await fileActions.accessTeam()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();

    // change avatar back to original
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await page.frameLocator('#sbox-iframe').getByLabel('Upload a new file to your').click();
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles('testdocuments/teamavatar-empty.png');
    await fileActions.okButton.waitFor();
    await fileActions.okButton.click();
    await page.waitForTimeout(5000);
    await page.goto(`${url}/teams`);
    // await page.waitForTimeout(20000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    if (browserName === 'chrome') {
      await expect(page).toHaveScreenshot( { maxDiffPixels: 9000 });
    } else {
      await expect(page).toHaveScreenshot( { maxDiffPixels: 100 });
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'change team avatar', status: 'passed', reason: 'Can change team avatar' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'change team avatar', status: 'failed', reason: 'Can\'t change team avatar' } })}`);
  }
});

test('can download team drive', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');

  try {
    await fileActions.accessTeam()

    // access administration panel
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();

    // download drive
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Download' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    // await page.waitForTimeout(10000);
    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/myteamdrivecontents.zip');

    await expect(page.frameLocator('#sbox-iframe').getByText('Your download is ready!')).toBeVisible();

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
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'can download team drive', status: 'passed', reason: 'Can download team drive contents' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'can download team drive ', status: 'failed', reason: 'Can\'t download team drive contents' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'can download team drive', status: 'failed', reason: 'Can\'t download team drive contents' } })}`);
  }
});

test('add contact to team as viewer and remove them', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    // invite contact to team
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite', exact: true }).click();

    // login as other user
    const context = await browser.newContext({ storageState: 'auth/testuser.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    await page1.waitForTimeout(10000);

    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.click();

    if (!await page1.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').isVisible({ timeout: 3000 })) {
      // notification about being added to team doesn't display - re-add contact
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'testuser' }).locator('.fa.fa-times').click();
      await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
      await fileActions.okButton.click();
      // await page.waitForTimeout(1800);
      await expect(page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('testuser').getByText('testuser', { exact: true })).toBeHidden({ timeout: 3000 });

      await page1.reload();
      await page1.waitForTimeout(10000);
      await fileActions1.notifications.click();
      if (await page1.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').count() > 1) {
        await expect(page1.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').first()).toBeVisible();
        await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
      } else {
        await expect(page1.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team')).toBeVisible();
        if (await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').count() > 1) {
          await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
        } else {
          await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').click();
        }
      }
      await page1.reload();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite', exact: true }).click();
    }

    // contact accepts team invitation
    await page1.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click();
    await page1.waitForTimeout(3000);
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' })).toBeVisible();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor();
    const page2Promise = page1.waitForEvent('popup');
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    const page2 = await page2Promise;
    await page2.waitForTimeout(5000);

    await page.reload();
    // await page.waitForTimeout(10000);
    await fileActions.accessTeam()

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('testuser', { exact: true })).toBeVisible({ timeout: 100000 });

    const fileActions2 = new FileActions(page2)
    await fileActions2.accessTeam()

    await page2.waitForTimeout(5000);
    const page3Promise = page2.waitForEvent('popup');
    await page2.frameLocator('#sbox-iframe').getByText('test pad').dblclick({ timeout: 5000 });
    const pageThree = await page3Promise;

    // check viewer can't add members or access admin panel
    await page2.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();
    await expect(page2.frameLocator('#sbox-iframe').getByText('Invite members')).toBeHidden();
    await expect(page2.frameLocator('#sbox-iframe').getByText('Administration')).toBeHidden();
    // check team docs are read only for viewer
    await pageThree.waitForTimeout(7000);
    await pageThree.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText('test pad').waitFor();
    await expect(pageThree.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible();
    await pageThree.close();

    await page2.close();
    await page.bringToFront();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'testuser' }).locator('.fa.fa-times').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
    await fileActions.okButton.click();
    // await page.waitForTimeout(1800);
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('testuser')).toBeHidden({ timeout: 3000 });

    await page1.reload();
    await page1.waitForTimeout(10000);
    await fileActions1.notifications.waitFor();
    await fileActions1.notifications.click();

    if (await page1.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').count() > 1) {
      await expect(page1.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').first()).toBeVisible();
      await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
    } else {
      await expect(page1.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team')).toBeVisible();
      if (await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').count() > 1) {
        await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
      } else {
        await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').click();
      }
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'add contact to team as viewer and remove them', status: 'passed', reason: 'Can add contact to team as viewer and remove them' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'add contact to team as viewer and remove them', status: 'failed', reason: 'Can\'t add contact to team as viewer and remove them' } })}`);
  }
});

//fixme
test('promote team viewer to member', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    // promote viewer to member
    // await page.waitForTimeout(8000);
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').click();
    await page.waitForTimeout(2000);
    if (!await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').isVisible()) {
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').click();
    }

    /// log in other user
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/teams`);
    await page1.waitForTimeout(10000);
    await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible();

    // check team docs are editable for member
    await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    await page1.waitForTimeout(5000);
    await page1.waitForTimeout(3000);
    await page1.frameLocator('#sbox-iframe').getByText('test pad').waitFor()
    const page2Promise = page1.waitForEvent('popup');
    await page1.frameLocator('#sbox-iframe').getByText('test pad').dblclick();
    await page1.frameLocator('#sbox-iframe').getByText('test pad').dblclick();
    const page2 = await page2Promise;

    // check member can't add members or access admin panel
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Invite members')).toBeHidden();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Administration')).toHaveCount(0);

    // check member can send team messages
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
    const dateTimeStamp = new Date();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().fill(`hello at ${dateTimeStamp}`);
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().press('Enter');

    // check member can edit team docs
    await page2.bringToFront();
    await page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText('test pad').waitFor();
    await expect(page2.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden();
    await page2.close();
    await page1.close();

    await page.reload();
    // await page.waitForTimeout(6000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    // await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();

    // check messages sent by member are visible to team
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText(`hello at ${dateTimeStamp}`)).toBeVisible();

    // demote member back to viewer
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();
    const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3', { exact: true });
    await expect(user).toBeVisible({ timeout: 5000 });
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').click({ timeout: 5000 });
    await page.waitForTimeout(2000);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'promote team viewer to member', status: 'passed', reason: 'Can promote team viewer to member and demote them' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'promote team viewer to member', status: 'failed', reason: 'Can\'t promote team viewer to member and demote them' } })}`);
  }
});

test('promote team viewer to admin', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    // await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').click();

    /// log in other user
    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/teams`);
    await page1.waitForTimeout(10000);
    await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();

    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible();

    // check team docs are editable for member
    await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    await page1.waitForTimeout(3000);
    const page2Promise = page1.waitForEvent('popup');
    await page1.frameLocator('#sbox-iframe').getByText('test pad').dblclick({ timeout: 5000 });
    const page2 = await page2Promise;

    // check member can't add members or access admin panel
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Invite members')).toBeVisible();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Administration')).toHaveCount(0);
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();

    const dateTimeStamp = new Date();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().fill(`hello at ${dateTimeStamp}`);
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().press('Enter');

    await page2.bringToFront();
    await page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText('test pad').waitFor();
    await expect(page2.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden();
    await page2.close();
    await page1.close();

    await page.reload();
    // await page.waitForTimeout(6000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    // await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText(`hello at ${dateTimeStamp}`)).toBeVisible();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();
    const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3', { exact: true });
    await expect(user).toBeVisible({ timeout: 5000 });
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().click();
    await page.waitForTimeout(2000);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'promote team viewer to admin', status: 'passed', reason: 'Can promote team viewer to admin and demote them' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'promote team viewer to admin', status: 'failed', reason: 'Can\'t promote team viewer to admin and demote them' } })}`);
  }
});

test('promote team viewer to owner', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up').click();
    await page.waitForTimeout(2000);
    await expect(page.frameLocator('#sbox-iframe').getByText(/^Co-owners can modify or delete the team/)).toBeVisible({ timout: 3000 });
    // await page.waitForTimeout(2000);
    await fileActions.okButton.waitFor()
    await fileActions.okButton.click();
    await page.waitForTimeout(2000);

    ///
    // user 2: log in

    const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
    page1 = await context.newPage();
    await page1.goto(`${url}/drive`);
    await page1.waitForTimeout(10000);
    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.click();

    // user 2: team viewer accepts promotion to owner
    await page1.frameLocator('#sbox-iframe').getByText('test-user wants you to be an owner of test team').first().waitFor();
    await page1.frameLocator('#sbox-iframe').getByText('test-user wants you to be an owner of test team').first().click();
    await page.waitForTimeout(2000);
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    await page.waitForTimeout(2000);
    await page1.goto(`${url}/teams`);
    await page1.waitForTimeout(5000);
    await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();

    // user 2: check team docs are editable for new owner
    await page1.waitForTimeout(3000);
    const page2Promise = page1.waitForEvent('popup');
    await page1.frameLocator('#sbox-iframe').getByText('test pad').dblclick({ timeout: 5000 });
    const page2 = await page2Promise;

    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
    const dateTimeStamp = new Date();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().fill(`hello at ${dateTimeStamp}`);
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).first().press('Enter');

    // check member can add members and access admin panel
    await expect(page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first()).toBeVisible();
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Invite members')).toBeVisible();

    await page2.bringToFront();
    await page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText('test pad').waitFor();
    await expect(page2.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden();
    await page2.close();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText(`hello at ${dateTimeStamp}`)).toBeVisible();
    await page.reload();
    // await page.waitForTimeout(6000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    // await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();
    const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3', { exact: true });
    await expect(user).toBeVisible({ timeout: 5000 });
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().click();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last().click();
    await page.waitForTimeout(2000);

    await page1.reload();
    await page1.waitForTimeout(10000);
    await fileActions1.notifications.waitFor();
    await fileActions1.notifications.click();

    if (await page1.frameLocator('#sbox-iframe').getByText('test-user has removed your ownership of test team').count() > 1) {
      await expect(page1.frameLocator('#sbox-iframe').getByText('test-user has removed your ownership of test team').first()).toBeVisible();
      await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
    } else {
      await expect(page1.frameLocator('#sbox-iframe').getByText('test-user has removed your ownership of test team')).toBeVisible();
      if (await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').count() > 1) {
        await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
      } else {
        await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').click();
      }
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'promote team viewer to owner', status: 'passed', reason: 'Can add contact to team as owner and demote them' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'promote team viewer to owner', status: 'failed', reason: 'Can\'t add contact to team as owner and demote them' } })}`);
  }
});

test('add contact to team and contact leaves team', async ({ page, browser }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite', exact: true }).click();

    ///

    const newContext = await browser.newContext({ storageState: 'auth/testuser.json' });
    page1 = await newContext.newPage();
    await page1.goto(`${url}/drive`);
    await page1.waitForTimeout(10000);
    const fileActions1 = new FileActions(page1);
    await fileActions1.notifications.click();

    if (!await page1.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').isVisible({ timeout: 3000 })) {
      // notification about being added to team doesn't display
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'testuser' }).locator('.fa.fa-times').click();
      await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
      await fileActions.okButton.click();
      // await page.waitForTimeout(1800);
      await expect(page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })).toBeHidden({ timeout: 3000 });

      await page1.reload();
      await page1.waitForTimeout(10000);
      await fileActions1.notifications.click();
      if (await page1.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').count() > 1) {
        await page1.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').first().click({ timeout: 3000 });
      } else {
        await page1.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click({ timeout: 3000 });
      }
      await page1.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
    }

    await page1.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click({ timeout: 3000 });
    await page1.waitForTimeout(3000);
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' })).toBeVisible();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor();
    const page2Promise = page1.waitForEvent('popup');
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    const page2 = await page2Promise;

    await page2.waitForTimeout(6000);
    await page2.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page2.waitForTimeout(2000);
    await page2.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    await page2.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();

    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'Leave this team' }).click();
    await expect(page2.frameLocator('#sbox-iframe').getByText(/^If you leave this team you will lose access/)).toBeVisible();
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();

    await page2.waitForTimeout(3000);
    await expect(page2.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toHaveCount(0);

    await expect(page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'testuser' })).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'add contact to team and contact leaves', status: 'passed', reason: 'Can add contact to team and contact can leave team' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'add contact to team and contact leaves', status: 'failed', reason: 'Can\'t add contact to team / contact can\'t leave team' } })}`);
  }
});

test('invite contact to team and cancel', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite', exact: true }).click();
    // await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByText('tetestuser', { exact: true }).waitFor();
    await expect(page.frameLocator('#sbox-iframe').getByText('tetestuser', { exact: true })).toBeVisible();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'testuser' }).locator('.fa.fa-times').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
    await fileActions.okButton.click();
    // await page.waitForTimeout(1800);
    const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('testuser', { exact: true });
    await expect(user).toBeHidden({ timeout: 100000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'invite contact to team - cancel', status: 'passed', reason: 'Can invite contact to team and cancel invite' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'invite contact to team - cancel', status: 'failed', reason: 'Can\'t invite contact to team and cancel invite' } })}`);
  }
});
