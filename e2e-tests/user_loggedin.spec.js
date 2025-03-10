import * as OTPAuth from 'otpauth';
const { url, test, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const os = require('os');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

let mobile;
let contextOne;
let pageOne;
let platform;
let fileActions;
let userActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(210000);

  mobile = isMobile;
  platform = os.platform();
  userActions = new UserActions(page);

  // if (mobile) {
  //   await userActions.login('test-user', mainAccountPassword);
  // }
  fileActions = new FileActions(page);
  // await page.waitForTimeout(35000);
});

test('can change display name', async ({ page }) => {
  try {
    await page.goto(`${url}/drive`);

    // await page.waitForTimeout(15000);
    await fileActions.drivemenu.click();

    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    const fileActions1 = new FileActions(page1);

    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').click();
    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').fill('test-user-new');
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Display nameSave$/ }).getByRole('button', { name: 'Save' }).click();
    await page1.goto(`${url}/settings/#account`);
    await page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-user-dropdown.cp-dropdown-container').click();

    await expect(page1.frameLocator('#sbox-iframe').getByText('Display name: test-user-new')).toBeVisible();
    await page1.waitForTimeout(5000);

    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').click();
    await page1.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').fill('test-user');
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Display nameSave$/ }).getByRole('button', { name: 'Save' }).click();
    await page1.waitForTimeout(5000);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'change display name', status: 'passed', reason: 'Can change display name' } })}`);
  } catch (e) {
  // in case of test failure, change display name back to original
    await page.goto(`${url}/settings/#account`);
    if (await page.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').hasValue('test-user-new')) {
      await page.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').click();
      await page.frameLocator('#sbox-iframe').locator('#cp-settings-displayname').fill('test-user');
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Display nameSave$/ }).getByRole('button', { name: 'Save' }).click();
      await page.goto(`${url}/settings/#account`);
    }
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'change display name', status: 'failed', reason: 'Can\'t change display name' } })}`);
  }
});

test('can access public signing key', async ({ page }) => {
  try {
    await page.goto(`${url}/drive`);
    // await page.waitForTimeout(15000);

    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    const key = await page1.frameLocator('#sbox-iframe').getByRole('textbox').first().inputValue();

    if (key.indexOf('test-user@') !== -1) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' can access public signing key', status: 'passed', reason: 'Can access public signing key' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' can access public signing key', status: 'failed', reason: 'Can\'t access public signing key' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' can access public signing key', status: 'failed', reason: 'Can\'t access public signing key' } })}`);
  }
});

