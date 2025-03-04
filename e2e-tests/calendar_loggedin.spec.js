const { test, url, mainAccountPassword, weekday, dateTodayDashFormat, dateTodaySlashFormat, nextMondayDashFormat, nextMondaySlashFormat, nextMondayStringFormat } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { UserActions } = require('./useractions.js');
const { Cleanup } = require('./cleanup.js');
const { FileActions } = require('./fileactions.js');

require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');
let mobile;
let fileActions;
let cleanUp;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(210000);
  mobile = isMobile;
  if (mobile) {
    const userActions = new UserActions(page);
    await userActions.login('test-user', mainAccountPassword);
  }

  await page.goto(`${url}/calendar`);
  fileActions = new FileActions(page);
  // await page.waitForTimeout(10000);

  cleanUp = new Cleanup(page);
  await cleanUp.cleanCalendar();

  // if (await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').count() > 0) {
  //   await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
  //   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
  //   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
  // }
});

test('create and delete event in calendar', async ({ page }) => {
  try {
    // create event
    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').click({ force: true });
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).click();
    }

    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

    // set date
    if (mobile) {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).fill(`${dateTodayDashFormat}T20:00`);
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').nth(1).fill(`${dateTodayDashFormat}T20:30`);
      await page.keyboard.press('Enter');
    } else {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
      await page.keyboard.press('Enter');
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();

    // delete
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click({ timeout: 3000 });
    await expect(page.frameLocator('#sbox-iframe').getByText(`${dateTodaySlashFormat} 20:00 - 20:30`)).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0).waitFor({ state: "hidden" }) 
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0).waitFor({ state: "hidden" }) 
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0)).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(1)).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' create and delete event in calendar', status: 'passed', reason: 'Can create and delete event in calendar' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: ' create and delete event in calendar', status: 'failed', reason: 'Can\'t create and delete event in calendar' } })}`);
  }
});

test('create and delete repeating event in calendar', async ({ page }) => {
  try {
    // create event

    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').click({ force: true });
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

    // make repeating

    await fileActions.oneTimeClick()

    await page.frameLocator('#sbox-iframe').getByText(`Weekly on ${weekday}`).click();
    // await page.waitForTimeout(3000);

    // set date and time
    if (mobile) {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).fill(`${dateTodayDashFormat}T20:00`);
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').nth(1).fill(`${dateTodayDashFormat}T20:30`);
      await page.keyboard.press('Enter');
    } else {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
      await page.keyboard.press('Enter');
    }

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    // await page.waitForTimeout(3000);

    // check if repeats next week
    await page.frameLocator('#sbox-iframe').getByLabel('Right').click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test event')).toBeVisible();

    // delete event
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Left' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test event').click();
    await expect(page.frameLocator('#sbox-iframe').getByText(`${dateTodaySlashFormat} 20:00 - 20:30`)).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0)).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(1)).toBeHidden();

    await page.frameLocator('#sbox-iframe').getByLabel('Right').click();
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0)).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(1)).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create and delete repeating event in calendar', status: 'passed', reason: 'Can create and delete repeating event in calendar' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create and delete repeating event in calendar', status: 'failed', reason: 'Can\'t create and delete repeating event in calendar' } })}`);
  }
});

test('create event in calendar and edit location', async ({ page }) => {
  try {
    // create event

    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').click({ force: true });
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

    // set date
    if (mobile) {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).fill(`${dateTodayDashFormat}T20:00`);
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').nth(1).fill(`${dateTodayDashFormat}T20:30`);
      await page.keyboard.press('Enter');
    } else {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
      await page.keyboard.press('Enter');
    }

    // set location
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('somewhere');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    // await page.waitForTimeout(3000);

    // edit location
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').dblclick();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('somewhere else');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Update' }).click();
    await page.waitForTimeout(2000);

    // check location changed
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText('somewhere else')).toBeVisible();

    // delete event
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0)).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(1)).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create event in calendar and edit location', status: 'passed', reason: 'Can create event in calendar and edit location' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create event in calendar and edit location', status: 'failed', reason: 'Can\'t create event in calendar and edit location' } })}`);
  }
});

test('create event in calendar and edit time', async ({ page }) => {
  try {
    // create event
    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').click({ force: true });
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

    // set date
    if (mobile) {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).fill(`${dateTodayDashFormat}T20:00`);
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').nth(1).fill(`${dateTodayDashFormat}T20:30`);
      await page.keyboard.press('Enter');
    } else {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
      await page.keyboard.press('Enter');
    }

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();

    // edit time
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();

    if (mobile) {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).waitFor();
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).click();
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).fill(`${dateTodayDashFormat}T20:15`);
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').nth(1).fill(`${dateTodayDashFormat}T20:30`);
      await page.keyboard.press('Enter');
    } else {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor();
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('15');
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Update' }).click();

    // check time changed
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText(`${dateTodaySlashFormat} 20:15 - 20:30`)).toBeVisible();

    // delete event
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test event').first()).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create event in calendar and edit time', status: 'passed', reason: 'Can create event in calendar and edit time' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create event in calendar and edit time', status: 'failed', reason: 'Can\'t create event in calendar and edit time' } })}`);
  }
});

