const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
require('dotenv').config();
const { FileActions } = require('./fileactions.js');

let page1;
const local = !!process.env.PW_URL.includes('localhost');
let mobile;
let fileActions;

test.beforeEach(async ({ page, isMobile }) => {
  fileActions = new FileActions(page);
  mobile = isMobile;
  await fileActions.loadFileType("whiteboard")

});

test('screenshot anon - can draw on whiteboard (default settings)', async ({ page }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await page.mouse.up();

    await expect(page).toHaveScreenshot({ maxDiffPixels: 4000 });
    await fileActions.toSuccess( 'Can draw on whiteboard (default settings)');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t draw on whiteboard (default settings)');
  }
});

test('screenshot anon - erase on whiteboard', async ({ page }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await page.mouse.up();
    await fileActions.clearButton.click();

    await expect(page).toHaveScreenshot({ maxDiffPixels: 4700 });
    await fileActions.toSuccess( 'Can erase on whiteboard');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t erase on whiteboard');
  }
});

test('screenshot anon - enter text on whiteboard', async ({ page }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardText.click();

    await fileActions.whiteBoardCanvas.dblclick({
      position: {
        x: 26,
        y: 74
      }
    });
    await fileActions.textbox.fill('test text');
    await expect(page).toHaveScreenshot({ maxDiffPixels: 4000 });
    // await expect(page.frameLocator('#sbox-iframe').getByText('test text')).toBeVisible();
    await fileActions.toSuccess(  'Can enter text on whiteboard');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t enter text on whiteboard');
  }
});

test('screenshot anon - delete selection on whiteboard', async ({ page }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await fileActions.whiteBoardArrows.click();
    await fileActions.whiteBoardCanvas.click({
      position: {
        x: 174,
        y: 230
      }
    });
    await fileActions.whiteBoardDelete.click();

    await expect(page).toHaveScreenshot({ maxDiffPixels: 4900 });
    await fileActions.toSuccess( 'Can delete selection on Whiteboard' );
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t delete selection on Whiteboard');
  }
});

test('screenshot anon - can change whiteboard brush thickness', async ({ page }) => {
  try {
    await fileActions.whiteBoardWidth.click();
    await fileActions.whiteBoardWidth.fill('50');
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });

    await fileActions.toSuccess(  'Can change Whiteboard brush thickness');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t change Whiteboard brush thickness');
  }
});

test('screenshot anon - can change whiteboard brush opacity', async ({ page }) => {
  try {
    await fileActions.whiteBoardOpacity.click();
    await fileActions.whiteBoardOpacity.fill('0.5');
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });

    await expect(page).toHaveScreenshot({ maxDiffPixels: 4300 });
    await fileActions.toSuccess(  'Can draw on whiteboard (default settings)');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t draw on whiteboard (default settings)');
  }
});

test('screenshot anon - can clear whiteboard canvas', async ({ page }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await fileActions.clearButton.click();

    await expect(page).toHaveScreenshot({ maxDiffPixels: 4600 });
    await fileActions.toSuccess( 'Can clear whiteboard canvas');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t clear whiteboard canvas');
  }
});

test('screenshot anon whiteboard - make a copy', async ({ page }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await fileActions.filemenuClick(mobile);
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await fileActions.fileMenuItem(' Make a copy').click()
    ]);

    await expect(page1).toHaveURL(new RegExp(`^${url}/whiteboard`), { timeout: 100000 });

    await expect(page).toHaveScreenshot({ maxDiffPixels: 4400 });
    await fileActions.toSuccess( 'Can make copy of Whiteboard document');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t make copy of Whiteboard document');
  }
});

test('screenshot anon whiteboard - export as png', async ({ page }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await fileActions.export(mobile);
    await fileActions.textbox.fill('test whiteboard');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test whiteboard');
    expect(download.suggestedFilename()).toBe('test whiteboard.png');

    await fileActions.toSuccess(  'Can export Whiteboard as png');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t export Whiteboard as png');
  }
});

test('screenshot anon whiteboard - display history', async ({ page }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await fileActions.historyPrevLast.click();
    await expect(page).toHaveScreenshot({ maxDiffPixels: 7000 });

    await fileActions.toSuccess( 'Can display Whiteboard history');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t display Whiteboard history');
  }
});

test('screenshot anon whiteboard - share whiteboard history at specific moment in time (link)', async ({ page, browser }) => {
  try {
    await fileActions.whiteBoardCanvas.waitFor();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await page.mouse.down();
    await fileActions.whiteBoardCanvas.hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await page.mouse.up();
    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    var clipboardText = await fileActions.getShareLink()

    page1 = await browser.newPage();

    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.fileTitle('Whiteboard').waitFor()
    await expect(page1).toHaveScreenshot({ maxDiffPixels: 4000 });

    await fileActions.toSuccess( 'Can share Whiteboard history at specific moment in time (link)');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t share Whiteboard history at specific moment in time (link)');
  }
});

// test('screenshot whiteboard - insert image', async ({ page }) => {
//   try {
//     // await page.waitForTimeout(5000);
//     const fileChooserPromise = page.waitForEvent('filechooser');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Insert' }).click();
//     const fileChooser = await fileChooserPromise;
//     await fileChooser.setFiles('testdocuments/teamavatar-empty.png');

//     await expect(page).toHaveScreenshot({ maxDiffPixels: 1500 });

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'failed', reason: 'Can\'t clear whiteboard canvas' } })}`);
//   } catch (e) {
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'passed', reason: 'Can clear whiteboard canvas' } })}`);
//   }
// });
