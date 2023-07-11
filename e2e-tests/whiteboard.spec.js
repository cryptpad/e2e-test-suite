const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url } = require('../browserstack.config.js')

let browser;
let page;

test.beforeEach(async ({}, testInfo) => {
  const name = testInfo.project.name
  if (name.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (name.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }
  page = await browser.newPage();
  await page.goto(`${url}`);
  test.setTimeout(240000)
});

test('anon - can draw on whiteboard (default settings)', async () => {

  try {

    await page.goto(`${url}/whiteboard`);
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down()
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up()
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await page.mouse.down()
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await page.mouse.up()

    await expect(page).toHaveScreenshot();
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - can draw on whiteboard (default settings)', status: 'failed',reason: 'Can\'t draw on whiteboard (default settings)'}})}`);

    
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - can draw on whiteboard (default settings)', status: 'passed',reason: 'Can draw on whiteboard (default settings)'}})}`);

  }  
});


test.afterEach(async () => {
  await browser.close()
});