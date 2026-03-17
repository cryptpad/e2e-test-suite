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
  await page.goto(`${url}/sheet`);
  await fileActions.createFile.waitFor();
  await fileActions.createFile.click();
  await fileActions.fileSaved.waitFor();

});

test('loggedin - sheet - import template', async ({ page, context }) => {
  test.skip(mobile, 'mobile incompatibility with evaluating 2nd window text content')
  
  try {

    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'example template content');
    await page.keyboard.press('Enter');

    await fileActions.saveTemplate(mobile);
    await fileActions.templateName.fill('example sheet template');
    await fileActions.okButton.click();
    await page.waitForTimeout(3000);
    await page.goto(`${url}/sheet/`);
    await fileActions.createFile.click();
    await fileActions.importTemplate(mobile);
    await fileActions.templateSpan('example sheet template').click();
    await page.waitForTimeout(5000);

    await fileActions.fileSaved.waitFor();
    await fileActions.waitForSync.waitFor({state: "hidden"})

    await fileActions.docEditor.click({force: true});
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('example template content');

    await page.goto(`${url}/drive/`);
    await fileActions.driveSideMenu.getByText('Templates').click();
    await fileActions.driveContentFolder.getByText('example sheet template').click({ button: 'right' });
    await fileActions.destroyItem.click();
    await fileActions.okButton.click();
    await expect(fileActions.secureFrame.getByText('example template')).toHaveCount(0);

    await fileActions.toSuccess('Can save and import Sheet template');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t save and import Sheet template');
  }
});

test('loggedin - sheet - import file (xlsx)', async ({ page, context }) => {
  test.skip(mobile, 'mobile incompatibility with evaluating 2nd window text content')
  
  try {
    
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);

    await fileChooser.setFiles('testdocuments/test sheet.xlsx');
    await fileActions.okButton.click()
    await fileActions.fileSaved.waitFor();
    await fileActions.docEditor.click({force: true});
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('test text');

    await fileActions.toSuccess('Can import .xlsx file into Sheet document');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t import .xlsx file into Sheet document');
  }
});

test('loggedin - sheet - import file (ods)', async ({ page, context }) => {
  test.skip(mobile, 'mobile incompatibility with evaluating 2nd window text content')
  
  try {
    
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);

    await fileChooser.setFiles('testdocuments/test sheet ods.ods');
    await fileActions.okButton.click()
    await fileActions.fileSaved.waitFor();
    await fileActions.docEditor.click({force: true});
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('test text');

    await fileActions.toSuccess('Can import .ods file into Sheet document');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t import .ods file into Sheet document');
  }
});


test('loggedin - sheet - snapshot (history)', async ({ page, context }) => {
  test.skip(mobile, 'mobile incompatibility with evaluating 2nd window text content')
  
  test.skip('#2090')
  try {

    await fileActions.docEditor.click();
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');
    await page.keyboard.press('Enter');

    await fileActions.history(mobile);
    await fileActions.historyFastPrev.click()
    await expect(fileActions.warningModal).toHaveCount(0)

    await fileActions.createSnapshot.click();
    await fileActions.snapshotTitle.fill('test snapshot');
    await fileActions.newSnapshot.click();
    await fileActions.closeSnapshots.click()
    await fileActions.closeHistory.click()
    await fileActions.fileSaved.waitFor()

    await fileActions.filemenuClick(mobile);
    await fileActions.fileMenuItem('Snapshots').click();
    await fileActions.mainFrame.getByText('test snapshot').hover();

    const page1Promise = page.waitForEvent('popup');
    await fileActions.openButton.click();
    const page1 = await page1Promise;
    const fileActions1 = new FileActions(page1)

    await fileActions1.docEditor.click({force: true});
    await page1.keyboard.press('Control+A');
    await page1.keyboard.press('Control+C');
    const clipboardText = await page1.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toEqual('');
    
    await fileActions.toSuccess( 'Can create and load Sheet history snapshots');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and load Sheet history snapshots');
  }
});

test('screenshot loggedin - sheet - insert image', async ({ page, context }) => {
  test.skip(mobile, '#2093')
  
  try {

    await expect(page).toHaveScreenshot( { maxDiffPixels: 16120 });
    
    await fileActions.insertTab.click({force: true});
    await fileActions.insertImg.click();
    await fileActions.imgFromFile.click();

    const fileChooserPromise = page.waitForEvent('filechooser');
    await fileActions.uploadFileSecure.click()

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/teamavatar.png');

    await fileActions.okButtonSecure.click();
    await fileActions.mainFrame.getByText('Your file (teamavatar.png)').waitFor()
    await page.waitForTimeout(3000)
    await expect(page).toHaveScreenshot( { maxDiffPixels: 17160 });

    await fileActions.toSuccess( 'Can insert image into Sheet');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t insert image into Sheet');
  }
});

test('loggedin - sheet - history (restore)', async ({ page, context }) => {
  test.skip(mobile, 'mobile incompatibility with evaluating 2nd window text content')
  
  try {

    await fileActions.docEditor.click();
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');
    await page.keyboard.press('Enter');

    await fileActions.history(mobile);

    await fileActions.historyFastPrev.click()
    await fileActions.fileHistory.waitFor()
    await fileActions.waitForSync.waitFor({state: 'hidden'})
    await expect(fileActions.warningModal).toHaveCount(0)

    await fileActions.docEditor.click({force: true});
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    await page.waitForTimeout(3000)

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toEqual('');
    await fileActions.restore.click();
    await fileActions.okButton.click();

    await fileActions.fileSaved.waitFor()
    await fileActions.waitForSync.waitFor({state: 'hidden'})
    await expect(fileActions.warningModal).toHaveCount(0)

    await fileActions.docEditor.click({force: true});
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText2 = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText2.trim()).not.toContain('test text');
    
    await fileActions.toSuccess( 'Can restore history in Presentation document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t restore history in Presentation document');
  }
});