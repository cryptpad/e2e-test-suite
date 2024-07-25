const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
require('dotenv').config();
const { Cleanup } = require('./cleanup.js');
const { FileActions } = require('./fileactions.js');

let pageOne; 
const local = !!process.env.PW_URL.includes('localhost');
let isMobile;
let cleanUp;

test.beforeEach(async ({ page }, testInfo) => {
    const template = testInfo.title.match(/import template/);
    if (template) {
      cleanUp = new Cleanup(page);
      await cleanUp.cleanTemplates();
    }

  await page.goto(`${url}/whiteboard`);
  await page.waitForTimeout(10000);
});


test('screenshot whiteboard - display history (previous author)', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await page.waitForTimeout(3000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Copy link' }).click();
    const clipboardText = await page.evaluate('navigator.clipboard.readText()');

    pageOne = await browser.newPage();
    await pageOne.goto(`${clipboardText}`);
    await pageOne.waitForTimeout(5000);
    await pageOne.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await pageOne.mouse.down();
    await pageOne.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await pageOne.mouse.up();
   
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (!local) {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' History' }).locator('a').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
    await expect(pageOne).toHaveScreenshot();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'failed', reason: 'Can\'t clear whiteboard canvas' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'passed', reason: 'Can clear whiteboard canvas' } })}`);
  }
});

test('whiteboard - save as and import template', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
    }
    await page.frameLocator('#sbox-iframe').locator('.dialog').getByRole('textbox').fill('example whiteboard template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/whiteboard/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    if (local) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
    }
    await page.frameLocator('#sbox-secure-iframe').getByText('example whiteboard template').click();

    await expect(page).toHaveScreenshot();

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree').getByText('Templates').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example whiteboard template').click({ button: 'right' });
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example whiteboard template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - save as template', status: 'passed', reason: 'Can save and use Whiteboard document as template ' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard -save as template', status: 'failed', reason: 'Can\'t save and use Whiteboard document as template' } })}`);
  }
});