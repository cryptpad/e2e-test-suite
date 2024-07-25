const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');
const fs = require('fs');
require('dotenv').config();
const os = require('os');

let pageOne;
let isMobile;
let browserstackMobile;
let platform;
const local = !!process.env.PW_URL.includes('localhost');

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);

  isMobile = testInfo.project.use.isMobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  platform = os.platform();

  await page.goto(`${url}/code`);
  await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
});

test('anon - code - input text #1367', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').click();
    await page.keyboard.press('T');
    await page.keyboard.press('e');
    await page.keyboard.press('s');
    await page.keyboard.press('t');
    await page.keyboard.press(' ');
    await page.keyboard.press('t');
    await page.keyboard.press('e');
    await page.keyboard.press('x');
    await page.keyboard.press('t');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('test text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' code - input text', status: 'passed', reason: 'Can create Code document and input text' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - input text', status: 'failed', reason: 'Can\'t acreate Code document and input text' } })}`);
  }
});

test('code - file menu - history #1367', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').click();
    await page.keyboard.press('T');
    await page.keyboard.press('e');
    await page.keyboard.press('s');
    await page.keyboard.press('t');
    await page.keyboard.press(' ');
    await page.keyboard.press('t');
    await page.keyboard.press('e');
    await page.keyboard.press('x');
    await page.keyboard.press('t');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('test text')).toBeVisible();
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

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('test text')).toHaveCount(0);
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('test text')).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - file menu - history', status: 'passed', reason: 'Can view Code document history' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - file menu - history', status: 'failed', reason: 'Can\'t view Code document history' } })}`);
  }
});

test('code - toggle toolbar #1367', async ({ page }) => {
  try {
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeHidden();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
    }

    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - toggle toolbar', status: 'passed', reason: 'Can toggle toolbar in Code document' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - toggle toolbar', status: 'failed', reason: 'Can\'t toggle toolbar in Code document' } })}`);
  }
});

test('code - toggle preview #1367', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').click();
    await page.keyboard.press('T');
    await page.keyboard.press('e');
    await page.keyboard.press('s');
    await page.keyboard.press('t');
    await page.keyboard.press(' ');
    await page.keyboard.press('t');
    await page.keyboard.press('e');
    await page.keyboard.press('x');
    await page.keyboard.press('t');
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('test text')).toBeVisible();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-rightside-button').locator('.fa.fa-eye').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Preview' }).click();
    }

    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('test text')).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - code - toggle preview', status: 'passed', reason: 'Can toggle preview in Code document' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - code - toggle preview', status: 'failed', reason: 'Can\'t toggle preview in Code document' } })}`);
  }
});

test('code -  make a copy #1367', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').click();
    await page.keyboard.press('T');
    await page.keyboard.press('e');
    await page.keyboard.press('s');
    await page.keyboard.press('t');
    await page.keyboard.press(' ');
    await page.keyboard.press('t');
    await page.keyboard.press('e');
    await page.keyboard.press('x');
    await page.keyboard.press('t');
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('test text')).toBeVisible();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    const page1Promise = page.waitForEvent('popup');
    if (!local) {
      await page.frameLocator('#sbox-iframe').getByText('Make a copy').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
    }
    const page1 = await page1Promise;

    await expect(page1).toHaveURL(new RegExp(`^${url}/code`), { timeout: 100000 });

    await page1.waitForTimeout(4000);
    await page1.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text').waitFor();
    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('test text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code -  make a copy', status: 'passed', reason: 'Can make a copy' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code -  make a copy', status: 'failed', reason: 'Can\'t make a copy' } })}`);
  }
});

test('code - import file #1367', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').click();
    const fileChooserPromise = page.waitForEvent('filechooser');

    let fileActions = new FileActions(page);
    await fileActions.import(isMobile);

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/myfile.html');

    await page.waitForTimeout(3000);

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text here')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text here')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - import file', status: 'passed', reason: 'Can import file into Code document' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - import file', status: 'failed', reason: 'Can\'t import file into Code document' } })}`);
  }
});

test('code - export (md)', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');

  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').click();
    await page.keyboard.press('T');
    await page.keyboard.press('e');
    await page.keyboard.press('s');
    await page.keyboard.press('t');
    await page.keyboard.press(' ');
    await page.keyboard.press('t');
    await page.keyboard.press('e');
    await page.keyboard.press('x');
    await page.keyboard.press('t');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('test text')).toBeVisible();

    let fileActions = new FileActions(page);
    await fileActions.export(isMobile);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test code');

    const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/test code');

    const readData = fs.readFileSync('/tmp/test code', 'utf8');
    if (readData.trim() === 'Test text') {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - export (md)', status: 'passed', reason: 'Can export Code document as .md' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - export (md)', status: 'failed', reason: 'Can\'t export Code document as .md' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - export (md)', status: 'failed', reason: 'Can\'t export Code document as .md' } })}`);
  }
});

test('code - share at a moment in history', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').click();
    await page.keyboard.press('o');
    await page.keyboard.press('n');
    await page.keyboard.press('e');
    await page.waitForTimeout(7000);

    let key;
    if (platform === 'darwin') {
      key = 'Meta';
    } else {
      key = 'Control';
    }
    await page.keyboard.press(`${key}+a`);
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(3000);
    await page.keyboard.press('t');
    await page.keyboard.press('w');
    await page.keyboard.press('o');
    await page.waitForTimeout(7000);
    await page.keyboard.press(`${key}+a`);
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(3000);
    
    await page.waitForTimeout(7000);
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }

    await page.waitForTimeout(2000);
    if (!local) {
      await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' History' }).locator('a').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('One moment in history')).toBeVisible();

    let fileActions = new FileActions(page);
    await fileActions.share(isMobile);
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
    await page.waitForTimeout(5000);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    pageOne = await browser.newPage();

    await pageOne.goto(`${clipboardText}`);

    await pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
    await expect(pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('t')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - share at a moment in history', status: 'passed', reason: 'Can share code document at a specific moment in history' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - share at a moment in history', status: 'failed', reason: 'Can\'t share code document at a specific moment in history' } })}`);
  }
});
