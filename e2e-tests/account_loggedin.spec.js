const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url } = require('../browserstack.config.js')

let browser;
let page;
let pageOne;
let clipboardText;


test.beforeEach(async ({ page }) => {
  test.setTimeout(2400000);
  await page.goto(`${url}/drive`)

});


test('anon - sign up and delete account', async ({}) => {
  
  try {

    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(page).toHaveURL(`${url}`, { timeout: 100000 })
    
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('Username').fill('test-user-4');
    await page.getByPlaceholder('Password', {exact: true}).fill('password');
    await page.getByPlaceholder('Confirm your password', {exact: true}).fill('password');
    const register = page.locator("[id='register']")
    await register.waitFor()

    if (`${url}`.indexOf('cryptpad') !== -1) {
      await page.locator('#userForm span').nth(2).waitFor()
      await page.locator('#userForm span').nth(2).click()
    }
    await register.click()
 
    const modal = page.getByText('Warning');
    await expect(modal).toBeVisible({ timeout: 180000 });
    if (await modal.isVisible({ timeout: 180000 })) {
      await page.getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
    }
    const hashing = page.getByText('Hashing your password')
    const existingUser = page.getByText('This user already exists, do you want to log in?')
    await expect(hashing).toBeVisible({ timeout: 200000 })

    await page.waitForTimeout(20000)

    await page.waitForURL(`${url}/drive`)
    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
    await expect(page1.frameLocator('#sbox-iframe').getByText('Delete your account')).toBeVisible()
    await expect(page1.frameLocator('#sbox-iframe').getByText('Delete your account')).click()
    await expect(page1.frameLocator('#sbox-iframe').getByText('Are you sure?')).click()
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'passed',reason: 'Can sign up'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'failed',reason: 'Can\'t sign up'}})}`);
  }  

})


test(' add other user as contact and decline request', async ({ page }, testInfo) => {

  try {

    //user 1: send user request to user 2 
    await page.goto(`${url}/profile/#/2/profile/view/v5coYdvAKofy2fZkWZoAelB8KVey7SxFbDweAMZ-R3I/`);
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()

    ///
    //user 2: log in
    const name = testInfo.project.name
    if (name.indexOf('firefox') !== -1 ) {
      browser = await firefox.launch();
    } else if (name.indexOf('webkit') !== -1 ) {
      browser = await webkit.launch();
    } else {
      browser = await chromium.launch();
    }
    const context = await browser.newContext();
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/drive`);
    const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
    await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()
    await pageOne.getByRole('link', { name: 'Log in' }).click()
    await expect(pageOne).toHaveURL(`${url}/login/`)
    await pageOne.getByPlaceholder('Username').fill('test-user2');
    await pageOne.waitForTimeout(10000)
    await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
    const login = pageOne.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await pageOne.waitForLoadState('networkidle');
    await pageOne.waitForTimeout(10000)

    //user 2: decline contact request
    const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
    await notifsOne.waitFor({ timeout: 100000 })
    await notifsOne.click()
    await pageOne.waitForTimeout(5000)

    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Decline' }).waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Decline' }).click();
    await pageOne.close()
    ////

    //user 1: be notified of declined request
    await page.goto(`${url}/drive/`)
    await page.waitForTimeout(10000)
    const notifs = page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
    await notifs.waitFor({ timeout: 100000 })
    await notifs.click()
    await page.waitForTimeout(5000)
    if (await page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request').isHidden()) {
      await notifs.click()
      await page.waitForTimeout(5000)
    }
    await page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request').waitFor()
    await expect(page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request')).toBeVisible();

       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' add and remove other user as contact', status: 'passed',reason: 'Can add and remove other user as contact'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' add and remove other user as contact', status: 'failed',reason: 'Can\'t add and remove other user as contact'}})}`);
  } 

});

test(' add and remove other user as contact', async ({ page }, testInfo) => {

  try {

    //user 1: send user request to user 2 
    await page.goto(`${url}/profile/#/2/profile/view/v5coYdvAKofy2fZkWZoAelB8KVey7SxFbDweAMZ-R3I/`);
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()

    ///
    //user 2: log in
    const name = testInfo.project.name
    if (name.indexOf('firefox') !== -1 ) {
      browser = await firefox.launch();
    } else if (name.indexOf('webkit') !== -1 ) {
      browser = await webkit.launch();
    } else {
      browser = await chromium.launch();
    }
    const context = await browser.newContext();
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/drive`);
    const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
    await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()
    await pageOne.getByRole('link', { name: 'Log in' }).click()
    await expect(pageOne).toHaveURL(`${url}/login/`)
    await pageOne.getByPlaceholder('Username').fill('test-user2');
    await pageOne.waitForTimeout(10000)
    await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
    const login = pageOne.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await pageOne.waitForLoadState('networkidle');
    await pageOne.waitForTimeout(10000)

    //user 2: accept contact request
    const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
    await notifsOne.waitFor({ timeout: 100000 })
    await notifsOne.click()
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
    const notifs = page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
    await notifs.waitFor({ timeout: 100000 })
    await notifs.click()
    await page.waitForTimeout(5000)
    if (await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').isHidden()) {
      await notifs.click()
      await page.waitForTimeout(5000)
    }
    await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').waitFor()
    await expect(page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request')).toBeVisible();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: 'test-user2 accepted your contact request' }).locator('div').nth(1).click()
    await page.goto('https://cryptpad.fr/profile/#/2/profile/view/v5coYdvAKofy2fZkWZoAelB8KVey7SxFbDweAMZ-R3I/');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to remove test-user2 from your contacts?')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' add and remove other user as contact', status: 'passed',reason: 'Can add and remove other user as contact'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' add and remove other user as contact', status: 'failed',reason: 'Can\'t add and remove other user as contact'}})}`);
  } 

});


