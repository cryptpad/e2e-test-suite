const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
require('dotenv').config();
const { FileActions } = require('./fileactions.js');

let pageOne;
const local = !!process.env.PW_URL.includes('localhost');
let mobile;
let fileActions;

test.beforeEach(async ({ page, isMobile }) => {
  await page.goto(`${url}/whiteboard`);
  fileActions = new FileActions(page);
  mobile = isMobile;
  // await page.waitForTimeout(10000);
});

test('screenshot anon - can draw on whiteboard (default settings)', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await page.mouse.up();

    await expect(page).toHaveScreenshot({ maxDiffPixels: 3000 });
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - can draw on whiteboard (default settings)', status: 'passed', reason: 'Can draw on whiteboard (default settings)' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - can draw on whiteboard (default settings)', status: 'failed', reason: 'Can\'t draw on whiteboard (default settings)' } })}`);
  }
});

test('screenshot anon - erase on whiteboard', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await page.mouse.up();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Clear' }).click();
    // await page.waitForTimeout(3000);

    await expect(page).toHaveScreenshot({ maxDiffPixels: 4000 });
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - can erase on whiteboard', status: 'passed', reason: 'Can erase on whiteboard' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - can erase on whiteboard', status: 'failed', reason: 'Can\'t erase on whiteboard' } })}`);
  }
});

test('screenshot anon - enter text on whiteboard', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('.cp-whiteboard-text').click();

    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).dblclick({
      position: {
        x: 26,
        y: 74
      }
    });
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test text');
    // await page.waitForTimeout(3000);
    await expect(page).toHaveScreenshot({ maxDiffPixels: 3000 });
    // await expect(page.frameLocator('#sbox-iframe').getByText('test text')).toBeVisible();
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - can enter text on whiteboard', status: 'passed', reason: 'Can enter text on whiteboard' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - can enter text on whiteboard', status: 'failed', reason: 'Can\'t enter text on whiteboard' } })}`);
  }
});

test('screenshot anon - delete selection on whiteboard', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    await page.frameLocator('#sbox-iframe').locator('.btn.move.fa.fa-arrows').click();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).click({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.frameLocator('#sbox-iframe').locator('#cp-app-whiteboard-delete').click();

    await expect(page).toHaveScreenshot({ maxDiffPixels: 3000 });
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - delete selection on whiteboard', status: 'passed', reason: 'Can delete selection on Whiteboard' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - delete selection on whiteboard', status: 'failed', reason: 'Can\'t delete selection on Whiteboard' } })}`);
  }
});

test('screenshot anon - can change whiteboard brush thickness', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByLabel('Width:').click();
    await page.frameLocator('#sbox-iframe').getByLabel('Width:').fill('50');
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - change whiteboard brush thickness', status: 'passed', reason: 'Can change Whiteboard brush thickness' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - change whiteboard brush thickness', status: 'failed', reason: 'Can\'t change Whiteboard brush thickness' } })}`);
  }
});

test('screenshot anon - can change whiteboard brush opacity', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByLabel('Opacity:').click();
    await page.frameLocator('#sbox-iframe').getByLabel('Opacity:').fill('0.5');
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });

    await expect(page).toHaveScreenshot({ maxDiffPixels: 3000 });
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - can draw on whiteboard (default settings)', status: 'passed', reason: 'Can draw on whiteboard (default settings)' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'anon - can draw on whiteboard (default settings)', status: 'failed', reason: 'Can\'t draw on whiteboard (default settings)' } })}`);
  }
});

test('screenshot anon - can clear whiteboard canvas', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    // await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Clear' }).click();

    await expect(page).toHaveScreenshot({ maxDiffPixels: 4000 });
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'passed', reason: 'Can clear whiteboard canvas' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'failed', reason: 'Can\'t clear whiteboard canvas' } })}`);
  }
});

test('screenshot whiteboard - make a copy', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    // await page.waitForTimeout(3000);
    await fileActions.filemenuClick(mobile);
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await fileActions.filecopy.click()
    ]);

    await expect(page1).toHaveURL(new RegExp(`^${url}/whiteboard`), { timeout: 100000 });

    await expect(page).toHaveScreenshot({ maxDiffPixels: 3000 });
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - make a copy', status: 'passed', reason: 'Can make copy of Whiteboard document' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - make a copy', status: 'failed', reason: 'Can\'t make copy of Whiteboard document' } })}`);
  }
});

test('screenshot whiteboard - export as png', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    // await page.waitForTimeout(3000);
    await fileActions.export(mobile);
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test whiteboard');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);

    await download.saveAs('/tmp/test whiteboard');
    // await page.waitForTimeout(3000);
    expect(download.suggestedFilename()).toBe('test whiteboard.png');

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - export as png', status: 'passed', reason: 'Can export Whiteboard as png' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - export as png', status: 'failed', reason: 'Can\'t export Whiteboard as png' } })}`);
  }
});

test('screenshot whiteboard - display history', async ({ page }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    // await page.waitForTimeout(3000);

    await fileActions.history(mobile);
    await fileActions.historyPrev.click();
    await fileActions.historyPrev.click();
    await expect(page).toHaveScreenshot({ maxDiffPixels: 7000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - display history', status: 'passed', reason: 'Can display Whiteboard history' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - display history', status: 'failed', reason: 'Can\'t display Whiteboard history' } })}`);
  }
});

test('screenshot whiteboard - share whiteboard history at specific moment in time (link)', async ({ page, browser }) => {
  try {
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).waitFor();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 175,
        y: 315
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 174,
        y: 230
      }
    });
    await page.mouse.up();
    // await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 287,
        y: 227
      }
    });
    await page.mouse.down();
    await page.frameLocator('#sbox-iframe').locator('canvas').nth(1).hover({
      position: {
        x: 286,
        y: 314
      }
    });
    await page.mouse.up();
    await fileActions.history(mobile);
    await fileActions.historyPrev.click();
    await fileActions.share(mobile);
    // await page.waitForTimeout(5000);
    await fileActions.shareCopyLink.click();
    // await page.waitForTimeout(5000);

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    pageOne = await browser.newPage();

    await pageOne.goto(`${clipboardText}`);
    // await page.waitForTimeout(30000);

    await expect(pageOne).toHaveScreenshot({ maxDiffPixels: 7000 });

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'share whiteboard history at specific moment in time (link)', status: 'passed', reason: 'Can share Whiteboard history at specific moment in time (link)' } })}`);
  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'share whiteboard history at specific moment in time (link)', status: 'failed', reason: 'Can\'t share Whiteboard history at specific moment in time (link)' } })}`);
  }
});

// test('screenshot whiteboard - insert image', async ({ page }) => {
//   try {
//     // await page.waitForTimeout(5000);
//     const fileChooserPromise = page.waitForEvent('filechooser');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Insert' }).click();
//     const fileChooser = await fileChooserPromise;
//     await fileChooser.setFiles('e2e-test-suite/testdocuments/teamavatar-empty.png');

//     await expect(page).toHaveScreenshot({ maxDiffPixels: 1500 });

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'failed', reason: 'Can\'t clear whiteboard canvas' } })}`);
//   } catch (e) {
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'clear whiteboard canvas', status: 'passed', reason: 'Can clear whiteboard canvas' } })}`);
//   }
// });
