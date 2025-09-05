const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');

const fs = require('fs');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let mobile;
let browserName;
let browserstackMobile;
let fileActions;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(90000);

  mobile = testInfo.project.use.mobile;
  browserName = testInfo.project.name.split(/@/)[0];
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  fileActions = new FileActions(page);
  await fileActions.loadFileType("pad")
});

test('anon - pad -  comment', async ({ page, context }) => {
  try {
    await fileActions.padEditorBody.click();

    await fileActions.padEditorBody.fill('TEST TEXT');
    await fileActions.padEditor.getByText('TEST TEXT').click({
      clickCount: 3
    });
    await fileActions.addComment.click();
    await fileActions.commenttextbox.fill('Test comment');
    await fileActions.submitButton.click();
    await expect(fileActions.mainFrame.getByText('Test comment', { exact: true })).toBeVisible();

    await fileActions.toSuccess( 'Can create comment in Rich Text document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create comment in Rich Text document');
  }
});

test('anon - pad -  create and open snapshot', async ({ page, context }) => {
  try {
    await fileActions.padEditorBody.click();
    await fileActions.padEditorBody.fill('TEST TEXT');

    await fileActions.filemenuClick(mobile);
    await fileActions.snapshots.waitFor();
    await fileActions.snapshots.click();
    await fileActions.snapshotTitle.waitFor();
    await fileActions.snapshotTitle.fill('snap1');
    await fileActions.newSnapshot.waitFor();
    await fileActions.newSnapshot.click();
    await fileActions.closeButton.waitFor();
    await fileActions.closeButton.click();
    await fileActions.padEditorBody.fill('');

    await fileActions.filemenuClick(mobile);
    await fileActions.snapshots.waitFor();
    await fileActions.snapshots.click();
    await fileActions.mainFrame.getByText('snap1').waitFor();
    await fileActions.mainFrame.getByText('snap1').click();
    await fileActions.openButton.waitFor();
    await fileActions.openButton.click();
    await fileActions.padEditor.getByText('TEST TEXT').waitFor();
    await expect(fileActions.padEditor.getByText('TEST TEXT')).toBeVisible();

    await fileActions.toSuccess('Can create and open snapshot in Rich Text document');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create and open snapshot in Rich Text document');
  }
});

test('anon - pad -  history (previous version)', async ({ page, context }) => {
  try {
    await fileActions.padEditorHTML.click();
    await fileActions.padEditorBody.fill('Test text');

    await fileActions.history(mobile);

    await fileActions.historyPrevLast.click();
    await expect(fileActions.mainFrame.getByText('Test text')).toHaveCount(0);

    await fileActions.toSuccess( 'Can create Rich Text document and view history (previous version)');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create Rich Text document and view history (previous version)');
  }
});

test('anon - pad -  toggle tools', async ({ page, context }) => {
  try {

    if (mobile) {
      await expect(fileActions.padToolbar).toBeHidden();
      await fileActions.toggleTools(mobile)
      await expect(fileActions.padToolbar).toBeVisible();
      await fileActions.toggleTools(mobile)
      await expect(fileActions.padToolbar).toBeHidden();
    } else {
      await fileActions.padToolbar.waitFor();
      await expect(fileActions.padToolbar).toBeVisible();
      await fileActions.toggleTools(mobile)
      await expect(fileActions.padToolbar).toBeHidden();
    }

    await fileActions.toSuccess( 'Can toggle Tools in Rich Text document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t toggle Tools in Rich Text document');
  }
});

test('anon - pad -  import file', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);
    await fileChooser.setFiles('testdocuments/myfile.html');
    await expect(fileActions.padEditor.getByText('Test text here')).toBeVisible();

    await fileActions.toSuccess( 'Can import file into Rich Text document');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t import file into Rich Text document');
  }
});

test('anon - pad -  make a copy', async ({ page, context }) => {
  try {
    await fileActions.padEditorBody.click();
    await fileActions.padEditorBody.fill('TEST TEXT');
    await expect(fileActions.padEditor.getByText('TEST TEXT')).toBeVisible();

    await fileActions.filemenuClick(mobile);
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await fileActions.fileMenuItem(' Make a copy').click()
    ]);
    const fileActions1 = new FileActions(page1)
    await expect(page1).toHaveURL(new RegExp(`^${url}/pad`), { timeout: 100000 });
    await page1.waitForTimeout(5000);
    await fileActions1.padEditor.getByText('TEST TEXT').waitFor();
    await expect(fileActions1.padEditor.getByText('TEST TEXT')).toBeVisible();

    await fileActions.toSuccess( 'Can\'t make copy of Rich Text document');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t make copy of Rich Text document');
  }
});

