const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, dateTodayDashFormat, dateTodaySlashFormat, nextMondayDashFormat, nextMondaySlashFormat, minutes, hours, todayStringFormat, nextMondayStringFormat } = require('../browserstack.config.js')
var fs = require('fs');
const d3 = require('d3')


let browser;
let page;
let browserName;
// let pageOne;


test.beforeEach(async ({  }, testInfo) => {
  
  test.setTimeout(2400000);
  browserName = testInfo.project.name
  if (browserName.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
    test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')
  } else if (browserName.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext();
  if (browserName.indexOf('firefox') == -1 ) {
    context.grantPermissions(['clipboard-read', "clipboard-write"]);
  } 
  page = await context.newPage();
  await page.goto(`${url}/form`)
  if (browserName.indexOf('firefox') !== -1 ) {
    await page.waitForTimeout(15000)
  } else {
    await page.waitForTimeout(5000)
  }
});



test('form - close and open', async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.waitForTimeout(1000)

    const visible = await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).isVisible();
    
    if (visible === false) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({force: true});
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

    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form was closed on ${dateTodaySlashFormat}`)).toBeVisible();

    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`)

    await page1.waitForTimeout(5000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('Your question here?')).toBeVisible()
    await expect(page1.frameLocator('#sbox-iframe').getByText(`This form was closed on ${dateTodaySlashFormat}`)).toBeVisible();
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeHidden();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open', exact: true }).click();
    await page.waitForTimeout(1000)
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('This form is open')).toBeVisible();

    await expect(page1.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form was closed on ${dateTodaySlashFormat}`)).toHaveCount(0);
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - open and close', status: 'passed',reason: 'Can close and open Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - open and close', status: 'failed',reason: 'Can\'t close and open Form'}})}`);

    console.log(e);
  }
});

test('form - set future closing date and open //needs user interaction + DATEINJECTION', async ({ }) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`)

    await page1.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
    await page.frameLocator('#sbox-iframe').getByLabel(`${nextMondayStringFormat}`).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(3000)
    
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText(`This form will close on ${nextMondaySlashFormat}`)).toBeVisible();

    await expect(page1.frameLocator('#sbox-iframe').getByText(`This form will close on ${nextMondaySlashFormat}`)).toBeVisible();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Remove closing date', exact: true }).click();
    await page.waitForTimeout(5000)
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('This form is open')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - set closing date and open', status: 'passed',reason: 'Can set closing date for and open Form'}})}`);

  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - set closing date and open', status: 'failed',reason: 'Can\'t set closing date for and open Form'}})}`);
    console.log(e);
  }
});

test('form - anonymize responses', async ({ }) => { 

  try {
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`)

    await page1.waitForTimeout(10000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('Please choose how you would like to answer this form:')).toBeVisible({timeout: 15000});


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
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - anonymize responses', status: 'passed',reason: 'Can anonymize Form responses'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - anonymize responses', status: 'failed',reason: 'Can\'t anonymize Form responses'}})}`);

    console.log(e);
  }

 });
 


test('form - publish responses', async ({ }) => { 

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");

    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`)

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

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - publish responses', status: 'passed',reason: 'Can publish Form responses'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - publish responses', status: 'failed',reason: 'Can\'t publish Form responses'}})}`);

    console.log(e);
  }

 });


test('form - view history and share at a specific moment in history', async ({ }) => {
  
  try {
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('new option');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');

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
        
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - view history and share at a specific moment in history', status: 'passed',reason: 'Can view Form history and share at a specific moment in history'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - view history and share at a specific moment in history', status: 'failed',reason: 'Can\'t view Form history and share at a specific moment in history'}})}`);

  }  
});

