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


// test('anon form-quick-scheduling create + delete', async ({ }) => {
  
//   try {

//     await page.goto(`${url}/login/`);
//     await page.getByPlaceholder('Username').fill('test-user');
//     await page.waitForTimeout(10000)
//     await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//     const login = page.locator(".login")
//     await login.waitFor({ timeout: 1800 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//       await login.click()
//     }
//     await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(5000)
//     await page.goto(`${url}/form/`);

//     await page.frameLocator('#sbox-iframe').getByText('Quick Scheduling Poll').click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Poll$/ }).locator('span')).toBeVisible()
    
//     await page.waitForTimeout(5000)
//     await expect(page.frameLocator('#sbox-iframe').getByText(`${nextMondayString}`)).toBeVisible()
    
//   } catch (e) {
//     console.log(e);
//     // /await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'failed',reason: 'Can\'t created quick scheduling poll'}})}`);

//   }  
  
// });

// test('form - anon - close + open ', async ({ }) => {

//     try {
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
//       await page.frameLocator('#sbox-iframe').getByText(`${now.getDate()}`, { exact: true }).last().click();
//       await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill(`${hours}`);
//       await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill(`${minutes}`);
//       await page.keyboard.press('Enter')
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
      
//       await page.waitForTimeout(5000)
//       expect(await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form was closed on ${dateString}`)).toBeVisible();

//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open', exact: true }).click();
//       expect(await page.frameLocator('#sbox-iframe').getByText('This form is open')).toBeDefined();
//     } catch(e) {
//       console.log(e);
//     }
// });

// test('form - anon - set future closing date + open ', async ({ }) => {

//   try {
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
//     await page.frameLocator('#sbox-iframe').getByText(`${nextWeek.getDate()}`, { exact: true }).last().click();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    
//     await page.waitForTimeout(5000)
//     expect(await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form will close on ${newDateString}`)).toBeVisible();

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Remove closing date', exact: true }).click();
//     expect(await page.frameLocator('#sbox-iframe').getByText('This form is open')).toBeDefined();
//   } catch(e) {
//     console.log(e);
//   }
// });

// test('form - anon responses - non-anon responses ', async ({ }) => { //add another user interaction

//    try {

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//     await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first().click();
//     await page.waitForTimeout(5000)
//     await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
//     await page.waitForTimeout(5000)
//     //anon resp check
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//     const page1Promise = page.waitForEvent('popup');
//     const page1 = await page1Promise;
//     await page1.waitForTimeout(5000)
//     await expect(page1.frameLocator('#sbox-iframe').getByText('Responses to this form are anonymized').first()).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//     await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first().click();
//     await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
//     await page.waitForTimeout(5000)
//     const page2Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//     const page2 = await page2Promise;
//     //non-anon resp check
//     await page.waitForTimeout(5000)
//     await expect(page2.frameLocator('#sbox-iframe').getByText('Please choose how you would like to answer this form:')).toBeVisible();

//   } catch(e) {
//     console.log(e);
//   }

//  });
 


// test('form - anon - publish responses - public/private', async ({ }) => { //add another user interaction to check whether the notif are private/public

//   try{

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Publish responses' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('Responses are public')).toBeVisible();
//     //once the responses are made public we cannot make them private again
//   } catch(e) {
//     console.log(e);
//   }

//  });


// test('form - anon - view history + share at a specific moment in history', async ({ }) => {
//   try {
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('new option');
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('new option')).toHaveCount(0)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     await page.frameLocator('#sbox-secure-iframe').getByText('Link', { exact: true }).click();
//     await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
//     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

//     const clipboardText = await page.evaluate("navigator.clipboard.readText()");
//     const page1 = await browser.newPage();
//     await page1.goto(`${clipboardText}`)

//     await expect(page1.frameLocator('#sbox-iframe').getByText('new option')).toHaveCount(0)
        

//     //await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     //await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('form - anon - import file', async ({ }) => { 
  
//   try {

//     const fileChooserPromise = page.waitForEvent('filechooser');
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

//     const fileChooser = await fileChooserPromise;
//     await fileChooser.setFiles('testForm.json');

