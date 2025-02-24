const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
require('dotenv').config();
const { Cleanup } = require('./cleanup.js');
const { FileActions } = require('./fileactions.js');

let pageOne;
const local = !!process.env.PW_URL.includes('localhost');
let mobile;
let cleanUp;
let fileActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  mobile = isMobile;
  const template = testInfo.title.match(/import template/);
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/whiteboard`);
  fileActions = new FileActions(page);
  // await page.waitForTimeout(10000);
});

test('screenshot whiteboard - display history (previous author)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

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
    // await page.waitForTimeout(3000);

    await fileActions.share(mobile);
    await fileActions.clickLinkTab(mobile);
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await fileActions.shareCopyLink.click();
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

    await fileActions.history(mobile);
    await fileActions.historyPrev.click();
    await fileActions.historyPrev.click();
    await expect(pageOne).toHaveScreenshot();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'failed', reason: 'Can\'t clear whiteboard canvas' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'passed', reason: 'Can clear whiteboard canvas' } })}`);
  }
});

test('whiteboard - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.click();

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

    await fileActions.saveTemplate(mobile);
    await page.frameLocator('#sbox-iframe').locator('.dialog').getByRole('textbox').fill('example whiteboard template');
    await fileActions.okButton.click();
    // await page.waitForTimeout(3000);
    await page.goto(`${url}/whiteboard/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await page.frameLocator('#sbox-secure-iframe').getByText('example whiteboard template').click();

    await expect(page).toHaveScreenshot();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example whiteboard template').click({ button: 'right' });
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example whiteboard template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - save as template', status: 'passed', reason: 'Can save and use Whiteboard document as template ' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard -save as template', status: 'failed', reason: 'Can\'t save and use Whiteboard document as template' } })}`);
  }
});