test('form - import file', async ({ }) => { 
  
  try {
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    const fileChooserPromise = page.waitForEvent('filechooser');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/testform.json');

    await page.waitForTimeout(3000)

    await expect(page.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('What to do today?')
    await expect(page.frameLocator('#sbox-iframe').getByText('Surf')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible()
    

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - import file', status: 'passed',reason: 'Can import a Form from a .json'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - import file', status: 'failed',reason: 'Can\'t import a Form from a .json'}})}`);

  }  
});

test('form - make a copy', async ({ }) => {
  
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
 
   await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - make a copy', status: 'passed',reason: 'Can create a copy of a Form'}})}`);
  } catch (e) {
    console.log(e);
   await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - make a copy', status: 'failed',reason: 'Can\'t create a copy of a Form'}})}`);

  }  
});


test('form - export file',  async ({ }) => {
 
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
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - export file', status: 'passed',reason: 'Can create and export a Form into a .json'}})}`);


    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - export file', status: 'failed',reason: 'Can\'t create and export a Form into a .json'}})}`);

    }

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - export file', status: 'failed',reason: 'Can\'t create and export a Form into a .json'}})}`);

    console.log(e);
  }
});


test('form - add description',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('New description');
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)

    await page1.waitForTimeout(10000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('New description')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add description', status: 'passed',reason: 'Can create Form with a description'}})}`);
    
  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add description', status: 'failed',reason: 'Can\'t create Form with a description'}})}`);

    console.log(e);
  }
});

test('form - add submission message',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Add submit message' }).click();
    await page.waitForTimeout(1000)
    
    await page.frameLocator('#sbox-iframe').locator('pre').nth(1).fill('Thank you for submitting your answer!');
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click();
    await page.waitForTimeout(1000)
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page.waitForTimeout(1000)
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1000)
    await expect(page1.frameLocator('#sbox-iframe').getByText('Thank you for submitting your answer!')).toBeVisible();
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add submission message', status: 'passed',reason: 'Can create Form with a submission message'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add submission message', status: 'failed',reason: 'Can\'t create Form with a submission message'}})}`);

    console.log(e);
  }
});



test('form - anon (guest) access - allowed',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What to do today?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).nth(1).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('sleep');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('eat');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('heading', { name: 'Total responses: 1' })).toBeVisible()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Show individual answers' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/^Anonymous answer/)).toBeVisible()
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - anon (guest) access - allowed', status: 'passed',reason: 'Can create and answer question with permitted guest access in a Form'}})}`);

  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - anon (guest) access - allowed', status: 'failed',reason: 'Can\'t create and answer question with permitted guest access in a Form'}})}`);

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
    
    if (visible === false) {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click({force: true});
    }
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Blocked' }).locator('span').first().click({timeout: 5000});
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click({force: true});
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await expect(page1.frameLocator('#sbox-iframe').getByText(/^Guest responses are blocked for this form/)).toBeVisible()
    await page.waitForTimeout(1000)
    await page1.frameLocator('#sbox-iframe').getByRole('link', { name: 'log in' }).click();
    await page.waitForTimeout(1000)

    await page.waitForTimeout(3000)

    await page1.getByPlaceholder('Username').fill('test-user');
    await page1.waitForTimeout(10000)
    await page1.getByPlaceholder('Password', {exact: true}).fill('newpassword');
    const login = page1.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    await page1.waitForTimeout(5000)
    if (await login.isVisible()) {
      await login.click()
    }

    await page1.frameLocator('#sbox-iframe').getByText('Option 1').click()

    await page1.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('test-user').click()
    
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click({timeout:60000});
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Show individual answers' }).click();
    await page.waitForTimeout(2000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/^Answer from test-user/)).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - anon (guest) access - blocked', status: 'passed',reason: 'Can create and answer question with blocked guest access in a Form'}})}`);
  
  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - anon (guest) access - blocked', status: 'failed',reason: 'Can\'t create and answer question with blocked guest access in a Form'}})}`);
    console.log(e);
  }
});


test('form - add and respond to text question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Text' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('What is your name?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').click();
    await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').fill('Guest');
    await page1.waitForTimeout(1000)
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.waitForTimeout(3000)
    await page1.close()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('Guest', { exact: true })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to text question', status: 'passed',reason: 'Can create and answer text question in a Form'}})}`);

  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to text question', status: 'failed',reason: 'Can\'t create and answer text question in a Form'}})}`);

    console.log(e);
  }
});


test('form - add and respond to paragraph question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Paragraph' }).click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container textarea').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-form-container textarea').fill('Tell me about yourself');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('textarea').click();
    await page1.frameLocator('#sbox-iframe').locator('textarea').fill('I am a guest');
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-form-container').getByText('I am a guest')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - respond to paragraph question', status: 'passed',reason: 'Can create and answer paragraph question in a Form'}})}`);

  } catch(e) {

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - respond to paragraph question', status: 'failed',reason: 'Can\'t create and answer paragraph question in a Form'}})}`);

    console.log(e);
  }
});

test('form - add and respond to choice question (optional)',  async ({ }) => {
 
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
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/test option one1/)).toBeVisible()
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to choice question (optional)', status: 'passed',reason: 'Can create and answer choice question (optional) in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to choice question (optional)', status: 'failed',reason: 'Can\'t create and answer choice question (optional) in a Form'}})}`);

    console.log(e);
  }

});


