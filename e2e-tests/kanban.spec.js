const { test, expect } = require('@playwright/test');
const { chromium } = require('@playwright/test');
const { Browser } = require('selenium-webdriver');

test.describe.configure({ mode: 'parallel' });

// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'

test('kanban board - anon', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(240000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Kanban' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/kanban/#/`), { timeout: 100000 })
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
  browser.close()
});

test('kanban board - anon - change title', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(240000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Kanban' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/kanban/#/`), { timeout: 100000 })
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })

    const date = new Date()

    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    var weekday = days[date.getDay()]
    
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    var month = months[date.getMonth()]

    const title = `Kanban - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
    await expect(page).toHaveTitle(title)


    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(title).fill('new doc title');
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('new doc title')).toBeVisible()

    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
    browser.close()
});


test('kanban board - anon - new list', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(240000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Kanban' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/kanban/#/`), { timeout: 100000 })
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })


    await page.frameLocator('#sbox-iframe').locator('#kanban-addboard').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('New board')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'Done' }).click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('new title');
    await page.frameLocator('#sbox-iframe').locator('div:nth-child(5) > .kanban-board-inner > .kanban-drag').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('new title')).toBeVisible()

    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
  browser.close()
});

test('kanban board - anon - new list item', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(240000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Kanban' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/kanban/#/`), { timeout: 100000 })
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('example item');
    await page.frameLocator('#sbox-iframe').locator('div:nth-child(5) > .kanban-board-inner > .kanban-drag').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
  browser.close()
});

test('drive - anon - kanban', async ({  }) => {
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

  await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().waitFor()
  await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click();
  const page1Promise = page.waitForEvent('popup');
  
  await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().waitFor()
  await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Kanban' }).click();
  const page1 = await page1Promise;
  await page1.waitForLoadState('networkidle');
  await page1.waitForTimeout(50000)
  await page1.frameLocator('#sbox-iframe').locator('body').waitFor()
  await expect(page1).toHaveURL(new RegExp(`^${url}/kanban/#/`), { timeout: 100000 })

   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > kanban', status: 'passed',reason: 'Can anonymously navigate to Drive and create Kanban'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > kanban', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and create Kanban'}})}`);

  }  
  browser.close()

});