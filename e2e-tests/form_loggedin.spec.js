const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { caps, patchCaps, url, nextMondaySlashFormat } = require('../browserstack.config.js')

var fs = require('fs');

let browser;
let page;
let browserName;
let context;

test.beforeEach(async ({ playwright }, testInfo) => {
  
  test.setTimeout(2400000);
  const isMobile = testInfo.project.name.match(/browserstack-mobile/);
  if (isMobile) {
    patchMobileCaps(
      testInfo.project.name,
      `${testInfo.file} - ${testInfo.title}`
    );
    device = await playwright._android.connect(
      `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
        JSON.stringify(caps)
      )}`
    );
    await device.shell("am force-stop com.android.chrome");
    context = await device.launchBrowser();
  } else {
    patchCaps(testInfo.project.name, `${testInfo.title}`);
    delete caps.osVersion;
    delete caps.deviceName;
    delete caps.realMobile;
    browser = await playwright.chromium.connect({
      wsEndpoint:
        `wss://cdp.browserstack.com/playwright?caps=` +
        `${encodeURIComponent(JSON.stringify(caps))}`,
    });
    context = await browser.newContext({ storageState: 'auth/mainuser.json' }, testInfo.project.use);
  }
  // browser = await firefox.launch({
  //   firefoxUserPrefs: {
  //     'dom.events.asyncClipboard.readText': true,
  //     'dom.events.testing.asyncClipboard': true,
  //   },
  //   locale: 'en-GB',
  // })
  // context = await browser.newContext({ storageState: 'auth/mainuser.json' })
  page = await context.newPage();

  await page.goto(`${url}/form`)
  await page.waitForTimeout(15000)
});



test('form - create quick scheduling poll', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByText('Quick Scheduling Poll').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Poll$/ }).locator('span')).toBeVisible()
    
    await page.waitForTimeout(10000)
    await expect(page.frameLocator('#sbox-iframe').getByText(`${nextMondaySlashFormat}`)).toBeVisible()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    await page1.waitForTimeout(5000)
    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.close()
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({hasText: 'Responses'}).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('heading', { name: 'Total responses: 1' })).toBeVisible()

    await page.waitForTimeout(10000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/Total1\(0\)0\(0\)/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - quick scheduling poll', status: 'passed',reason: 'Can create quick scheduling poll'}})}`);

    
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - quick scheduling poll', status: 'failed',reason: 'Can\'t create quick scheduling poll'}})}`);

  }  
  
});


test(`form - save as and import template - THIS TEST WILL FAIL`, async ({}) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('example text');
    await page.waitForTimeout(3000)
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');
    await page.waitForTimeout(3000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
    await page.frameLocator('#sbox-iframe').locator('.dialog').getByRole('textbox').fill('example form template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000)
    await page.goto(`${url}/form/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('example form template').click();

    await expect(page.frameLocator('#sbox-iframe').getByText('example text')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('example question?')
    await expect(page.frameLocator('#sbox-iframe').getByText('test option one')).toBeVisible(0)
    await expect(page.frameLocator('#sbox-iframe').getByText('test option two')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('test option three')).toBeVisible()

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').getByText('Templates').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example form template').click({button: 'right'});
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example form template')).toHaveCount(0)
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - save as template', status: 'passed',reason: 'Can save and use Form document as template '}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - save as template - THIS TEST WILL FAIL', status: 'failed',reason: 'Can\'t save and use Form document as template - THIS TEST WILL FAIL'}})}`);

  }  
});


test.afterEach(async ({  }) => {
    await browser.close()
  });