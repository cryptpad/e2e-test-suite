const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, mainAccountPassword } = require('../browserstack.config.js')

var fs = require('fs');


let page;
let pageOne;
let browser;
let browserName;


test.beforeEach(async ({  }, testInfo) => {
  
  test.setTimeout(2400000);
  browserName = testInfo.project.name
  if (browserName.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (browserName.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext({ storageState: 'auth/mainuser.json' });
  if (browserName.indexOf('firefox') == -1 ) {
    context.grantPermissions(['clipboard-read', "clipboard-write"]);
  } 
  page = await context.newPage();
  if (browserName.indexOf('firefox') !== -1 ) {
    await page.waitForTimeout(15000)
  } else {
    await page.waitForTimeout(5000)
  }
});


test('sign up and delete account', async ({}) => {
  
  try {

    await page.goto(`${url}/drive`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(15000)
    } else {
      await page.waitForTimeout(5000)
    }

    await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(page).toHaveURL(`${url}`, { timeout: 100000 })
    
    const username = (Math.random() + 1).toString(36).substring(7);
    const password = (Math.random() + 1).toString(36).substring(7);
    console.log(username)
    console.log(password)
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password', {exact: true}).fill(password);
    await page.getByPlaceholder('Confirm your password', {exact: true}).fill(password);
    const register = page.locator("[id='register']")
    await register.waitFor()

    if (await page.locator('#userForm span').nth(2).isVisible()) {
      await page.locator('#userForm span').nth(2).click()
    }
    await register.click()
 
    const modal = page.getByText('Warning');
    await expect(modal).toBeVisible({ timeout: 180000 });
    if (await modal.isVisible({ timeout: 180000 })) {
      await page.getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
    }
    const hashing = page.getByText('Hashing your password')
    await expect(hashing).toBeVisible({ timeout: 200000 })

    await page.waitForTimeout(20000)

    await expect(page).toHaveURL(`${url}/drive/#`)
    await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(password);
    await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
    await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

    await page1.waitForTimeout(5000)
    const text = await page.frameLocator('#sbox-iframe').locator('#cp-loading-message').textContent()
    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-loading-message')).toHaveText('This account was deleted by its owner')

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'sign up and delete account', status: 'passed',reason: 'Can sign up and delete account'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'sign up and delete account', status: 'failed',reason: 'Can\'t sign up and delete account'}})}`);
  }  

})

test(' can change password', async ({ }) => {

  try {

    await page.goto(`${url}/drive`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(15000)
    } else {
      await page.waitForTimeout(5000)
    }

    await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

    //change password
    await page1.frameLocator('#sbox-iframe').getByText('Security & Privacy').click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(mainAccountPassword);
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).fill('password');
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').fill('password');
    await page.waitForTimeout(5000)
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Change password' }).click();
    await page1.waitForTimeout(3000)
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).waitFor()
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(30000)
    } else {
      await page.waitForTimeout(15000)
    }
    if (await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).isVisible()) {
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill('password');
      await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).click();
      await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).fill(mainAccountPassword);
      await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').click();
      await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').fill(mainAccountPassword);
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Change password' }).click();

      await page1.waitForTimeout(3000)
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).waitFor()
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
      if (browserName.indexOf('firefox') !== -1 ) {
        await page1.waitForTimeout(30000)
      } else {
        await page1.waitForTimeout(15000)
      }
    } else {
      await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()
      await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log in$/ }).click()
      await page1.getByPlaceholder('Username').fill('test-user');
      await page1.waitForTimeout(10000)
      await page1.getByPlaceholder('Password', {exact: true}).fill('password');
      const login = page1.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      await page1.waitForTimeout(5000)
      if (await login.isVisible()) {
        await login.click()
      }
      await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()
      await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
      const pagePromise = page.waitForEvent('popup')
      await page.frameLocator('#sbox-iframe').getByText('Settings').click()
      const page1 = await pagePromise
      await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

      //change password
      await page1.frameLocator('#sbox-iframe').getByText('Security & Privacy').click();
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill('password');
      await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).click();
      await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).fill(mainAccountPassword);
      await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').click();
      await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').fill(mainAccountPassword);
      await page.waitForTimeout(5000)
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Change password' }).click();
      await page1.waitForTimeout(3000)
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).waitFor()
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
      if (browserName.indexOf('firefox') !== -1 ) {
        await page.waitForTimeout(30000)
      } else {
        await page.waitForTimeout(15000)
      }
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' change password', status: 'failed',reason: 'Can\'t change password'}})}`);

    }
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' change password', status: 'passed',reason: 'Can change password'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' change password', status: 'failed',reason: 'Can\'t change password'}})}`);
  }  

});


test('can change display name', async ({ }) => {

  try {

    await page.goto(`${url}/drive`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(15000)
    } else {
      await page.waitForTimeout(5000)
    }

    await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').click();
    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').fill('test-user-new');
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Display nameSave$/ }).getByRole('button', { name: 'Save' }).click();
    await page1.goto(`${url}/settings/#account`);
    await page1.frameLocator('#sbox-iframe').getByAltText('User menu').click()

    await expect(page1.frameLocator('#sbox-iframe').getByText('Display name: test-user-new')).toBeVisible();

    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').click();
    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').fill('test-user');
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Display nameSave$/ }).getByRole('button', { name: 'Save' }).click();
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change display name', status: 'passed',reason: 'Can change display name'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change display name', status: 'failed',reason: 'Can\'t change display name'}})}`);
  }  

});


test(' can access public signing key', async ({ }) => {

  try {

    await page.goto(`${url}/drive`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(15000)
    } else {
      await page.waitForTimeout(5000)
    }

    await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

    const key = await page1.frameLocator('#sbox-iframe').getByRole('textbox').first().inputValue()

    if (url.toString() === 'https://freemium.cryptpad.fr') {
      if (key.indexOf('test-user@freemium.cryptpad.fr') !== -1 ) {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' can access public signing key', status: 'passed',reason: 'Can access public signing key'}})}`);
      } else {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' can access public signing key', status: 'failed',reason: 'Can\'t access public signing key'}})}`);
      }

    } else {
      if (key.indexOf('test-user@cryptpad.fr') !== -1 ) {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' can access public signing key', status: 'passed',reason: 'Can access public signing key'}})}`);
      } else {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' can access public signing key', status: 'failed',reason: 'Can\'t access public signing key'}})}`);
      }

    }
    
       
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' can access public signing key', status: 'failed',reason: 'Can\'t access public signing key'}})}`);
  } 

});