test('add other user as contact and decline request', async ({ page, browser }) => {
  try {
    // get user 2 profile link
    const contextOne = await browser.newContext({ storageState: 'auth/testuser2.json' });
    pageOne = await contextOne.newPage();
    await pageOne.goto(`${url}/profile`);
    const fileActions1 = new FileActions(pageOne);
    await pageOne.waitForTimeout(15000);
    await fileActions1.shareLink.click();
    const testuser2ProfileLink = await pageOne.evaluate('navigator.clipboard.readText()');
    await page.goto(`${testuser2ProfileLink}`);
    await page.locator('#sbox-iframe').contentFrame().locator('#cp-app-profile-displayname').getByText('test-user2').waitFor()

    // user 1: send user request to user 2
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Cancel' }).count() > 0) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Cancel' }).click();
      await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to cancel your contact request with test-user2?')).toBeVisible();
      await fileActions.okButton.click();
      // await page.waitForTimeout(5000);
    } else if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).count() > 0) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).click();
      await fileActions.okButton.click();
      // await page.waitForTimeout(5000);
    }

    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Contact request pending...' })).toBeVisible();

    // user 2: decline contact request
    await pageOne.bringToFront();
    await pageOne.waitForTimeout(5000);
    await fileActions1.notifications.click();
    // await pageOne.waitForTimeout(5000);
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor();
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Decline' }).waitFor();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Decline' }).click();

    // user 1: be notified of declined request
    await page.waitForTimeout(5000);
    await fileActions.notifications.click();
    // await page.waitForTimeout(5000);
    if (await page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request').isHidden()) {
      await fileActions.notifications.click();
      // await page.waitForTimeout(5000);
    }
    await page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request').waitFor();
    await expect(page.frameLocator('#sbox-iframe').getByText('test-user2 declined your contact request')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' add and remove other user as contact', status: 'passed', reason: 'Can add and remove other user as contact' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' add and remove other user as contact', status: 'failed', reason: 'Can\'t add and remove other user as contact' } })}`);
  }
});

test('add and remove other user as contact', async ({ page, browser }) => {
  try {
    // get user 2 profile link
    contextOne = await browser.newContext({ storageState: 'auth/testuser2.json' });
    pageOne = await contextOne.newPage();
    await pageOne.goto(`${url}/profile`);
    const fileActions1 = new FileActions(pageOne);
    await fileActions1.shareLink.waitFor()
    await fileActions1.shareLink.click();
    const testuser2ProfileLink = await pageOne.evaluate('navigator.clipboard.readText()');
    await page.goto(`${testuser2ProfileLink}`);
    await page.locator('#sbox-iframe').contentFrame().locator('#cp-app-profile-displayname').getByText('test-user2').waitFor()
    // await page.waitForTimeout(15000);

    // user 1: send user request to user 2
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Contact request pending...' }).count() > 0) {
      await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Cancel' }).click();
      await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to cancel your contact request with test-user2?')).toBeVisible();
      await fileActions.okButton.click();
    } else if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).click();
      await fileActions.okButton.click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible();

    // user 2: accept contact request
    await fileActions1.notifications.click();
    // await pageOne.waitForTimeout(5000);

    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor();
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    await pageOne.close();
    /// /

    // user 1: remove contact
    await page.goto(`${url}/drive/`);
    await page.waitForTimeout(10000);
    await fileActions.notifications.waitFor()
    await fileActions.notifications.click();
    console.log("hidden?", await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').isHidden())
    // await page.waitForTimeout(5000);
    // if (await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').isHidden()) {
    //   await fileActions.notifications.click();
    //   // await page.waitForTimeout(5000);
    // }
    await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').waitFor();
    await expect(page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request')).toBeVisible();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: 'test-user2 accepted your contact request' }).locator('div').nth(1).click();
    await page.goto(`${testuser2ProfileLink}`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to remove test-user2 from your contacts?')).toBeVisible();
    await fileActions.okButton.click();
    // await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' add and remove other user as contact', status: 'passed', reason: 'Can add and remove other user as contact' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' add and remove other user as contact', status: 'failed', reason: 'Can\'t add and remove other user as contact' } })}`);
  }
});

test('request and cancel to add user as contact', async ({ page, browser }) => {
  try {
    // get user 2 profile link
    const contextOne = await browser.newContext({ storageState: 'auth/testuser2.json' });
    pageOne = await contextOne.newPage();
    await pageOne.goto(`${url}/profile`);
    const fileActions1 = new FileActions(pageOne);
    await fileActions1.shareLink.waitFor()
    await fileActions1.shareLink.click();
    const testuser2ProfileLink = await pageOne.evaluate('navigator.clipboard.readText()');
    await page.bringToFront();
    await page.goto(`${testuser2ProfileLink}`);
    await page.locator('#sbox-iframe').contentFrame().locator('#cp-app-profile-displayname').getByText('test-user2').waitFor()
    // await page.waitForTimeout(15000);

    // user 1: send user request to user 2
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Contact request pending...' }).count() > 0) {
      await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Cancel' }).click();
      await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to cancel your contact request with test-user2?')).toBeVisible();
      await fileActions.okButton.click();
    } else if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).click();
      await fileActions.okButton.click();
    }

    // await page.waitForTimeout(3000);

    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Cancel' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to cancel your contact request with test-user2?')).toBeVisible();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' request and cancel to add user as contact', status: 'passed', reason: 'Can request to add user as contact and cancel request' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' request and cancel to add user as contact', status: 'failed', reason: 'Can\'t request to add user as contact and cancel request' } })}`);
  }
});

test('chat with contacts and erase message history #1415', async ({ page, browser }) => {
  test.skip();

  try {
    // user 1: send message
    await page.goto(`${url}/contacts/`);
    // await page.waitForTimeout(15000);
    await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('testuser').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('testuser').click();

    if (await page.frameLocator('#sbox-iframe').getByText('hello').count() > 0) {
      await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-messaging div').filter({ hasText: /^tetestuser$/ }).locator('span').nth(4).click();
      await fileActions.okButton.click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill('hello');
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');

    // user 2: send message back
    contextOne = await browser.newContext({ storageState: 'auth/testuser.json' });
    pageOne = await contextOne.newPage();
    await pageOne.goto(`${url}/contacts/`);
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('test-user').waitFor({ timeout: 10000 });
    await pageOne.frameLocator('#sbox-iframe').locator('#cp-app-contacts-friendlist').getByText('test-user').click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('hello')).toBeVisible();
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).click();
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).fill('hello to you too!');
    await pageOne.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Type a message here...' }).press('Enter');

    // user 1: view user 2's message and erase message history
    await expect(page.frameLocator('#sbox-iframe').getByText('hello to you too!')).toBeVisible();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-contacts-messaging div').filter({ hasText: /^tetestuser$/ }).locator('span').nth(4).click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-iframe').getByText('hello')).toHaveCount(0);
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('hello')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'chat with contacts and erase message history', status: 'passed', reason: 'Can chat with contacts and erase chat history ' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'chat with contacts and erase message history', status: 'failed', reason: 'Can\'t chat with contacts and erase chat history' } })}`);
  }
});

