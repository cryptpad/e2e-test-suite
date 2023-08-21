const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url } = require('../browserstack.config.js')

test.describe.configure({ mode: 'serial' });


let browser;
let page;
let pageOne;

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
  await page.goto(`${url}/calendar`)
  await page.waitForTimeout(5000)
});


//today's date
const date = new Date()
const year = date.getFullYear();
const monthString = (1 + date.getMonth()).toString();
// const month =  monthString.toString().length > 1 ? monthString.toString() : '0' + monthString.toString();
const dayString = date.getDate().toString();
const day = dayString.length > 1 ? dayString : '0' + dayString;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const month = months[date.getMonth()]
const dateToday = `${month} ${dayString}, ${year}`
const nextDate = parseInt(day) + 1
const dateTomorrow = `${month} ${nextDate}, ${year}`
const dateString = monthString + '/' + dayString + '/' + year;

const nextDay = nextDate.toString().length > 1 ? nextDate.toString() : '0' + nextDate.toString();
const nextDateString = monthString + '/' + nextDate + '/' + year;


// test('create and delete event in calendar', async ({ }) => {

//   try {

//     //create event
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

//     //set date
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click({timeout: 3000});
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
//     await page.keyboard.press('Enter')

//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click({timeout: 3000});
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();

//     //delete
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click({timeout: 3000})
//     await expect(page.frameLocator('#sbox-iframe').getByText( `${dateString} 08:00 PM - 08:30 PM`)).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0)).toBeHidden();
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(1)).toBeHidden();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' create and delete event in calendar', status: 'passed',reason: 'Can create and delete event in calendar'}})}`);
//   } catch (e) {
//   console.log(e);
//   await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ' create and delete event in calendar', status: 'failed',reason: 'Can\'t create and delete event in calendar'}})}`);
//   } 

// });


// test('create and delete repeating event in calendar', async ({ }) => {

//   try {

//     //create event
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

//     //set date
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
    
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).fill(`${year}`);
//     await page.frameLocator('#sbox-iframe').getByText(`${day}`, { exact: true }).nth(2).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();

//     //set time
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();

//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');

//     //make repeating
//     await page.frameLocator('#sbox-iframe').getByText('RepeatOne timeOne timeDaily').click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' One time' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Weekly' }).click();
//     await page.waitForTimeout(3000)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();
//     await page.waitForTimeout(3000)

//     //check if repeats next week
//     await page.frameLocator('#sbox-iframe').locator('.fa.fa-chevron-right').click()
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test event')).toBeVisible()

//     //delete event
//     await page.frameLocator('#sbox-iframe').locator('.fa.fa-chevron-left').click()
//     await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test event').click();
//     await expect(page.frameLocator('#sbox-iframe').getByText( `08:00 PM - 08:30 PM`)).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0)).toBeHidden();
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(1)).toBeHidden();

//     await page.frameLocator('#sbox-iframe').locator('.fa.fa-chevron-right').click()
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0)).toBeHidden();
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(1)).toBeHidden();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create and delete repeating event in calendar', status: 'passed',reason: 'Can create and delete repeating event in calendar'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create and delete repeating event in calendar', status: 'failed',reason: 'Can\'t create and delete repeating event in calendar'}})}`);
//   }  

// });

// test('create event in calendar and edit location', async ({ }) => {

//   try {

//     //create event
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

//     //set date
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).fill(`${year}`);
//     await page.frameLocator('#sbox-iframe').getByText(`${day}`, { exact: true }).nth(2).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();

//     //set time
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');

//     //set location
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('somewhere');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();
//     await page.waitForTimeout(3000)

//     //edit location
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').dblclick();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('somewhere else');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Update' }).click();
//     await page.waitForTimeout(5000)

//     //check location changed
//     await page.reload()
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Location: somewhere else')).toBeVisible();

//     //delete event
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(0)).toBeHidden();
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(1)).toBeHidden();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event in calendar and edit location', status: 'passed',reason: 'Can create event in calendar and edit location'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event in calendar and edit location', status: 'failed',reason: 'Can\'t create event in calendar and edit location'}})}`);
//   }  