test('form - add and respond to choice question (required)',  async ({ }) => {

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
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    await page.waitForTimeout(3000)

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await expect(page1.frameLocator('#sbox-iframe').getByText('The following questions require an answer:Question 1.')).toBeVisible();
    await expect(page1.frameLocator('#sbox-iframe').getByRole('button', {name: 'Submit'})).toBeDisabled();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await page.waitForTimeout(3000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/test option one1/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to choice question (required)', status: 'passed',reason: 'Can create and answer choice question (required) in a Form'}})}`);
  
  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to choice question (required)', status: 'failed',reason: 'Can\'t create and answer choice question (required) in a Form'}})}`);

    console.log(e);
  }
});

test('form - add and respond to choice grid question',  async ({ }) => {
 
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
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^GeneralGeneral$/ }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^ParticularParticular$/ }).locator('span').nth(2).click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (0)' }).click();
    await page.waitForTimeout(3000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/Choice10 Choice21/)).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText(/Choice11 Choice20/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add and respond to choice grid question', status: 'passed',reason: 'Can create and answer choice grid question in a Form'}})}`);
  
  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'add and respond to choice grid question', status: 'failed',reason: 'Can\'t create and answer choice grid question in a Form'}})}`);

    console.log(e);
  }
});
  
test('form - add and respond to date question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Date' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').first().fill('What is today\'s date?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('input[type="text"]').click();
    await page1.frameLocator('#sbox-iframe').getByLabel(`${todayStringFormat}`).click()
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await page.waitForTimeout(50000)
    await expect(page.frameLocator('#sbox-iframe').getByText(`${dateTodayDashFormat}`)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to date question', status: 'passed',reason: 'Can create and answer choice grid question in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to date question', status: 'failed',reason: 'Can\'t create and answer choice grid question in a Form'}})}`);

    console.log(e);
  }
});

test('form - add and respond to checkbox question',  async ({ }) => {
 
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
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'box2' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/box10 box21 box30/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to checkbox question', status: 'passed',reason: 'Can create and answer checkbox question in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to checkbox question', status: 'failed',reason: 'Can\'t create and answer checkbox question in a Form'}})}`);

    console.log(e);
  }
});

test('form - add and respond to checkbox grid question',  async ({ }) => {
 
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
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label:nth-child(5) > .cp-checkmark-mark').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label:nth-child(4) > .cp-checkmark-mark').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label:nth-child(4) > .cp-checkmark-mark').nth(1).click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();

    await expect(page.frameLocator('#sbox-iframe').getByText(/GeneralBox10 Box21 Box31/)).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText(/ParticularBox10 Box21 Box30/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to checkbox grid question', status: 'passed',reason: 'Can create and answer checkbox grid question in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to checkbox grid question', status: 'failed',reason: 'Can\'t create and answer checkbox grid question in a Form'}})}`);

    console.log(e);
  }
});

