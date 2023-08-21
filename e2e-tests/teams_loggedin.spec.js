const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url } = require('../browserstack.config.js')

var fs = require('fs');
var unzipper = require('unzipper');

let page;
let pageOne;
let browser;


test.beforeEach(async ({  }, testInfo) => {
  
  test.setTimeout(2400000);
  const name = testInfo.project.name
  console.log(name)
  if (name.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (name.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  page = await browser.newPage();
  await page.goto(`${url}/teams`)
  await page.waitForTimeout(5000)
});


test('drive -  user menu - make and delete team ', async ({ }) => {
  
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

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'passed',reason: 'Can navigate to Drive as user and create a team'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'failed',reason: 'Can\'t navigate to Drive as user and create a team'}})}`);

  }  
});

test(' chat with team member', async ({ }) => {


  try {

    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team', { exact: true }).click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3')).toBeVisible()
    await page.frameLocator('#sbox-iframe').locator('.cp-online > span').first().click();

    ///

    pageOne = await browser.newPage();
    await pageOne.goto(`${url}/drive`);
    const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
    await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()
    await pageOne.getByRole('link', { name: 'Log in' }).click()
    await expect(pageOne).toHaveURL(`${url}/login/`)
    await pageOne.getByPlaceholder('Username').fill('test-user3');
    await pageOne.waitForTimeout(10000)
    await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
    const login = pageOne.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await pageOne.waitForTimeout(10000)

    await pageOne.goto(`${url}/teams`)
    await pageOne.waitForTimeout(5000)
    await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-leftside div').filter({ hasText: /^Chat$/ }).locator('span').first().click();

    const dateTimeStamp = new Date()
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill(`hello at ${dateTimeStamp}`);
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');
    ////

    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-leftside div').filter({ hasText: /^Chat$/ }).locator('span').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText(`hello at ${dateTimeStamp}`)).toBeVisible()
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill(`hello to you too at ${dateTimeStamp}!`);
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');
    await expect(pageOne.frameLocator('#sbox-iframe').getByText(`hello to you too at ${dateTimeStamp}!`)).toBeVisible()
    await pageOne.close()

    
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    await page.frameLocator('#sbox-iframe').locator('.cp-online > span:nth-child(2)').first().click();

    await page.waitForTimeout(1000)
    
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'chat with team member', status: 'passed',reason: 'Can chat with team member'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'chat with team member', status: 'failed',reason: 'Can\'t chat with team member'}})}`);

  }  
});


