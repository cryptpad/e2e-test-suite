const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');
const fs = require('fs');
require('dotenv').config();
const os = require('os');

let page1;
let mobile;
let browserstackMobile;
let platform;
const local = !!process.env.PW_URL.includes('localhost');
let fileActions;
let fileActions1

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);
  mobile = isMobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  platform = os.platform();
  fileActions = new FileActions(page);
  await fileActions.loadFileType("code")
});

test('anon - code - input text #1367', async ({ page }) => {
  test.fixme(mobile, 'mobile editor preview bug');
  try {
    await fileActions.codeEditor.click();
    await fileActions.typeTestTextCode(mobile, 'test text');
    await expect(fileActions.codeEditor.getByText('test text')).toBeVisible();
    await expect(fileActions.codepreview.getByText('test text')).toBeVisible();

    await fileActions.toSuccess('Can create Code document and input text');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t acreate Code document and input text');
  }
});

test('code - file menu - history #1367', async ({ page }) => {
  test.fixme(mobile, 'mobile editor preview bug');
  try {
    await fileActions.codeEditor.click();
    await fileActions.typeTestTextCode(mobile, 'test text');
    await expect(fileActions.codeEditor.getByText('test text')).toBeVisible();
    await expect(fileActions.codepreview.getByText('test text')).toBeVisible();
    await fileActions.history(mobile);
    await fileActions.historyPrevFirst.click();
    await expect(fileActions.codeEditor.getByText('test text')).toHaveCount(0);
    await expect(fileActions.codepreview.getByText('test text')).toBeHidden();

   await fileActions.toSuccess('Can view Code document history');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e,  'Can\'t view Code document history');
  }
});

test('code - toggle toolbar #1367', async ({ page }) => {
  test.fixme(mobile, 'mobile editor preview bug');
  try {
    await expect(fileActions.codeToolbar).toBeHidden();
    await fileActions.toolbarButton.click();
    await expect(fileActions.codeToolbar).toBeVisible();

    await fileActions.toSuccess('Can toggle toolbar in Code document');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t toggle toolbar in Code document');
  }
});

test('code - toggle preview #1367', async ({ page }) => {
  test.fixme(mobile, 'mobile editor preview bug');
  try {
    await fileActions.typeTestTextCode(mobile, 'test text');
    await expect(fileActions.codepreview.getByText('test text')).toBeVisible();

    await fileActions.togglePreview(mobile);

    await expect(fileActions.codepreview.getByText('test text')).toBeHidden();

    await fileActions.toSuccess('Can toggle preview in Code document' );
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t toggle preview in Code document');
  }
});

test('code -  make a copy #1367', async ({ page }) => {
  test.fixme(mobile, 'mobile editor preview bug');
  try {
    await fileActions.codeEditor.click();
    await fileActions.typeTestTextCode(mobile, 'test text');

    await expect(fileActions.codepreview.getByText('test text')).toBeVisible();
    await fileActions.filemenuClick(mobile);
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await fileActions.fileMenuItem(' Make a copy').click()
    ]);

    await expect(page1).toHaveURL(new RegExp(`^${url}/code`), { timeout: 100000 });
    fileActions1 = new FileActions(page1);

    await page1.waitForTimeout(4000);
    await fileActions1.codepreview.getByText('Test text').waitFor();
    await expect(fileActions1.codepreview.getByText('test text')).toBeVisible();

    await fileActions.toSuccess('Can make a copy of Code document');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t make a copy of Code document');
  }
});

test('code - import file #1367', async ({ page, context }) => {
  test.fixme(mobile, 'mobile editor preview bug');
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    await fileActions.codeEditor.waitFor();
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);

    await fileChooser.setFiles('/testdocuments/myfile.html');
    await expect(fileActions.codeEditor.getByText('Test text here')).toBeVisible();
    await expect(fileActions.codepreview.getByText('Test text here')).toBeVisible();

    await fileActions.toSuccess('Can import file into Code document');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t import file into Code document');
  }
});

test('code - export (md)', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');

  try {
    await fileActions.codeEditor.click();
    await fileActions.typeTestTextCode(mobile, 'test text');
    await expect(fileActions.codeEditor.getByText('test text')).toBeVisible();
    await fileActions.export(mobile);
    await fileActions.textbox.fill('test code');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test code');
    const readData = fs.readFileSync('/tmp/test code', 'utf8');
    if (readData.trim() === 'test text') {
      await fileActions.toSuccess('Can export Code document as .md');
    } else {
      await fileActions.toFailure(e, 'Can\'t export Code document as .md');
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - export (md)', status: 'failed', reason: 'Can\'t export Code document as .md' } })}`);
  }
});

test('code - share at a moment in history', async ({ page, browser }) => {
  try {
    await fileActions.codeEditor.click();
    await page.keyboard.press('t');
    await page.keyboard.press('e');
    await page.keyboard.press('s');
    await page.keyboard.press('t');
    await page.keyboard.press(' ');
    await page.keyboard.press('t');
    await page.keyboard.press('e');
    await page.keyboard.press('x');
    await page.keyboard.press('t');
    await expect(fileActions.codeEditor.getByText('test text')).toBeVisible();


    let key;
    if (platform === 'darwin') {
      key = 'Meta';
    } else {
      key = 'Control';
    }
    await page.keyboard.press(`${key}+a`);
    await page.keyboard.press('Backspace');
    await expect(fileActions.codeEditor.getByText('test text')).toHaveCount(0);

    var clipboardText = await fileActions.getShareLink()
    page1 = await browser.newPage();

    await page1.goto(`${clipboardText}`);

    await page1.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
    await expect(fileActions.codeEditor.getByText('test text')).toHaveCount(0);

    await fileActions.toSuccess('Can share code document at a specific moment in history')
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t share code document at a specific moment in history' )
  }
});
