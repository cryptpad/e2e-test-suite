const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');

const fs = require('fs');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let isMobile;
let browserstackMobile;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);
  isMobile = testInfo.project.use.isMobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  await page.goto(`${url}/slide`);
  await page.waitForTimeout(10000);
});

test('markdown - anon - input text into editor and create slide', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'passed', reason: 'Can anonymously create Markdown slides' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'failed', reason: 'Can\'t anonymously create Markdown slides' } })}`);
  }
});

test('markdown - anon - create new slide', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('---');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('More test text');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).click();
    }
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Not now' }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).click();
    }

    await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').filter({ hasText: 'Test text' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-right span').hover();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-right span').click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('More test text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'passed', reason: 'Can anonymously create Markdown slides' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'failed', reason: 'Can\'t anonymously create Markdown slides' } })}`);
  }
});

test('markdown - toggle toolbar', async ({ page, context }) => {
  try {
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - input text into editor', status: 'passed', reason: 'Can input ' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - input text into editor', status: 'failed', reason: 'Can\'t anonymously create Markdown slides' } })}`);
  }
});

test('markdown - toggle preview', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-rightside-button').locator('.fa.fa-eye').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Preview' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeHidden();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-rightside-button').locator('.fa.fa-eye').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Preview' }).click();
    }
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'passed', reason: 'Can anonymously create Markdown slides' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'failed', reason: 'Can\'t anonymously create Markdown slides' } })}`);
  }
});

test('anon - slide - make a copy', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await page.waitForTimeout(5000);

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

    await expect(page1).toHaveURL(new RegExp(`^${url}/slide`), { timeout: 100000 });
    await page1.waitForTimeout(5000);
    await page1.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text').waitFor();
    await expect(page1.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - slide > make a copy', status: 'passed', reason: 'Can\'t create a copy of a Markdown document' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - slide > make a copy', status: 'failed', reason: 'Can\'t create a copy of a Markdown document' } })}`);
  }
});

test('slide - export (md)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await page.waitForTimeout(5000);

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByText('Export').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test markdown');

    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/test markdown');

    const readData = fs.readFileSync('/tmp/test markdown', 'utf8');
    if (readData.trim() === 'Test text') {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - export (md)', status: 'passed', reason: 'Can export Markdown document as .md' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - export (md)', status: 'failed', reason: 'Can\'t export Markdown document as .md' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - export (md)', status: 'failed', reason: 'Can\'t export Markdown document as .md' } })}`);
  }
});

test('slide - share at a moment in history', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('One moment in history');
    await page.waitForTimeout(7000);
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('');
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Another moment in history');
    await page.waitForTimeout(7000);

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('');
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Yet another moment in history');
    await page.waitForTimeout(7000);

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
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

    // await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('One moment in history')).toBeVisible();

    let fileActions = new FileActions(page);
    await fileActions.share(isMobile);
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

    const clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    // await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('One moment in history').waitFor()
    // await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Another moment in history')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - share at a moment in history', status: 'passed', reason: 'Can share Markdown at a specific moment in history' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - share at a moment in history', status: 'failed', reason: 'Can\'t share Markdown at a specific moment in history' } })}`);
  }
});

test('slide - history (previous version)', async ({ page, context }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await page.waitForTimeout(5000);

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
    await expect(page.frameLocator('#sbox-iframe').getByText('Test text')).toHaveCount(0);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - file menu - history (previous version)', status: 'passed', reason: 'Can create Markdown document and view history' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - file menu - history (previous version)', status: 'failed', reason: 'Can\'t create Markdown document and view history' } })}`);
  }
});

test('markdown - import file', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    const fileChooserPromise = page.waitForEvent('filechooser');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByText('Import').click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/testslide.md');

    await page.waitForTimeout(3000);

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('1test text2​3---4​5new text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - import file', status: 'passed', reason: 'Can import file into Slide document' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - import file', status: 'failed', reason: 'Can\'t import file into Slide document' } })}`);
  }
});