test(' add contact to team as viewer and remove them', async ({ }) => {


  try {

    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)    
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()

    ///
    pageOne = await browser.newPage();
    await pageOne.goto(`${url}/drive`);
    const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
    await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()
    await pageOne.getByRole('link', { name: 'Log in' }).click()
    await expect(pageOne).toHaveURL(`${url}/login/`)
    await pageOne.getByPlaceholder('Username').fill('testuser');
    await pageOne.waitForTimeout(10000)
    await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
    const login = pageOne.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await pageOne.waitForTimeout(10000)

    const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container')
    await notifsOne.waitFor({ timeout: 100000 })
    await notifsOne.click()
    await pageOne.waitForTimeout(5000)

    await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click();
    await pageOne.waitForTimeout(3000)
    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' })).toBeVisible()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    await pageOne.waitForTimeout(5000)
    await pageOne.goto(`${url}/teams`)
    await pageOne.waitForTimeout(5000)
    await pageOne.reload()
    await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()

    //check team docs are read only for viewer
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
    await pageOne.waitForTimeout(3000)
    await pageOne.frameLocator('#sbox-iframe').getByText('example document').waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByText('example document').click()
    await pageOne.waitForTimeout(5000)
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible()


    //check viewer can't add members or access admin panel
    await pageOne.goto(`${url}/teams`)
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Invite members')).toHaveCount(0)
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Administration')).toHaveCount(0)

    await pageOne.close()
    ////


    await page.reload()
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)    
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    const user = page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })
    await expect(user).toBeVisible({ timeout: 100000 })
    await page.frameLocator('#sbox-iframe').locator('div:nth-child(2) > .cp-online > span:nth-child(2)').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(1800)
    
    await expect(user).toBeHidden({ timeout: 100000 })

       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add contact to team as viewer and remove them', status: 'passed',reason: 'Can add contact to team as viewer and remove them'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add contact to team as viewer and remove them', status: 'failed',reason: 'Can\'t add contact to team as viewer and remove them'}})}`);

  }  
});



test(' promote team viewer to member', async ({  }) => {


    try {
      
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
      
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').click({force: true});
  
      await page.waitForTimeout(2000)
  
  
      ///log in other user
      pageOne = await browser.newPage()
      await pageOne.goto(`${url}/drive`);
      const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
      await menu.waitFor()
      await menu.click()
      await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
      await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
      await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()
      await pageOne.getByRole('link', { name: 'Log in' }).click()
      await expect(pageOne).toHaveURL(`${url}/login/`)
      await pageOne.getByPlaceholder('Username').fill('test-user3');
      await pageOne.waitForTimeout(5000)
      await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
      const login = pageOne.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
        await login.click()
      }
      await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
      await pageOne.waitForTimeout(5000)
      await pageOne.goto(`${url}/teams`)
      await pageOne.waitForTimeout(5000)
      await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()
  
      //check team docs are editable for member
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
      await pageOne.waitForTimeout(3000)
      await pageOne.frameLocator('#sbox-iframe').getByText('example document').waitFor()
      await pageOne.frameLocator('#sbox-iframe').getByText('example document').click()
      await pageOne.waitForTimeout(5000)
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Read only')).toHaveCount(0)
  
  
      //check member can't add members or access admin panel
      await pageOne.goto(`${url}/teams`)
      await pageOne.waitForTimeout(5000)
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Invite members')).toHaveCount(0)
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Administration')).toHaveCount(0)
      await pageOne.close()
      ////
  
  
      await page.reload()
      await page.waitForTimeout(10000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
  
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3')
      await expect(user).toBeVisible({ timeout: 100000 })
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
         
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to member', status: 'passed',reason: 'Can promote team viewer to member'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to member', status: 'failed',reason: 'Can\'t promote team viewer to member'}})}`);
  
    }  
  });
  
  
