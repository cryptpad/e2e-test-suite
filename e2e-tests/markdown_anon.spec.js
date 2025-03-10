const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');

const fs = require('fs');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let mobile;
let browserstackMobile;
let fileActions;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);
  mobile = testInfo.project.use.mobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  await page.goto(`${url}/slide`);
  fileActions = new FileActions(page);
  // await page.waitForTimeout(10000);
});

// test('markdown - anon - input text into editor and create slide', async ({ page }) => {
//   try {
//     await fileActions.slideeditor.click();
//     await fileActions.slideeditor.type('Test text');
//     await expect(fileActions.slideeditor.getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'passed', reason: 'Can anonymously create Markdown slides' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'failed', reason: 'Can\'t anonymously create Markdown slides' } })}`);
//   }
// });

// test('markdown - anon - create new slide', async ({ page }) => {
//   try {
//     await fileActions.slideeditor.click();
//     await fileActions.slideeditor.type('Test text');
//     await page.keyboard.press('Enter');
//     await page.keyboard.press('Enter');
//     await fileActions.slideeditor.type('---');
//     await page.keyboard.press('Enter');
//     await page.keyboard.press('Enter');
//     await fileActions.slideeditor.type('More test text');
//     await page.keyboard.press('Enter');
//     await page.keyboard.press('Enter');
//     if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).isVisible()) {
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).click();
//     }
//     if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Not now' }).isVisible()) {
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store' }).click();
//     }

//     await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').filter({ hasText: 'Test text' }).click();
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-right span').hover();
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-right span').click();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('More test text')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'passed', reason: 'Can anonymously create Markdown slides' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'failed', reason: 'Can\'t anonymously create Markdown slides' } })}`);
//   }
// });

// test('markdown - toggle toolbar', async ({ page }) => {
//   try {
//     // await page.waitForTimeout(1000);
//     await fileActions.toggleTools(mobile);
//     await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible();
//     await fileActions.toggleTools(mobile);
//     await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeHidden();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - input text into editor', status: 'passed', reason: 'Can input ' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - input text into editor', status: 'failed', reason: 'Can\'t anonymously create Markdown slides' } })}`);
//   }
// });

// test('markdown - toggle preview', async ({ page }) => {
//   try {
//     // await page.waitForTimeout(1000);
//     await fileActions.slideeditor.click();
//     await fileActions.slideeditor.type('Test text');

//     await fileActions.togglePreview(mobile);
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeHidden();

//     await fileActions.togglePreview(mobile);
//     await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'passed', reason: 'Can anonymously create Markdown slides' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown', status: 'failed', reason: 'Can\'t anonymously create Markdown slides' } })}`);
//   }
// });

// test('anon - slide - make a copy', async ({ page, context }) => {
//   try {
//     await fileActions.slideeditor.click();
//     await fileActions.slideeditor.type('Test text');
//     // await page.waitForTimeout(5000);

//     await fileActions.filemenuClick(mobile);
//     const [page1] = await Promise.all([
//       page.waitForEvent('popup'),
//       await fileActions.filecopy.click()
//     ]);

//     await expect(page1).toHaveURL(new RegExp(`^${url}/slide`), { timeout: 100000 });
//     await page1.waitForTimeout(5000);
//     await page1.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text').waitFor();
//     await expect(page1.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - slide > make a copy', status: 'passed', reason: 'Can\'t create a copy of a Markdown document' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - slide > make a copy', status: 'failed', reason: 'Can\'t create a copy of a Markdown document' } })}`);
//   }
// });

// test('slide - export (md)', async ({ page, context }) => {
//   try {
//     await fileActions.slideeditor.click();
//     await fileActions.slideeditor.type('Test text');
//     // await page.waitForTimeout(5000);

//     await fileActions.export(mobile);
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test markdown');

//     const [download] = await Promise.all([
//       page.waitForEvent('download'),
//       await fileActions.okButton.click()
//     ]);

//     await download.saveAs('/tmp/test markdown');

//     const readData = fs.readFileSync('/tmp/test markdown', 'utf8');
//     if (readData.trim() === 'Test text') {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - export (md)', status: 'passed', reason: 'Can export Markdown document as .md' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - export (md)', status: 'failed', reason: 'Can\'t export Markdown document as .md' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - export (md)', status: 'failed', reason: 'Can\'t export Markdown document as .md' } })}`);
//   }
// });

test('slide - share at a moment in history', async ({ page, context }) => {
  try {
    await fileActions.slideeditor.click();
    await fileActions.slideeditor.type('One moment in history');
    // await page.waitForTimeout(7000);
    await fileActions.slideeditor.fill('');
    await fileActions.slideeditor.type('Another moment in history');
    // await page.waitForTimeout(7000);

    await fileActions.slideeditor.fill('');
    await fileActions.slideeditor.type('Yet another moment in history');
    // await page.waitForTimeout(7000);

    await fileActions.history(mobile);
    await fileActions.historyPrev.click();
    await fileActions.historyPrev.click();

    // await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('One moment in history')).toBeVisible();

    await fileActions.share(mobile);
    await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
    await fileActions.shareCopyLink.click();

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

// test('slide - history (previous version)', async ({ page, context }) => {
//   try {
//     await fileActions.slideeditor.click();
//     await fileActions.slideeditor.type('Test text');
//     // await page.waitForTimeout(5000);

//     await fileActions.history(mobile);
//     await fileActions.historyPrev.click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Test text')).toHaveCount(0);

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - file menu - history (previous version)', status: 'passed', reason: 'Can create Markdown document and view history' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - file menu - history (previous version)', status: 'failed', reason: 'Can\'t create Markdown document and view history' } })}`);
//   }
// });

// test('markdown - import file', async ({ page }) => {
//   test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

//   try {
//     await fileActions.filemenuClick(mobile);
//     const [fileChooser] = await Promise.all([
//       page.waitForEvent('filechooser'),
//       await fileActions.importClick()
//     ]);
//     await fileChooser.setFiles('testdocuments/testslide.md');

//     // await page.waitForTimeout(3000);

//     await expect(fileActions.slideeditor.getByText('1test text2​3---4​5new text')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - import file', status: 'passed', reason: 'Can import file into Slide document' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'slide - import file', status: 'failed', reason: 'Can\'t import file into Slide document' } })}`);
//   }
// });