//     await page.waitForTimeout(3000)

//     await expect(page.frameLocator('#sbox-iframe').getByText('Surfing')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Bowling')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('What to do today?')).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('form - anon - make a copy', async ({ }) => {
  
//   try {
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
//     await page.waitForTimeout(5000)
    
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What to do today?');
//     await page.waitForTimeout(5000)
//     await page.keyboard.press('Enter')
//     await page.waitForTimeout(5000)

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
//     await page.waitForTimeout(5000)
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('Surf');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('Cinema');
//     await page.waitForTimeout(5000)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form', exact: true }).click();
//     await page.waitForTimeout(5000)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
//     await page.waitForTimeout(5000)
//     const page1 = await page1Promise;
//     await page1.waitForTimeout(10000)
//     await expect(page1.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('What to do today?')
//     await expect(page1.frameLocator('#sbox-iframe').getByText('Surf')).toBeVisible()
//     await expect(page1.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible()
 
//    // await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//    // await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });


// test('form - anon - export file',  async({ })=>{
 
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
//     await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
//     await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('example text');

//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     const downloadPromise = page.waitForEvent('download');
//     const download = await downloadPromise;
//     await download.saveAs('/tmp/test form');

//     const actualFormJSONObject = JSON.parse(fs.readFileSync('/tmp/test form'))

//     const actualFormJSONString = JSON.stringify(actualFormJSONObject)

//     const testFormJSONString = /^{"form":{"1":{"type":"md","opts":{"text":"example text"}},"2":{"type":"radio","opts":{"values":\[{"uid":"([a-z0-9]{10,11})","v":"test option one"},{"uid":"([a-z0-9]{10,11})","v":"test option two"},{"uid":"([a-z0-9]{10,11})","v":"test option three"}]},"q":"example question\?"}},"order":\["1","2"],"version":1}$/

//     if (testFormJSONString.test(actualFormJSONString)) {
//       console.log('pass')

//     } else {
//       console.log('fail')

//     }


//   } catch(e) {
//     console.log(e);
//   }
// });


// test('form - anon - can add description + submission message',  async({ })=>{
 
//   try {

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
//     await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
//     await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('New description');
//     await page.waitForTimeout(5000)
//     await expect(page.frameLocator('#sbox-iframe').getByText('New description')).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Add submit message' }).click();
//     await page.frameLocator('#sbox-iframe').locator('pre').nth(1).fill('Thank you for submitting your answer!');
//     await page.waitForTimeout(5000)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click()
//     await expect(page.frameLocator('#sbox-iframe').locator('#cp-response-preview').getByText('Thank you for submitting your answer!')).toBeVisible();
    
//   } catch(e) {
//     console.log(e);
//   }
// });

test('form - anon - template',  async({ })=>{//not finished
 
  try {
    await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What colour for the template?');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Answer: OptionalRequiredPreviewOption 1Option 2EditDelete$/ }).getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('blue');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('red');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('myTemplate');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File  New  History  Snapshots  Make a copy  Save as template  Import a template  Move to trash  Tags  Properties  Help  Import  Export' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
    await page.frameLocator('#sbox-secure-iframe').locator('span:nth-child(5) > .cptools').click();
    await expect(page.frameLocator('#sbox-secure-iframe').locator('//*[@id="cp-app-form-container"]/div/div[2]/div[4]/div[2]/input').getByText('What colour for the template?')).toBeDefined();
  } catch(e) {
    console.log(e);
  }
});

// test('form - anon - guest access - allowed/blocked',  async({ })=>{
 
//   try {
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What to do today?');
//   await page.frameLocator('#sbox-iframe').locator('div').locator('//*[@id="cp-app-form-container"]/div/div[2]/div[4]/div[3]/div[5]/button[1]').click();
//   await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('sleep');
//   await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('eat');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
//   const page1Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page1 = await page1Promise;
//   await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[1]/div/div[1]/button[1]/span').click();
//   //allowed
//   await expect(page.frameLocator('#sbox-iframe').locator('//*[@id="cp-title"]')).toHaveText('Total responses: 1');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//   await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Blocked' }).locator('span').first().click();
//   await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
//   const page3Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page3 = await page3Promise;
//   //blocked
//   await expect(page3.frameLocator('#sbox-iframe').locator('//html/body/div[5]/div/div/p/span')).toHaveText('Guest responses are blocked for this form. You must log in or register to submit answers.');
//   } catch(e) {
//     console.log(e);
//   }
// });


