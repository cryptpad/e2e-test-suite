const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
var fs = require('fs');


let browser;
let page;
const url=`https://cryptpad.fr`;

const now = new Date();
const month = now.getMonth()+1
const dateStringDashFormat = now.getFullYear() + '-' + '0'+ month.toString() + '-' + now.getDate()
const nextWeek = new Date();  
nextWeek.setDate(now.getDate()+7);

const nextMonday = new Date()

nextMonday.setDate(nextMonday.getDate() + (((1 + 7 - nextMonday.getDay()) % 7) || 7));
const nextMondayMonth = parseInt(nextMonday.getMonth())+1
const nextMondayMonthFormatted = '0' + nextMondayMonth.toString()
const nextMondayString = nextMonday.getFullYear() + '-' + nextMondayMonthFormatted + '-' + nextMonday.getDate()


const nextMonth = nextWeek.getMonth()+1
const newDateString = nextWeek.getFullYear() + '-' + nextMonth + '-' + nextWeek.getDate()

const minutes = now.getMinutes().toString().length > 1 ? now.getMinutes() : '0' + now.getMinutes()
const hours = now.getHours()

const date = new Date()
const year = date.getFullYear();
const monthString = (1 + date.getMonth()).toString();
// const month =  monthString.toString().length > 1 ? monthString.toString() : '0' + monthString.toString();
const dayString = date.getDate().toString();
const day = dayString.length > 1 ? dayString : '0' + dayString;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const monthName = months[date.getMonth()]
const dateToday = `${monthName} ${dayString}, ${year}`
// const nextDate = parseInt(day) + 1
// const dateTomorrow = `${month} ${nextDate}, ${year}`



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
  await page.goto(`${url}/form`)
  await page.waitForTimeout(5000)
});


test('create quick poll', async ({ }) => {
  
  try {

    await page.goto(`${url}/login/`);
    await page.getByPlaceholder('Username').fill('test-user');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
    const login = page.locator(".login")
    await login.waitFor({ timeout: 1800 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000)
    await page.goto(`${url}/form/`);

    await page.frameLocator('#sbox-iframe').getByText('Quick Scheduling Poll').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Poll$/ }).locator('span')).toBeVisible()
    
    await page.waitForTimeout(10000)
    await expect(page.frameLocator('#sbox-iframe').getByText(`${nextMondayString}`)).toBeVisible()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    await page1.waitForTimeout(5000)
    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('heading', { name: 'Total responses: 1' })).toBeVisible()

    await page.waitForTimeout(10000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/Total1\(0\)0\(0\)/)).toBeVisible()
    
  } catch (e) {
    console.log(e);
    // /await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'failed',reason: 'Can\'t created quick scheduling poll'}})}`);

  }  
  
});


test(`form - save as and import template -- DOES NOT WORK THIS TEST WILL FAIL`, async ({}) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('example text');
    await page.waitForTimeout(3000)
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');
    await page.waitForTimeout(3000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
    await page.frameLocator('#sbox-iframe').locator('.dialog').getByRole('textbox').fill('example form template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000)
    await page.goto(`${url}/form/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('span').filter({ hasText: 'example form template' }).nth(1).click();

    await expect(page.frameLocator('#sbox-iframe').getByText('example text')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('example question?')
    await expect(page.frameLocator('#sbox-iframe').getByText('test option one')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('test option two')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('test option three')).toBeVisible()

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').getByText('Templates').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example form template').click({button: 'right'});
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example form template')).toHaveCount(0)
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'passed',reason: 'Can save and use Rich Text document as template'}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'pad > save as template', status: 'failed',reason: 'Can\'t save and use Rich Text document as template'}})}`);

  }  
});


test.afterEach(async ({  }) => {
    await browser.close()
  });