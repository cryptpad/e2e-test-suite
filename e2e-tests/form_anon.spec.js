const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
var fs = require('fs');


let browser;
let page;
let pageOne;
const url=`https://cryptpad.fr`;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const now = new Date();

const month = now.getMonth() + 1
const monthFormatted = month.toString().length > 1 ? month : '0' + month;

const today = now.getDate();
const todayFormatted = today.toString().length > 1 ? today : '0' + today;

const dateTodayDashFormat = now.getFullYear() + '-' + monthFormatted + '-' + todayFormatted
const dateTodaySlashFormat = todayFormatted + '/' + monthFormatted + '/' + now.getFullYear()

///

const nextMonday = new Date()
nextMonday.setDate(nextMonday.getDate() + (((1 + 7 - nextMonday.getDay()) % 7) || 7));
const nextMondayFormatted = nextMonday.getDate().toString().length > 1 ? nextMonday.getDate() : '0' + nextMonday.getDate();
const nextMondayMonth = nextMonday.getMonth() + 1

const nextMondayMonthFormatted = nextMondayMonth.toString().length > 1 ? nextMondayMonth : '0' + nextMondayMonth;
const nextMondayDashFormat = nextMonday.getFullYear() + '-' + nextMondayMonthFormatted + '-' + nextMondayFormatted
const nextMondaySlashFormat =  nextMondayFormatted + '/' + nextMondayMonthFormatted + '/' +  nextMonday.getFullYear()

const nextMondayMonthString = months[nextMonday.getMonth()]
const nextMondayStringFormat = `${nextMondayMonthString} ${nextMonday.getDate()}, ${nextMonday.getFullYear()}`

///

const minutes = now.getMinutes().toString().length > 1 ? now.getMinutes() : '0' + now.getMinutes()
const hours = now.getHours()
const monthString = months[now.getMonth()]
const todayStringFormat = `${monthString} ${now.getDate()}, ${now.getFullYear()}`




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



test('form - anon - close + open', async ({ }) => {

  try {


    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.waitForTimeout(1000)

    const visible = await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).isVisible();
    console.log(visible)
    
    if (visible === false) {
      console.log('not visible')
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({force: true});
      console.log('2nd click')
    }

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByLabel(`${todayStringFormat}`).click()
    await page.waitForTimeout(1000)

    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill(`${hours}`);
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill(`${minutes}`);
    await page.waitForTimeout(1000)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();

    
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    await page1.waitForTimeout(5000)

    await expect(page1.frameLocator('#sbox-iframe').getByText('Your question here?')).toBeVisible()
    await page.waitForTimeout(1000)
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form was closed on ${dateTodaySlashFormat}`)).toBeVisible();

    await expect(page1.frameLocator('#sbox-iframe').getByText(`This form was closed on ${dateTodaySlashFormat}`)).toBeVisible();
    await page.waitForTimeout(1000)
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeHidden();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open', exact: true }).click();
    await page.waitForTimeout(1000)
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('This form is open')).toBeVisible();

    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form was closed on ${dateTodaySlashFormat}`)).toHaveCount(0);
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can close and open Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t close and open Form'}})}`);

    console.log(e);
  }
});

test('form - anon - set future closing date and open //needs user interaction + DATEINJECTION', async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
    await page.frameLocator('#sbox-iframe').getByLabel(`${nextMondayStringFormat}`).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(3000)
    
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form will close on ${nextMondaySlashFormat}`)).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Remove closing date', exact: true }).click();
    await page.waitForTimeout(5000)
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('This form is open')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can set closing date and open Form'}})}`);

  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t set closing date and open Form'}})}`);
    console.log(e);
  }
});

test('form - anonymized responses', async ({ }) => { 

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    await page1.waitForTimeout(5000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('Please choose how you would like to answer this form:')).toBeVisible();


    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first().click();
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
    await page.waitForTimeout(5000)

    await expect(page1.frameLocator('#sbox-iframe').getByText('Responses to this form are anonymized').first()).toBeVisible();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Answer as')).toBeHidden();

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Show individual answers' }).click();
    await page.frameLocator('#sbox-iframe').getByText(/^Anonymous answer/).click();
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can anonymize Form responses'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymize Form responses'}})}`);

    console.log(e);
  }

 });
 


test('form - anon - publish responses', async ({ }) => { 

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    await page1.waitForTimeout(5000)

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' View all responses (1)' })).toBeHidden();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Publish responses' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();

    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' View all responses (1)' }).click();
    await page1.frameLocator('#sbox-iframe').getByText(/Your question here\?Option 11 Option 20/).click();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can publish Form responses'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t publish Form responses'}})}`);

    console.log(e);
  }

 });


