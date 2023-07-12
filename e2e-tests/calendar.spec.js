const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url } = require('../browserstack.config.js')

test.describe.configure({ mode: 'serial' });


let browser;
let page;
let pageOne;

test.beforeEach(async ({}, testInfo) => {
  test.setTimeout(2400000);
  await page.goto(`${url}/calendar/`);

});

//today's date
const date = new Date()
const year = date.getFullYear();
const month = (1 + date.getMonth()).toString();
const dayString = date.getDate().toString();
const day = dayString.length > 1 ? dayString : '0' + dayString;
const dateString = month + '/' + day + '/' + year;


test('user - create and delete event in calendar', async ({ page }) => {

  try {

    //create event
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('new event');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

    //set date
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).fill(`${year}`);
    await page.frameLocator('#sbox-iframe').getByText(`${day}`, { exact: true }).nth(2).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();

    //set time
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');

    await page.frameLocator('#sbox-iframe').getByText('RepeatOne timeOne timeDaily').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();

    //delete
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('new event').click();
    await page.frameLocator('#sbox-iframe').getByText( `${dateString} 08:00 PM - 08:30 PM`).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText( `${dateString} 08:00 PM - 08:30 PM`)).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user - create and delete event in calendar', status: 'passed',reason: 'Can create and delete event in calendar'}})}`);
  } catch (e) {
  console.log(e);
  await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user - create and delete event in calendar', status: 'failed',reason: 'Can\'t create and delete event in calendar'}})}`);
  } 

});


test('user - create and delete repeating event in calendar', async ({ page }) => {

  try {

    //create event
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('test event');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');

    //set date
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).fill(`${year}`);
    await page.frameLocator('#sbox-iframe').getByText(`${day}`, { exact: true }).nth(2).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();

    //set time
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');

    //make repeating
    await page.frameLocator('#sbox-iframe').getByText('RepeatOne timeOne timeDaily').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' One time' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Weekly' }).click();
    await page.waitForTimeout(3000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();
    await page.waitForTimeout(3000)

    //check if repeats next week
    await page.frameLocator('#sbox-iframe').locator('.fa.fa-chevron-right').click()
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test event')).toBeVisible()

    //delete event
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test event').click();
    await expect(page.frameLocator('#sbox-iframe').getByText( `08:00 PM - 08:30 PM`)).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText( `08:00 PM - 08:30 PM`)).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user - create and delete repeating event in calendar', status: 'passed',reason: 'Can create and delete repeating event in calendar'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user - create and delete repeating event in calendar', status: 'failed',reason: 'Can\'t create and delete repeating event in calendar'}})}`);
  }  

});


test.afterEach(async () => {
  await browser.close()
});

