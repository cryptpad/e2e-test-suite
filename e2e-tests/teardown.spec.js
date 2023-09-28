const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, mainAccountPassword, testUser2Password, testUserPassword, testUser3Password } = require('../browserstack.config.js')

let page;
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
    const context = await browser.newContext();
    page = await context.newPage();
});

let deletionMessage;
if (url.toString() === 'https://cryptpad.fr') {
  deletionMessage = 'Your user account is now deleted'
} else {
  deletionMessage = 'This account was deleted by its owner'
}

test('delete test-user account', async ({ }) => {

    try {

      await page.goto(`${url}/login`);
      await page.getByPlaceholder('Username').fill('test-user');
      await page.waitForTimeout(10000)
      await page.getByPlaceholder('Password', {exact: true}).fill(mainAccountPassword);
      const login = page.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
          await login.click()
      }
      await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })  
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

      await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
      const pagePromise = page.waitForEvent('popup')
      await page.frameLocator('#sbox-iframe').getByText('Settings').click()
      const page1 = await pagePromise
      await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(mainAccountPassword);
      await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
      await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

      await page1.waitForTimeout(5000)
      const text = await page.frameLocator('#sbox-iframe').locator('#cp-loading-message').textContent()
      await expect(page1.frameLocator('#sbox-iframe').locator('#cp-loading-message')).toHaveText('This account was deleted by its owner')
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user account', status: 'passed',reason: 'Can delete test-user account'}})}`);
  
    } catch(e) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user account', status: 'failed',reason: 'Can\'t delete test-user account'}})}`);
  
      console.log(e);
    }
});
  
test('delete testuser account', async ({ }) => {

    try {
  
      await page.goto(`${url}/login`);
      await page.getByPlaceholder('Username').fill('testuser');
      await page.waitForTimeout(10000)
      await page.getByPlaceholder('Password', {exact: true}).fill(testUserPassword);
      const login = page.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
          await login.click()
      }
      await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })  
        await page.waitForTimeout(5000)
        await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

        await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
        const pagePromise = page.waitForEvent('popup')
        await page.frameLocator('#sbox-iframe').getByText('Settings').click()
        const page1 = await pagePromise
        await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(testUserPassword);
        await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
        await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

        await page1.waitForTimeout(5000)

        const text = await page.frameLocator('#sbox-iframe').locator('#cp-loading-message').textContent()
        await expect(page1.frameLocator('#sbox-iframe').locator('#cp-loading-message')).toHaveText('This account was deleted by its owner')
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete testuser account', status: 'passed',reason: 'Can delete testuser account'}})}`);
  
    } catch(e) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete testuser account', status: 'failed',reason: 'Can\'t delete testuser account'}})}`);
  
      console.log(e);
    }
});

test('delete test-user2 account', async ({ }) => {

    try {
  
      await page.goto(`${url}/login`);
      await page.getByPlaceholder('Username').fill('test-user2');
      await page.waitForTimeout(10000)
      await page.getByPlaceholder('Password', {exact: true}).fill(testUser2Password);
      const login = page.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
          await login.click()
      }
      await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })  
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

      await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
      const pagePromise = page.waitForEvent('popup')
      await page.frameLocator('#sbox-iframe').getByText('Settings').click()
      const page1 = await pagePromise
      await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(testUser2Password);
      await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
      await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

      await page1.waitForTimeout(5000)
      const text = await page.frameLocator('#sbox-iframe').locator('#cp-loading-message').textContent()
      await expect(page1.frameLocator('#sbox-iframe').locator('#cp-loading-message')).toHaveText('This account was deleted by its owner')
        
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user2 account', status: 'passed',reason: 'Can delete test-user2 account'}})}`);
  
    } catch(e) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user2 account', status: 'failed',reason: 'Can\'t delete test-user2 account'}})}`);
  
      console.log(e);
    }
});

test('delete test-user3 account', async ({ }) => {

    try {
  
      await page.goto(`${url}/login`);

      await page.getByPlaceholder('Username').fill('test-user3');
      await page.waitForTimeout(10000)
      await page.getByPlaceholder('Password', {exact: true}).fill(testUser3Password);
      const login = page.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
          await login.click()
      }
      await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })  
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

      await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
      const pagePromise = page.waitForEvent('popup')
      await page.frameLocator('#sbox-iframe').getByText('Settings').click()
      const page1 = await pagePromise
      await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
      await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(testUser3Password);
      await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
      await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

      await page1.waitForTimeout(5000)
      
      const text = await page.frameLocator('#sbox-iframe').locator('#cp-loading-message').textContent()
      await expect(page1.frameLocator('#sbox-iframe').locator('#cp-loading-message')).toHaveText('This account was deleted by its owner')

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user3 account', status: 'passed',reason: 'Can delete test-user3 account'}})}`);
  
    } catch(e) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user3 account', status: 'failed',reason: 'Can\'t delete test-user3 account'}})}`);
  
      console.log(e);
    }
});

test.afterEach(async () => {
    await browser.close()
  });
  