test('form - anon - view history and share at a specific moment in history', async ({ }) => {
  
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
        

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can view Form history and share at a specific moment in history'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t view Form history and share at a specific moment in history'}})}`);

  }  
});

test('form - anon - import file', async ({ }) => { 
  
  try {
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    const fileChooserPromise = page.waitForEvent('filechooser');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testForm.json');

    await page.waitForTimeout(3000)

    await expect(page.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('What to do today?')
    await expect(page.frameLocator('#sbox-iframe').getByText('Surf')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible()
    

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can import a Form from a .json'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t import a Form from a .json'}})}`);

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
 
   await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can create a copy of a Form'}})}`);
  } catch (e) {
    console.log(e);
   await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create a copy of a Form'}})}`);

  }  
});


test('form - anon - export file',  async ({ }) => {
 
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
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create and export a Form into a .json'}})}`);


    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create and export a Form into a .json'}})}`);


    }


  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create and export a Form into a .json'}})}`);

    console.log(e);
  }
});


test('form - anon - can add description',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('New description');
    await page.waitForTimeout(1000)
    
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;

    await page1.waitForTimeout(10000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('New description')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create Form with a description'}})}`);
    
  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create Form with a description'}})}`);

    console.log(e);
  }
});

test('form - anon - can add submission message',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Add submit message' }).click();
    await page.waitForTimeout(1000)
    
    await page.frameLocator('#sbox-iframe').locator('pre').nth(1).fill('Thank you for submitting your answer!');
    await page.waitForTimeout(1000)
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page.waitForTimeout(1000)
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page.waitForTimeout(1000)
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('Thank you for submitting your answer!')).toBeVisible();
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create Form with a submission message'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create Form with a submission message'}})}`);

    console.log(e);
  }
});



test('form - anon (guest) access - allowed',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What to do today?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('sleep');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('eat');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('heading', { name: 'Total responses: 1' })).toBeVisible()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Show individual answers' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/^Anonymous answer/)).toBeVisible()
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create and answer question with permitted guest access in a Form'}})}`);

  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create and answer question with permitted guest access in a Form'}})}`);

    console.log(e);
  }
});

test('form - anon (guest) access - blocked',  async ({ }) => {
 
  try {

    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({force: true});
    await page.waitForTimeout(5000)
    const visible = await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Blocked' }).locator('span').first().isVisible();
    console.log(visible)
    
    if (visible === false) {
      console.log('not visible')
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({force: true});
      console.log('2nd click')
    }
    await page.waitForTimeout(10000)
    // console.log('here1')
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Blocked' }).locator('span').first().click({timeout: 5000});
    // console.log('here2')
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click({force: true});
    await page.waitForTimeout(1000)
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.waitForTimeout(3000)
    await expect(page1.frameLocator('#sbox-iframe').getByText(/^Guest responses are blocked for this form/)).toBeVisible()
    await page.waitForTimeout(1000)
    await page1.frameLocator('#sbox-iframe').getByRole('link', { name: 'log in' }).click();
    await page.waitForTimeout(1000)

    // await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Copy public link' }).click();
    await page.waitForTimeout(3000)
    if (await page.frameLocator('#sbox-iframe').getByText('Document destroyed').count() === 1) {
      console.log('destroyed')
    }

    // const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    // await page1.goto(`${url}/login/`)
    await page1.getByPlaceholder('Username').fill('test-user');
    await page1.waitForTimeout(10000)
    await page1.getByPlaceholder('Password', {exact: true}).fill('newpassword');
    const login = page1.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    // await expect(page1).toHaveURL(`${url}/drive/#`, { timeout: 100000 })

    // await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(10000)
    // if (await page1.frameLocator('#sbox-iframe').getByText('Option 1').count() === 0) {
    //   await page1.goto(`${clipboardText}`)
    // }
    if (await page.frameLocator('#sbox-iframe').getByText('Document destroyed').count() === 1) {
      console.log('destroyed1')
      // await page.reload()
    }
    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click()
    if (await page.frameLocator('#sbox-iframe').getByText('Document destroyed').count() === 1) {
      console.log('destroyed2')
      // await page.reload()
    }
    await page1.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('test-user').click()
    if (await page.frameLocator('#sbox-iframe').getByText('Document destroyed').count() === 1) {
      console.log('destroyed3')
      // await page.reload()
    }
    
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.close()

    if (await page.frameLocator('#sbox-iframe').getByText('Document destroyed').count() === 1) {
      console.log('destroyed4')
      // await page.reload()
    }
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click({timeout:60000});
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Show individual answers' }).click();
    await page.waitForTimeout(200000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/^Answer from test-user/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create and answer question with blocked guest access in a Form'}})}`);
  
  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create and answer question with blocked guest access in a Form'}})}`);
    console.log(e);
  }
});


test('form - anon - respond to text question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What is your name?');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: 'Preview form' }).nth(2).click();
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').click();
    await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').fill('Guest');
    await page1.waitForTimeout(1000)
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('Guest')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create and answer text question in a Form'}})}`);

  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create and answer text question in a Form'}})}`);

    console.log(e);
  }
});


