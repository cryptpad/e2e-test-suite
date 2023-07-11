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
  // console.log(window)
  // Get session storage and store as env variable
// const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));
  // await page.goto(`${url}/login/`);
  // await page.getByPlaceholder('Username').fill('test-user');
  // await page.waitForTimeout(10000)
  // await page.getByPlaceholder('Password', {exact: true}).fill('password');
  // const login = page.locator(".login")
  // await login.waitFor({ timeout: 18000 })
  // await expect(login).toBeVisible({ timeout: 1800 })
  // if (await login.isVisible()) {
  //   await login.click()
  // }
  // await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
  // const browserContext = await browser.newContext()
  // const storage = await browserContext.storageState();
  // console.log(storage.Block_hash)
  await page.goto(`${url}/pad`);
  await page.waitForTimeout(10000)
});

//ANONYMOUS USER


// test('anon - rich text pad - comment', async () => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').waitFor()

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT').click({
//       clickCount: 3
//     });
//     await page.frameLocator('#sbox-iframe').locator('.cp-comment-bubble').locator('button').click()
//     await page.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Comment' }).fill('Test comment');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Test comment', { exact: true })).toBeVisible();
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create comment in Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

//   }  
// });

// test('anon - rich text pad - create and open snapshot', async () => {

//   try { 

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').waitFor()
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Snapshot title').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Snapshot title').fill('snap1');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New snapshot' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New snapshot' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).waitFor()
//     // await page.waitForLoadState('networkidle', { timeout: 5000 });
//     // await page.waitForTimeout(10000)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Snapshots', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByText('snap1').waitFor()
//     await page.frameLocator('#sbox-iframe').getByText('snap1').click();
//     // await page.waitForLoadState('networkidle', { timeout: 5000 });
//     await page.waitForTimeout(10000)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).click();
//     // await page.waitForLoadState('networkidle');
//     // await page.waitForTimeout(20000)
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT').waitFor()
//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible()
    
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > create and open snapshot', status: 'passed',reason: 'Can create and open snapshot in Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > anon > create and open snapshot', status: 'failed',reason: 'Can\'t create and open snapshot in Rich Text document'}})}`);

//   }  
// });

// test(`anon - pad - file menu - history`, async ({}, testInfo) => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('html').click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('Test text');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Test text')).toHaveCount(0)

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - ${name} - add to team drive`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - ${name} - add to team drive`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - pad - toggle tools`, async ({}, testInfo) => {

//   try {

//     await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeVisible()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.cke_toolbox_main.cke_reset_all')).toBeHidden()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - ${name} - add to team drive`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - ${name} - add to team drive`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test(`anon - pad - import file`, async ({}, testInfo) => {

//   try {

//     const fileChooserPromise = page.waitForEvent('filechooser');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

//     const fileChooser = await fileChooserPromise;
//     await fileChooser.setFiles('myfile.html');

//     await page.waitForTimeout(3000)

//     await expect(page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('Test text here')).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - import file`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - pad - import file`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);

//   }  
// });

// test('anon - pad - make a copy', async () => {

//   try {

//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').waitFor()
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('html').click();
//     await page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
//     const page1 = await page1Promise;

//     await expect(page1).toHaveURL(new RegExp(`^${url}/pad`), { timeout: 100000 })

//     await expect(page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible();
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create comment in Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'failed',reason: 'Can\'t create comment in Rich Text document'}})}`);

//   }  
// });





test.afterEach(async () => {
  await browser.close()
});