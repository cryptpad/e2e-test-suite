const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')
var fs = require('fs');


let page;
let pageOne;
let browser;
let browserName;

test.beforeEach(async ({  }, testInfo) => {
  
  test.setTimeout(2400000);
  browserName = testInfo.project.name
  if (browserName.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (browserName.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext();
  if (browserName.indexOf('firefox') == -1 ) {
    context.grantPermissions(['clipboard-read', "clipboard-write"]);
  } 
  page = await context.newPage();
  await page.goto(`${url}/kanban`)
  if (browserName.indexOf('firefox') !== -1 ) {
    await page.waitForTimeout(15000)
  } else {
    await page.waitForTimeout(5000)
  }
});

test('kanban - new board', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').locator('#kanban-addboard').waitFor()
    await page.frameLocator('#sbox-iframe').locator('#kanban-addboard').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('New board')).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByAltText('Edit this board').nth(3).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByText('Are you sure?').click();

    await expect(page.frameLocator('#sbox-iframe').getByText('New board')).toHaveCount(0)
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
  
});

test('kanban - new list item', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('example item');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'example item' }).getByAltText('Edit this card').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByText('Are you sure?').click();

    await expect(page.frameLocator('#sbox-iframe').getByText('example item')).toHaveCount(0)


    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - new list item', status: 'passed',reason: 'Can create list item in Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - new list item', status: 'failed',reason: 'Can\'t create list item in Kanban board'}})}`);

  }  
});

test('kanban - edit board', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'Done' }).getByAltText('Edit this board').click();
    await page.frameLocator('#sbox-iframe').getByLabel('Title').click();
    await page.frameLocator('#sbox-iframe').getByLabel('Title').fill('new title');
    await page.frameLocator('#sbox-iframe').getByLabel('Title').press('Enter');
    await expect(page.frameLocator('#sbox-iframe').getByText('new title')).toBeVisible();


    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - edit board', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - edit board', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});

test('kanban board - anon - edit list item title', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Item 1' }).getByAltText('Edit this card').first().click();
    await page.frameLocator('#sbox-iframe').getByLabel('Title').click();
    await page.frameLocator('#sbox-iframe').getByLabel('Title').fill('new item title');
    await page.frameLocator('#sbox-iframe').getByLabel('Title').press('Enter');
    await expect(page.frameLocator('#sbox-iframe').getByText('new item title')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});

test('kanban board - anon - edit list item content', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Item 1' }).getByAltText('Edit this card').first().click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').type('new item content');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('new item content')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});

test('kanban board - anon - add and filter by tag', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Item 1' }).getByAltText('Edit this card').first().click();
    await page.frameLocator('#sbox-iframe').locator('#cp-kanban-edit-tags').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-kanban-edit-tags').type('newtag');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-kanban-content').getByText('newtag')).toBeVisible();


    await page.frameLocator('#sbox-iframe').locator('#cp-kanban-controls').getByText('newtag').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Item 1')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('Item 2')).toBeHidden();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Clear filter' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('Item 1')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('Item 2')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});

test('kanban - view history', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'Done' }).getByAltText('Edit this board').click();
    await page.frameLocator('#sbox-iframe').getByLabel('Title').fill('new item title');
    await page.frameLocator('#sbox-iframe').getByLabel('Title').press('Enter');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    if ( await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.isVisible()) {
       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText('new item title')).toHaveCount(0)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Close' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('new item title')).toBeVisible()
    

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});

test('kanban - import file', async ({ }) => {
  
  try {

    const fileChooserPromise = page.waitForEvent('filechooser');
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/testkanban.json');

    await page.waitForTimeout(3000)

    await expect(page.frameLocator('#sbox-iframe').getByText('board 1')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('board two')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('test item one')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('test item two')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-kanban-content').getByText('tagone')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-kanban-content').getByText('tagtwo')).toBeVisible()


    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - import file', status: 'passed',reason: 'Can import file into Kanban document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - import file', status: 'failed',reason: 'Can\'t import file into Kanban document'}})}`);

  }  
});

