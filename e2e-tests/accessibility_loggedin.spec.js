const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright')
const fs = require('fs');
require('dotenv').config();
const os = require('os');

let pageOne;
let isMobile;
let browserstackMobile;
let platform;
const local = !!process.env.PW_URL.includes('localhost');

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);

  isMobile = testInfo.project.use.isMobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  platform = os.platform();

});

test('settings - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/drive`);
    await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-user-dropdown.cp-dropdown-container').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByText('Settings').click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    let accessibilityScanResultsString;
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    if (accessibilityScanResults.violations.length) {
      accessibilityScanResults.violations.forEach(function(violation, index) {
        accessibilityScanResultsString = `Settings \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
        console.log(accessibilityScanResultsString)
      })
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' code - input text', status: 'passed', reason: 'Can create Code document and input text' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - input text', status: 'failed', reason: 'Can\'t acreate Code document and input text' } })}`);
  }
});

test('calendar - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/calendar`);
    await page.waitForTimeout(10000);
    let accessibilityScanResultsString;
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    if (accessibilityScanResults.violations.length) {
      accessibilityScanResults.violations.forEach(function(violation, index) {
        accessibilityScanResultsString = `Calendar \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
        console.log(accessibilityScanResultsString)
      })
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' code - input text', status: 'passed', reason: 'Can create Code document and input text' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - input text', status: 'failed', reason: 'Can\'t acreate Code document and input text' } })}`);
  }
});

test('drive (user) - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/drive`);
    await page.waitForTimeout(10000);
    let accessibilityScanResultsString;
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    if (accessibilityScanResults.violations.length) {
      accessibilityScanResults.violations.forEach(function(violation, index) {
        accessibilityScanResultsString = `Drive (user) \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
        console.log(accessibilityScanResultsString)
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (user) - accessibility', status: 'failed', reason: 'Drive (user) is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (user) - accessibility', status: 'passed', reason: 'Drive (user) is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (user) - accessibility', status: 'failed', reason: 'Drive (user) is not accessible' } })}`);
  }
});

test('teams - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/teams`);
    await page.waitForTimeout(10000);
    let accessibilityScanResultsString;
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    if (accessibilityScanResults.violations.length) {
      accessibilityScanResults.violations.forEach(function(violation, index) {
        accessibilityScanResultsString = `Teams \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
        console.log(accessibilityScanResultsString)
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'teams - accessibility', status: 'failed', reason: 'Drive is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (anon) - accessibility', status: 'passed', reason: 'Drive is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - input text', status: 'failed', reason: 'Can\'t acreate Code document and input text' } })}`);
  }
});

test('teams (admin) - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/teams`);
    await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({ timeout: 3000 });

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();
    await page.waitForTimeout(2000);

    let accessibilityScanResultsString;
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    if (accessibilityScanResults.violations.length) {
      accessibilityScanResults.violations.forEach(function(violation, index) {
        accessibilityScanResultsString = `Teams \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
        console.log(accessibilityScanResultsString)
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'teams - accessibility', status: 'failed', reason: 'Drive is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (anon) - accessibility', status: 'passed', reason: 'Drive is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - input text', status: 'failed', reason: 'Can\'t acreate Code document and input text' } })}`);
  }
});

