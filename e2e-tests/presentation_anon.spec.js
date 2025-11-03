
const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');
const fs = require('fs');
require('dotenv').config();
const os = require('os');
const { PDFParse } = require('pdf-parse');

// const local = !!process.env.PW_URL.includes('localhost');

let mobile;
let browserName;
let browserstackMobile;
let fileActions;
let fileActions1
let page1

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(90000);

  mobile = testInfo.project.use.mobile;
  browserName = testInfo.project.name.split(/@/)[0];
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  fileActions = new FileActions(page);
  await fileActions.loadFileType("presentation")
});

test('anon - presentation - input text', async ({ page, context }) => {
  try {

    await fileActions.docEditorInput.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('test text');
    await fileActions.toSuccess( 'Can input text into Presentation');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t input text into Presentation');
  }
});

test('anon - presentation - add a slide', async ({ page, context }) => {
  try {

    await fileActions.addSlide.click();
    const pages = await fileActions.slideNumber.innerText()
    expect(pages).toContain('Slide 2 of 2')

    await fileActions.toSuccess( 'Can add a slide in Presentation');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t add a slide in Presentation');
  }
});

test('anon - presentation - make a copy', async ({ page, context }) => {
  try {

    await fileActions.docEditorInput.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('test text');
    await fileActions.filemenuClick(mobile);
    const [page1] = await Promise.all([
        page.waitForEvent('popup'),
        await fileActions.filecopy.click()
    ]);

    await expect(page1).toHaveURL(new RegExp(`^${url}/presentation`), { timeout: 100000 });
    fileActions1 = new FileActions(page1);

    await fileActions1.fileSaved.waitFor()
    await fileActions1.docEditor.click({force: true});
    await page1.keyboard.press('Control+A');
    await page1.keyboard.press('Control+C');
    const clipboardText2 = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText2.trim()).toContain('test text');

    await fileActions.toSuccess( 'Can make a copy of a Presentation');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t make a copy of a Presentation');
  }
});

test('anon - presentation - export (pdf)', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');

    await fileActions.export(mobile);
    await fileActions.textbox.fill('test presentation');
    await fileActions.fileFormatButton('.pptx').click();
    await fileActions.mainFrame.getByText('.pdf').click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test presentation');

    const buffer = fs.readFileSync('/tmp/test presentation');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    expect(result.text).toEqual('test text\n\n-- 1 of 1 --\n\n')

    await fileActions.toSuccess( 'Can export Presentation as .pdf');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Presentation as .pdf');
  }
});

test('anon - presentation - export (pptx)', async ({ page, context }) => {
  try {


    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');

    await fileActions.export(mobile);
    await fileActions.textbox.fill('test presentation');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test presentation');
    const PptxParser = require("node-pptx-parser").default;

    async function parse() {
      const parser = new PptxParser('/tmp/test presentation');
      try {
        const textContent = await parser.extractText();
        textContent.forEach((slide) => {
          expect(slide.text.join("\n").trim()).toEqual('test text')
        });
        } catch (error) {
          console.error(error.message);
        }
      }

    parse();

    await fileActions.toSuccess( 'Can export Presentation as .pptx');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Presentation as .pptx');
  }
});

test('anon - presentation - history (previous version)', async ({ page, context }) => {
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

    await fileActions.toSuccess( 'Can browse Presentation history');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t browse Presentation history');
  }
});

test('anon - presentation - history (share)', async ({ page, browser, context }) => {
  try {

    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');

    await fileActions.history(mobile);
    await fileActions.historyFastPrev.click()
    await fileActions.fileSaved.waitFor()
    await fileActions.waitForSync.waitFor({state: 'hidden'})
    await expect(fileActions.warningModal).toHaveCount(0)

    
    await fileActions.docEditor.click({force: true});
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toEqual('');

    var clipboardText2 = await fileActions.getShareLink(mobile)
    page1 = await browser.newPage();
    await page1.goto(`${clipboardText2}`);
    fileActions1 = new FileActions(page1);
    await fileActions1.waitForSync.waitFor({timeout: 5000})
    await fileActions1.waitForSync.waitFor({state: 'hidden', timeout: 5000})

    await fileActions1.docEditor.waitFor()
    await fileActions1.docEditor.click({force: true});
    await page1.keyboard.press('Control+A');
    await page1.keyboard.press('Control+C');
    const clipboardText3 = await page1.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText3.trim()).toEqual('');

    await fileActions.toSuccess( 'Can share Presentation at a moment in history');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t share Presentation at a moment in history');
  }
});
