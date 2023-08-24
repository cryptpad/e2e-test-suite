const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')
var fs = require('fs');


let page;
let pageOne;
let browser;

test.beforeEach(async ({  }, testInfo) => {
  
  test.setTimeout(2400000);
  const name = testInfo.project.name
  if (name.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (name.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  page = await browser.newPage();
  await page.goto(`${url}/slide`)
  await page.waitForTimeout(5000)
});

test('markdown - anon - input text into editor', async ({ page }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').type('Test text');
    await expect(page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').getByText('Test text')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-modal-content').getByText('Test text')).toBeVisible();
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

  }  
});

test('markdown - input text into editor', async ({ page }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-markdown-toolbar')).toBeVisible();
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown - input text into editor', status: 'passed',reason: 'Can input '}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown - input text into editor', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

  }  
});

test.afterEach(async ({  }) => {
  await browser.close()
});