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
  test.setTimeout(90000);
  mobile = isMobile;
  await page.goto(`${url}/calendar`);
  fileActions = new FileActions(page, mobile);
  cleanUp = new Cleanup(page);
  await cleanUp.cleanCalendar();
});

test('loggedin - create and delete event in calendar', async ({ page }) => {
  try {
    // create event
    await fileActions.newCalendarEvent(mobile)

    await fileActions.setEventTitle()
    await fileActions.eventLocation.fill('test location');

    await fileActions.setHour('20', '00', '30')
    await fileActions.saveButton.click();

    // delete
    await fileActions.calendarTestEvent.first().click({ timeout: 3000 });
    await expect(fileActions.mainFrame.getByText(`${dateTodaySlashFormat} 20:00 - 20:30`)).toBeVisible();
    await fileActions.deleteButton.click();
    await fileActions.areYouSureButton.click();
    await fileActions.calendarTestEvent.nth(0).waitFor({ state: "hidden" }) 
    await fileActions.calendarTestEvent.nth(0).waitFor({ state: "hidden" }) 
    await expect(fileActions.calendarTestEvent.nth(0)).toBeHidden();
    await expect(fileActions.calendarTestEvent.nth(1)).toBeHidden();

    await fileActions.toSuccess( 'Can create and delete event in calendar');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t create and delete event in calendar');
  }
});

test('loggedin - create and delete repeating event in calendar', async ({ page }) => {
  try {
    // create event
    await fileActions.newCalendarEvent(mobile)
    await fileActions.setEventTitle()
    await fileActions.eventLocation.fill('test location');

    // make repeating
    await fileActions.oneTimeClick()
    await fileActions.mainFrame.getByText(`Weekly on ${weekday}`).click();

    // set date and time
    await fileActions.setHour('20', '00', '30')
    await fileActions.saveButton.click();

    // check if repeats next week
    await fileActions.nextWeek.click();
    await expect(fileActions.calendarSlot.getByText('test event')).toBeVisible();

    // delete event
    await fileActions.prevWeek.click();
    await fileActions.calendarSlot.getByText('test event').click();
    await expect(fileActions.mainFrame.getByText(`${dateTodaySlashFormat} 20:00 - 20:30`)).toBeVisible();
    await fileActions.deleteButton.click();
    await fileActions.areYouSureButton.click();
    await expect(fileActions.calendarTestEvent.nth(0)).toBeHidden();
    await expect(fileActions.calendarTestEvent.nth(1)).toBeHidden();

    await fileActions.nextWeek.click();
    await expect(fileActions.calendarTestEvent.nth(0)).toBeHidden();
    await expect(fileActions.calendarTestEvent.nth(1)).toBeHidden();

    await fileActions.toSuccess('Can create and delete repeating event in calendar');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t create and delete repeating event in calendar' );
  }
});

test('loggedin - create event in calendar and edit location', async ({ page }) => {
  try {
    // create event

    await fileActions.newCalendarEvent(mobile)
    await fileActions.setEventTitle()
    await fileActions.eventLocation.fill('test location');

    // set date
    await fileActions.setHour('20', '00', '30')

    // set location
    await fileActions.eventLocation.click();
    await fileActions.eventLocation.fill('somewhere');
    await fileActions.saveButton.click();

    // edit location
    await fileActions.calendarTestEvent.first().click();
    await fileActions.editEvent.click();
    await fileActions.eventLocation.click();
    await fileActions.eventLocation.dblclick();
    await fileActions.eventLocation.fill('somewhere else');
    await fileActions.updateButton.click();
    await page.waitForTimeout(2000);

    // check location changed
    await fileActions.calendarTestEvent.first().click();
    await expect(fileActions.mainFrame.getByText('somewhere else')).toBeVisible();

    // delete event
    await fileActions.deleteButton.click();
    await fileActions.areYouSureButton.click();
    await expect(fileActions.calendarTestEvent.nth(0)).toBeHidden();
    await expect(fileActions.calendarTestEvent.nth(1)).toBeHidden();

    await fileActions.toSuccess( 'Can create event in calendar and edit location');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t create event in calendar and edit location');
  }
});

test('loggedin - create event in calendar and edit time', async ({ page }) => {
  try {
    // create event
    await fileActions.newCalendarEvent(mobile)
    await fileActions.setEventTitle()
    await fileActions.eventLocation.fill('test location');

    // set date
    await fileActions.setHour('20', '00', '30')
    await fileActions.saveButton.click();

    // edit time
    await fileActions.calendarTestEvent.first().click();
    await fileActions.editEvent.click();
    await fileActions.setHour('20', '15', '30')
    await page.waitForTimeout(2000);
    await fileActions.updateButton.click();

    // check time changed
    await page.waitForTimeout(1000);
    await fileActions.calendarTestEvent.first().click();
    await expect(fileActions.mainFrame.getByText(`${dateTodaySlashFormat} 20:15 - 20:30`)).toBeVisible();

    // delete event
    await fileActions.deleteButton.click();
    await fileActions.areYouSureButton.click();
    await expect(fileActions.testEvent.first()).toBeHidden();

    await fileActions.toSuccess( 'Can create event in calendar and edit time');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e, 'Can\'t create event in calendar and edit time');
  }
});