test(' request and cancel to add user as contact', async ({ page }) => {

  try {

    await page.goto(`${url}/profile/#/2/profile/view/v5coYdvAKofy2fZkWZoAelB8KVey7SxFbDweAMZ-R3I/`);
    await page.waitForTimeout(10000)

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
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' request and cancel to add user as contact', status: 'failed',reason: 'Can\'t request to add user as contact and cancel request'}})}`);
  }  

});


test(' chat with contacts and erase message history', async ({ page }, testInfo) => {

  try {

    //user 1: send message
    await page.goto(`${url}/contacts/`);
    await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('testuser').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill('hello');
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');

    ///
    //user 2: log in 
    const name = testInfo.project.name
    if (name.indexOf('firefox') !== -1 ) {
      browser = await firefox.launch();
    } else if (name.indexOf('webkit') !== -1 ) {
      browser = await webkit.launch();
    } else {
      browser = await chromium.launch();
    }
    const context = await browser.newContext();
    pageOne = await context.newPage();
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

    //user 2: view user 1's message and send own message
    await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await pageOne.goto(`${url}/contacts/`);
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('test-user').waitFor();
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
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' chat with contacts and erase message history', status: 'passed',reason: 'Can chat with contacts and erase chat history'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' chat with contacts and erase message history', status: 'failed',reason: 'Can\'t chat with contacts and erase chat history'}})}`);
  }  

});


test(' can change password', async ({ page }) => {

  try {

    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

    //change password
    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-change-password-current').click();
    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-change-password-current').fill('newpassword');
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).fill('anothernewpassword');
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').fill('anothernewpassword');
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Change password' }).click();

    await page1.waitForTimeout(3000)
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).waitFor()
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
    await page1.waitForTimeout(15000)
    await expect(page1).toHaveURL(new RegExp(`^${url}/login/`), { timeout: 10000 })
    await page1.close()

    //log in with new password
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: 'click here' }).click()
    await expect(page).toHaveURL(`${url}/login/`, { timeout: 100000 })
    await page.getByPlaceholder('Username').fill('test-user');
    await page.waitForTimeout(5000)
    await page.getByPlaceholder('Password', {exact: true}).fill('anothernewpassword');
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })

    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    const pagePromise2 = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page2 = await pagePromise2
    await expect(page2).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

    //change password back
    await page2.frameLocator('#sbox-iframe').locator('#cp-settings-change-password-current').click();
    await page2.frameLocator('#sbox-iframe').locator('#cp-settings-change-password-current').fill('anothernewpassword');
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).click();
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).fill('newpassword');
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').click();
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').fill('newpassword');
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'Change password' }).click();

    await page2.waitForTimeout(3000)
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).waitFor()
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
    await page2.waitForTimeout(15000)
    await page2.close()
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: 'click here' }).click()
    await expect(page).toHaveURL(`${url}/login/`, { timeout: 100000 })

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' change password', status: 'passed',reason: 'Can change password'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' change password', status: 'failed',reason: 'Can\'t change password'}})}`);
  }  

});


test(' can change display name', async ({ page }) => {

  try {

    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Guest').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('test-user-new');
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Display nameSave$/ }).getByRole('button', { name: 'Save' }).click();
    await page1.goto(`${url}/settings/#account`);
    const menu1 = page1.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu1.click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Display name: test-user-new')).toBeVisible();

    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Guest').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Guest').fill('test-user');
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Display nameSave$/ }).getByRole('button', { name: 'Save' }).click();
       
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' change display name', status: 'passed',reason: 'Can change display name'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' change display name', status: 'failed',reason: 'Can\'t change display name'}})}`);
  }  

});


test(' can access public signing key', async ({ page }) => {

  try {

    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

    const key = await page1.frameLocator('#sbox-iframe').getByRole('textbox').first().inputValue()

    if (key.indexOf('test-user@cryptpad.fr') !== -1) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' can access public signing key', status: 'passed',reason: 'Can access public signing key'}})}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' can access public signing key', status: 'failed',reason: 'Can\'t access public signing key'}})}`);
    }
       
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' can access public signing key', status: 'failed',reason: 'Can\'t access public signing key'}})}`);
  } 

});