test('sign up and delete account', async ({ page }) => {
  try {
    // log out current user
    await page.goto(`${url}/drive`);
    // await page.waitForTimeout(15000);
    await fileActions.drivemenu.waitFor()
    await fileActions.drivemenu.click();
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click();
    await expect(page).toHaveURL(`${url}`, { timeout: 100000 });

    // register new user
    const username = (Math.random() + 1).toString(36).substring(2);
    const password = (Math.random() + 1).toString(36).substring(2);
    await userActions.register(username, password);

    // access settings
    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // delete new account
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(password);
    await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click();
    await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click();
    await page1.waitForTimeout(5000);
    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-loading-message')).toHaveText('Account deletion');
    await page1.waitForTimeout(10000);
    await expect(page1.frameLocator('#sbox-iframe').getByText(/Your user account is now deleted/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sign up and delete account', status: 'passed', reason: 'Can sign up and delete account' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sign up and delete account', status: 'failed', reason: 'Can\'t sign up and delete account' } })}`);
  }
});

test('enable 2FA login', async ({ page, context }) => {
  try {
    // access settings
    await page.goto(`${url}/drive`);

    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    // await page.waitForTimeout(30000);
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // begin 2FA setup
    await page1.frameLocator('#sbox-iframe').getByText('Security & Privacy').waitFor();
    await page1.frameLocator('#sbox-iframe').getByText('Security & Privacy').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Password', { exact: true }).click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Password', { exact: true }).fill(mainAccountPassword);
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Begin 2FA setup' }).click();
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Done$/ }).getByRole('textbox').click();

    // copy recovery code
    let key;
    if (platform === 'darwin') {
      key = 'Meta';
    } else {
      key = 'Control';
    }
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Done$/ }).getByRole('textbox').press(`${key}+c`);
    await page1.waitForTimeout(5000);
    const recoveryCode = await page1.evaluate('navigator.clipboard.readText()');
    console.log('code', recoveryCode);

    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Done' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Continue' }).click();

    // generate token from URI
    const uri = await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside div').filter({ hasText: 'Two-Factor Authentication (' }).locator('input[type="text"]').inputValue();
    const totp = OTPAuth.URI.parse(uri);
    const token = totp.generate();

    // checks validity of generated token
    const delta = totp.validate({
      token,
      window: 1
    });

    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Verification code').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Verification code').fill(token);
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Enable 2FA' }).click();
    await page1.waitForTimeout(5000);
    await expect(page1.frameLocator('#sbox-iframe').getByText('2FA is active')).toBeVisible();

    // log out and log back in
    await page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-user-dropdown.cp-dropdown-container').click();
    await page1.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click();

    await page1.getByRole('link', { name: 'Log in' }).click();
    await page1.waitForTimeout(5000);
    const userActions1 = new UserActions(page1);
    await page1.getByPlaceholder('Username').fill('test-user');
    await page1.waitForTimeout(10000);
    await page1.getByPlaceholder('Password', { exact: true }).fill(mainAccountPassword);

    await userActions1.loginButton.waitFor();
    await userActions1.loginButton.click();
    await page1.waitForTimeout(20000);

    // use 2FA to log in
    await expect(page1.getByText('This account is protected')).toBeVisible();

    const token1 = totp.generate();

    // checks validity of generated token
    const delta1 = totp.validate({
      token: token1,
      window: 1
    });

    await page1.getByPlaceholder('Verification code').click();
    await page1.getByPlaceholder('Verification code').fill(token1);
    await page1.getByRole('button', { name: 'Confirm' }).click();
    await page1.waitForTimeout(20000);
    await page1.reload();
    await page1.waitForTimeout(20000);
    const fileActions1 = new FileActions(page1);

    // disable 2FA
    await fileActions1.drivemenu.click();
    await page1.waitForTimeout(5000);
    await expect(fileActions1.settings).toBeVisible();
    const pagePromise2 = page1.waitForEvent('popup');
    await fileActions1.settings.click();
    const page2 = await pagePromise2;
    await expect(page2).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });
    await page2.frameLocator('#sbox-iframe').getByText('Security & Privacy').click();
    await page2.waitForTimeout(5000);

    await page2.frameLocator('#sbox-iframe').getByPlaceholder('Password', { exact: true }).waitFor();
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('Password', { exact: true }).click();
    await page2.waitForTimeout(2000);

    await page2.frameLocator('#sbox-iframe').getByPlaceholder('Password', { exact: true }).fill(mainAccountPassword);
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'Disable 2FA' }).click();

    const token2 = totp.generate();

    // checks validity of generated token
    const delta2 = totp.validate({
      token: token2,
      window: 1
    });
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('Verification code').fill(token2);
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'Confirm disable 2FA' }).click();
    await expect(page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'Begin 2FA setup' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'enable 2FA login', status: 'passed', reason: 'Can enable 2FA login' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'enable 2FA login', status: 'failed', reason: 'Can\'t enable 2FA login' } })}`);
  }
});