test('kanban - make a copy', async ({ }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'Done' }).getByAltText('Edit this board').click();
    await page.frameLocator('#sbox-iframe').getByLabel('Title').click();
    await page.frameLocator('#sbox-iframe').getByLabel('Title').fill('new title');
    await page.frameLocator('#sbox-iframe').getByLabel('Title').press('Enter');
    await page.waitForTimeout(3000)

    await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Item 1' }).getByAltText('Edit this card').first().click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').click();
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-lines').type('new item content');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(3000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
    const page1 = await page1Promise;

    await expect(page1).toHaveURL(new RegExp(`^${url}/kanban`), { timeout: 100000 })
    await page1.frameLocator('#sbox-iframe').getByText('new title').waitFor()
    await expect(page1.frameLocator('#sbox-iframe').getByText('new title')).toBeVisible();
    await expect(page1.frameLocator('#sbox-iframe').getByText('new item content')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - make a copy', status: 'passed',reason: 'Can create a copy of Kanban document'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - make a copy', status: 'failed',reason: 'Can\'t create a copy of Kanban document'}})}`);

  }  
});


test(`kanban - share at a moment in history - (FF clipboard incompatibility)`, async ({ }) => {

  try {

    test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('One moment in history');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await expect(page.frameLocator('#sbox-iframe').getByText('One moment in history')).toBeVisible();
    await page.waitForTimeout(7000)

    await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'One moment in history' }).getByAltText('Edit this card').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByText('Are you sure?').click();
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('Another moment in history');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await expect(page.frameLocator('#sbox-iframe').getByText('Another moment in history')).toBeVisible();
    await page.waitForTimeout(7000)

    await page.frameLocator('#sbox-iframe').getByRole('main').filter({ hasText: 'Another moment in history' }).getByAltText('Edit this card').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByText('Are you sure?').click();
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('.kanban-title-button').first().click();
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').fill('Yet another moment in history');
    await page.frameLocator('#sbox-iframe').locator('#kanban-edit').press('Enter');
    await expect(page.frameLocator('#sbox-iframe').getByText('Yet another moment in history')).toBeVisible();
    await page.waitForTimeout(7000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    
    if ( await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.isVisible()) {
       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true })
.click();
    } else {
      await page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
    }
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click();

    await expect(page.frameLocator('#sbox-iframe').getByText('Another moment in history')).toBeVisible();


    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)

    await page.waitForTimeout(5000)
    await page1.frameLocator('#sbox-iframe').getByText('Another moment in history').waitFor()
    await expect(page1.frameLocator('#sbox-iframe').getByText('Another moment in history')).toBeVisible();


    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - share at a moment in history', status: 'passed',reason: 'Can share Kanban at a specific moment in history'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - share at a moment in history - (FF clipboard incompatibility)', status: 'failed',reason: 'Can share Kanban at a specific moment in history - (FF clipboard incompatibility)'}})}`);

  }  
});


test(`kanban - can drag boards`, async ({ }) => {

  try {
    
    await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'To Do' }).hover();
    await page.mouse.down();
    await page.mouse.move(100, 0);
    await page.frameLocator('#sbox-iframe').getByRole('banner').filter({ hasText: 'Done' }).hover();
    await page.mouse.up(); 

    await expect(page).toHaveScreenshot({ maxDiffPixels: 3500 });

    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - can drag boards', status: 'passed',reason: 'Can drag Kanban boards'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - can drag boards', status: 'failed',reason: 'Can\'t drag Kanban boards'}})}`);

  }  
});

test(`kanban - can drag items`, async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Item 1$/ }).first()
    await page.mouse.down();
    await page.mouse.move(0, 50);
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Item 2$/ }).first()
    await page.mouse.up(); 

    await expect(page).toHaveScreenshot({ maxDiffPixels: 1800 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - can drag items', status: 'passed',reason: 'Can drag Kanban items'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - can drag items', status: 'failed',reason: 'Can\'t drag Kanban items'}})}`);

  }  
});

test('kanban - export as .json',  async ({ }) => { 
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test kanban');
    
    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download = await downloadPromise;

    await download.saveAs('/tmp/test kanban');

    const kanbanJSONObject = JSON.parse(fs.readFileSync('/tmp/test kanban'))
    const kanbanJSONString = JSON.stringify(kanbanJSONObject)
    const expectedString = JSON.stringify({"list":[11,12,13],"data":{"11":{"id":11,"title":"To Do","item":[1,2]},"12":{"id":12,"title":"In progress","item":[]},"13":{"id":13,"title":"Done","item":[]}},"items":{"1":{"id":1,"title":"Item 1"},"2":{"id":2,"title":"Item 2"}}})

    if (expectedString === kanbanJSONString) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - export responses as .json', status: 'passed',reason: 'Can export Kanban document as .json'}})}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - export responses as .json', status: 'failed',reason: 'Can\'t export Kanban document as .json'}})}`);
    }

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban - export as .json', status: 'failed',reason: 'Can\'t export Kanban document as .json'}})}`);
    console.log(e);
  }
});

test.afterEach(async ({  }) => {
  await browser.close()
});