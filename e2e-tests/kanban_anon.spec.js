const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { FileActions } = require('./fileactions.js');

const fs = require('fs');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

let mobile;
let browserstackMobile;
let fileActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);
  mobile = isMobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  fileActions = new FileActions(page);
  await fileActions.loadFileType("kanban")

});

test('anon - kanban -  new board', async ({ page }) => {
  try {
    await fileActions.addBoard.click();
    await expect(fileActions.newBoard).toBeVisible();
    await fileActions.editNewBoard.click();
    await fileActions.deleteButton.click();
    await fileActions.areYouSure.click();

    await expect(fileActions.newBoard).toHaveCount(0);

    await fileActions.toSuccess('Can anonymously create Kanban board');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t anonymously create Kanban board');
  }
});

test('anon - kanban -  new list item', async ({ page }) => {
  try {
    await fileActions.addItem.first().click();
    await fileActions.editItem.fill('example item');
    await fileActions.editItem.press('Enter');
    await expect(fileActions.mainFrame.getByText('example item')).toBeVisible();
    await fileActions.editItemContent().first().waitFor()
    await fileActions.editItemContent().first().click({force: true});
    await fileActions.deleteButton.click();
    await fileActions.areYouSure.click();

    await expect(fileActions.mainFrame.getByText('example item')).toHaveCount(0);

    await fileActions.toSuccess( 'Can create list item in Kanban board');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create list item in Kanban board');
  }
});

test('anon - kanban -  edit board', async ({ page }) => {
  try {
    await fileActions.editDoneBoard.click();
    await fileActions.boardTitle.click();
    await fileActions.boardTitle.fill('new title');
    await fileActions.boardTitle.press('Enter');
    await expect(fileActions.mainFrame.getByText('new title')).toBeVisible();

    await fileActions.toSuccess( 'Can edit Kanban board');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t edit Kanban board');
  }
});

test('anon - kanban board - edit list item title', async ({ page }) => {
  try {
    //here
    await fileActions.editItemTitle.first().click();
    await fileActions.editItemTitle.locator('#kanban-edit').first().fill('new item title');
    await fileActions.editItemTitle.locator('#kanban-edit').first().press('Enter');
    await expect(fileActions.mainFrame.getByText('new item title')).toBeVisible();

    await fileActions.toSuccess('Can edit Kanban list item title');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t edit Kanban list item title');
  }
});

test('anon - kanban board - edit list item content', async ({ page }) => {
  try {
    await fileActions.editItemContent().first().click();
    await fileActions.kanbanEditor.click();
    await fileActions.kanbanEditor.type('new item content');
    await fileActions.closeButton.click();
    await expect(fileActions.mainFrame.getByText('new item content')).toBeVisible();

    await fileActions.toSuccess('Can edit Kanban list item content');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t edit Kanban list item content');
  }
});

test('anon - kanban board - add and filter by tag', async ({ page }) => {
  try {
    await fileActions.editItemContent().first().click();
    await fileActions.editKanbanTags.click();
    await fileActions.editKanbanTags.type('newtag');
    await fileActions.addButton.click();
    await fileActions.closeButton.click();
    await expect(fileActions.kanbanContent.getByText('newtag')).toBeVisible();
  
    await fileActions.kanbanControls.getByText('newtag').click();
    await expect(fileActions.mainFrame.getByText('Item 1')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('Item 2')).toBeHidden();

    await fileActions.clearFilter.click();
    await expect(fileActions.mainFrame.getByText('Item 1')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('Item 2')).toBeVisible();

    await fileActions.toSuccess( 'Can add and filter by tag in Kanban board');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t add and filter by tag in Kanban board');
  }
});

test('anon - kanban -  view history', async ({ page }) => {
  try {
    await fileActions.editDoneBoard.waitFor()
    await fileActions.editDoneBoard.click();
    await fileActions.boardTitle.fill('new item title');
    await fileActions.boardTitle.press('Enter');
    await fileActions.history();
    await fileActions.historyPrevFirst.click();
    await expect(fileActions.mainFrame.getByText('new item title')).toHaveCount(0);

    await fileActions.closeButton.click();
    await expect(fileActions.mainFrame.getByText('new item title')).toBeVisible();

    await fileActions.toSuccess( 'Can view Kanban history');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t view Kanban history');
  }
});

test('anon - kanban -  import file', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);
    await fileChooser.setFiles('testdocuments/testkanban.json');

    await expect(fileActions.mainFrame.getByText('board 1')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('board two')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('test item one')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('test item two')).toBeVisible();
    await expect(fileActions.kanbanContainer.getByText('tagone')).toBeVisible();
    await expect(fileActions.kanbanContainer.getByText('tagtwo')).toBeVisible();

    await fileActions.toSuccess('Can import file into Kanban document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t import file into Kanban document');
  }
});