// test('form - anon - respond to text question',  async({ })=>{
 
//   try {
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What is your name?');
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: 'Preview form' }).nth(2).click();
//   const page1Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page1 = await page1Promise;
//   await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').click();
//   await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').fill('Guest');
//   await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//   await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('Guest')).toBeVisible();
//   } catch(e) {
//     console.log(e);
//   }
// });


// test('form - anon - respond to paragraph question',  async({ })=>{
 
//   try {
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Paragraph' }).click();
//   await page.frameLocator('#sbox-iframe').locator('div:nth-child(6) > .cp-form-input-block').click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('Tell me about yourself');
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');
//   const page1Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page1 = await page1Promise;
//   await page1.frameLocator('#sbox-iframe').locator('textarea').click();
//   await page1.frameLocator('#sbox-iframe').locator('textarea').fill('I am guest');
//   await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//   await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('I am guest')).toBeVisible();
//   } catch(e) {

//     console.log(e);
//   }
// });

// test('form - anon - respond to choice question',  async({ })=>{
 
//     try {
//     await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choice' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What is your choice?');
//     await page.frameLocator('#sbox-iframe').getByText('Option 1').nth(1).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(2).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('choice1');
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).click();
//     await page.frameLocator('#sbox-iframe').locator('div:nth-child(2) > .cp-form-handle').click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).dblclick();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).fill('choice2');
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).press('Enter');
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//     const page1 = await page1Promise;
//     await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'choice2' }).locator('span').first().click();
//     await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[3]/div[3]/div[2]/div[2]')).toHaveText('What is your choice?');
//     } catch(e) {
  
//       console.log(e);
//     }
//   });

// test('form - anon - respond to choice grid question',  async({ })=>{
 
//   try {
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choice Grid' }).click();
//   await page.frameLocator('#sbox-iframe').locator('div:nth-child(6) > .cp-form-block-drag-handle').click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What is your choice grid?');
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(2).click();
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').first().fill('General');
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').first().fill('Choice1');
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').nth(1).fill('Particular');
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(1).fill('Choice2');
//   const page1Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page1 = await page1Promise;
//   await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^GeneralGeneral$/ }).locator('span').first().click();
//   await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^ParticularParticular$/ }).locator('span').nth(2).click();
//   await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//   await expect(page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[3]/div[3]/div[2]/div[2]')).toHaveText('What is your choice grid?');
//   } catch(e) {

//     console.log(e);
//   }
// });
  
// test('form - anon - respond to date question',  async({ })=>{
 
//   try {
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Date' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What is today\'s date?');
//   const page1Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page1 = await page1Promise;
//   await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').click();
//   await page1.frameLocator('#sbox-iframe').getByText('28', { exact: true }).click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//   await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//   const element = page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[3]/div[3]/div[2]/div[3]');
//   const textValue = await element.textContent();
//   await expect(textValue).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
//   } catch(e) {
//     console.log(e);
//   }
// });

// test('form - anon - respond to checkbox question',  async({ })=>{
 
//   try {
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What box do you choose?');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(2).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('box1');
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).fill('box2');
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(4).fill('box3');
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//     const page1 = await page1Promise;
//     await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'box1' }).locator('span').first().click();
//     await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'box2' }).locator('span').first().click();
//     await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'box3' }).locator('span').first().click();
//     await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
//     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//     await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: 'Responses (0)Preview formCopy public linkForm settingsThis form is openResponses' }).nth(3).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[3]/div[3]/div[2]/div[2]')).toHaveText('What box do you choose?');

//   } catch(e) {
//     console.log(e);
//   }
// });

// test('form - anon - respond to checkbox grid question',  async({ })=>{
 
