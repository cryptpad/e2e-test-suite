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
  await page.goto(`${url}`);
});

test('kanban board - anon - new list', async () => {
  
  try {
    await page.getByRole('link', { name: 'Kanban' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/kanban/#/`), { timeout: 100000 })

    await page.frameLocator('#sbox-iframe').locator('#kanban-addboard').waitFor()
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
  
});

test('kanban board - anon - new list item', async () => {
  
  try {
    await page.getByRole('link', { name: 'Kanban' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/kanban/#/`), { timeout: 100000 })

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('example item');
    await page.frameLocator('#sbox-iframe').locator('#cp-kanban-controls').click()
    await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});

test.afterEach(async () => {
  await browser.close()
});