test(' promote team viewer to admin', async ({ }) => {


  try {
    
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000)
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
    
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').click({force: true});
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').waitFor();
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').click({force: true});

    await page.waitForTimeout(2000)


    ///
    pageOne = await browser.newPage();
    await pageOne.goto(`${url}/drive`);
    const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
    await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()
    await pageOne.getByRole('link', { name: 'Log in' }).click()
    await expect(pageOne).toHaveURL(`${url}/login/`)
    await pageOne.getByPlaceholder('Username').fill('test-user3');
    await pageOne.waitForTimeout(5000)
    await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
    const login = pageOne.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await pageOne.waitForTimeout(5000)
    await pageOne.goto(`${url}/teams`)
    await pageOne.waitForTimeout(5000)
    await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()

    //check team docs are editable for admin
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
    await pageOne.waitForTimeout(3000)
    await pageOne.frameLocator('#sbox-iframe').getByText('example document').waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByText('example document').click()
    await pageOne.waitForTimeout(5000)
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Read only')).toHaveCount(0)


    //check admin can add members and access admin panel
    await pageOne.goto(`${url}/teams`)
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    if (await pageOne.frameLocator('#sbox-iframe').getByText('Invite members').count() === 0) {
      console.log('hello')
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').click({force: true});
      await pageOne.waitForTimeout(5000)
      console.log('hello 2')

    }
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Invite members')).toBeVisible()
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Administration')).toHaveCount(0)
    await pageOne.close()
    ////


    await page.reload()
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3')
    await expect(user).toBeVisible({ timeout: 100000 })
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().waitFor();
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().click();
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().waitFor();
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().click();
    await page.waitForTimeout(5000)
        
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to admin', status: 'passed',reason: 'Can promote team viewer to admin and demote them'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to admin', status: 'failed',reason: 'Can\'t promote team viewer to admin and demote them'}})}`);

  }  
});
  
  test(' promote team viewer to owner', async ({ }) => {
  
    try {
        
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
      
      //user 1: team owner promotes viewer to owner
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').click({force: true});
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').click({force: true});
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').click({force: true});
      if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).count() === 0) {
        await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').waitFor();
        await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-up').click({force: true});
      }
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.waitForTimeout(2000)
  
      ///
      //user 2: log in

      pageOne = await browser.newPage();
      await pageOne.goto(`${url}/drive`);
      const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
      await menu.waitFor()
      await menu.click()
      await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
      await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
      await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()
      await pageOne.getByRole('link', { name: 'Log in' }).click()
      await expect(pageOne).toHaveURL(`${url}/login/`)
      await pageOne.getByPlaceholder('Username').fill('test-user3');
      await pageOne.waitForTimeout(5000)
      await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
      const login = pageOne.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
        await login.click()
      }
      await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
      await pageOne.waitForTimeout(5000)
      await pageOne.goto(`${url}/teams`)
      await pageOne.waitForTimeout(5000)
      await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()
      const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container')
      await notifsOne.click()

      //user 2: team viewer accepts promotion to owner
      await pageOne.frameLocator('#sbox-iframe').getByText('test-user wants you to be an owner').waitFor()
      await pageOne.frameLocator('#sbox-iframe').getByText('test-user wants you to be an owner').click();
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
  
      //user 2: check team docs are editable for new owner
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
      await pageOne.waitForTimeout(3000)
      await pageOne.frameLocator('#sbox-iframe').getByText('example document').waitFor()
      await pageOne.frameLocator('#sbox-iframe').getByText('example document').click()
      await pageOne.waitForTimeout(5000)
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Read only')).toHaveCount(0)
  
      //user 2: check new owner can add members and access admin panel
      await pageOne.goto(`${url}/teams`)
      await pageOne.waitForTimeout(5000)
      await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Invite members')).toBeVisible()
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('Administration')).toBeVisible()
      await pageOne.close()
      ////
  
      //user 1: demotes new owner back to viewer
      await page.reload()
      await page.waitForTimeout(10000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
  
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
      const user = page.frameLocator('#sbox-iframe').locator('#cp-team-roster-container').getByText('test-user3')
      await expect(user).toBeVisible({ timeout: 100000 })
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().waitFor();
      await page.frameLocator('#sbox-iframe').locator('.fa.fa-angle-double-down').last().click();
      await page.waitForTimeout(5000)
         
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to owner', status: 'passed',reason: 'Can add contact to team as owner and demote them'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'promote team viewer to owner', status: 'failed',reason: 'Can\'t add contact to team as owner and demote them'}})}`);
  
    }  
  });
  
  
test(' add contact to team and contact leaves team', async ({  }) => {

  try {
      
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)
    
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()

    ///

    pageOne = await browser.newPage();
    await pageOne.goto(`${url}/drive`);
    const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
    await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()
    await pageOne.getByRole('link', { name: 'Log in' }).click()
    await expect(pageOne).toHaveURL(`${url}/login/`)
    await pageOne.getByPlaceholder('Username').fill('testuser');
    await pageOne.waitForTimeout(10000)
    await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
    const login = pageOne.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await pageOne.goto(`${url}/teams`)
    await pageOne.waitForTimeout(5000)
    await pageOne.reload()
    await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toBeVisible()
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click()
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    await pageOne.frameLocator('#sbox-iframe').getByText('Leave this team').click()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await pageOne.waitForTimeout(5000)
    await expect(pageOne.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team')).toHaveCount(0)
    await pageOne.close()
    ////

    await page.reload()
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)      
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    const user = page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })
    await expect(user).toHaveCount(0)


    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add contact to team', status: 'passed',reason: 'Can add contact to team and contact can leave team'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add contact to team', status: 'failed',reason: 'Can\'t add contact to team / contact can\'t leave team'}})}`);

  }  
});

test(' invite contact to team and cancel', async ({ }) => {
    
  try {

    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)      
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByText('tetestuser', { exact: true }).waitFor()
    await expect(page.frameLocator('#sbox-iframe').getByText('tetestuser', { exact: true })).toBeVisible();
    await page.frameLocator('#sbox-iframe').locator('div:nth-child(11) > .cp-team-roster-member > .cp-online > .fa').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(1800)
    const user = page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })
    await expect(user).toBeHidden({ timeout: 100000 })

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'invite contact to team > remove', status: 'passed',reason: 'Can invite contact to team'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'invite contact to team > remove', status: 'failed',reason: 'Can\'t invite contact to team'}})}`);

  }   
});