test('loggedin - create event in calendar and edit date', async ({ page }) => {
  try {
    // create event
    await fileActions.newCalendarEvent(mobile)
    await fileActions.setEventTitle()
    await fileActions.eventLocation.fill('test location');

    // set time
    await fileActions.setHour('20', '00', '30')
    await fileActions.saveButton.click();

    //edit date
    await fileActions.calendarTestEvent.first().click({ timeout: 10000 });
    await fileActions.editEvent.click();

    if (mobile) {
      await fileActions.startDate.nth(1).fill(`${nextMondayDashFormat}T20:00`);
      await page.keyboard.press('Enter');
      await fileActions.endDate.nth(1).fill(`${nextMondayDashFormat}T20:30`);
      await page.keyboard.press('Enter');
    } else {
      await fileActions.startDate.waitFor();
      await fileActions.startDate.click();
      await fileActions.mainFrame.getByLabel(`${nextMondayStringFormat}`).nth(1).click({ timeout: 3000 });
      await fileActions.pickHour.click();
      await fileActions.pickHour.fill('20');
      await fileActions.pickMinute.fill('00');
      await fileActions.endDate.waitFor();
      await fileActions.endDate.click();
      await fileActions.mainFrame.getByLabel(`${nextMondayStringFormat}`).first().click({ timeout: 3000 });
      await fileActions.pickHour.click();
      await fileActions.pickHour.fill('20');
      await fileActions.pickMinute.fill('30');
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(1000);
    await fileActions.updateButton.click();

    // check date changed
    await page.keyboard.down('End');
    const today = new Date();
    if (today.getDay() === 0) {
      await fileActions.nextWeek.click();
    }
    await page.waitForTimeout(1000);
    await fileActions.nextWeek.click();
    await fileActions.calendarTestEvent.first().click();
    await expect(fileActions.mainFrame.getByText(`${nextMondaySlashFormat} 20:00 - 20:30`)).toBeVisible();

    // delete event
    await fileActions.deleteButton.click();
    await fileActions.areYouSureButton.click();
    await expect(fileActions.calendarTestEvent.first()).toBeHidden();

    await fileActions.toSuccess( 'Can create event in calendar and edit date');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e,  'Can\'t create event in calendar and edit date');
  }
});

test('loggedin - create new calendar and edit calendar in event', async ({ page }) => {
  try {
    let calendarCount = await fileActions.calendarSettings.count();
    if (calendarCount > 1) {
      while (calendarCount > 1) {
        if (calendarCount > 1) {
          await fileActions.calendarSettings.nth(calendarCount - 1).click();
        } else {
          await fileActions.calendarSettings.click();
        }
        await fileActions.remove.click();
        await fileActions.okButton.click();
        calendarCount = calendarCount - 1;
      }
    }

    // create calendar
    await fileActions.newCalendar.click();
    await fileActions.textbox.click();
    await fileActions.textbox.fill('test calendar');
    await fileActions.saveButton.click();

    // create event as part of calendar
    await fileActions.newCalendarEvent(mobile)
    await fileActions.setEventTitle()
    await fileActions.saveButton.click();

    await fileActions.testEvent.nth(1).click();
    await fileActions.editEvent.click();
    await fileActions.myCalendar.click();
    await fileActions.calendarSlot.getByText('test calendar').click();
    await page.waitForTimeout(1000);

    await fileActions.updateButton.click();
    await page.waitForTimeout(1000);
    await fileActions.testEvent.nth(1).click();
    await expect(fileActions.testCalendar.nth(3)).toBeVisible();

    // delete event
    await fileActions.deleteButton.click();
    await fileActions.areYouSureButton.click();
    await expect(fileActions.testEvent.nth(0)).toBeHidden();
    await expect(fileActions.testEvent.nth(1)).toBeHidden();

    // delete calendar
    await fileActions.testCalendarSettings.click();
    await fileActions.remove.click();
    await fileActions.okButton.click();
    await expect(fileActions.testCalendar.nth(0)).toBeHidden();

    await fileActions.toSuccess('Can create new calendar and edit calendar in event');
  } catch (e) {
    console.log(e);
    await fileActions.toFailure(e,  'Can\'t create new calendar and edit calendar in event');
  }
});