test('create event in calendar and edit date', async ({ page }) => {
  try {
    // create event

    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').click({ force: true });
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

    // set time
    if (mobile) {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).fill(`${dateTodayDashFormat}T20:00`);
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').nth(1).fill(`${dateTodayDashFormat}T20:30`);
      await page.keyboard.press('Enter');
    } else {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
      await page.keyboard.press('Enter');
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();

    // //edit date
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click({ timeout: 10000 });
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();

    if (mobile) {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').nth(1).fill(`${nextMondayDashFormat}T20:00`);
      await page.keyboard.press('Enter');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').nth(1).fill(`${nextMondayDashFormat}T20:30`);
      await page.keyboard.press('Enter');
    } else {
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor();
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
      await page.frameLocator('#sbox-iframe').getByLabel(`${nextMondayStringFormat}`).nth(1).click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');

      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').waitFor();
      await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
      await page.frameLocator('#sbox-iframe').getByLabel(`${nextMondayStringFormat}`).first().click({ timeout: 3000 });
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Update' }).click();
    // await page.waitForTimeout(7000);

    // //check date changed
    await page.keyboard.down('End');
    const today = new Date();
    if (today.getDay() === 0) {
      await page.frameLocator('#sbox-iframe').getByLabel('Right').click();
    }
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByLabel('Right').click();
    await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText(`${nextMondaySlashFormat} 20:00 - 20:30`)).toBeVisible();

    // delete event
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first()).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create event in calendar and edit date', status: 'passed', reason: 'Can create event in calendar and edit date' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create event in calendar and edit date', status: 'failed', reason: 'Can\'t create event in calendar and edit date' } })}`);
  }
});

test('create new calendar and edit calendar in event', async ({ page }) => {
  try {
    let calendarCount = await page.frameLocator('#sbox-iframe').getByLabel('Calendar Settings').count();
    if (calendarCount > 1) {
      while (calendarCount > 1) {
        if (calendarCount > 1) {
          await page.frameLocator('#sbox-iframe').getByLabel('Calendar Settings').nth(calendarCount - 1).click();
        } else {
          await page.frameLocator('#sbox-iframe').getByLabel('Calendar Settings').click();
        }
        await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Remove' }).locator('a').click();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
        // await page.waitForTimeout(3000);
        calendarCount = calendarCount - 1;
      }
    }

    // create calendar
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New calendar' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test calendar');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    // await page.waitForTimeout(5000);

    // create event as part of calendar
    if (mobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').waitFor();
      await page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').click({ force: true });
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).waitFor();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'New event' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();

    await page.frameLocator('#sbox-iframe').getByText('test event').nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'My calendar' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test calendar').click();
    await page.waitForTimeout(1000);

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Update' }).click();
    // await page.waitForTimeout(5000);
    await page.waitForTimeout(1000);
    await page.frameLocator('#sbox-iframe').getByText('test event').nth(1).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test calendar').nth(3)).toBeVisible();

    // delete event
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test event').nth(0)).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').getByText('test event').nth(1)).toBeHidden();

    // delete calendar
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^test calendar/ }).locator('.btn.btn-default.fa.fa-gear.small.cp-calendar-actions').click();
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: 'Remove' }).nth(1).click();
    await fileActions.okButton.click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test calendar').nth(0)).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create new calendar and edit calendar in event', status: 'passed', reason: 'Can create new calendar and edit calendar in event' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create new calendar and edit calendar in event', status: 'failed', reason: 'Can\'t create new calendar and edit calendar in event' } })}`);
  }
});