test(' can change team name', async ({ }) => {


  try {
    
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)    
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('example team');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(5000)
    await page.reload()
    await page.frameLocator('#sbox-iframe').getByText('example team')
    await page.frameLocator('#sbox-iframe').getByText('et', { exact: true }).click();
    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)    
      await page.frameLocator('#sbox-iframe').getByText('et', { exact: true }).waitFor();
      await page.frameLocator('#sbox-iframe').getByText('et', { exact: true }).click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('test team');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(5000)
    ;
    await page.frameLocator('#sbox-iframe').getByText('test team')
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change team name', status: 'passed',reason: 'Can change team name'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change team name', status: 'failed',reason: 'Can\'t change team name'}})}`);

  }  
});


test(' can access team public signing key', async ({ }) => {


  try {
    
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)    
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    const key = await page.frameLocator('#sbox-iframe').getByRole('textbox').first().inputValue()

    if (key.indexOf('test team@cryptpad.fr/') !== -1) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'access team public signing key', status: 'passed',reason: 'Can access team public signing key'}})}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'access team public signing key', status: 'failed',reason: 'Can\'t access team public signing key'}})}`);

    }

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'access team public signing key', status: 'failed',reason: 'Can\'t access team public signing key'}})}`);

  }  
});

test('change team avatar', async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Upload a new avatar' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/teamavatar.png');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.goto(`${url}/teams`)

    await expect(page).toHaveScreenshot('team-avatar.png');
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Upload a new avatar' }).click();
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles('testdocuments/teamavatar-empty.png');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.goto(`${url}/teams`)
    await expect(page).toHaveScreenshot('blank-avatar.png');

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change team avatar', status: 'passed',reason: 'Can change team avatar'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change team avatar', status: 'failed',reason: 'Can\'t change team avatar'}})}`);


  }  
});

test('can download team drive THIS TEST WILL FAIL - WHITEBOARD FILES DON\'T DOWNLOAD', async ({ }) => {


  try {

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^test team$/ }).click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click()

    await page.frameLocator('#sbox-iframe').getByText('Administration').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Download' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').getByText('Your download is ready!').click();

    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/myteamdrivecontents.zip');

    await expect(page.frameLocator('#sbox-iframe').getByText('Your download is ready!')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'View errors' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('An error occured')).toHaveCount(0);

    const expectedFiles = ["Drive/", "Drive/example code.md", "Drive/example form", "Drive/example kanban.json", "Drive/example pad.html", "Drive/example slides.md", "Drive/example sheet.xlsx", "Drive/example whiteboard.png"]
    let actualFiles = [];

    fs.createReadStream('/tmp/myteamdrivecontents.zip')
    .pipe(unzipper.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      actualFiles.push(fileName)
      console.log(fileName)
    });

    if (actualFiles == expectedFiles) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'can download team drive', status: 'passed',reason: 'Can download team drive contents'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'can download team drive', status: 'failed',reason: 'Can\'t download team drive contents'}})}`);

    }

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'can download team drive', status: 'failed',reason: 'Can\'t download team drive contents'}})}`);

  }  
});

test.afterEach(async ({  }) => {
  await browser.close()
});
