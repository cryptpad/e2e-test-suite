const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
var fs = require('fs');


let browser;
let page;
const url=`https://cryptpad.fr`;

const now = new Date();
const month = now.getMonth()+1
const dateString = now.getFullYear() + '-' + month + '-' + now.getDate()
const nextWeek = new Date();  
nextWeek.setDate(now.getDate()+7);

const nextMonday = new Date()

nextMonday.setDate(nextMonday.getDate() + (((1 + 7 - nextMonday.getDay()) % 7) || 7));
const nextMondayMonth = parseInt(nextMonday.getMonth())+1
const nextMondayString = nextMonday.getFullYear() + '-' + nextMondayMonth + '-' + nextMonday.getDate()


const nextMonth = nextWeek.getMonth()+1
const newDateString = nextWeek.getFullYear() + '-' + nextMonth + '-' + nextWeek.getDate()

const minutes = now.getMinutes().toString().length > 1 ? now.getMinutes() : '0' + now.getMinutes()
const hours = now.getHours()



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


test('anon form-quick-scheduling create + delete', async ({ }) => {
  
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
    
    await page.waitForTimeout(5000)
    await expect(page.frameLocator('#sbox-iframe').getByText(`${nextMondayString}`)).toBeVisible()
    
  } catch (e) {
    console.log(e);
    // /await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'failed',reason: 'Can\'t created quick scheduling poll'}})}`);

  }  
  
});

test('form - anon - close + open ', async ({ }) => {

    try {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
      await page.frameLocator('#sbox-iframe').getByText(`${now.getDate()}`, { exact: true }).last().click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill(`${hours}`);
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill(`${minutes}`);
      await page.keyboard.press('Enter')
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
      
      await page.waitForTimeout(5000)
      expect(await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form was closed on ${dateString}`)).toBeVisible();

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open', exact: true }).click();
      expect(await page.frameLocator('#sbox-iframe').getByText('This form is open')).toBeDefined();
    } catch(e) {
      console.log(e);
    }
});

test('form - anon - set future closing date + open ', async ({ }) => {

  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
    await page.frameLocator('#sbox-iframe').getByText(`${nextWeek.getDate()}`, { exact: true }).last().click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    
    await page.waitForTimeout(5000)
    expect(await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form will close on ${newDateString}`)).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Remove closing date', exact: true }).click();
    expect(await page.frameLocator('#sbox-iframe').getByText('This form is open')).toBeDefined();
  } catch(e) {
    console.log(e);
  }
});

test('form - anon responses - non-anon responses ', async ({ }) => { //add another user interaction

   try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first().click();
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
    await page.waitForTimeout(5000)
    //anon resp check
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    await page1.waitForTimeout(5000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('Responses to this form are anonymized').first()).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
    await page.waitForTimeout(5000)
    const page2Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page2 = await page2Promise;
    //non-anon resp check
    await page.waitForTimeout(5000)
    await expect(page2.frameLocator('#sbox-iframe').getByText('Please choose how you would like to answer this form:')).toBeVisible();

  } catch(e) {
    console.log(e);
  }

 });
 


test('form - anon - publish responses - public/private', async ({ }) => { //add another user interaction to check whether the notif are private/public

  try{

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Publish responses' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('Responses are public')).toBeVisible();
    //once the responses are made public we cannot make them private again
  } catch(e) {
    console.log(e);
  }

 });


test('form - anon - view history + share at a specific moment in history', async ({ }) => {
  try {
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('new option');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText('new option')).toHaveCount(0)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
    await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)

    await expect(page1.frameLocator('#sbox-iframe').getByText('new option')).toHaveCount(0)
        

    //await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    //await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});

test('form - anon - import file', async ({ }) => { 
  
  try {

    const fileChooserPromise = page.waitForEvent('filechooser');
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testForm.json');

    await page.waitForTimeout(3000)

    await expect(page.frameLocator('#sbox-iframe').getByText('Surfing')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('Bowling')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('What to do today?')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});

test('form - anon - make a copy', async ({ }) => {
  
  try {
    await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
    await page.waitForTimeout(5000)
    
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What to do today?');
    await page.waitForTimeout(5000)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('Surf');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('Cinema');
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form', exact: true }).click();
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
    await page.waitForTimeout(5000)
    const page1 = await page1Promise;
    await page1.waitForTimeout(10000)
    await expect(page1.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('What to do today?')
    await expect(page1.frameLocator('#sbox-iframe').getByText('Surf')).toBeVisible()
    await expect(page1.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible()
 
   // await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
  } catch (e) {
    console.log(e);
   // await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

  }  
});


test('form - anon - export file',  async({ })=>{
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('example text');

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    await download.saveAs('/tmp/test form');

    const actualFormJSONObject = JSON.parse(fs.readFileSync('/tmp/test form'))

    const actualFormJSONString = JSON.stringify(actualFormJSONObject)

    const testFormJSONString = /^{"form":{"1":{"type":"md","opts":{"text":"example text"}},"2":{"type":"radio","opts":{"values":\[{"uid":"([a-z0-9]{10,11})","v":"test option one"},{"uid":"([a-z0-9]{10,11})","v":"test option two"},{"uid":"([a-z0-9]{10,11})","v":"test option three"}]},"q":"example question\?"}},"order":\["1","2"],"version":1}$/

    if (testFormJSONString.test(actualFormJSONString)) {
      console.log('pass')

    } else {
      console.log('fail')

    }


  } catch(e) {
    console.log(e);
  }
});


test('form - anon - can add description + submission message',  async({ })=>{
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('New description');
    await page.waitForTimeout(5000)
    await expect(page.frameLocator('#sbox-iframe').getByText('New description')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Add submit message' }).click();
    await page.frameLocator('#sbox-iframe').locator('pre').nth(1).fill('Thank you for submitting your answer!');
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click()
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-response-preview').getByText('Thank you for submitting your answer!')).toBeVisible();
    
  } catch(e) {
    console.log(e);
  }
});

test.afterEach(async ({  }) => {
  await browser.close()
});