test('enable 2FA login and recover account', async ({ page, context }) => {
  try {
    // access settings
    await page.goto(`${url}/drive`);

    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // begin 2FA setup
    await page1.frameLocator('#sbox-iframe').getByText('Security & Privacy').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Password', { exact: true }).click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Password', { exact: true }).fill(mainAccountPassword);
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Begin 2FA setup' }).click();

    // copy recovery key
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Done$/ }).getByRole('textbox').click();
    let key;
    if (platform === 'darwin') {
      key = 'Meta';
    } else {
      key = 'Control';
    }
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Done$/ }).getByRole('textbox').press(`${key}+c`);
    await page1.waitForTimeout(5000);
    const recoveryCode = await page1.evaluate('navigator.clipboard.readText()');
    console.log('code', recoveryCode);

    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Done' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Continue' }).click();

    // generate token from URI
    const uri = await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside div').filter({ hasText: 'Two-Factor Authentication (' }).locator('input[type="text"]').inputValue();
    const totp = OTPAuth.URI.parse(uri);
    const token = totp.generate();

    // checks validity of generated token
    const delta = totp.validate({
      token,
      window: 1
    });

    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Verification code').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Verification code').fill(token);
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Enable 2FA' }).click();
    await page1.waitForTimeout(5000);
    await expect(page1.frameLocator('#sbox-iframe').getByText('2FA is active')).toBeVisible();

    // log out and log back in
    await page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-user-dropdown.cp-dropdown-container').click();
    await page1.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click();
    await page1.getByRole('link', { name: 'Log in' }).click();
    await page1.waitForTimeout(5000);
    const userActions1 = new UserActions(page1);
    await page1.getByPlaceholder('Username').fill('test-user');
    await page1.waitForTimeout(10000);
    await page1.getByPlaceholder('Password', { exact: true }).fill(mainAccountPassword);

    await userActions1.loginButton.waitFor({ timeout: 18000 });
    await expect(userActions1.loginButton).toBeVisible({ timeout: 1800 });
    if (await userActions1.loginButton.isVisible()) {
      await userActions1.loginButton.click();
    }
    await page1.waitForTimeout(20000);
    await expect(page1.getByText('This account is protected')).toBeVisible();

    await page1.getByRole('link', { name: 'Recover your account' }).click();
    await page1.getByPlaceholder('Username').click();
    await page1.getByPlaceholder('Username').fill('test-user');
    await page1.getByPlaceholder('Password').click();
    await page1.getByPlaceholder('Password').fill(mainAccountPassword);
    await page1.getByRole('button', { name: 'Continue' }).click();

    await page1.getByText('Forgot recovery code').waitFor();
    await page1.getByText('Forgot recovery code').click();
    await page1.waitForTimeout(5000);
    await page1.getByRole('button', { name: 'Copy to clipboard' }).click();
    await page1.waitForTimeout(5000);
    const recoveryInfo = await page1.evaluate('navigator.clipboard.readText()');

    const actualJSONString = JSON.stringify(recoveryInfo);

    const testRecoveryInfo = '"intent":"Disable TOTP"';

    console.log(actualJSONString.includes(testRecoveryInfo));

    console.log('actualJSONString', actualJSONString);
    console.log('testRecoveryInfo', testRecoveryInfo);

    // if (testRecoveryInfo.test(actualJSONString)) {

    await page1.getByPlaceholder('Recovery code').click();
    await page1.getByPlaceholder('Recovery code').fill(recoveryCode);
    await page1.getByRole('button', { name: 'Disable 2FA' }).click();

    await page1.waitForTimeout(15000);
    await expect(page1).toHaveURL(`${url}/drive/#`, { timeout: 100000 });

    // } else {
    //   await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'enable 2FA login and recover account', status: 'failed',reason: 'Can\'t enable 2FA login'}})}`);
    // }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'enable 2FA login and recover account', status: 'passed', reason: 'Can enable 2FA login' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'enable 2FA login and recover account', status: 'failed', reason: 'Can\'t enable 2FA login' } })}`);
  }
});


