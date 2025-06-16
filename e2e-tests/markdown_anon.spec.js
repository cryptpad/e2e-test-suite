const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions, StoreModal } = require('./fileactions.js');

const fs = require('fs');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let mobile;
let browserstackMobile;
let fileActions;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(90000);
  mobile = testInfo.project.use.mobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  fileActions = new FileActions(page);
  await fileActions.loadFileType("slide")

});

test('anon - slide - input text into editor and create slide', async ({ page }) => {
  try {
    await fileActions.slideEditor.click();
    await fileActions.slideEditor.type('Test text');
    await expect(fileActions.slideEditor.getByText('Test text')).toBeVisible();
    await expect(fileActions.slideContent.getByText('Test text')).toBeVisible();

    await fileActions.toSuccess( 'Can anonymously create Markdown slides' );
  } catch (e) {
   await fileActions.toFailure(e,'Can\'t anonymously create Markdown slides' );
  }
});

test('anon - slide - create new slide', async ({ page }) => {
  try {
    await fileActions.slideEditor.click();
    await fileActions.slideEditor.type('Test text');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await fileActions.slideEditor.type('---');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await fileActions.slideEditor.type('More test text');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await fileActions.slideContent.filter({ hasText: 'Test text' }).click();
    await fileActions.nextSlide.hover();
    await fileActions.nextSlide.click();
    await expect(fileActions.slideContent.getByText('More test text')).toBeVisible();

    await fileActions.toSuccess( 'Can anonymously create Markdown slides');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t anonymously create Markdown slides');
  }
});

test('anon - slide - toggle toolbar', async ({ page }) => {
  try {
    await fileActions.toggleTools(mobile);
    await expect(fileActions.codeToolbar).toBeVisible();
    await fileActions.toggleTools(mobile);
    await expect(fileActions.codeToolbar).toBeHidden();

    await fileActions.toSuccess('Can input ');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t anonymously create Markdown slides');
  }
});

test('anon - slide - toggle preview', async ({ page }) => {
  try {
    await fileActions.slideEditor.click();
    await fileActions.slideEditor.type('Test text');

    await fileActions.togglePreview(mobile);
    await expect(fileActions.codeEditor.getByText('Test text')).toBeVisible();
    await expect(fileActions.slideContent.getByText('Test text')).toBeHidden();

    await fileActions.togglePreview(mobile);
    await expect(fileActions.codeEditor.getByText('Test text')).toBeVisible();
    await expect(fileActions.slideContent.getByText('Test text')).toBeVisible();

    await fileActions.toSuccess('Can anonymously create Markdown slides');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t anonymously create Markdown slides');
  }
});

test('anon - slide - make a copy', async ({ page, context }) => {
  try {
    await fileActions.slideEditor.click();
    await fileActions.slideEditor.type('Test text');

    await fileActions.filemenuClick(mobile);
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await fileActions.fileMenuItem(' Make a copy').click()
    ]);

    await expect(page1).toHaveURL(new RegExp(`^${url}/slide`), { timeout: 100000 });
    const fileActions1 = new FileActions(page1)
    await fileActions1.codeEditor.getByText('Test text').waitFor();
    await expect(fileActions1.codeEditor.getByText('Test text')).toBeVisible();

    await fileActions.toSuccess('Can\'t create a copy of a Markdown document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create a copy of a Markdown document');
  }
});

test('anon - slide - export (md)', async ({ page, context }) => {
  try {
    await fileActions.slideEditor.click();
    await fileActions.slideEditor.type('Test text');
    await fileActions.export(mobile);
    await fileActions.textbox.fill('test markdown');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test markdown');

    const readData = fs.readFileSync('/tmp/test markdown', 'utf8');
    if (readData.trim() === 'Test text') {
      await fileActions.toSuccess( 'Can export Markdown document as .md');
    } else {
      await fileActions.toFailure(e, 'Can\'t export Markdown document as .md' );
    }
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Markdown document as .md');
  }
});

test('anon - slide - share at a moment in history', async ({ page, context }) => {
  try {
    await fileActions.slideEditor.click();
    await fileActions.slideEditor.type('One moment in history');
    await page.waitForTimeout(3000)
    await fileActions.slideEditor.fill('');
    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await fileActions.historyPrevLast.click();

    var clipboardText = await fileActions.getShareLink()

    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await expect(fileActions1.codeEditor.getByText('One moment in history')).toBeHidden();

    await fileActions.toSuccess( 'Can share Markdown at a specific moment in history');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t share Markdown at a specific moment in history');
  }
});

test('anon - slide - history (previous version)', async ({ page, context }) => {
  try {
    await fileActions.slideEditor.click();
    await fileActions.slideEditor.type('Test text');

    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await expect(fileActions.mainFrame.getByText('Test text')).toHaveCount(0);

    await fileActions.toSuccess('Can create Markdown document and view history');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create Markdown document and view history');
  }
});

test('anon - slide - import file', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);
    await fileChooser.setFiles('testdocuments/testslide.md');

    await expect(fileActions.slideEditor.getByText('1test text2​3---4​5new text')).toBeVisible();

    await fileActions.toSuccess( 'Can import file into Slide document');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t import file into Slide document');
  }
});
