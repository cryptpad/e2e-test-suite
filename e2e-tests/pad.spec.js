const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');

const url = 'https://cryptpad.fr'

let browser;
let page;

test.beforeEach(async ({}, testInfo) => {
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
  await page.goto(`${url}`);
});

//ANONYMOUS USER

test('anon - rich text pad - input text', async ({}, testInfo) => {

  try {
    await page.getByRole('link', { name: 'Rich Text' }).click();
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })
    const iframe = page.locator('#sbox-iframe')

    await expect(iframe).toBeVisible({ timeout: 24000 })
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body')).toBeVisible()
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('Hello');
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('Hello')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad', status: 'passed',reason: 'Can anonymously create Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad', status: 'failed',reason: 'Can\'t anonymously create Rich Text document'}})}`);

  }  
});

test('anon - rich text pad - comment', async () => {

  try {
    await page.getByRole('link', { name: 'Rich Text' }).click();
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('TEST TEXT');
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT').click({
      clickCount: 3
    });
    await page.frameLocator('#sbox-iframe').locator('.cp-comment-bubble').locator('button').click()
    await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Comment' }).fill('Test comment');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Test comment', { exact: true })).toBeVisible();
    

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create comment in Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

  }  
});

test('anon - rich text pad - create and open snapshot', async () => {

  try { 
    await page.getByRole('link', { name: 'Rich Text' }).click();
    await page.waitForTimeout(20000)
    await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })

    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('TEST TEXT');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Snapshot title').fill('snap1');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New snapshot' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
    await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByText('snap1').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).click();
    await page.waitForTimeout(20000)
    await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible()
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > create and open snapshot', status: 'passed',reason: 'Can create and open snapshot in Rich Text document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > anon > create and open snapshot', status: 'failed',reason: 'Can\'t create and open snapshot in Rich Text document'}})}`);

  }  
});


test.afterEach(async () => {
  await browser.close()
});