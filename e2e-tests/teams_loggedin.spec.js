const { test, url, mainAccountPassword, titleDate } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./test-pages.spec.js');

var fs = require('fs');
var unzipper = require('unzipper')

let pageOne;
let isMobile;
let browserName;
let cleanUp
let browserstackMobile;

test.beforeEach(async ({ page }, testInfo) => {

  test.setTimeout(210000)

  isMobile = testInfo.project.use['isMobile']  
  browserName = testInfo.project.name.split(/@/)[0]
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/)

  if (isMobile) {
    await page.goto(`${url}/login`)
    await page.getByPlaceholder('Username').fill('test-user');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill(mainAccountPassword);
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    await page.waitForTimeout(5000)
    if (await login.isVisible()) {
      await login.click()
    }
    await page.waitForTimeout(10000)
  }
  await page.goto(`${url}/teams`)
  await page.waitForTimeout(10000)

});

test('user menu - make and delete team', async ({ page }) => {

  test.skip(browserName === 'edge', 'microsoft edge incompatibility')
  
  try {

    await page.frameLocator('#sbox-iframe').getByText('Available team slotNew').first().click();

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example team')
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(10000)
    await expect(page).toHaveURL(`${url}/teams/`, { timeout: 100000 })

    await page.frameLocator('#sbox-iframe').getByText('example team').first().waitFor({ timeout: 10000 })
    await page.frameLocator('#sbox-iframe').getByText('example team').first().click()
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-leftside').hover();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(5000)
    await expect(page.frameLocator('#sbox-iframe').getByText('example team', { exact: true })).toHaveCount(0)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'make team' , status: 'passed',reason: 'Can create a team'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'make team', status: 'failed',reason: 'Can\'t create a team'}})}`);

  }  
});


test('can change team name', async ({ page }) => {

  test.skip(browserName === 'edge', 'microsoft edge incompatibility')

  try {

    //access team admin panel
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000)
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({timeout:3000});

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    //change team name
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('example team');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(5000)
    await page.reload()
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('example team').waitFor()
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('example team').click();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    //change team name back
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('test team');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByText('test team').toBeVisible()
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change team name', status: 'passed',reason: 'Can change team name'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change team name', status: 'failed',reason: 'Can\'t change team name'}})}`);

  }  
});