test('add other user as contact and decline request - (FF clipboard incompatibility)', async ({ }) => {

  try {
    
    test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')
    
    //user 2: log in
    const context = await browser.newContext({ storageState: 'auth/testuser2.json' });
    if (browserName.indexOf('firefox') == -1 ) {
      context.grantPermissions(['clipboard-read', "clipboard-write"]);
    } 
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/profile`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await pageOne.waitForTimeout(15000)
    } else {
      await pageOne.waitForTimeout(5000)
    }
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    const testuser2ProfileLink = await pageOne.evaluate("navigator.clipboard.readText()");
    
    await page.goto(`${testuser2ProfileLink}`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(15000)
    } else {
      await page.waitForTimeout(5000)
    }
    
    //user 1: send user request to user 2 
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()

    //user 2: decline contact request
    await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Decline' }).waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Decline' }).click();
    await pageOne.close()
    ////

    //user 1: be notified of declined request
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
    await page.waitForTimeout(5000)
    if (await page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request').isHidden()) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
      await page.waitForTimeout(5000)
    }
    await page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request').waitFor()
    await expect(page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request')).toBeVisible();

       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' add and remove other user as contact', status: 'passed',reason: 'Can add and remove other user as contact'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' add and remove other user as contact - (FF clipboard incompatibility)', status: 'failed',reason: 'Can\'t add and remove other user as contact - (FF clipboard incompatibility)'}})}`);
  } 

});

