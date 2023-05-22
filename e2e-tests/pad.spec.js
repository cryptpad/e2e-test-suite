const { test, expect } = require('@playwright/test');
const { chromium } = require('@playwright/test');
const { Browser } = require('selenium-webdriver');

test.describe.configure({ mode: 'parallel' });

// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'

// // ANONYMOUS USER

test('rich text pad - anon', async ({ }) => {
  test.setTimeout(240000)
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    
    await page.goto(`${url}`);
    // const pagePromise = page.waitForEvent('popup');

    await page.getByRole('link', { name: 'Rich Text' }).click();
    // await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad', status: 'passed',reason: 'Can anonymously create Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad', status: 'failed',reason: 'Can\'t anonymously create Rich Text document'}})}`);

  }  
  browser.close()


});

test('rich text pad - anon - change title', async ({ }) => {
  test.setTimeout(240000)
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    
    await page.goto(`${url}`);
    // const pagePromise = page.waitForEvent('popup');

    await page.getByRole('link', { name: 'Rich Text' }).click();
    // await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })

    const date = new Date()

    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    var weekday = days[date.getDay()]
    
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var month = months[date.getMonth()]

    const title = `Rich text - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
    await expect(page).toHaveTitle(title)


    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(title).fill('new doc title');
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('new doc title')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad', status: 'passed',reason: 'Can anonymously create Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad', status: 'failed',reason: 'Can\'t anonymously create Rich Text document'}})}`);

  }  
  browser.close()


});

test('rich text pad - anon - input text', async ({ }) => {
  test.setTimeout(240000)
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    
    await page.goto(`${url}`);
    // const pagePromise = page.waitForEvent('popup');

    await page.getByRole('link', { name: 'Rich Text' }).click();
    // await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('Hello');
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('Hello')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad', status: 'passed',reason: 'Can anonymously create Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad', status: 'failed',reason: 'Can\'t anonymously create Rich Text document'}})}`);

  }  
  browser.close()


});

test('drive - anon - pad', async ({ }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    test.setTimeout(240000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Drive' }).click();
    await expect(page).toHaveURL(`${url}/drive/`, { timeout: 10000 })
    await page.goto(`${url}/drive/`);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)

    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click()
    const page1Promise = page.waitForEvent('popup');
    
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().waitFor()
    // await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().click()
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Rich Text' }).click();
    const page1 = await page1Promise;
    await page1.waitForLoadState('networkidle');
    await page1.waitForTimeout(50000)
    await page1.frameLocator('#sbox-iframe').locator('body').waitFor()
    await expect(page1).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 10000 })

   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > pad', status: 'passed',reason: 'Can anonymously navigate to Drive and create Pad'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > pad', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and create Pad'}})}`);

  }  
  browser.close()

});