test('form - anon - respond to paragraph question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Paragraph' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container textarea').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container textarea').fill('Tell me about yourself');
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('textarea').click();
    await page1.frameLocator('#sbox-iframe').locator('textarea').fill('I am a guest');
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('I am a guest')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create and answer paragraph question in a Form'}})}`);

  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create and answer paragraph question in a Form'}})}`);

    console.log(e);
  }
});

test('form - anon - add and respond to choice question (optional)',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choice' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your choice?');
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').first().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').first().fill('test option one');
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(1).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(1).fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(2).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(2).fill('test option three');

    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/test option one1/)).toBeVisible()
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create and answer choice question (optional) in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create and answer choice question (optional) in a Form'}})}`);

    console.log(e);
  }
  });

test('form - anon - add and respond to choice question (required)',  async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choice' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your choice?');
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();


    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').first().click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').first().fill('test option one');
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(1).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(1).fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(2).click();
    await page.frameLocator('#sbox-iframe').locator('.cp-form-edit-block-input > input').nth(2).fill('test option three');
    await page.waitForTimeout(2000)
    await page.frameLocator('#sbox-iframe').locator('.cp-checkmark-label').getByText('Required').nth(0).click();
    await page.waitForTimeout(2000)

    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    // await page1.waitForTimeout(100000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('The following questions require an answer:Question 1.')).toBeVisible();
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', {name: 'Submit'})).toBeDisabled();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await page.waitForTimeout(3000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/test option one1/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad > comment', status: 'passed',reason: 'Can create and answer choice question (required) in a Form'}})}`);
  
  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t create and answer choice question (required) in a Form'}})}`);

    console.log(e);
  }
});

test('form - anon - respond to choice grid question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choice Grid' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your choice grid?');
    await page.keyboard.press('Enter')

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').first().fill('General');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').first().fill('Choice1');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').nth(1).fill('Particular');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(1).fill('Choice2');
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^GeneralGeneral$/ }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^ParticularParticular$/ }).locator('span').nth(2).click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    await page.waitForTimeout(3000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/Choice10 Choice21/)).toBeVisible({timeout: 3000})
    await expect(page.frameLocator('#sbox-iframe').getByText(/Choice11 Choice20/)).toBeVisible({timeout: 3000})

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - choice grid question', status: 'passed',reason: 'Can create and answer choice grid question in a Form'}})}`);
  
  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - choice grid question', status: 'failed',reason: 'Can\'t create and answer choice grid question in a Form'}})}`);

    console.log(e);
  }
});
  
test('form - anon - respond to date question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Date' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().fill('What is today\'s date?');
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').click();
    await page1.frameLocator('#sbox-iframe').getByLabel(`${todayStringFormat}`).click({timeout: 3000})
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await page.waitForTimeout(50000)
    await expect(page.frameLocator('#sbox-iframe').getByText(`${dateTodayDashFormat}`)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - date question', status: 'passed',reason: 'Can create and answer choice grid question in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - date question', status: 'failed',reason: 'Can\'t create and answer choice grid question in a Form'}})}`);

    console.log(e);
  }
});

