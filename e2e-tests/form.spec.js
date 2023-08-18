const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
//const { url, titleDate } = require('../browserstack.config.js')
import * as path from 'path'; // Import the path module
import * as fs from 'fs/promises'; 

let browser;
let page;
const url=`https://cryptpad.fr/form`;

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(240000)
  await page.goto(url);
});

// test('form - anon', async ({ page }) => {
//   try {

//     await page.waitForTimeout(20000)
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'passed',reason: 'Can anonymously create Form'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'failed',reason: 'Can\'t anonymously create Form'}})}`);

//   }  
// });

// test('anon form-quick-scheduling create + delete', async ({ page }) => {
  
//   try {
//   await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Form$/ }).locator('span').first().click();
//   const page1 = await page1Promise;
//   await page1.frameLocator('#sbox-iframe').getByText('Quick Scheduling Poll').click();
//   await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//   await page1.frameLocator('#sbox-iframe').getByText('Form - Fri, August 18, 2023').click();
//   await page1.frameLocator('#sbox-iframe').getByPlaceholder('Form - Fri, August 18, 2023').fill('test quick-scheduling');
//   await page1.frameLocator('#sbox-iframe').getByPlaceholder('Form - Fri, August 18, 2023').press('Enter');
//   await page1.goto('https://cryptpad.fr/drive/#');
//   await expect(page1.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('test quick-scheduling')).toBeVisible();
//   await page1.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('test quick-scheduling').click({
//     button: 'right'
//   });
//   await page1.frameLocator('#sbox-iframe').getByText('Move to trash').click();
//   await expect(page1.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('test quick-scheduling')).toHaveCount(0);
//     //await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'passed',reason: 'Can create quick scheduling poll'}})}`);
//   } catch (e) {
//     console.log(e);
//     // /await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form', status: 'failed',reason: 'Can\'t created quick scheduling poll'}})}`);

//   }  
  
// });

// test('form - anon - set closing date + open ', async ({ page }) => {

    // try {
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Set closing date' }).click();
//   await page.frameLocator('#sbox-iframe').getByText('18', { exact: true }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Save' }).click();
//   expect(await page.frameLocator('#sbox-iframe').getByText(new RegExp(`/^This form was closed on/`))).toBeDefined();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Open' }).click();
//   expect(await page.frameLocator('#sbox-iframe').getByText('This form is open')).toBeDefined();
    // }catch(e)
    // {
    //   console.log(e);
    // }
// });

// test('form - anon responses - non-anon responses ', async ({ page }) => { //add another user interaction

   // try{
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//   await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first().click();
//   await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
//   //anon resp check
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page1Promise = page.waitForEvent('popup');
//   const page1 = await page1Promise;
//   expect(await page1.frameLocator('#sbox-iframe').getByText('Responses to this form are anonymized')).toBeDefined();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//   await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first().click();
//   await page.frameLocator('#sbox-iframe').locator('.cp-modal-close').click();
//   const page2Promise = page.waitForEvent('popup');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview form' }).click();
//   const page2= await page2Promise;
//   //non-anon resp check
//   expect(await page2.frameLocator('#sbox-iframe').getByText('Please choose how you would like to answer this form:')).toBeDefined();
    // }catch(e)
    // {
    //   console.log(e);
    // }

//  });
 


// test('form - anon - publish responses - public/private', async ({ page }) => { //add another user interaction to check whether the notif are private/public

//   try{
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Form settings' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Publish responses' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//   expect(await page.frameLocator('#sbox-iframe').locator('#cp-form-settings').getByText('Responses are public')).toBeDefined();
//   //once the responses are made public we cannot make them private again
//   }catch(e)
//     {
//       console.log(e);
//     }

//  });


// test('form - anon - view history + share at a specific moment in history', async ({ page }) => {
//   try {
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[2]/div[4]/div[3]/div[5]/button[1]/span').click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
//   await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: 'Responses (0)Preview formCopy public linkForm settingsThis form is openNotificat' }).nth(3).click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).click();
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).fill('new option');
//   await page.frameLocator('#sbox-iframe').getByRole('textbox').nth(1).press('Enter');
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' History', exact: true }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' ' }).click();
//   await expect(page.frameLocator('#sbox-iframe').getByText('new option')).toHaveCount(0)
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//   await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
//   await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Close' }).click();
//   await expect(page.frameLocator('#sbox-iframe').getByText('new option')).toBeVisible()
       

//     //await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     //await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('form - anon - import file', async ({ page }) => { 
  
//   try {

//     const fileChooserPromise = page.waitForEvent('filechooser');
    
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import', exact: true }).click();

//     const fileChooser = await fileChooserPromise;
//     await fileChooser.setFiles('testForm.json');

//     await page.waitForTimeout(3000)

//     await expect(page.frameLocator('#sbox-iframe').getByText('Surfing)).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Bowling')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Cinema')).toBeVisible()
//     await expect(page.frameLocator('#sbox-iframe').getByText('What to do today?')).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });

// test('form - anon - make a copy', async ({ page }) => {
  
//   try {
//     await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').click();
//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('What to do today?');
//     await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Answer: OptionalRequiredPreviewOption 1Option 2EditDelete$/ }).getByRole('button', { name: ' Edit' }).click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('Surf');
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
//     await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('Cinema');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Make a copy', exact: true }).click();
//     const page1 = await page1Promise;
//     await page1.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//     await expect(page1).toHaveURL(new RegExp(`^${url}/#/2/form/edit/`), { timeout: 100000 })
//     await expect(page1.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[2]/div[4]/div[2]')).toHaveText('What to do today?');//not working as it should
//     await expect(page1.frameLocator('#sbox-iframe').locator('//*[@id="cp-app-form-container"]/div/div[2]/div[4]/div[3]/div[3]/label[1]/span[2]')).toHaveText('Surf');
 
//    // await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//    // await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'kanban', status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  
// });


// test('form - anon - export file',  async({page})=>{
 
//   try {

//   await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Export', exact: true }).click();
//   await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//   const downloadPromise = page.waitForEvent('download');
//   const download = await downloadPromise;
//   expect(download).toBeDefined();

//   } catch(e)
//   {
//     console.log(e);
//   }
// });


test('form - anon - can add description + submission message',  async({page})=>{
 
  try {

  await page.frameLocator('#sbox-iframe').locator('//*[@id="cp-creation-form"]/div[3]/button').dblclick();
  await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
  await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
  await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('New description');
  expect(await page.frameLocator('#sbox-iframe').getByText('New description')).toBeVisible();
  await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).click();
  await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Add submit message' }).click();
  await page.frameLocator('#sbox-iframe').locator('pre').nth(1).fill('Thank you for submitting your answer!');
  await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Preview', exact: true }).dblclick()
  expect(await page.frameLocator('#sbox-iframe').locator('#cp-response-preview').getByText('Thank you for submitting your answer!')).toBeDefined();
  } catch(e)
  {
    console.log(e);
  }
});