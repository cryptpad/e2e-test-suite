const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');
const { Cleanup } = require('./cleanup.js');

const fs = require('fs');
require('dotenv').config();
const os = require('os');
const mammoth = require('mammoth');
// const PDFParse = require('pdf-parse');
const PDFParser = require('pdf2json');
// import PDFParser from "pdf2json"; 

// const local = !!process.env.PW_URL.includes('localhost');

let mobile;
let browserName;
let browserstackMobile;
let fileActions;
let fileActions1
let cleanUp;


test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(90000);

  mobile = testInfo.project.use.mobile;
  browserName = testInfo.project.name.split(/@/)[0];
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
    const template = testInfo.title.match(/import template/);
    if (template) {
      cleanUp = new Cleanup(page);
      await cleanUp.cleanTemplates();
    }
  fileActions = new FileActions(page);
  await page.goto(`${url}/doc`);
    await fileActions.createFile.waitFor();
    await fileActions.createFile.click();
        await fileActions.fileSaved.waitFor();

});

test('loggedin - doc - import template', async ({ page, context }) => {
  try {


    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'example template content');

    await fileActions.saveTemplate(mobile);
    await fileActions.templateName.fill('example doc template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/doc/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);
    await fileActions.templateSpan('example doc template').click();
    await fileActions.fileSaved.waitFor();
    await fileActions.docEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('example template content');

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example doc template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example template')).toHaveCount(0);
    
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t input text into Document');
  }
});


test('loggedin - document - snapshot', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click();
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');
    await fileActions.history(mobile);
    await fileActions.historyFastPrev.click()
    await expect(page.locator('#sbox-iframe').contentFrame().locator('iframe[name="frameEditor"]').contentFrame().getByText('Warning')).toHaveCount(0)

    await page.locator('#sbox-iframe').contentFrame().locator('.cp-history-create-snapshot').click();
    await page.locator('#sbox-iframe').contentFrame().getByRole('textbox', { name: 'Snapshot title' }).fill('test snapshot');
    await page.locator('#sbox-iframe').contentFrame().getByRole('button', { name: 'New snapshot' }).click();
    await page.locator('#sbox-iframe').contentFrame().getByRole('navigation').getByRole('button', { name: 'Close' }).click()
    await page.locator('#sbox-iframe').contentFrame().locator('[data-original-title="Close the history"]').click()
    await fileActions.fileSaved.waitFor()

    await page.locator('#sbox-iframe').contentFrame().getByRole('button', { name: 'File' }).click();
    await page.locator('#sbox-iframe').contentFrame().getByRole('menuitem', { name: 'Snapshots' }).locator('a').click();
    await page.locator('#sbox-iframe').contentFrame().getByText('test snapshot').hover();

    await page.locator('#sbox-iframe').contentFrame().getByRole('button', { name: 'Open' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    await page1.locator('#sbox-iframe').contentFrame().getByText('You are currently viewing a').click();
    await fileActions.docEditor.click();

    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toEqual('');
    
    await fileActions.toSuccess( 'Can create and load Presentation snapshots');

  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and load Presentation snapshots');
  }
});