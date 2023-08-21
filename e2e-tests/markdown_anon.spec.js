const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')

let browser;
let page;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(2400000);
  await page.goto(`${url}/slide`);
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
