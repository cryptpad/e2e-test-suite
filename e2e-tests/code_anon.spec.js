const { test, url,  dateTodayDashFormat, dateTodaySlashFormat, nextMondayDashFormat, nextMondaySlashFormat, minutes, hours, todayStringFormat, nextMondayStringFormat, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');

var fs = require('fs');
const d3 = require('d3')

// let page;
let pageOne;
let isMobile;
let browserName;
let browserstackMobile;

test.beforeEach(async ({ page }, testInfo) => {

  isMobile = testInfo.project.use['isMobile']
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/)
  await page.goto(`${url}/code`)
  await page.waitForTimeout(10000)

});

test(`anon - code - input text`, async ({ page }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` code - input text`, status: 'passed',reason: 'Can create Code document and input text'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - input text`, status: 'failed',reason: 'Can\'t acreate Code document and input text'}})}`);

  }  
});

test(`code - file menu - history`, async ({ page }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();
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

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toHaveCount(0)
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeHidden()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - file menu - history`, status: 'passed',reason: 'Can view Code document history'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - file menu - history`, status: 'failed',reason: 'Can\'t view Code document history'}})}`);

  }  
});

test(`code - toggle toolbar`, async ({ page }) => {

  try {

    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeHidden()

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').waitFor()
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
    }
    
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - toggle toolbar`, status: 'passed',reason: 'Can toggle toolbar in Code document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - toggle toolbar`, status: 'failed',reason: 'Can\'t toggle toolbar in Code document'}})}`);

  }  
});

test(`code - toggle preview`, async ({ page }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').waitFor()
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-rightside-button').locator('.fa.fa-eye').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Preview' }).click();
    }

    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeHidden()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - code - toggle preview`, status: 'passed',reason: 'Can toggle preview in Code document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - code - toggle preview`, status: 'failed',reason: 'Can\'t toggle preview in Code document'}})}`);

  }  
});

test(`code -  make a copy`, async ({ page }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
    const page1 = await page1Promise;

    await expect(page1).toHaveURL(new RegExp(`^${url}/code`), { timeout: 100000 })

    await page1.waitForTimeout(4000)
    await page1.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text').waitFor()
    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text')).toBeVisible();
    

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code -  make a copy`, status: 'passed',reason: 'Can make a copy'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code -  make a copy`, status: 'failed',reason: 'Can\'t make a copy'}})}`);

  }  
});

test(`code - import file`, async ({ page }) => {

  test.skip(browserstackMobile, 'browserstack mobile import incompatibility')

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();

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

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text here')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content').getByText('Test text here')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - import file`, status: 'passed',reason: 'Can import file into Code document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `code - import file`, status: 'failed',reason: 'Can\'t import file into Code document'}})}`);

  }  
});

  test(`code - export (md) - `, async ({ page }) => {

    test.skip(browserstackMobile, 'browserstack mobile download incompatibility')

    try {

      await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
      await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').type('Test text');
      await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Test text')).toBeVisible();

      if (isMobile) {
        await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
      }
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
      await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test code');
      
      const downloadPromise = page.waitForEvent('download', {timeout: 60000});
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      const download = await downloadPromise;

      await download.saveAs('/tmp/test code');

      const readData = fs.readFileSync("/tmp/test code", "utf8");
      if (readData.trim() == "Test text") {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - export (md)', status: 'passed',reason: 'Can export Code document as .md'}})}`);
      } else {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - export (md)', status: 'failed',reason: 'Can\'t export Code document as .md'}})}`);

      }

    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - export (md)', status: 'failed',reason: 'Can\'t export Code document as .md'}})}`);

    }  
});

  
test(`code - share at a moment in history`, async ({ page, context }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('One moment in history')
    await page.waitForTimeout(7000)
    await page.keyboard.press("Meta+A");
    await page.keyboard.press("Backspace");
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('Another moment in history');
    await page.waitForTimeout(7000)
    await page.keyboard.press("Meta+A");
    await page.keyboard.press("Backspace");
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').fill('Yet another moment in history');
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

    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Another moment in history')).toBeVisible();

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    }
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
    await page.waitForTimeout(5000)

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    pageOne = await context.newPage()
    
    await pageOne.goto(`${clipboardText}`)
    await pageOne.waitForTimeout(20000)

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-code').waitFor()
    await expect(pageOne.frameLocator('#sbox-iframe').locator('.CodeMirror-code').getByText('Another moment in history')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - share at a moment in history', status: 'passed',reason: 'Can share code document at a specific moment in history'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'code - share at a moment in history', status: 'failed',reason: 'Can\'t share code document at a specific moment in history'}})}`);

  }  
});
  

