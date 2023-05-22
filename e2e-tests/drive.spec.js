const { test, expect } = require('@playwright/test');
const { chromium } = require('@playwright/test');
const { Browser } = require('selenium-webdriver');

test.describe.configure({ mode: 'parallel' });

// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'


// // ANONYMOUS USER

test('drive - anon', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(2400000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Drive' }).click();
    await expect(page).toHaveURL(`${url}/drive/`, { timeout: 100000 })
    await page.goto(`${url}/drive/`);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    
    await expect(page.frameLocator('#sbox-iframe').getByText('You are not logged in so your documents will expire after 90 days. Clearing your')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Sign up'})).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Log in'})).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Read more'})).toBeVisible()
    
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive', status: 'passed',reason: 'Can anonymously navigate to Drive'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive', status: 'failed',reason: 'Can\'t anonymously navigate to Drive'}})}`);

  }    

});




test('drive - anon - user menu - settings ', async ({  }) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
  try {
    test.setTimeout(2400000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Drive' }).click();
    await expect(page).toHaveURL(`${url}/drive/`, { timeout: 100000 })
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
    
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive > settings', status: 'passed',reason: 'Can anonymously navigate to Drive and access settings'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive > settings', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and access settings'}})}`);

  }    
  browser.close()

});


test('drive - anon - notifications', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(2400000)

    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Drive' }).click();
    await expect(page).toHaveURL(`${url}/drive/`, { timeout: 100000 })
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    const notifs = page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: /^Allow notificationsNo notifications available$/ })
    await notifs.waitFor({ timeout: 100000 })
    await notifs.click()

    page.on('dialog', dialog => {    
        console.log("DIALOG")    
        expect(dialog.message()).toContain('Show notifications');
        dialog.accept();
    });

    await expect(page.frameLocator('#sbox-iframe').getByText('Allow notifications')).toBeVisible()
    await page.frameLocator('#sbox-iframe').getByText('Allow notifications').click({ timeout: 1000 })

    //dialog not present - check browser permissions?


    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive - notifications', status: 'passed',reason: 'Can anonymously navigate to Drive and check/switch on notifications'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive - notifications', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and check/switch on notifications'}})}`);

  }  
  browser.close()
});


test('drive - anon - sign up from drive page', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    test.setTimeout(2400000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Drive' }).click();
    await expect(page).toHaveURL(`${url}/drive/`, { timeout: 100000 })
    await page.goto(`${url}/drive/`);
    

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await page.frameLocator('#sbox-iframe').locator('body').filter({hasText: "You are not logged in"}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Sign up'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Sign up'}).click()
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(`${url}/register/`, { timeout: 100000 })
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > sign up', status: 'passed',reason: 'Can anonymously navigate to Drive and find link to sign up'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > sign up', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and find link to sign up'}})}`);

  }  
  browser.close()

});

test('drive - anon - log in from drive page', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    test.setTimeout(2400000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Drive' }).click();
    await expect(page).toHaveURL(`${url}/drive/`, { timeout: 100000 })
    await page.goto(`${url}/drive/`);
    

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await page.frameLocator('#sbox-iframe').locator('body').filter({hasText: "You are not logged in"}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Log in'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Log in'}).click()
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(`${url}/login/`, { timeout: 100000 })
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > log in', status: 'passed',reason: 'Can anonymously navigate to Drive and find link to log in'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > log in', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and find link to log in'}})}`);

  }  
  browser.close()

});



// //LOGGED IN USER


test('drive - user - notifications panel', async ({  }) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
  try {
    test.setTimeout(240000)
    await page.goto(`${url}/login/`);
    await page.getByPlaceholder('Username').fill('test-user');
    await page.getByPlaceholder('Password', {exact: true}).fill('password');
    await page.waitForLoadState('networkidle');
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)

    const notifs = page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: /^Open notifications panelAllow notificationsNo notifications available$/ })
    
    await notifs.waitFor()
    
    await expect(notifs).toBeVisible()
    await notifs.click()
    await page.frameLocator('#sbox-iframe').getByText('Open notifications panel').waitFor()
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Open notifications panel').click()
    const page1 = await pagePromise
    await page1.waitForLoadState('networkidle');
    await expect(page1).toHaveURL(`${url}/notifications/#all`, { timeout: 100000 })
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive - notifications panel', status: 'passed',reason: 'Can log in, navigate to Drive and open notifications panel'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive - notifications panel', status: 'failed',reason: 'Can\'t log in, navigate to Drive and open notifications panel'}})}`);

  }  
  browser.close()
});



test('drive - user - user menu - settings - log out ', async ({  }) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
  try {
    test.setTimeout(2400000)

    await page.goto(url);

    await page.getByRole('link', { name: 'Log in' }).click();

    await expect(page).toHaveURL(`${url}/login/`);
    await page.getByPlaceholder('Username').fill('test-user');
    await page.getByPlaceholder('Password', {exact: true}).fill('password');

    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 18000 })
    if (await login.isVisible()) {
    await login.click()
    }
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ })).toBeVisible()
    
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
    await expect(page).toHaveURL(`${url}`, { timeout: 100000 })
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible()
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > log out', status: 'passed',reason: 'Can navigate to Drive as user and log out'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > log out', status: 'failed',reason: 'Can\'t navigate to Drive as user and log out'}})}`);

  }  
  browser.close()
});







// test.afterEach(async (browser) => {
    
//     browser.close()
//     // await page.goto(`${url}`);

//     // Go to the starting url before each test.
//     // await page.goto('https://my.start.url/');
// });