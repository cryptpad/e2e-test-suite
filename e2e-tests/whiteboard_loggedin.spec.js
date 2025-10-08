const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
require('dotenv').config();
const { Cleanup } = require('./cleanup.js');
const { FileActions } = require('./fileactions.js');

let page1;
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
  await fileActions.createFile.waitFor();
});

test('screenshot loggedin - whiteboard - display history (previous author)', async ({ page, browser }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }, force: true
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }, force: true
    });
    await page.mouse.up();

    await fileActions.share(mobile);
    const clipboardText = await fileActions.getLinkAfterCopyRole(/^Edit$/, mobile)

    page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`);
    await fileActions1.whiteBoardCanvas.waitFor()
    const fileActions1 = new FileActions(page1);
    await fileActions1.whiteBoardCanvas.hover({
      position: {
        x: 287,
        y: 227
      }, force: true
    });
    await page1.mouse.down();
    await fileActions1.whiteBoardCanvas.hover({
      position: {
        x: 286,
        y: 314
      }, force: true
    });
    await page1.mouse.up();

    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await fileActions.historyPrevLast.click();
    await expect(page1).toHaveScreenshot();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'failed', reason: 'Can\'t clear whiteboard canvas' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'passed', reason: 'Can clear whiteboard canvas' } })}`);
  }
});

test('screenshot loggedin - whiteboard - save as and import template', async ({ page }) => {
  try {
    await fileActions.createFile.click();

    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }, force: true
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }, force: true
    });
    await page.mouse.up();

    await fileActions.saveTemplate(mobile);
    await fileActions.templateName.fill('example whiteboard template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/whiteboard/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);

    await fileActions.secureFrame.getByText('example whiteboard template').click();
    await fileActions.fileSaved.waitFor();
    await expect(page).toHaveScreenshot();

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example whiteboard template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(fileActions.secureFrame.getByText('example whiteboard template')).toHaveCount(0);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - save as template', status: 'passed', reason: 'Can save and use Whiteboard document as template ' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard -save as template', status: 'failed', reason: 'Can\'t save and use Whiteboard document as template' } })}`);
  }
});
