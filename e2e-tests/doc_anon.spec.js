
const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');
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

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(90000);

  mobile = testInfo.project.use.mobile;
  browserName = testInfo.project.name.split(/@/)[0];
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  fileActions = new FileActions(page);
  await fileActions.loadFileType("doc")
});

test('anon - doc - input text', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.trim()).toContain('test text');
    await fileActions.toSuccess( 'Can input text into Document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t input text into Document');
  }
});

test('anon - doc - make a copy', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click({force: true});
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

    await expect(page1).toHaveURL(new RegExp(`^${url}/doc`), { timeout: 100000 });
    fileActions1 = new FileActions(page1);

    await fileActions1.fileSaved.waitFor()
    await fileActions1.docEditor.click({force: true});

    await page1.keyboard.press('Control+A');
    await page1.keyboard.press('Control+C');

    const clipboardText2 = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText2.trim()).toContain('test text');

    await fileActions.toSuccess( 'Can make a copy of Document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t make a copy of Document');
  }
});


test('anon - doc - insert image', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click({force: true});


    await fileActions.insertTab.click({force: true});
    await fileActions.insertImg.click();
    await fileActions.imgFromFile.click();


    

    await fileActions.toSuccess( 'Can input text into Document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t input text into Document');
  }
});

test('anon - doc - history (previous version)', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');

    await fileActions.history(mobile);
    await fileActions.historyFastPrev.click()
    await fileActions.fileSaved.waitFor()
    await page.locator('#sbox-iframe').contentFrame().getByRole('paragraph').filter({ hasText: 'syncing changes, please wait' }).waitFor({state: 'hidden'})

    
    await fileActions.docEditor.click({force: true});

    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboardText.trim()).toEqual('');
    
    await fileActions.toSuccess( 'Can input text into Document');

  } catch (e) {
    await fileActions.toFailure(e,'Can\'t input text into Document');
  }
});

test('anon - doc - export (doc)', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');

    await fileActions.export(mobile);
    await fileActions.textbox.fill('test doc');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test doc');

    mammoth.extractRawText({path: "/tmp/test doc"})
    .then(result => {
        expect(result.value.trim()).toEqual('test text');
    })
  await fileActions.toSuccess( 'Can export Document as .doc');

  } catch (e) {
    await fileActions.toFailure(e,'Can\'t input text into Document');
  }
});

test('anon - doc - export (pdf)', async ({ page, context }) => {
  try {


    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test text');

    await fileActions.export(mobile);
    await fileActions.textbox.fill('test doc');
    await page.locator('#sbox-iframe').contentFrame().getByRole('button', { name: '.docx' }).click();
    await page.locator('#sbox-iframe').contentFrame().getByText('.pdf').click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test doc');
    const { PDFParse } = require('pdf-parse');

    const buffer = fs.readFileSync('/tmp/test doc');
    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();
    await parser.destroy();
    expect(result.text).toEqual('test text\n\n-- 1 of 1 --\n\n')
    await fileActions.toSuccess( 'Can export Document as .pdf');

  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Document as .pdf');
  }
});

test('anon - doc - history (previous version 1)', async ({ page, context }) => {
  try {

    await fileActions.docEditor.click({force: true});
    await fileActions.docEditor.dispatchEvent('focus');
    await fileActions.docEditor.dispatchEvent('select');

    await fileActions.typeTestTextCode(mobile, 'test \n text');

    await fileActions.history(mobile);
    await fileActions.historyFastPrev.click()
    await fileActions.fileSaved.waitFor()
    await page.locator('#sbox-iframe').contentFrame().getByRole('paragraph').filter({ hasText: 'syncing changes, please wait' }).waitFor({state: 'hidden'})
    
    await fileActions.docEditor.click({force: true});

    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboardText.trim()).toEqual('');
    
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t input text into Document');
  }
});