test('form - add and respond to ordered list question',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Ordered list' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What is your preference?');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('test option 1');
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(2).fill('test option 2');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option 3');

    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    const firstOption = await page1.frameLocator('#sbox-iframe').getByText(/^\?test option/).first().textContent();
    const secondOption = await page1.frameLocator('#sbox-iframe').getByText(/^\?test option/).nth(1).textContent();
    const thirdOption = await page1.frameLocator('#sbox-iframe').getByText(/^\?test option/).nth(2).textContent();

    await page1.frameLocator('#sbox-iframe').getByText(`${thirdOption}`).hover();
    await page1.mouse.down();
    await page1.mouse.move(0, 100);
    await page1.frameLocator('#sbox-iframe').getByText(`${firstOption}`).hover();
    await page1.mouse.up();    

    const firstOption2 = await page1.frameLocator('#sbox-iframe').getByText(/^test option/).first().textContent();
    const secondOption2 = await page1.frameLocator('#sbox-iframe').getByText(/^test option/).nth(1).textContent();
    const thirdOption2 = await page1.frameLocator('#sbox-iframe').getByText(/^test option/).nth(2).textContent();

    const answerOrder = {}
    answerOrder[firstOption2] = 3
    answerOrder[secondOption2] = 2
    answerOrder[thirdOption2] = 1

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();

    const expectedAnswer = `test option 1${answerOrder['test option 1']} test option 2${answerOrder['test option 2']} test option 3${answerOrder['test option 3']}`
    const expectedAnswerRegex = new RegExp(expectedAnswer)
    const results = await page.frameLocator('#sbox-iframe').locator('.cp-form-creator-results-content').textContent()

    if (expectedAnswerRegex.test(results)) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to ordered list question', status: 'passed',reason: 'Can create and answer ordered list question in a Form'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to ordered list question', status: 'failed',reason: 'Can\'t create and answer ordered list question in a Form'}})}`);

    }

  } catch(e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to ordered list question', status: 'failed',reason: 'Can\'t create and answer ordered list question in a Form'}})}`);

  }
});

test('form - add and respond to poll question',  async ({ }) => {
 
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
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await expect(page.frameLocator('#sbox-iframe').getByText(/Total1\(0\)0\(0\)/)).toBeVisible()
    await page.waitForTimeout(10000)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to poll question', status: 'passed',reason: 'Can create and answer poll question in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to poll question', status: 'failed',reason: 'Can\'t create and answer poll question in a Form'}})}`);

    console.log(e);
  }
});

test('form - add and respond to form with page break',  async({ }) => {
 
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
    await page.waitForTimeout(3000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(10000)

    await expect(page1.frameLocator('#sbox-iframe').getByText('Question one')).toBeVisible();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Question two')).toBeHidden();
    await page1.frameLocator('#sbox-iframe').locator('.btn.btn-secondary.cp-next').click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Question one')).toBeHidden();
    await expect(page1.frameLocator('#sbox-iframe').getByText('Question two')).toBeVisible();
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to page break', status: 'passed',reason: 'Can create and answer Form with a page break'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to page break', status: 'failed',reason: 'Can\'t create and answer Form with a page break'}})}`);

    console.log(e);
  }
  });

