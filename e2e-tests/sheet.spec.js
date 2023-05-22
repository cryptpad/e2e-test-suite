const { test, expect } = require('@playwright/test');
const { chromium } = require('@playwright/test');
const { Browser } = require('selenium-webdriver');

test.describe.configure({ mode: 'parallel' });

// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'

test('sheet doc - anon', async ({ }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(240000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Sheet' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/sheet/#/`), { timeout: 100000 })
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay')).toBeVisible()
    // await page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay').click({
    //   position: {
    //     x: 69,
    //     y: 27
    //   }
    // });
    // await page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay').click({
    //   position: {
    //     x: 131,
    //     y: 27
    //   }
    // });
    // await page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay').click({
    //   position: {
    //     x: 67,
    //     y: 46
    //   }
    // });
    // await page.frameLocator('#sbox-iframe').frameLocator('iframe[name="frameEditor"]').locator('#ws-canvas-graphic-overlay').click({
    //   position: {
    //     x: 143,
    //     y: 47
    //   }
    // });
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'sheet', status: 'passed',reason: 'Can anonymously create Sheet'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'sheet', status: 'failed',reason: 'Can\'t anonymously create Sheet'}})}`);

  }  
  browser.close()

});

test('drive - anon - sheet', async ({  }) => {
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
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click();
    const page1Promise = page.waitForEvent('popup');
    
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Sheet' }).click();
    const page1 = await page1Promise;
    await page1.waitForLoadState('networkidle');
    await page1.waitForTimeout(50000)
    await page1.frameLocator('#sbox-iframe').locator('body').waitFor()
    await expect(page1).toHaveURL(new RegExp(`^${url}/sheet/#/`), { timeout: 10000 })

   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > sheet', status: 'passed',reason: 'Can anonymously navigate to Drive and create Sheet'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > sheet', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and create Sheet'}})}`);

  }  
  browser.close()

});