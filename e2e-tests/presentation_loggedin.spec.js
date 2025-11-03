const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');
const { Cleanup } = require('./cleanup.js');

const fs = require('fs');
require('dotenv').config();
const os = require('os');

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
  await page.goto(`${url}/presentation`);
  await fileActions.createFile.waitFor();
  await fileActions.createFile.click();
  await fileActions.fileSaved.waitFor();

});

test('loggedin - presentation - import template', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'example template content');

    await fileActions.saveTemplate(mobile);
    await fileActions.templateName.fill('example presentation template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/presentation/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);
    await fileActions.templateSpan('example presentation template').click();
    await fileActions.fileSaved.waitFor();
    await fileActions.docEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('example template content');

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example presentation template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(fileActions.mainFrame.getByText('example template')).toHaveCount(0);
    
    await fileActions.toSuccess('Can import template into Presentation document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t import template into Presentation document');
  }
});

test('loggedin - presentation - import file (odp)', async ({ page, context }) => {
  try {
    
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);

    await fileChooser.setFiles('testdocuments/test presentation.odp');

    await page.waitForTimeout(6000)
    await fileActions.okButton.waitFor({state: 'visible'})
    await fileActions.okButton.click({force: true})
    await page.waitForTimeout(6000)
    await fileActions.okButton.click({force: true})

    await fileActions.fileSaved.waitFor();
    await fileActions.docEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('test text');

    await fileActions.toSuccess('Can import .odp file into Presentation document');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t import .odp file into Presentation document');
  }
});

test('loggedin - presentation - history (restore)', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click();
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');

    await fileActions.history(mobile);
    await fileActions.historyFastPrev.click()
    await fileActions.fileSaved.waitFor()
    await fileActions.waitForSync.waitFor({state: 'hidden'})
    await expect(fileActions.warningModal).toHaveCount(0)

    await fileActions.docEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toEqual('');
    await fileActions.restore.click();
    await fileActions.okButton.click();

    await fileActions.fileSaved.waitFor()
    await fileActions.waitForSync.waitFor({state: 'hidden'})
    await expect(fileActions.warningModal).toHaveCount(0)

    await fileActions.docEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText2 = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText2.trim()).toEqual('');
    
    await fileActions.toSuccess( 'Can restore history in Presentation document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t restore history in Presentation document');
  }
});

test('loggedin - presentation - snapshot (history)', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click();
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');
    await fileActions.history(mobile);
    await fileActions.historyFastPrev.click()
    await expect(fileActions.warningModal).toHaveCount(0)

    await fileActions.createSnapshot.click();
    await fileActions.snapshotTitle.waitFor();
    await fileActions.snapshotTitle.fill('test snapshot');
    await fileActions.newSnapshot.click();
    await fileActions.closeSnapshots.click()
    await fileActions.closeHistory.click()
    await fileActions.fileSaved.waitFor()

    await fileActions.filemenuClick(mobile)
    await fileActions.fileMenuItem('Snapshots').click();
    await fileActions.mainFrame.getByText('test snapshot').hover();

    const page1Promise = page.waitForEvent('popup');
    await fileActions.openButton.click();
    const page1 = await page1Promise;
    const fileActions1 = new FileActions(page1)

    await fileActions1.docEditor.click();
    await page1.keyboard.press('Control+A');
    await page1.keyboard.press('Control+C');
    const clipboardText = await page1.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toEqual('');
    
    await fileActions.toSuccess('Can create and load Presentation history snapshots');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and load Presentation history snapshots');
  }
});

test('loggedin - presentation - import file (pptx)', async ({ page, context }) => {
  try {
    
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);

    await fileChooser.setFiles('testdocuments/test presentation.pptx');
    await fileActions.okButton.click()
    await fileActions.fileSaved.waitFor();
    await fileActions.docEditor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('test text');

    await fileActions.toSuccess('Can import .pptx file into Presentation document');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t import .pptx file into Presentation document');
  }
});

test('loggedin - presentation - insert image', async ({ page, context }) => {
  try {

    await expect(page).toHaveScreenshot( { maxDiffPixels: 6000 });

    await fileActions.insertTab.click({force: true});
    await fileActions.insertImg.click();
    await fileActions.imgFromFile.click();

    const fileChooserPromise = page.waitForEvent('filechooser');
    await fileActions.uploadFile.click()

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/teamavatar.png');

    await fileChooser.setFiles('testdocuments/test sheet.xlsx');
    await fileActions.okButtonSecure.click();
    await fileActions.mainFrame.getByText('Your file (teamavatar.png)').waitFor()
    await page.waitForTimeout(3000)
    await expect(page).toHaveScreenshot( { maxDiffPixels: 6000 });

    await fileActions.toSuccess( 'Can insert image into Presentation');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t insert image into Presentation');
  }
});