test('anon - kanban -  make a copy', async ({ page }) => {
  try {
    await fileActions.editDoneBoard.click();
    await fileActions.boardTitle.click();
    await fileActions.boardTitle.fill('new title');
    await fileActions.boardTitle.press('Enter');
    await fileActions.editItemContent().first().click();
    await fileActions.kanbanEditor.click();
    await fileActions.kanbanEditor.type('new item content');
    await fileActions.closeButton.click();

    await fileActions.filemenuClick(mobile);
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await fileActions.fileMenuItem(' Make a copy').click()
    ]);

    await expect(page1).toHaveURL(new RegExp(`^${url}/kanban`), { timeout: 100000 });
    const fileActions1 = new FileActions(page1)
    await fileActions1.mainFrame.getByText('new title').waitFor();
    await expect(fileActions1.mainFrame.getByText('new title')).toBeVisible();
    await expect(fileActions1.mainFrame.getByText('new item content')).toBeVisible();

    await fileActions.toSuccess('Can create a copy of Kanban document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create a copy of Kanban document');
  }
});

test('anon - kanban -  share at a moment in history', async ({ page, context }) => {
  try {
    await fileActions.addItem.first().waitFor();
    await fileActions.addItem.first().click();
    await fileActions.editItem.fill('One moment in history');
    await fileActions.editItem.press('Enter');
    await expect(fileActions.mainFrame.getByText('One moment in history')).toBeVisible();
    await page.waitForTimeout(1000);

    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await fileActions.historyPrevLast.click();

    await expect(fileActions.mainFrame.getByText('One moment in history')).toBeHidden();

    var clipboardText = await fileActions.getShareLink()
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.fileTitle('Kanban').waitFor()
    await expect(fileActions1.mainFrame.getByText('One moment in history')).toBeHidden();

    await fileActions.toSuccess( 'Can share Kanban at a specific moment in history');
  } catch (e) {
    await fileActions.toFailure(e,'Can share Kanban at a specific moment in history');
  }
});

// test('(screenshot) anon - kanban -  can drag boards #1372', async ({ page }) => {
//   test.skip();
//   try {
//     await fileActions.mainFrame.getByRole('banner').filter({ hasText: 'To Do' }).hover();
//     await page.mouse.down();
//     await page.mouse.move(100, 0);
//     await fileActions.mainFrame.getByRole('banner').filter({ hasText: 'Done' }).hover();
//     await page.mouse.up();

//     await expect(page).toHaveScreenshot({ maxDiffPixels: 3500 });

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - kanban -  can drag boards', status: 'passed', reason: 'Can drag Kanban boards' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - kanban -  can drag boards', status: 'failed', reason: 'Can\'t drag Kanban boards' } })}`);
//   }
// });

// test('(screenshot) anon - kanban -  can drag items', async ({ page }) => {
//   test.skip();
//   try {
//     await fileActions.mainFrame.locator('div').filter({ hasText: /^Item 1$/ }).first().waitFor()

//     await fileActions.mainFrame.locator('div').filter({ hasText: /^Item 1$/ }).first().hover()
//     await page.mouse.down();
//     await page.mouse.move(0, 200);
//     await fileActions.mainFrame.locator('div').filter({ hasText: /^Item 2$/ }).first().hover()

//     await page.mouse.up();

//     await expect(page).toHaveScreenshot({ maxDiffPixels: 1800 });

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - kanban -  can drag items', status: 'passed', reason: 'Can drag Kanban items' } })}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - kanban -  can drag items', status: 'failed', reason: 'Can\'t drag Kanban items' } })}`);
//   }
// });

test('anon - kanban -  export as .json', async ({ page }) => {
  try {
    await fileActions.export(mobile);
    await fileActions.textbox.fill('test kanban');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test kanban');

    const kanbanJSONObject = JSON.parse(fs.readFileSync('/tmp/test kanban'));
    const kanbanJSONString = JSON.stringify(kanbanJSONObject);
    const expectedString = JSON.stringify({ list: [11, 12, 13], data: { 11: { id: 11, title: 'To Do', item: [1, 2] }, 12: { id: 12, title: 'In progress', item: [] }, 13: { id: 13, title: 'Done', item: [] } }, items: { 1: { id: 1, title: 'Item 1' }, 2: { id: 2, title: 'Item 2' } } });

    if (expectedString === kanbanJSONString) {
      await fileActions.toSuccess( 'Can export Kanban document as .json');
    } else {
      await fileActions.toFailure(e, 'Can\'t export Kanban document as .json');
    }
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Kanban document as .json');
  }
});