test('form - add and respond to conditional section question (OR)',  async ({ }) => {
 
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
    await page.waitForTimeout(1000)

    await page.frameLocator('#sbox-iframe').locator('.btn.cp-form-creator-inline-add').nth(2).click()
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').locator('.cptools.cptools-form-text').nth(2).click()
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('example question two?');
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option one' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible()

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option two' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeHidden()

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'test option three' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible() 

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to conditional question (or)', status: 'passed',reason: 'Can create and respond to conditional section question (OR) in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to conditional question (or)', status: 'failed',reason: 'Can\'t create and respond to conditional section question (OR) in a Form'}})}`);

    console.log(e);
  }
  });

test('form - add and respond to respond to conditional section question (AND)',  async ({ }) => { 
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();


    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Conditional section' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add OR condition' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Option 1' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add AND condition' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a question' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'example question?' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Choose a value' }).click();
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Option 3' }).click();
    await page.waitForTimeout(1000)

    await page.frameLocator('#sbox-iframe').locator('.btn.cp-form-creator-inline-add').nth(2).click()
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').locator('.cptools.cptools-form-text').nth(2).click()
    await page.waitForTimeout(1000)
    await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('example question two?');

    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeHidden()
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 3' }).locator('span').first().click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('example question two?')).toBeVisible()
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to conditional question (and)', status: 'passed',reason: 'Can create and respond to conditional section question (AND) in a Form'}})}`);

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - add and respond to conditional question (and)', status: 'failed',reason: 'Can\'t create and respond to conditional section question (AND) in a Form'}})}`);

    console.log(e);
  }
});

test('form - export responses as .csv',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    const UTChours = new Date().getUTCHours()
    const UTCminutes = new Date().getUTCMinutes()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export' }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: 'Export to CSV' }).click();
    const download = await downloadPromise;
    await download.saveAs('/tmp/form responses');

    const csv = fs.readFileSync("/tmp/form responses", "utf8");
    const data = d3.csvParse(csv);
    const responseJSON = JSON.stringify(data)
    const regexString = new RegExp(`\\[{"Time":"${dateTodayDashFormat}T${UTChours}:${UTCminutes}:[0-9]{2}.[0-9]{3}Z","Participant":"Guest","Your question here\\?":"Option 1"}]`)

    if (regexString.test(responseJSON)) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form  - export responses as .csv', status: 'passed',reason: 'Can export Form reponses as .csv'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form  - export responses as .csv', status: 'failed',reason: 'Can\'texport Form reponses as .csv'}})}`);

    }

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - export responses as .csv', status: 'failed',reason: 'Can\'t export Form reponses as .csv'}})}`);

    console.log(e);
  }
});

test('form - export responses as .json',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    const UTChours = new Date().getUTCHours()
    const UTCminutes = new Date().getUTCMinutes()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export' }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: 'Export to JSON' }).click();
    const download = await downloadPromise;
    await download.saveAs('/tmp/form responses');

    const responseJSONObject = JSON.parse(fs.readFileSync('/tmp/form responses'))
    const responseJSONString = JSON.stringify(responseJSONObject)
    const regexString = new RegExp(`{"questions":{"q1":"Your question here\\?"},"responses":\\[{"_time":"${dateTodayDashFormat}T${UTChours}:${UTCminutes}:[0-9]{2}.[0-9]{3}Z","_name":"Guest","q1":\\["Option 1"]}]}`)
    
    if (regexString.test(responseJSONString)) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form  - export responses as .json', status: 'passed',reason: 'Can export Form responses as .json'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form  - export responses as .json', status: 'failed',reason: 'Can\'t export Form responses as .json'}})}`);

    }

  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - export responses as .json', status: 'failed',reason: 'Can\'t export Form responses as .json'}})}`);

    console.log(e);
  }
});

test('form - export responses (to sheet document)',  async ({ }) => {
 
  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Checkbox' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();

    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await browser.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)

    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Option 1' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
    await page1.close()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
    const page2Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export to Sheet' }).click({timeout: 3000});
    const page2 = await page2Promise;

    await expect(page2).toHaveURL(new RegExp(`^${url}/sheet`), { timeout: 100000 })

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form  - export responses (to sheet document)', status: 'passed',reason: 'Can export Form responses to Sheet document'}})}`);
  } catch(e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - export responses (to sheet document)', status: 'failed',reason: 'Can\'t export Form reponses to Sheet document'}})}`);

    console.log(e);
  }
});

test.afterEach(async ({  }) => {
  if (browser) {
    await browser.close()
  }
  
});