// });

// test('create event in calendar and edit time', async ({ }) => {

//   try {

//     //create event
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

//     //set date
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).fill(`${year}`);
//     await page.frameLocator('#sbox-iframe').getByText(`${day}`, { exact: true }).nth(2).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();

//     //set time
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();

//     //edit time
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('15');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Update' }).click();
//     await page.waitForTimeout(5000)

//     //check time changed
//     await page.reload()
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText( '08:15 PM - 08:30 PM')).toBeVisible();

//     //delete event
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('test event').first()).toBeHidden();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event in calendar and edit time', status: 'passed',reason: 'Can create event in calendar and edit time'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event in calendar and edit time', status: 'failed',reason: 'Can\'t create event in calendar and edit time'}})}`);
//   }  

// });


// test('create event in calendar and edit date', async ({ }) => {

//   try {

//     //create event
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

//     //set time
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();

//     // //edit date
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click({timeout: 10000});
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
//     await page.frameLocator('#sbox-iframe').getByLabel(`${dateTomorrow}`).nth(1).click({timeout: 3000})
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
    
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').waitFor()
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
//     await page.frameLocator('#sbox-iframe').getByLabel(`${dateTomorrow}`).nth(0).click({timeout: 3000})
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Update' }).click();
//     await page.waitForTimeout(7000)

//     // //check date changed
//     await page.reload()
//     await page.keyboard.down('End')
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText( `${nextDateString} 08:00 PM - 08:30 PM`)).toBeVisible()

//     //delete event
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first()).toBeHidden();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event in calendar and edit date', status: 'passed',reason: 'Can create event in calendar and edit date'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event in calendar and edit date', status: 'failed',reason: 'Can\'t create event in calendar and edit date'}})}`);
//   }  

// });

// test('create event in calendar and edit calendar', async ({ }) => {

//   try {

//     // //create event
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

//     //set date
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');

//     await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
//     await page.keyboard.press('Enter')
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();
//     await page.waitForTimeout(3000)

//     // //edit calendar
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Meetings' }).click();
//     await page.frameLocator('#sbox-iframe').locator('li').filter({ hasText: 'My calendar' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Update' }).click();
//     await page.waitForTimeout(7000)

//     // //check calendar changed
//     await page.reload()
//     await page.keyboard.down('End')
//     await page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').first().click()
//     await expect(await page.frameLocator('#sbox-iframe').getByText('My calendar').nth(1)).toBeVisible()


//     //delete event
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('test event').nth(0)).toBeHidden();
//     await expect(page.frameLocator('#sbox-iframe').getByText('test event').nth(1)).toBeHidden();

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event and edit calendar', status: 'passed',reason: 'Can create event and edit calendar'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event and edit calendar', status: 'failed',reason: 'Can\'t create event and edit calendar'}})}`);
//   }  

// });

// test('create new calendar', async ({ }) => {

//   try {

//     //create calendar
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New calendar' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test calendar');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
//     await page.waitForTimeout(5000)

//     //create event as part of calendar
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Meetings' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('list').getByText('test calendar').click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();

//     await page.frameLocator('#sbox-iframe').getByText('test event').nth(1).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('test calendar').nth(3)).toBeVisible()

//     //delete event
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('test event').nth(0)).toBeHidden();
//     await expect(page.frameLocator('#sbox-iframe').getByText('test event').nth(1)).toBeHidden();

//     //delete calendar
//     await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^test calendarEditShareAccessImportExportPropertiesRemove$/ }).locator('.btn.btn-default.fa.fa-gear.small.cp-calendar-actions').click();
//     await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: 'Remove' }).nth(3).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('test calendar').nth(0)).toBeHidden();
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event and edit calendar', status: 'passed',reason: 'Can create event and edit calendar'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'create event and edit calendar', status: 'failed',reason: 'Can\'t create event and edit calendar'}})}`);
//   }  

// });

test.afterEach(async () => {
  await browser.close()
});