test(' can access team public signing key', async ({ page }) => {

  test.skip(browserName === 'edge', 'microsoft edge incompatibility')

  try {
    
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000)
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({timeout:3000});

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    const key = await page.frameLocator('#sbox-iframe').getByRole('textbox').first().inputValue()
    console.log(url)
    if (url === 'https://freemium.cryptpad.fr') {
      if (key.indexOf('test team@freemium.cryptpad.fr/') !== -1) {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'access team public signing key', status: 'passed',reason: 'Can access team public signing key'}})}`);

      } else {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'access team public signing key', status: 'failed',reason: 'Can\'t access team public signing key'}})}`);

      }
    } else  {
      if (key.indexOf('test team@cryptpad.fr/') !== -1) {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'access team public signing key', status: 'passed',reason: 'Can access team public signing key'}})}`);
      } else {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'access team public signing key', status: 'failed',reason: 'Can\'t access team public signing key'}})}`);
    }
  }


  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'access team public signing key', status: 'failed',reason: 'Can\'t access team public signing key'}})}`);

  }  
});

test('change team avatar', async ({ page }) => {

  test.skip(browserName === 'edge', 'microsoft edge incompatibility')
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility')

  try {

    //access team administration panel
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000)
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({timeout:3000});
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    //upload new avatar
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Upload a new avatar' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/teamavatar.png');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(10000)
    await page.goto(`${url}/teams`)
    await page.waitForTimeout(20000)
    await expect(page).toHaveScreenshot('team-avatar.png', { maxDiffPixels: 100 });

    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    //change avatar back to original
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Upload a new avatar' }).click();
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles('testdocuments/teamavatar-empty.png');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(5000)
    await page.goto(`${url}/teams`)
    await page.waitForTimeout(20000)
    await expect(page).toHaveScreenshot('blank-avatar.png', { maxDiffPixels: 100 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change team avatar', status: 'passed',reason: 'Can change team avatar'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change team avatar', status: 'failed',reason: 'Can\'t change team avatar' }})}`);


  }  
});

  test('can download team drive', async ({ page }) => {

    test.skip(browserName === 'edge', 'microsoft edge incompatibility')
    test.skip(browserstackMobile, 'browserstack mobile download incompatibility')

    try {
      
      //access administration panel
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()
      await page.frameLocator('#sbox-iframe').getByText('Administration').click();

      //download drive
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Download' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
      await page.waitForTimeout(10000)
      const downloadPromise = page.waitForEvent('download');
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Download' }).click();
      const download = await downloadPromise;
  
      await download.saveAs('/tmp/myteamdrivecontents.zip');
  
      await expect(page.frameLocator('#sbox-iframe').getByText('Your download is ready!')).toBeVisible();
  
      //verify contents
      const expectedFiles = ["Drive/", "Drive/test code.md", "Drive/test form.json", "Drive/test kanban.json", "Drive/test pad.html", "Drive/test markdown.md", "Drive/test sheet.xlsx", "Drive/test whiteboard.png", "Drive/test diagram.drawio"]

      const actualFiles = []

      async function unzipDownload() {
        return new Promise((resolve) => {
          fs.createReadStream('/tmp/myteamdrivecontents.zip')
          .pipe(unzipper.Parse())
          .on('entry', function (entry) {
            var fileName = entry.path;
            actualFiles.push(fileName)
            // console.log(fileName)
          })
          .on('finish', resolve)
        });
      }

      async function compareFiles() {
        const result = await unzipDownload();
        let checker = (arr, target) => target.every(v => arr.includes(v));
        let check = checker(actualFiles, expectedFiles)

        if (check) {
        
          return true
        } else {
        return false}
      }


  
      if (compareFiles()) {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'can download team drive', status: 'passed',reason: 'Can download team drive contents'}})}`);
      } else {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'can download team drive ', status: 'failed',reason: 'Can\'t download team drive contents'}})}`);
      }
  
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'can download team drive', status: 'failed',reason: 'Can\'t download team drive contents'}})}`);
  
    }  
  });

  test('add contact to team as viewer and remove them', async ({ page, browser }) => {

    test.skip(browserName === 'edge', 'microsoft edge incompatibility')

    try {

      cleanUp = new Cleanup(page);
      await cleanUp.cleanTeamMembership();
  
      //invite contact to team
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
      await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()
  
      //login as other user
      const context = await browser.newContext({ storageState: 'auth/testuser.json' });
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/drive`);
      await pageOne.waitForTimeout(10000)
  
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
  
      if (!await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').isVisible({timeout: 3000})) {
  
        //notification about being added to team doesn't display - re-add contact
        await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'}).locator('.fa.fa-times').click();
        await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
        await page.waitForTimeout(1800)
        await expect(page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('testuser').getByText('testuser', { exact: true })).toBeHidden({ timeout: 3000 })
  
        await pageOne.reload()
        await pageOne.waitForTimeout(10000)
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
        if (await pageOne.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').count() > 1) {
          await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').first()).toBeVisible()
          await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
        } else {
          await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team')).toBeVisible()
          if (await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').count() > 1) {
            await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
          } else {
            await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').click();
          }
        }
      
      }
  
      //contact accepts team invitation
      await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click({timeout: 3000});
      await pageOne.waitForTimeout(3000)
      await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' })).toBeVisible()
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
      const page2Promise = pageOne.waitForEvent('popup')
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
      const pageTwo = await page2Promise
      await pageTwo.waitForTimeout(5000)
  
      await page.reload()
      await page.waitForTimeout(10000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
  
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await expect(page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('testuser', { exact: true })).toBeVisible({ timeout: 100000 })
      
  
      await expect(pageTwo.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()
      await pageTwo.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
  
      await pageTwo.waitForTimeout(5000)
      const page3Promise = pageTwo.waitForEvent('popup')
      await pageTwo.frameLocator('#sbox-iframe').getByText('test pad').dblclick({timeout:5000})
      const pageThree = await page3Promise
  
      //check viewer can't add members or access admin panel
      await pageTwo.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await expect(pageTwo.frameLocator('#sbox-iframe').getByText('Invite members')).toBeHidden()
      await expect(pageTwo.frameLocator('#sbox-iframe').getByText('Administration')).toBeHidden()
      //check team docs are read only for viewer
      await pageThree.waitForTimeout(7000)
      await pageThree.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText('test pad').waitFor()
      await expect(pageThree.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible()
      await pageThree.close()
  
      await pageTwo.close()
      await page.bringToFront()
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'}).locator('.fa.fa-times').click();
      await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.waitForTimeout(1800)
      await expect(page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('testuser')).toBeHidden({ timeout: 3000 })
      await page.close()
  
      await pageOne.reload()
      await pageOne.waitForTimeout(10000)
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').waitFor()
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
  
      if (await pageOne.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').count() > 1) {
        await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').first()).toBeVisible()
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
      } else {
        await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team')).toBeVisible()
        if (await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').count() > 1) {
          await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
        } else {
          await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').click();
        }
      }
         
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add contact to team as viewer and remove them', status: 'passed',reason: 'Can add contact to team as viewer and remove them'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add contact to team as viewer and remove them', status: 'failed',reason: 'Can\'t add contact to team as viewer and remove them'}})}`);
  
    } 
  });
  
  
  test('promote team viewer to member', async ({ page, browser }) => {

    test.skip(browserName === 'edge', 'microsoft edge incompatibility')
  
    try {

      cleanUp = new Cleanup(page);
      await cleanUp.cleanTeamMembership();

      //promote viewer to member
      await page.waitForTimeout(8000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').waitFor();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').click();
      await page.waitForTimeout(5000)

      ///log in other user
      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/teams`)
      await pageOne.waitForTimeout(10000)
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor()
      await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()
  
      //check team docs are editable for member
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
      await pageOne.waitForTimeout(5000)
      await pageOne.waitForTimeout(3000)
      const page2Promise = pageOne.waitForEvent('popup')
      await pageOne.frameLocator('#sbox-iframe').getByText('test pad').dblclick({timeout:5000})
      const pageTwo = await page2Promise
  
      //check member can't add members or access admin panel
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Invite members')).toBeHidden()
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Administration')).toHaveCount(0)

      //check member can send team messages
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
      const dateTimeStamp = new Date()
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill(`hello at ${dateTimeStamp}`);
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');
  
      //check member can edit team docs
      await pageTwo.bringToFront()
      await pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText('test pad').waitFor()
      await expect(pageTwo.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden()
      await pageTwo.close()
      await pageOne.close()
  
      await page.reload()
      await page.waitForTimeout(6000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
  
      //check messages sent by member are visible to team
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
      await expect(page.frameLocator('#sbox-iframe').getByText(`hello at ${dateTimeStamp}`)).toBeVisible()    
  
      //demote member back to viewer
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3', {exact: true})
      await expect(user).toBeVisible({ timeout: 5000 })
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').waitFor()
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').click({ timeout: 5000 });
      await page.waitForTimeout(5000)
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to member', status: 'passed',reason: 'Can promote team viewer to member and demote them'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to member', status: 'failed',reason: 'Can\'t promote team viewer to member and demote them- (EDGE) THIS TEST WILL FAIL'}})}`);
  
    }  
  
  });
    
    
  test('promote team viewer to admin', async ({ page, browser }) => {

    test.skip(browserName === 'edge', 'microsoft edge incompatibility')
  
    try {

      cleanUp = new Cleanup(page);
      await cleanUp.cleanTeamMembership();
      
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').click();
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').click();
  
      ///log in other user
      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/teams`)
      await pageOne.waitForTimeout(10000)
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor()

      await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()
  
      //check team docs are editable for member
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
      await pageOne.waitForTimeout(3000)
      const page2Promise = pageOne.waitForEvent('popup')
      await pageOne.frameLocator('#sbox-iframe').getByText('test pad').dblclick({timeout:5000})
      const pageTwo = await page2Promise
  
      //check member can't add members or access admin panel
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Invite members')).toBeVisible()
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Administration')).toHaveCount(0)
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
  
      const dateTimeStamp = new Date()
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill(`hello at ${dateTimeStamp}`);
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');
  
      await pageTwo.bringToFront()
      await pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText('test pad').waitFor()
      await expect(pageTwo.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden()
      await pageTwo.close()
      await pageOne.close()
  
      await page.reload()
      await page.waitForTimeout(6000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
  
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
      await expect(page.frameLocator('#sbox-iframe').getByText(`hello at ${dateTimeStamp}`)).toBeVisible()    
  
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3', {exact: true})
      await expect(user).toBeVisible({ timeout: 5000 })
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
      
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to admin', status: 'passed',reason: 'Can promote team viewer to admin and demote them'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to admin', status: 'failed',reason: 'Can\'t promote team viewer to admin and demote them'}})}`);
  
    }  
  });
    
  test('promote team viewer to owner', async ({ page, browser }) => {

    test.skip(browserName === 'edge', 'microsoft edge incompatibility')

    try {

      cleanUp = new Cleanup(page);
      await cleanUp.cleanTeamMembership();

      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').click();
      await page.waitForTimeout(4000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').click();
      await page.waitForTimeout(4000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-up').click();
      await page.waitForTimeout(4000)
      await expect(page.frameLocator('#sbox-iframe').getByText(/^Co-owners can modify or delete the team/)).toBeVisible({timout: 3000})
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.waitForTimeout(2000)
  
      ///
      //user 2: log in
  
      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/drive`);
      await pageOne.waitForTimeout(10000)
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
  
      //user 2: team viewer accepts promotion to owner
      await pageOne.frameLocator('#sbox-iframe').getByText('test-user wants you to be an owner of test team').first().waitFor()
      await pageOne.frameLocator('#sbox-iframe').getByText('test-user wants you to be an owner of test team').first().click();
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
      await pageOne.goto(`${url}/teams`);
      await pageOne.waitForTimeout(5000)
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
      
      //user 2: check team docs are editable for new owner
      await pageOne.waitForTimeout(3000)
      const page2Promise = pageOne.waitForEvent('popup')
      await pageOne.frameLocator('#sbox-iframe').getByText('test pad').dblclick({timeout:5000})
      const pageTwo = await page2Promise

      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
      const dateTimeStamp = new Date()
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill(`hello at ${dateTimeStamp}`);
      await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');
  
      //check member can add members and access admin panel
      await expect(pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first()).toBeVisible()
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Invite members')).toBeVisible()
    
      await pageTwo.bringToFront()
      await pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText('test pad').waitFor()
      await expect(pageTwo.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden()
      await pageTwo.close()
      
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
      await expect(page.frameLocator('#sbox-iframe').getByText(`hello at ${dateTimeStamp}`)).toBeVisible()    
      await page.reload()
      await page.waitForTimeout(6000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
  
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3', {exact: true})
      await expect(user).toBeVisible({ timeout: 5000 })
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
  
      await pageOne.reload()
      await pageOne.waitForTimeout(10000)
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').waitFor()
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
  
      if (await pageOne.frameLocator('#sbox-iframe').getByText('test-user has removed your ownership of test team').count() > 1) {
        await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user has removed your ownership of test team').first()).toBeVisible()
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
      } else {
        await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user has removed your ownership of test team')).toBeVisible()
        if (await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').count() > 1) {
          await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
        } else {
          await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').click();
        }
      }
  
          
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to owner', status: 'passed',reason: 'Can add contact to team as owner and demote them'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to owner', status: 'failed',reason: 'Can\'t add contact to team as owner and demote them'}})}`);
  
    }  
  });
    
    
  test('add contact to team and contact leaves team', async ({ page, browser }) => {

    test.skip(browserName === 'edge', 'microsoft edge incompatibility')

    try {
 
      cleanUp = new Cleanup(page);
      await cleanUp.cleanTeamMembership();
  
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
      await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()
  
      ///
  
      const newContext = await browser.newContext({ storageState: 'auth/testuser.json' });
      pageOne = await newContext.newPage();
      await pageOne.goto(`${url}/drive`);
      await pageOne.waitForTimeout(10000)
  
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
  
  
      if (!await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').isVisible({timeout: 3000})) {
  
        //notification about being added to team doesn't display
        await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'}).locator('.fa.fa-times').click();
        await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
        await page.waitForTimeout(1800)
        await expect(page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })).toBeHidden({ timeout: 3000 })
  
        await pageOne.reload()
        await pageOne.waitForTimeout(10000)
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
        if (await pageOne.frameLocator('#sbox-iframe').getByText('test-user has kicked you from the team: test team').count() > 1) {
          await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').first().click({timeout: 3000});
  
        } else {
          await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click({timeout: 3000});
  
        }
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-notification-dismiss').first().click();
  
      }
  
      await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click({timeout: 3000});
      await pageOne.waitForTimeout(3000)
      await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' })).toBeVisible()
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
      const page2Promise = pageOne.waitForEvent('popup')
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
      const pageTwo = await page2Promise
  
      await pageTwo.waitForTimeout(6000)
      await pageTwo.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await pageTwo.waitForTimeout(2000)
      await pageTwo.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
      await pageTwo.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
  
      await pageTwo.frameLocator('#sbox-iframe').getByRole('button', { name: 'Leave this team' }).click();
      await expect(pageTwo.frameLocator('#sbox-iframe').getByText(/^If you leave this team you will lose access/)).toBeVisible()
      await pageTwo.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
  
      await pageTwo.waitForTimeout(3000)
      await expect(pageTwo.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toHaveCount(0)
  
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'})).toHaveCount(0)
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add contact to team and contact leaves', status: 'passed',reason: 'Can add contact to team and contact can leave team'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add contact to team and contact leaves', status: 'failed',reason: 'Can\'t add contact to team / contact can\'t leave team'}})}`);
  
    }  
  });
  


test('invite contact to team and cancel', async ({ page }) => {

  test.skip(browserName === 'edge', 'microsoft edge incompatibility')
    
  try {

    cleanUp = new Cleanup(page);
    await cleanUp.cleanTeamMembership();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByText('tetestuser', { exact: true }).waitFor()
    await expect(page.frameLocator('#sbox-iframe').getByText('tetestuser', { exact: true })).toBeVisible();
    await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'}).locator('.fa.fa-times').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(1800)
    const user = page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })
    await expect(user).toBeHidden({ timeout: 100000 })

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'invite contact to team - cancel', status: 'passed',reason: 'Can invite contact to team and cancel invite'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'invite contact to team - cancel', status: 'failed',reason: 'Can\'t invite contact to team and cancel invite'}})}`);

  }   
});