test('can change password', async ({ page, browser }) => {
  try {
    // access settings
    await page.goto(`${url}/drive`);

    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // change password
    await page1.frameLocator('#sbox-iframe').getByText('Security & Privacy').click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(mainAccountPassword);
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).fill('password');
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').click();
    await page1.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').fill('password');
    await page1.waitForTimeout(5000);
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Change password' }).click();
    await page1.waitForTimeout(3000);
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' }).waitFor();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' }).click();
    await page1.waitForTimeout(20000);
    const fileActions1 = new FileActions(page1);
    await fileActions1.drivemenu.click();
    await page1.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click();
    await expect(page1).toHaveURL(`${url}`, { timeout: 100000 });

    // login using new password
    const userActions1 = new UserActions(page1);
    await userActions1.login('test-user', 'password');
    await page1.waitForTimeout(5000);
    await page1.reload();
    await page1.waitForTimeout(3000);

    await fileActions1.drivemenu.click();
    await expect(fileActions1.settings).toBeVisible();
    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.settings.click();
    const page2 = await page2Promise;
    await expect(page2).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // change password back
    await page2.frameLocator('#sbox-iframe').getByText('Security & Privacy').click();
    await page2.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
    await page2.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill('password');
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).click();
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('New password', { exact: true }).fill(mainAccountPassword);
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').click();
    await page2.frameLocator('#sbox-iframe').getByPlaceholder('Confirm new password').fill(mainAccountPassword);
    await page2.waitForTimeout(5000);
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'Change password' }).click();
    await page2.waitForTimeout(3000);
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' }).waitFor();
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'I have written down my username and password, proceed' }).click();

    await page2.waitForTimeout(5000);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' change password', status: 'failed', reason: 'Can\'t change password' } })}`);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' change password', status: 'passed', reason: 'Can change password' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' change password', status: 'failed', reason: 'Can\'t change password' } })}`);
  }
});
