const { test, expect } = require('@playwright/test');
const { chromium } = require('@playwright/test');
const { Browser } = require('selenium-webdriver');

test.describe.configure({ mode: 'parallel' });

// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'

// // ANONYMOUS USER

test('form - anon', async ({ }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    test.setTimeout(240000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Form' }).click();
    await page.waitForLoadState('networkidle');
     await expect(page).toHaveURL(new RegExp(`^${url}/form/#/`), { timeout: 100000 })
    await page.waitForTimeout(20000)
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })

    // await iframe.click()
    // await iframe.type('Test text')
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'passed',reason: 'Can anonymously create Form'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'failed',reason: 'Can\'t anonymously create Form'}})}`);

  }  
  browser.close()

});