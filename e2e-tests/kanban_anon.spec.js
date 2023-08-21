const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')

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
  await page.goto(`${url}/kanban`)
  await page.waitForTimeout(5000)
});

// test('kanban board - anon - new board', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').locator('#kanban-addboard').waitFor()
//     await page.frameLocator('#sbox-iframe').locator('#kanban-addboard').click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('New board')).toBeVisible();

//     await page.frameLocator('#sbox-iframe').getByAltText('Edit this board').nth(3).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByText('Are you sure?').click();

//     await expect(page.frameLocator('#sbox-iframe').getByText('New board')).toHaveCount(0)
    
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
  
// });

// test('kanban board - anon - new list item', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
//     await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
//     await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('example item');
//     await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
//     await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'example item' }).getByAltText('Edit this card').first().click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByText('Are you sure?').click();

//     await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toHaveCount(0)


//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('kanban board - anon - edit board', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'Done' }).getByAltText('Edit this board').click();
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').click();
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').fill('new title');
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').press('Enter');
//     await expect(page.frameLocator('#sbox-iframe').getByText('new title')).toBeVisible();


//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('kanban board - anon - edit list item title', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Item 1' }).getByAltText('Edit this card').first().click();
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').click();
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').fill('new item title');
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').press('Enter');
//     await expect(page.frameLocator('#sbox-iframe').getByText('new item title')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('kanban board - anon - edit list item content', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Item 1' }).getByAltText('Edit this card').first().click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').type('new item content');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('new item content')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('kanban board - anon - add and filter by tag', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Item 1' }).getByAltText('Edit this card').first().click();
//     await page.frameLocator('#sbox-iframe').locator('#cp-kanban-edit-tags').click();
//     await page.frameLocator('#sbox-iframe').locator('#cp-kanban-edit-tags').type('newtag');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-kanban-content').getByText('newtag')).toBeVisible();


//     await page.frameLocator('#sbox-iframe').locator('#cp-kanban-controls').getByText('newtag').click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Item 1')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Item 2')).toBeHidden();
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Clear filter' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Item 1')).toBeVisible();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Item 2')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('kanban board - anon - view history', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'Done' }).getByAltText('Edit this board').click();
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').fill('new item title');
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').press('Enter');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('new item title')).toHaveCount(0)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Close' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('new item title')).toBeVisible()
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('kanban board - anon - import file', async ({ }) => {
  
//   try {

//     const fileChooserPromise = page.waitForEvent('filechooser');
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

//     const fileChooser = await fileChooserPromise;
//     await fileChooser.setFiles('testdocuments/testkanban.json');

//     await page.waitForTimeout(3000)

//     await expect(page.frameLocator('#sbox-iframe').getByText('board 1')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('board two')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('test item one')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('test item two')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-kanban-content').getByText('tagone')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-kanban-content').getByText('tagtwo')).toBeVisible()


//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('kanban board - anon - make a copy', async ({ }) => {
  
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'Done' }).getByAltText('Edit this board').click();
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').click();
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').fill('new title');
//     await page.frameLocator('#sbox-iframe').getByLabel('Title').press('Enter');
//     await page.waitForTimeout(3000)

//     await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Item 1' }).getByAltText('Edit this card').first().click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').click();
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').type('new item content');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
//     await page.waitForTimeout(3000)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
//     const page1 = await page1Promise;

//     await expect(page1).toHaveURL(new RegExp(`^${url}/kanban`), { timeout: 100000 })

//     await expect(page1.frameLocator('#sbox-iframe').getByText('new title')).toBeVisible();
//     await expect(page1.frameLocator('#sbox-iframe').getByText('new item content')).toBeVisible();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

test(`pad - history (previous author) -- DOESNT WORK`, async ({ }, testInfo) => {

  try {

    await page.goto(`${url}/login/`)
    await page.getByPlaceholder('Username').fill('test-user');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await page.goto(`${url}/kanban`)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('test text by test-user');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await page.waitForTimeout(5000)


    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^Edit$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', {name: 'Copy link'}).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    pageOne = await browser.newPage();
    await pageOne.goto(`${clipboardText}`)
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('some test text by anon');
    await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    // await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('some more test text by anon!');
    await pageOne.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await pageOne.waitForTimeout(5000)

    await pageOne.close()

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    // await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('and some more test text by test user');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    // await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('and some more test by test user here');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('and some more test text by test user')).toHaveCount(0)
    await expect(page.frameLocator('#sbox-iframe').getByText('and some more test by test user here')).toHaveCount(0)

    await expect(page.frameLocator('#sbox-iframe').getByText('some test text by anon')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('some more test text by anon!')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author)`, status: 'passed',reason: 'Can create Rich Text document and view history (previous author)'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `pad - file menu - history (previous author)`, status: 'failed',reason: 'Can\'t create Rich Text document and view history (previous author)'}})}`);

  }  
});

test.afterEach(async ({  }) => {
  await browser.close()
});