test('form - anon - respond to checkbox question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What box do you choose?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('box1');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('box2');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(3).fill('box3');
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'box2' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/box10 box21 box30/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - checkbox question', status: 'passed',reason: 'Can create and answer checkbox question in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - checkbox question', status: 'failed',reason: 'Can\'t create and answer checkbox question in a Form'}})}`);

    console.log(e);
  }
});

test('form - anon - respond to checkbox grid question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox Grid' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('Which checkbox grid do you choose?');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').press('Enter');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').first().fill('General');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox').nth(1).fill('Particular');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').first().fill('Box1');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(1).fill('Box2');
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox').nth(2).fill('Box3');
    await page.waitForTimeout(20000)

    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;


    await page1.frameLocator('#sbox-iframe').locator('label:nth-child(5) > .cp-checkmark-mark').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label:nth-child(4) > .cp-checkmark-mark').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label:nth-child(4) > .cp-checkmark-mark').nth(1).click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();

    await expect(page.frameLocator('#sbox-iframe').getByText(/GeneralBox10 Box21 Box31/)).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText(/ParticularBox10 Box21 Box30/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - checkbox grid question', status: 'passed',reason: 'Can create and answer checkbox grid question in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - checkbox grid question', status: 'failed',reason: 'Can\'t create and answer checkbox grid question in a Form'}})}`);

    console.log(e);
  }
});

// test('form - anon - respond to ordered list question ',  async ({ }) => {
 
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

test('form - anon - respond to poll question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Poll' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What do you want to do?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().fill('Hiking');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('Yoga');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('Campfire');
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;

    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/Total1\(0\)0\(0\)/)).toBeVisible()
    await page.waitForTimeout(10000)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - poll question', status: 'passed',reason: 'Can create and answer poll question in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - poll question', status: 'failed',reason: 'Can\'t create and answer poll question in a Form'}})}`);

    console.log(e);
  }
});

test('form - anon - create and respond to form with page break',  async({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().fill('Question one');
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Page break' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('Question two');
    await page.waitForTimeout(1000)
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await expect(page1.frameLocator('#sbox-iframe').getByText('Question one')).toBeVisible();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Question two')).toBeHidden();
    await page1.frameLocator('#sbox-iframe').locator('.btn.btn-secondary.cp-next').click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Question one')).toBeHidden();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Question two')).toBeVisible();
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - page break', status: 'passed',reason: 'Can create and answer Form with a page break'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - page break', status: 'failed',reason: 'Can\'t create and answer Form with a page break'}})}`);

    console.log(e);
  }
  });

test('form - anon - respond to conditional section question (OR)',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Conditional section' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add OR condition' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'test option one' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add OR condition' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'test option three' }).click();

    await page.frameLocator('#sbox-iframe').locator('.btn.cp-form-creator-inline-add').nth(2).click()
    await page.frameLocator('#sbox-iframe').locator('.cptools.cptools-form-text').nth(2).click()
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('example question two?');

    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible()

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option two' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeHidden()

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option three' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible() 

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - conditional question (or)', status: 'passed',reason: 'Can create and respond to conditional section question (OR) in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - conditional question (or)', status: 'failed',reason: 'Can\'t create and respond to conditional section question (OR) in a Form'}})}`);

    console.log(e);
  }
  });

test('form - anon - respond to conditional section question (AND)',  async ({ }) => { 
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();


    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Conditional section' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add OR condition' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Option 1' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add AND condition' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Option 3' }).click();

    await page.frameLocator('#sbox-iframe').locator('.btn.cp-form-creator-inline-add').nth(2).click()
    await page.frameLocator('#sbox-iframe').locator('.cptools.cptools-form-text').nth(2).click()
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('example question two?');

    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeHidden()
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 3' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible()
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - conditional question (and)', status: 'passed',reason: 'Can create and respond to conditional section question (AND) in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - conditional question (and)', status: 'failed',reason: 'Can\'t create and respond to conditional section question (AND) in a Form'}})}`);

    console.log(e);
  }
});


test.afterEach(async ({  }) => {
  await browser.close()
});