test('anon - pad -  export (html)', async ({ page }) => {
  try {
    await fileActions.padEditorBody.click();
    await fileActions.padEditorBody.fill('TEST TEXT');

    await fileActions.export(mobile);
    await fileActions.textbox.fill('test pad');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test pad');
    const readData = fs.readFileSync('/tmp/test pad', 'utf8');

    let expectedString;
    if (browserName === 'playwright-firefox' | browserName === 'playwright-webkit') {
      expectedString = '<!DOCTYPEhtml><html><head><metacharset="utf-8"></head><body>TESTTEXT</body></html>';
    } else {
      expectedString = '<!DOCTYPEhtml><html><head><metacharset="utf-8"></head><body>TESTTEXT<p></p></body></html>';
    }
    if (expectedString === readData.normalize().replace(/[\s]/g, '')) {
      await fileActions.toSuccess( 'Can export Rich Text document as .html');
    } else {
      await fileActions.toFailure('Can\'t export Rich Text document as .html');
    }
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t export Rich Text document as .html');
  }
});

test('anon - pad -  export (.doc)', async ({ page }) => {
  try {
    await fileActions.padEditorBody.click();
    await fileActions.padEditorBody.fill('TEST TEXT');

    await fileActions.export(mobile);
    await fileActions.textbox.fill('test pad');
    await fileActions.html.click();
    await fileActions.mainFrame.getByText('.doc').click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test pad');

    const readData = fs.readFileSync('/tmp/test pad', 'utf8');

    let expectedString;
    if (browserName === 'playwright-firefox') {
      expectedString = "<htmlxmlns:o='urn:schemas-microsoft-com:office:office'xmlns:w='urn:schemas-microsoft-com:office:word'xmlns='http://www.w3.org/TR/REC-html40'><head><metacharset='utf-8'><title>ExportHTMLToDoc</title></head><body>TESTTEXT</body></html>";
    } else if (browserName === 'playwright-webkit') {
      expectedString = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>TEST TEXT</body></html>"
    } else {
      expectedString = "<htmlxmlns:o='urn:schemas-microsoft-com:office:office'xmlns:w='urn:schemas-microsoft-com:office:word'xmlns='http://www.w3.org/TR/REC-html40'><head><metacharset='utf-8'><title>ExportHTMLToDoc</title></head><body>TESTTEXT<p></p></body></html>";
    }

    if (browserName !== 'playwright-webkit') {
      if (readData.trim().replace(/[\s]/g, '') === expectedString) {
        await fileActions.toSuccess( 'Can export Rich Text document as .doc');
      } else {
        await fileActions.toFailure('Can\'t export Rich Text document as .doc' );
      }
    } else {
      var normalize = str => str.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
      if (normalize(readData) === expectedString) {
        await fileActions.toSuccess( 'Can export Rich Text document as .doc');
      } else {
        await fileActions.toFailure('Can\'t export Rich Text document as .doc' );
      }

    }

  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Rich Text document as .doc');
  }
});

test('anon - pad -  export (md)', async ({ page, context }) => {
  try {
    await fileActions.padEditorBody.click();
    await fileActions.padEditorBody.fill('TEST TEXT');

    await fileActions.export(mobile);
    await fileActions.textbox.fill('test pad');
    await fileActions.html.click();
    await fileActions.mainFrame.getByText('.md').click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test pad');

    const readData = fs.readFileSync('/tmp/test pad', 'utf8');
    const expectedString = 'TEST TEXT';

    if (expectedString === readData.trim()) {
      await fileActions.toSuccess('Can export Rich Text document as .md');
    } else {
      await fileActions.toFailure(e, 'Can\'t export Rich Text document as .md');
    }
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Rich Text document as .md');
  }
});

test('anon - pad -  share at a moment in history', async ({ page, context }) => {
  try {
    await fileActions.padEditorBody.click();

    await fileActions.padEditorBody.fill('One moment in history');
    await fileActions.padEditor.getByText('One moment in history').click({
      clickCount: 3
    });

    await page.waitForTimeout(1000);
    await expect(fileActions.padEditor.getByText('One moment in history')).toBeVisible();
    
    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await fileActions.historyPrevLast.click();

    await expect(fileActions.padEditor.getByText('One moment in history')).toBeHidden();

    var clipboardText = await fileActions.getShareLink()

    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1);

    await fileActions1.fileTitle('Rich text').waitFor()
    await expect(fileActions1.padEditor.getByText('One moment in history')).toBeHidden();

    await fileActions.toSuccess( 'Can share Rich Text at a specific moment in history');
  } catch (e) {
    await fileActions.toFailure(e,'Can share Rich Text at a specific moment in history');
  }
});
