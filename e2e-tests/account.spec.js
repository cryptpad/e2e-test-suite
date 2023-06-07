const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');

const url = 'https://cryptpad.fr'

let browser;
let page;

test.beforeEach(async ({}, testInfo) => {
  test.setTimeout(2400000);
  const name = testInfo.project.name
  if (name.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (name.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }
  page = await browser.newPage();
  await page.goto(`${url}/login/`);
  await page.getByPlaceholder('Username').fill('test-user');
  await page.waitForTimeout(10000)
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
  await page.waitForTimeout(5000)

});


test('drive - user - request to add user as contact ', async () => {

  try {

    await page.goto('https://cryptpad.fr/profile/#/2/profile/view/v5coYdvAKofy2fZkWZoAelB8KVey7SxFbDweAMZ-R3I/');
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

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'passed',reason: 'Can request to add user as contact'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'failed',reason: 'Can\'t request to add user as contact'}})}`);

  }  
});

test('drive - user - add contact to team and remove them', async () => {
    
    try {
      await page.goto(`${url}/teams/`);
      await page.waitForTimeout(5000)
      await page.waitForLoadState('networkidle');
      
      await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
      await page.frameLocator('#sbox-iframe').getByText('tttest team').click();
      if (page.frameLocator('#sbox-iframe').getByText('Error').count() === 1) {
        await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
        await page.frameLocator('#sbox-iframe').getByText('tttest team').click();
      }
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
      await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('test-user3').click();
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()
      await page.waitForLoadState('networkidle')
      await page.frameLocator('#sbox-iframe').getByText('tetest-user3', { exact: true }).waitFor()
      await expect(page.frameLocator('#sbox-iframe').getByText('tetest-user3', { exact: true })).toBeVisible();
      await page.frameLocator('#sbox-iframe').locator('.cp-online > .fa').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('.cp-online > .fa').first().click()
      await expect(page.frameLocator('#sbox-iframe').getByText('test-user3 will know that you removed them from the team. Are you sure?')).toBeVisible();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.waitForTimeout(1800)
      const user = page.frameLocator('#sbox-iframe').getByText('test-user3', { exact: true })
      await expect(user).toBeHidden()

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > add contact to team > remove', status: 'passed',reason: 'Can navigate to Drive as user and create a team'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > add contact to team > remove', status: 'failed',reason: 'Can\'t navigate to Drive as user and create a team'}})}`);
  
    }   
  });

test('drive - user - user menu - make team ', async () => {
  
  try {
    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Teams$/ })).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Teams$/ }).click()
    const page1 = await pagePromise

    await expect(page1).toHaveURL(`${url}/teams/`, { timeout: 100000 })
    await page1.frameLocator('#sbox-iframe').getByText('Available team slotNew').first().click();

    await page1.waitForLoadState('networkidle');

    await page1.frameLocator('#sbox-iframe').getByRole('textbox').fill('example team')
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page1.waitForLoadState('networkidle');
    await page1.waitForTimeout(10000)
    await expect(page1).toHaveURL(`${url}/teams/`, { timeout: 100000 })
    await page1.waitForLoadState('networkidle');

    await page1.frameLocator('#sbox-iframe').getByText('example team').first().waitFor({ timeout: 10000 })
    await page1.frameLocator('#sbox-iframe').getByText('example team').first().click()
    await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-leftside').hover();
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page1.frameLocator('#sbox-iframe').getByText('Available team slotNew').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText('example team', { exact: true })).toHaveCount(0)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'passed',reason: 'Can navigate to Drive as user and create a team'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'failed',reason: 'Can\'t navigate to Drive as user and create a team'}})}`);

  }  
});


test('drive - anon - user menu - settings - delete account ', async () => {

  try {
    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.waitFor()
    await menu.click()
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
    await expect(page1.frameLocator('#sbox-iframe').getByText('Delete your account')).toBeVisible()
    
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive', status: 'passed',reason: 'Can navigate to Drive as user and delete account'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive', status: 'failed',reason: 'Can\'t anonymously navigate and delete account'}})}`);

  }  
});

test.afterEach(async () => {
  await browser.close()
});