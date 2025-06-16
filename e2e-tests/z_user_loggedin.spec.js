import * as OTPAuth from 'otpauth';
const { url, test, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const os = require('os');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

let mobile;
let contextOne;
let page1;
let platform;
let fileActions;
let userActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);

  mobile = isMobile;
  platform = os.platform();
  userActions = new UserActions(page);
  fileActions = new FileActions(page);
});


test('loggedin - can access public signing key', async ({ page }) => {
  try {
    await page.goto(`${url}/drive`);
    await fileActions.drivemenu.waitFor();
    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    const fileActions1 = new FileActions(page1);
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    const key = await fileActions1.textbox.first().inputValue();

    if (key.indexOf('test-user@') !== -1) {
      await fileActions.toSuccess('Can access public signing key');
    } else {
      await fileActions.toFailure(e,  'Can\'t access public signing key');
    }
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t access public signing key' );
  }
});

test('loggedin - add other user as contact and decline request', async ({ page, browser }) => {
  try {
    // get user 2 profile link
    const contextOne = await browser.newContext({ storageState: 'auth/testuser2.json' });
    page1 = await contextOne.newPage();
    await page1.goto(`${url}/profile`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.shareProfileButton.waitFor();
    await fileActions1.shareProfileButton.click();
    const testuser2ProfileLink = await page1.evaluate('navigator.clipboard.readText()');
    await page.goto(`${testuser2ProfileLink}`);
    await fileActions.profileDisplayName.getByText('test-user2', { exact: true }).waitFor()

    // user 1: send user request to user 2
    if (await fileActions.cancelIconButton.count() > 0) {
      await fileActions.cancelIconButton.click();
      await expect(fileActions.cancelContactRequestMessage('test-user2')).toBeVisible();
      await fileActions.okButton.click();
    } else if (await fileActions.removeContact.count() > 0) {
      await fileActions.removeContact.click();
      await fileActions.okButton.click();
    }

    await fileActions.contactRequest.waitFor();
    await fileActions.contactRequest.click();
    await expect(fileActions.cancelRequest).toBeVisible();

    // user 2: decline contact request
    await page1.bringToFront();
    await fileActions1.notifications.click();
    await fileActions1.contactRequestNotif('test-user').waitFor();
    await fileActions1.contactRequestNotif('test-user').click();
    await expect(fileActions1.contactRequestMessage('test-user')).toBeVisible();
    await fileActions1.declineButton.waitFor();
    await fileActions1.declineButton.click();

    // user 1: be notified of declined request
    await fileActions.notifications.click();
    await fileActions.declinedYourContactRequest('test-user2').waitFor();
    await expect(fileActions.declinedYourContactRequest('test-user2')).toBeVisible();

    await fileActions.toSuccess('Can add another user as contact and decline');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t add another user as contact and decline');
  }
});

test('loggedin - add and remove other user as contact', async ({ page, browser }) => {
  try {
    // get user 2 profile link
    contextOne = await browser.newContext({ storageState: 'auth/testuser2.json' });
    page1 = await contextOne.newPage();
    await page1.goto(`${url}/profile`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.shareProfileButton.waitFor()
    await fileActions1.shareProfileButton.click();
    const testuser2ProfileLink = await page1.evaluate('navigator.clipboard.readText()');
    
    await page.goto(`${url}/drive`)
    await fileActions.notifications.click();
    if (await fileActions.contactDeclinedNotif('test-user2').isVisible()) {
      await fileActions.dismissNotification.click()
    }
    await page.goto(`${testuser2ProfileLink}`);
    await fileActions.profileDisplayName.getByText('test-user2', { exact: true }).waitFor()
    // user 1: send user request to user 2
    if (await fileActions.cancelButton.count() > 0) {
      await fileActions.cancelButton.click();
      await expect(fileActions.cancelContactRequestMessage('test-user2')).toBeVisible();
      await fileActions.okButton.click();
    } else if (await fileActions.removeContact.isVisible()) {
      await fileActions.removeContact.click();
      await fileActions.okButton.click();
    }
    await fileActions.contactRequest.waitFor();
    await fileActions.contactRequest.click();
    await expect(fileActions.cancelButton).toBeVisible();

    // user 2: accept contact request
    await fileActions1.notifications.click();

    await fileActions1.contactRequestNotif('test-user').waitFor();
    await fileActions1.contactRequestNotif('test-user').click();
    await expect(fileActions1.contactRequestMessage('test-user')).toBeVisible();
    await fileActions1.acceptButton.waitFor();
    await fileActions1.acceptButton.click();
    await page1.close();
    /// /

    // user 1: remove contact
    await page.goto(`${url}/drive/`);
    await fileActions.notifications.waitFor()
    await fileActions.notifications.click();
    await fileActions.contactRequestAccepted('test-user2').waitFor();
    await expect(fileActions.contactRequestAccepted('test-user2')).toBeVisible();

    await page.goto(`${testuser2ProfileLink}`);
    await fileActions.removeContact.click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to remove test-user2 from your contacts?')).toBeVisible();
    await fileActions.okButton.click();
    await expect(fileActions.contactRequest).toBeVisible();

    await fileActions.toSuccess( 'Can add and remove other user as contact');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t add and remove other user as contact');
  }
});

test('loggedin - request and cancel to add user as contact', async ({ page, browser }) => {
  try {
    // get user 2 profile link
    const contextOne = await browser.newContext({ storageState: 'auth/testuser2.json' });
    page1 = await contextOne.newPage();
    await page1.goto(`${url}/profile`);
    const fileActions1 = new FileActions(page1);
    await fileActions1.shareProfileButton.waitFor()
    await fileActions1.shareProfileButton.click();
    const testuser2ProfileLink = await page1.evaluate('navigator.clipboard.readText()');
    await page.bringToFront();
    await page.goto(`${testuser2ProfileLink}`);
    await fileActions.profileDisplayName.getByText('test-user2', { exact: true }).waitFor()

    // user 1: send user request to user 2
    if (await fileActions.cancelButton.count() > 0) {
      await fileActions.cancelButton.click();
      await expect(fileActions.cancelContactRequestMessage('test-user2')).toBeVisible();
      await fileActions.okButton.click();
    } else if (await fileActions.removeContact.isVisible()) {
      await fileActions.removeContact.click();
      await fileActions.okButton.click();
    }

    await fileActions.contactRequest.waitFor();
    await fileActions.contactRequest.click();
    await expect(fileActions.cancelButton).toBeVisible();

    await fileActions.cancelButton.click();
    await expect(fileActions.cancelContactRequestMessage('test-user2')).toBeVisible();
    await fileActions.okButton.click();
    await expect(fileActions.contactRequest).toBeVisible();

    await fileActions.toSuccess( 'Can request to add user as contact and cancel request');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t request to add user as contact and cancel request' );
  }
});

test('loggedin - chat with contacts and erase message history', async ({ page, browser }) => {

  try {
    // user 1: send message
    await page.goto(`${url}/contacts/`);
    await fileActions.contactList.getByText('testuser').waitFor();
    await fileActions.contactList.getByText('testuser').click();

    if (await page.frameLocator('#sbox-iframe').getByText('hello').count() > 0) {
      await fileActions.cleanChatHistory(/^tetestuser$/).click();
      await fileActions.okButton.click();
    }
    await fileActions.typeMessage.click();
    await fileActions.typeMessage.fill('hello');
    await fileActions.typeMessage.press('Enter');

    // user 2: send message back
    contextOne = await browser.newContext({ storageState: 'auth/testuser.json' });
    page1 = await contextOne.newPage();
    const fileActions1 = new FileActions(page1);
    await page1.goto(`${url}/contacts/`);
    await fileActions1.contactList.getByText('test-user').waitFor({ timeout: 10000 });
    await fileActions1.contactList.getByText('test-user').click();
    await expect(fileActions1.mainFrame.getByText('hello')).toBeVisible();
    await fileActions1.typeMessage.click();
    await fileActions1.typeMessage.fill('hello to you too!');
    await fileActions1.typeMessage.press('Enter');

    // user 1: view user 2's message and erase message history
    await expect(page.frameLocator('#sbox-iframe').getByText('hello to you too!')).toBeVisible();
    await fileActions.cleanChatHistory(/^tetestuser$/).click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-iframe').getByText('hello')).toHaveCount(0);
    await expect(fileActions1.mainFrame.getByText('hello')).toHaveCount(0);

    await fileActions.toSuccess( 'Can chat with contacts and erase chat history ');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t chat with contacts and erase chat history');
  }
});

test('loggedin - sign up and delete account', async ({ page }) => {
  try {
    // log out current user
    await page.goto(`${url}/drive`);
    await fileActions.drivemenu.waitFor()
    await fileActions.drivemenu.click();
    await fileActions.driveMenuItem(/^Log out$/).click({ timeout: 2000 });
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
    const fileActions1 = new FileActions(page1);
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // delete new account
    await fileActions1.currentPassword.click();
    await fileActions1.currentPassword.fill(password);
    await fileActions1.mainFrame.getByText('Delete your account').click();
    await fileActions1.areYouSure.click();
    await fileActions1.mainFrame.getByText(/Your user account is now deleted/).waitFor()
    await expect(fileActions1.mainFrame.getByText(/Your user account is now deleted/)).toBeVisible();

    await fileActions.toSuccess('Can sign up and delete account');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t sign up and delete account');
  }
});

test('loggedin - can change display name', async ({ page }) => {
  try {
    await page.goto(`${url}/drive`);

    await fileActions.drivemenu.waitFor();
    await fileActions.drivemenu.click();

    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    const fileActions1 = new FileActions(page1);

    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    await fileActions1.displayName.click();
    await fileActions1.displayName.fill('test-user-new');
    await fileActions1.saveDisplayName.click();
    await page1.goto(`${url}/settings/#account`);
    await fileActions1.drivemenu.click();

    await expect(fileActions1.mainFrame.getByText('Display name: test-user-new')).toBeVisible();
    await fileActions1.displayName.click();
    await fileActions1.displayName.fill('test-user');
    await fileActions1.saveDisplayName.click();
    await page1.waitForTimeout(1000);
    await fileActions1.drivemenu.click();
    await fileActions1.mainFrame.getByText('Display name: test-user').waitFor()
    await expect(fileActions1.mainFrame.getByText('Display name: test-user-new')).toBeHidden();


    await fileActions.toSuccess( 'Can change display name');
  } catch (e) {
  // in case of test failure, change display name back to original
    await page.goto(`${url}/settings/#account`);
    if (await fileActions.displayName.hasValue('test-user-new')) {
      await fileActions.displayName.click();
      await fileActions.displayName.fill('test-user');
      await fileActions.saveDisplayName.click();
      await page.goto(`${url}/settings/#account`);
    }
    await fileActions.toFailure(e,  'Can\'t change display name');
  }
});

test('loggedin - enable 2FA login', async ({ page, context }) => {
  try {
    // access settings
    await page.goto(`${url}/drive`);

    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    const fileActions1 = new FileActions(page1);
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // begin 2FA setup
    await fileActions1.securityPrivacy.waitFor();
    await fileActions1.securityPrivacy.click();
    await fileActions1.passwordPlaceholderSettings.click();
    await fileActions1.passwordPlaceholderSettings.fill(mainAccountPassword);
    await fileActions1.begin2FASetup.click();
    await fileActions1.done.click();

    let key;
    if (platform === 'darwin') {
      key = 'Meta';
    } else {
      key = 'Control';
    }
    await fileActions1.done.press(`${key}+c`);
    await page1.waitForTimeout(1000);
    const recoveryCode = await page1.evaluate('navigator.clipboard.readText()');
    console.log('code', recoveryCode);

    await fileActions1.doneButton.click();
    await fileActions1.continueButton2FA.click();

    // generate token from URI
    const uri = await fileActions1.twoFAinput.inputValue();
    const totp = OTPAuth.URI.parse(uri);
    const token = totp.generate();

    // checks validity of generated token
    const delta = totp.validate({
      token,
      window: 1
    });

    await fileActions1.verificationCodeFrame.click();
    await fileActions1.verificationCodeFrame.fill(token);
    await fileActions1.enable2FA.click();
    await fileActions1.twoFAIsActive.waitFor()
    await expect(fileActions1.twoFAIsActive).toBeVisible();

    // log out and log back in
    await fileActions1.drivemenu.click();
    await fileActions1.driveMenuItem(/^Log out$/ ).click();

    await fileActions1.loginLink.click();
    const userActions1 = new UserActions(page1);
    await fileActions1.username.waitFor()
    await fileActions1.username.fill('test-user');
    await fileActions1.password.fill(mainAccountPassword);

    await userActions1.loginButton.waitFor();
    await userActions1.loginButton.click();

    // use 2FA to log in
    await page1.getByText('This account is protected').waitFor({timeout: 20000})
    await expect(page1.getByText('This account is protected')).toBeVisible();

    const token1 = totp.generate();

    // checks validity of generated token
    const delta1 = totp.validate({
      token: token1,
      window: 1
    });

    await fileActions1.verificationCode.click();
    await fileActions1.verificationCode.fill(token1);
    await fileActions1.confirmButton.click();
    await page1.waitForTimeout(5000);
    await page1.reload();

    // disable 2FA
    await fileActions1.drivemenu.waitFor()
    await fileActions1.drivemenu.click();
    await fileActions1.settings.waitFor()
    const pagePromise2 = page1.waitForEvent('popup');
    await fileActions1.settings.click();
    const page2 = await pagePromise2;
    const fileActions2 = new FileActions(page2);
    await expect(page2).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });
    await fileActions2.securityPrivacy.click();

    await fileActions2.passwordPlaceholderSettings.waitFor();
    await fileActions2.passwordPlaceholderSettings.click();

    await fileActions2.passwordPlaceholderSettings.fill(mainAccountPassword);
    await fileActions2.disable2FA.click();

    const token2 = totp.generate();

    // checks validity of generated token
    const delta2 = totp.validate({
      token: token2,
      window: 1
    });
    await fileActions2.verificationCodeFrame.fill(token2);
    await fileActions2.confirmDisable2FA.click();
    await expect(fileActions2.begin2FASetup).toBeVisible();

    await fileActions.toSuccess( 'Can enable 2FA login');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t enable 2FA login');
  }
});