test(' add and remove other user as contact - (FF clipboard incompatibility)', async ({ }) => {

  try {
    test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

    //user 2: log in
    const context = await browser.newContext({ storageState: 'auth/testuser2.json' });
    if (browserName.indexOf('firefox') == -1 ) {
     context.grantPermissions(['clipboard-read', "clipboard-write"]);
    } 
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/profile`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await pageOne.waitForTimeout(15000)
    } else {
      await pageOne.waitForTimeout(5000)
    }
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    const testuser2ProfileLink = await pageOne.evaluate("navigator.clipboard.readText()");
    
    await page.goto(`${testuser2ProfileLink}`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(15000)
    } else {
      await page.waitForTimeout(5000)
    }
    
    //user 1: send user request to user 2 
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()

    //user 2: accept contact request
    await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
    await pageOne.waitForTimeout(5000)

    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    await pageOne.close()
    ////

    //user 1: remove contact
    await page.goto(`${url}/drive/`)
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
    await page.waitForTimeout(5000)
    if (await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').isHidden()) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
      await page.waitForTimeout(5000)
    }
    await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').waitFor()
    await expect(page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request')).toBeVisible();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: 'test-user2 accepted your contact request' }).locator('div').nth(1).click()
    await page.goto(`${testuser2ProfileLink}`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to remove test-user2 from your contacts?')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' add and remove other user as contact', status: 'passed',reason: 'Can add and remove other user as contact'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' add and remove other user as contact - (FF clipboard incompatibility)', status: 'failed',reason: 'Can\'t add and remove other user as contact - (FF clipboard incompatibility)'}})}`);
  } 

});


test('request and cancel to add user as contact - (FF clipboard incompatibility)', async ({ }) => {

  try {

    test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

    //user 2: log in
    const context = await browser.newContext({ storageState: 'auth/testuser2.json' });
    if (browserName.indexOf('firefox') == -1 ) {
     context.grantPermissions(['clipboard-read', "clipboard-write"]);
    } 
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/profile`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await pageOne.waitForTimeout(15000)
    } else {
      await pageOne.waitForTimeout(5000)
    }
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    const testuser2ProfileLink = await pageOne.evaluate("navigator.clipboard.readText()");
    
    await page.goto(`${testuser2ProfileLink}`)
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(15000)
    } else {
      await page.waitForTimeout(5000)
    }
    
    //user 1: send user request to user 2 
    if ( await page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel').count() === 1) {
      await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Cancel'}).click();
      await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to cancel your contact request with test-user2?')).toBeVisible();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    }

    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()
    
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Cancel'}).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to cancel your contact request with test-user2?')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'})).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' request and cancel to add user as contact', status: 'passed',reason: 'Can request to add user as contact and cancel request'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' request and cancel to add user as contact - (FF clipboard incompatibility)', status: 'failed',reason: 'Can\'t request to add user as contact and cancel request - (FF clipboard incompatibility)'}})}`);
  }  

});


test('chat with contacts and erase message history - THIS TEST WILL FAIL', async ({ }) => {

  try {

    //user 1: send message

    await page.goto(`${url}/contacts/`);
    if (browserName.indexOf('firefox') !== -1 ) {
      await page.waitForTimeout(15000)
    } else {
      await page.waitForTimeout(5000)
    }
    await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('testuser').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill('hello');
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');

    ///
    //user 2: log in 
    const context = await browser.newContext({ storageState: 'auth/testuser.json' });
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/contacts/`);
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('test-user').waitFor({timeout: 10000});
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('test-user').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('hello')).toBeVisible()
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill('hello to you too!');
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');
    ////

    //user 1: view user 2's message and erase message history
    await expect(page.frameLocator('#sbox-iframe').getByText('hello to you too!')).toBeVisible()
    await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-messaging div').filter({ hasText: /^tetestuser$/ }).locator('span').nth(4).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('hello')).toHaveCount(0)
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('hello')).toHaveCount(0)
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'chat with contacts and erase message history', status: 'passed',reason: 'Can chat with contacts and erase chat history '}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'chat with contacts and erase message history - THIS TEST WILL FAIL', status: 'failed',reason: 'Can\'t chat with contacts and erase chat history - THIS TEST WILL FAIL'}})}`);
  }  

});


test.afterEach(async () => {
  await browser.close()
});

