const { test, expect } = require('@playwright/test');
const { chromium } = require('@playwright/test');
const { Browser } = require('selenium-webdriver');

test.describe.configure({ mode: 'parallel' });

// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'

test('drive - anon - whiteboard', async ({ }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
      test.setTimeout(240000)
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
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Whiteboard' }).click();
      const page1 = await page1Promise;
      await page1.waitForLoadState('networkidle');
      await page1.waitForTimeout(50000)
      await page1.frameLocator('#sbox-iframe').locator('body').waitFor()
      await expect(page1).toHaveURL(new RegExp(`^${url}/whiteboard/#/`), { timeout: 100000 })

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > whiteboard', status: 'passed',reason: 'Can anonymously navigate to Drive and create Whiteboard'}})}`);
  } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > whiteboard', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and create Whiteboard'}})}`);

  }  
    browser.close()

});



test('whiteboard - anon', async ({  }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(240000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Whiteboard' }).click();
    await expect(page).toHaveURL(new RegExp(`^${url}/whiteboard/#/`), { timeout: 10000 }) 
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000)
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'whiteboard', status: 'passed',reason: 'Can anonymously create Whiteboard'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'whiteboard', status: 'failed',reason: 'Can\'t anonymously create Whiteboard'}})}`);

  }  
  browser.close()

});