test('loggedin - enable 2FA login and recover account', async ({ page, context }) => {
  try {
    // access settings
    await page.goto(`${url}/drive`);

    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    const fileActions1 = new FileActions(page1);
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // begin 2FA setup
    await fileActions1.securityPrivacy.waitFor();
    await fileActions1.securityPrivacy.click();
    await fileActions1.passwordPlaceholderSettings.click();
    await fileActions1.passwordPlaceholderSettings.fill(mainAccountPassword);
    await fileActions1.begin2FASetup.click();

    await fileActions1.done.click();
    let key;
    if (platform === 'darwin') {
      key = 'Meta';
    } else {
      key = 'Control';
    }
    await fileActions1.done.press(`${key}+c`);
    await page1.waitForTimeout(2000);
    const recoveryCode = await page1.evaluate('navigator.clipboard.readText()');
    console.log('code', recoveryCode);

    await fileActions1.doneButton.click();
    await fileActions1.continueButton2FA.click();

    // // generate token from URI
    const uri = await fileActions1.twoFAinput.inputValue();
    const totp = OTPAuth.URI.parse(uri);
    const token = totp.generate();

    // checks validity of generated token
    const delta = totp.validate({
      token,
      window: 1
    });

    await fileActions1.verificationCodeFrame.click();
    await fileActions1.verificationCodeFrame.fill(token);
    await fileActions1.enable2FA.click();
    await fileActions1.twoFAIsActive.waitFor()
    await expect(fileActions1.twoFAIsActive).toBeVisible();

    // log out and log back in
    await fileActions1.drivemenu.click();
    await fileActions1.driveMenuItem(/^Log out$/ ).click();
    await fileActions1.loginLink.click();
    const userActions1 = new UserActions(page1);
    await fileActions1.username.waitFor()
    await fileActions1.username.fill('test-user');
    await fileActions1.password.fill(mainAccountPassword);

    await userActions1.loginButton.waitFor({ timeout: 18000 });
    await expect(userActions1.loginButton).toBeVisible({ timeout: 1800 });
    if (await userActions1.loginButton.isVisible()) {
      await userActions1.loginButton.click();
    }
    await page1.getByText('This account is protected').waitFor()
    await expect(page1.getByText('This account is protected')).toBeVisible();

    await fileActions1.recoverAccount.click();
    await fileActions1.username.click();
    await fileActions1.username.fill('test-user');
    await fileActions1.passwordPlaceholder.click();
    await fileActions1.passwordPlaceholder.fill(mainAccountPassword);
    await fileActions1.continueButton.click();

    await page1.getByText('Forgot recovery code').waitFor();
    await page1.getByText('Forgot recovery code').click();
    await page1.getByRole('button', { name: 'Copy to clipboard' }).click();
    await page1.waitForTimeout(2000);
    const recoveryInfo = await page1.evaluate('navigator.clipboard.readText()');

    const actualJSONString = JSON.stringify(recoveryInfo);

    const testRecoveryInfo = '"intent":"Disable TOTP"';

    console.log(actualJSONString.includes(testRecoveryInfo));

    console.log('actualJSONString', actualJSONString);
    console.log('testRecoveryInfo', testRecoveryInfo);

    await page1.getByPlaceholder('Recovery code').click();
    await page1.getByPlaceholder('Recovery code').fill(recoveryCode);
    await page1.getByRole('button', { name: 'Disable 2FA' }).click();

    await expect(page1).toHaveURL(`${url}/drive/#`, { timeout: 100000 });

    await fileActions.toSuccess('Can enable 2FA login');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t enable 2FA login' );
  }
});


