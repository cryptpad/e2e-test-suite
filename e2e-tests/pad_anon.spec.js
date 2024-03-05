const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');

var fs = require('fs');

let isMobile;
let browserName;

test.beforeEach(async ({ page }, testInfo) => {

  test.setTimeout(240000000)

  isMobile = testInfo.project.use['isMobile']  
  browserName = testInfo.project.name.split(/@/)[0]

  await page.goto(`${url}/pad`)
  await page.waitForTimeout(10000)

});


test('pad - comment', async ({ page, context }) => {

  try {

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').click()

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('TEST TEXT').click({
      clickCount: 3
    });
    await page.frameLocator('#sbox-iframe').locator('.cp-comment-bubble').locator('button').click()
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Comment' }).fill('Test comment');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Test comment', { exact: true })).toBeVisible();
    

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > comment', status: 'passed',reason: 'Can create comment in Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

  }  
});

test('pad - create and open snapshot', async ({ page, context }) => {

  try { 

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').click()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');
    await page.waitForTimeout(5000)
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Snapshot title').waitFor()
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Snapshot title').fill('snap1');
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New snapshot' }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New snapshot' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByText('snap1').waitFor()
    await page.frameLocator('#sbox-iframe').getByText('snap1').click();
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('TEST TEXT').waitFor()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible()
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - create and open snapshot', status: 'passed',reason: 'Can create and open snapshot in Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - create and open snapshot', status: 'failed',reason: 'Can\'t create and open snapshot in Rich Text document'}})}`);

  }  
});

test(`pad - history (previous version)`, async ({ page, context }) => {

  try {

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('Test text');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    
    if (await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).isVisible()) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Test text')).toHaveCount(0)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous version)`, status: 'passed',reason: 'Can create Rich Text document and view history (previous version)'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous version)`, status: 'failed',reason: 'Can\'t create Rich Text document and view history (previous version)'}})}`);

  }  
});


test(`pad - toggle tools`, async ({ page, context }) => {

  try {

    if (isMobile) {
      await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeHidden()
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').waitFor()
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').click();
      await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeVisible()
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').click();
      await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeHidden()
    } else {
      await page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all').waitFor()
      await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeVisible()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
      await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeHidden()

    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - toggle tools`, status: 'passed',reason: 'Can toggle Tools in Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - toggle tools`, status: 'failed',reason: 'Can\'t toggle Tools in Rich Text document'}})}`);

  }  
});

test(`pad - import file`, async ({ page }) => {

  test.skip(browserstackMobile, 'browserstack mobile import incompatibility')

  try {

    const fileChooserPromise = page.waitForEvent('filechooser');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/myfile.html');

    await page.waitForTimeout(3000)

    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Test text here')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - import file`, status: 'passed',reason: 'Can import file into Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - import file`, status: 'failed',reason: 'Can\'t import file into Rich Text document'}})}`);

  }  
});

test('pad - make a copy', async ({ page, context }) => {

  try {

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('html').click();
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').click()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');
    await page.waitForTimeout(5000)
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible()

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
    const page1 = await page1Promise;

    await expect(page1).toHaveURL(new RegExp(`^${url}/pad`), { timeout: 100000 })
    await page1.waitForTimeout(5000)

    await expect(page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible()
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - make a copy', status: 'passed',reason: 'Can\'t make copy of Rich Text document'}})}`);


  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - make a copy', status: 'failed',reason: 'Can\'t make copy of Rich Text document'}})}`);

  }  
});


test(`pad - export (html)`, async ({ page }) => {

  try {

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').click()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test pad');
    
    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/test pad');

    const readData = fs.readFileSync("/tmp/test pad", "utf8");
    console.log(readData)

    var expectedString;
    if (testInfo.project.name.indexOf('firefox') !== -1) {
      expectedString = '<!DOCTYPEhtml><html><head><metacharset="utf-8"></head><body>TESTTEXT</body></html>'
    } else {
      expectedString = '<!DOCTYPEhtml><html><head><metacharset="utf-8"></head><body>TESTTEXT<p></p></body></html>'
    }
    console.log(expectedString)

    
    if (expectedString === readData.normalize().replace(/[\s]/g, '' )) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (html)', status: 'passed',reason: 'Can export Rich Text document as .html'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (html)', status: 'failed',reason: 'Can\'t export Rich Text document as .html'}})}`);

    }

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (html)', status: 'failed',reason: 'Can\'t export Rich Text document as .html'}})}`);

  }  
});

test(`pad - export (.doc)`, async ({ page }) => {

  try {

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').click()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test pad');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' .html' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: '.doc' }).click();
    
    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/test pad');

    const readData = fs.readFileSync("/tmp/test pad", "utf8");

    var expectedString;
    if (testInfo.project.name.indexOf('firefox') !== -1) {
      expectedString = "<htmlxmlns:o='urn:schemas-microsoft-com:office:office'xmlns:w='urn:schemas-microsoft-com:office:word'xmlns='http://www.w3.org/TR/REC-html40'><head><metacharset='utf-8'><title>ExportHTMLToDoc</title></head><body>TESTTEXT</body></html>"
    } else {
      expectedString = "<htmlxmlns:o='urn:schemas-microsoft-com:office:office'xmlns:w='urn:schemas-microsoft-com:office:word'xmlns='http://www.w3.org/TR/REC-html40'><head><metacharset='utf-8'><title>ExportHTMLToDoc</title></head><body>TESTTEXT<p></p></body></html>"
    }

    if (readData.trim().replace(/[\s]/g, '' ) === expectedString) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (.doc)', status: 'passed',reason: 'Can export Rich Text document as .doc'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (.doc)', status: 'failed',reason: 'Can\'t export Rich Text document as .doc'}})}`);
    }

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (.doc)', status: 'failed',reason: 'Can\'t export Rich Text document as .doc'}})}`);

  }  
});

test(`pad - export (md)`, async ({ page, context }) => {

  try {

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').click()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('TEST TEXT');

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test pad');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' .html' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: '.md' }).click();
    
    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/test pad');

    const readData = fs.readFileSync("/tmp/test pad", "utf8");
    const expectedString = "TEST TEXT"

    if (expectedString === readData.trim()) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'passed',reason: 'Can export Rich Text document as .md'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'failed',reason: 'Can\'t export Rich Text document as .md'}})}`);

    }

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - export (md)', status: 'failed',reason: 'Can\'t export Rich Text document as .md'}})}`);

  }  
});



test(`pad - share at a moment in history`, async ({ page, context }) => {

  try {

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').waitFor()
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').click()

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').locator('body').fill('One moment in history')
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history').click({
      clickCount: 3
    });

    await page.waitForTimeout(7000)
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history').fill('Another moment in history');
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Another moment in history').click({
      clickCount: 3
    });
    await page.waitForTimeout(7000)
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('Another moment in history').fill('Yet another moment in history');
    await page.waitForTimeout(7000)

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    
    if ( await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).isVisible()) {
       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history')).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`)  
    await page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history').waitFor()
    await expect(page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]').getByText('One moment in history')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - share at a moment in history', status: 'passed',reason: 'Can share Rich Text at a specific moment in history'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad - share at a moment in history', status: 'failed',reason: 'Can share Rich Text at a specific moment in history'}})}`);

  }  
});