//   try {
    
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox Grid' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('Which checkbox grid do you choose?');
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(2).click();
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').first().fill('General');
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').nth(1).fill('Particular');
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').first().fill('Box1');
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(1).fill('Box2');
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(2).fill('Box3');
//   const page1Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page1 = await page1Promise;
//   await page1.frameLocator('#sbox-iframe').locator('.cp-checkmark-mark').first().click();
//   await page1.frameLocator('#sbox-iframe').locator('div:nth-child(3) > label:nth-child(4) > .cp-checkmark-mark').click();
//   await page1.frameLocator('#sbox-iframe').locator('label:nth-child(5) > .cp-checkmark-mark').first().click();
//   await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//   await expect( page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[3]/div[3]/div[2]/div[2]')).toHaveText('Which checkbox grid do you choose?');
//   } catch(e) {
//     console.log(e);
//   }
// });

// test('form - anon - respond to ordered list question',  async({ })=>{
 
//   try {
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Ordered list' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What is your prefference?');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(2).click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('sleep');
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).fill('eat');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('work');
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//     const page1 = await page1Promise;
//     await page1.frameLocator('#sbox-iframe').getByText('?work').click();
//     await page1.frameLocator('#sbox-iframe').getByText('?work').first().click();
//     await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//     await expect(page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[3]/div[3]/div[2]')).toHaveText('Ordered listWhat is your prefference?1 empty answerssleep0 eat0 work0 Condorcet methodSchulzeSchulzeRanked Pairswinner:');
//   } catch(e) {
//     console.log(e);
//   }
// });

// test('form - anon - respond to poll question',  async({ })=>{
 
//   try {
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Poll' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What do you want to do?');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(2).click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('Hiking');
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).fill('Yoga');
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(4).fill('Campfire');
//   const page1Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page1 = await page1Promise;
//   await page1.frameLocator('#sbox-iframe').getByText('0(0)').nth(1).click();
//   await page1.frameLocator('#sbox-iframe').locator('div:nth-child(3) > div:nth-child(3)').first().click();
//   await page1.frameLocator('#sbox-iframe').getByText('Swap axesHikingYogaCampfireYour answersTotal0(0)1(0)0(0)').click();
//   await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//   const element = page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[3]/div[3]/div[2]/div[3]');
//   const textValue = await element.textContent();
//   await expect(textValue).toMatch("Swap axesHikingYogaCampfireGuGuestTotal0(0)0(1)0(0)");
  
//   } catch(e) {
//     console.log(e);
//   }
// });

// test('form - anon - respond to page break question',  async({ })=>{
 
//     try {
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Page break' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
//       await page.frameLocator('#sbox-iframe').getByText('Page breakDelete').click();
//       const page1Promise = page.waitForEvent('popup');
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//       const page1 = await page1Promise;
//       await page1.frameLocator('#sbox-iframe').getByRole('button', { name: '' }).click();
//       await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').click();
//       await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').fill('Did you get to this page?');
//       await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
//       await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
//       await expect(page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[3]/div[3]/div[2]/div[3]')).toHaveText('Did you get to this page?');
//     } catch(e) {
//       console.log(e);
//     }
//   });

// test('form - anon - respond to conditional section question',  async({ })=>{
 
//     try {
//       await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
//       await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('Do you want to eat?');
//       await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Answer: OptionalRequiredPreviewOption 1Option 2EditDelete$/ }).getByRole('button', { name: ' Edit' }).click();
//       await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('yes');
//       await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('no');
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Conditional section' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add OR condition' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Do you want to eat?' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'yes' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: '', exact: true }).nth(3).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: '', exact: true }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What do you want to eat?');
//       const page1Promise = page.waitForEvent('popup');
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//       const page1 = await page1Promise;
//       await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'yes' }).locator('span').first().click();
//       //is visible if yes?
//       const element=page1.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[1]/div[2]/div[3]');
//       await expect(element).toBeVisible();
//       await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'no' }).locator('span').first().click();
//       //is still visible if no?
//       await expect(element).toBeVisible(false);
//     } catch(e) {
//       console.log(e);
//     }
//   });

test.afterEach(async ({  }) => {
  await browser.close()
});