test('loggedin - can change password', async ({ page, browser }) => {
  try {
    // access settings
    await page.goto(`${url}/drive`);

    await fileActions.drivemenu.click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    const fileActions1 = new FileActions(page1);

    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // change password
    await fileActions1.securityPrivacy.click();
    await fileActions1.currentPassword.click();
    await fileActions1.currentPassword.fill(mainAccountPassword);
    await fileActions1.newPassword.click();
    await fileActions1.newPassword.fill('newpassword');
    await fileActions1.confirmPassword.click();
    await fileActions1.confirmPassword.fill('newpassword');
    await page1.waitForTimeout(5000);
    await fileActions1.changePassword.click();
    await page1.waitForTimeout(3000);
    await fileActions1.passwordConfirmation.waitFor();
    await fileActions1.passwordConfirmation.click();
    await fileActions1.currentPassword.waitFor();
    await expect(fileActions1.currentPassword).toBeVisible();
    await fileActions1.drivemenu.click();
    await fileActions1.driveMenuItem(/^Log out$/ ).click();
    await expect(page1).toHaveURL(`${url}`, { timeout: 100000 });

    // login using new password
    const userActions1 = new UserActions(page1);
    await userActions1.login('test-user', 'newpassword');
    await page1.waitForTimeout(5000);
    await page1.reload();
    await fileActions1.drivemenu.waitFor()

    await fileActions1.drivemenu.click();
    await expect(fileActions1.settings).toBeVisible();
    const page2Promise = page1.waitForEvent('popup');
    await fileActions1.settings.click();
    const page2 = await page2Promise;
    const fileActions2 = new FileActions(page2);

    await expect(page2).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    // change password back
    await fileActions2.securityPrivacy.click();
    await fileActions2.currentPassword.click();
    await fileActions2.currentPassword.fill('newpassword');
    await fileActions2.newPassword.click();
    await fileActions2.newPassword.fill(mainAccountPassword);
    await fileActions2.confirmPassword.click();
    await fileActions2.confirmPassword.fill(mainAccountPassword);
    await fileActions2.changePassword.click();
    await fileActions2.passwordConfirmation.waitFor();
    await fileActions2.passwordConfirmation.click();

    await fileActions2.passwordChanged.waitFor({state: "hidden"})

    await fileActions.toSuccess('Can change password');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t change password');
  }
});
