const { test, url, titleDate } = require('../fixture.js');
const { expect } = require('@playwright/test');

var fs = require('fs');
const d3 = require('d3')

let page;
let isMobile;
let browserName;

test.beforeEach(async ({ page, context }, testInfo) => {

  test.setTimeout(210000)
  isMobile = testInfo.project.use['isMobile']  
  browserName = testInfo.project.name.split(/@/)[0]
  await page.goto(`${url}/drive`)
  // await page.waitForTimeout(1000)

});

const userMenuItems = ['settings', 'documentation', 'about', 'home page', 'pricing', 'donate', 'log in', 'sign up'] 


userMenuItems.forEach(function(item) {

  test(`drive - anon - user menu - ${item}`, async ({ page, context }) => {   
  
    try {


      const menu = page.frameLocator('#sbox-iframe').locator('.cp-toolbar-user-dropdown.cp-dropdown-container')
      await menu.waitFor()
      await menu.click()
      if (item === 'about') {
        await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: `${item}` }).first().click()
        if (url == 'https://cryptpad.fr') {
          await expect(page.frameLocator('#sbox-iframe').getByText('CryptPad.fr is the official instance of the open-source CryptPad project. It is ')).toBeVisible()

        } else {
          await expect(page.frameLocator('#sbox-iframe').getByText('This is an independent community instance of CryptPad')).toBeVisible()

        }
      } else if (item === 'log in') {
        await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: `${item}` }).first().click()
        await expect(page).toHaveURL(new RegExp(`^${url}/login/`), { timeout: 100000 })
      } else if (item === 'sign up') {
        await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: `${item}` }).first().click()
        await expect(page).toHaveURL(new RegExp(`^${url}/register/`), { timeout: 100000 })
      } else {
        const pagePromise = page.waitForEvent('popup')
        if (item === 'documentation' ) {
          await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: `${item}` }).first().click()
        } else {
          await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: `${item}` }).click()
        }
        const page1 = await pagePromise
        if (item === 'home page') {
          await expect(page1).toHaveURL(`${url}/index.html`, { timeout: 100000 })
        } else if (item === 'pricing') {
          await expect(page1).toHaveURL(`${url}/features.html`, { timeout: 100000 })
        } else if (item === 'donate') {
          page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.accept().catch(() => {});
          });
          await expect(page1).toHaveURL(/#https%3A%2F%2Fopencollective.com%2Fcryptpad%2F$/, { timeout: 100000 })
        } 
        else if (item === 'documentation') {
            await expect(page1).toHaveURL("https://docs.cryptpad.org/en/", { timeout: 100000 })
        } else if (item === 'settings') {
            await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
        } else {
            await expect(page1).toHaveURL(`${url}/${item}/`, { timeout: 100000 })
        }
      }
        
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon drive > ${item}`, status: 'passed',reason: `Can anonymously navigate to Drive and access ${item}`}})}`);
    } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon drive > ${item}`, status: 'failed',reason: `Can\'t anonymously navigate to Drive and access ${item}`}})}`);
    }    
  });

})

// test('drive - anon - erase all', async ({ page, context }) => {   
    
//   try {

//     //create file
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Rich text' }).click();
//     const page1 = await page1Promise;

//     //check that file is visible in drive

//     var title = `Rich text - ${titleDate}`;
//     await page1.waitForTimeout(10000)
//     await page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`).waitFor()
//     await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible()
//     await page1.close()
//     await page.reload()
//     await page.waitForTimeout(10000)
//     await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').locator('.cp-toolbar-title').getByText(`${title}`).click({timeout: 2000})

//     //erase
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-bottom-right').getByRole('button').nth(1).click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await page.waitForTimeout(20000)

//     //check file is erased
//     await expect(page.frameLocator('#sbox-iframe').getByText(title)).toHaveCount(0)

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - erase', status: 'passed',reason: 'Can navigate to Drive and erase all'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - erase', status: 'failed',reason: 'Can\'t navigate to Drive and erase all'}})}`);
//   }    

// });

test('drive - anon - list/grid view', async ({ page, context }) => {   
    
  try {

    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click();
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Rich text' }).click();
    const page1 = await page1Promise;

    var title = `Rich text - ${titleDate}`;
    await page.waitForTimeout(10000)
    if (!isMobile) {
      await expect(page.frameLocator('#sbox-iframe').getByText(title)).toBeVisible()
    }
    
    await page.bringToFront()
    await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-viewmode-button').click();

    if (isMobile) {
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-content-list')).toBeVisible()
    } else {
      await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: /^Type$/ })).toBeVisible()
      await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: /^Last access$/ })).toBeVisible()
      await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: /^Creation$/ })).toBeVisible()
    }  

    await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-viewmode-button').click();


    if (isMobile) {
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-content-grid')).toBeVisible()

    } else {
      await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: /^Type$/ })).toBeHidden()
      await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: /^Last access$/ })).toBeHidden()
      await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: /^Creation$/ })).toBeHidden()

    }
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive > list/grid view', status: 'passed',reason: 'Can anonymously navigate to Drive and change the view to list/grid'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive > list/grid view', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and change the view to list/grid'}})}`);
  }  

});

test('drive - anon - history', async ({ page, context }) => {   
    
  try {

    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click();
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Rich text' }).click();
    const page1 = await page1Promise;

    var title = `Rich text - ${titleDate}`;
    await page.waitForTimeout(15000)
    await page.bringToFront()
    await page.frameLocator('#sbox-iframe').getByText(title).waitFor()
    await expect(page.frameLocator('#sbox-iframe').getByText(title)).toBeVisible()
    
    await page.frameLocator('#sbox-iframe').locator("[data-original-title=\"Display the document history\"]") .click();

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last().click({
      clickCount: 3
    })

    await expect(page.frameLocator('#sbox-iframe').getByText(title)).toHaveCount(0)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive > history', status: 'passed',reason: 'Can anonymously navigate to Drive and view history'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive > history', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and view history'}})}`);
  }    

});

test('drive - anon - notifications', async ({ page, context }) => {
   
  try {

    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').waitFor()
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()

    await expect(page.frameLocator('#sbox-iframe').getByText('No notifications')).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive - notifications', status: 'passed',reason: 'Can check notifications'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon drive - notifications', status: 'failed',reason: 'Can\'t check notifications'}})}`);
  }  

});


test('drive - anon - sign up from drive page', async ({ page, context }) => {

  try {

    await page.waitForTimeout(5000)

    await page.frameLocator('#sbox-iframe').locator('body').filter({hasText: "You are not logged in"}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Sign up'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Sign up'}).click()
    await page.waitForTimeout(5000)
    await expect(page).toHaveURL(`${url}/register/`, { timeout: 100000 })
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > sign up', status: 'passed',reason: 'Can anonymously navigate to Drive and find link to sign up'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > sign up', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and find link to sign up'}})}`);

  }  
});

test('drive - anon - log in from drive page', async ({ page, context }) => {

  try {

    await page.waitForTimeout(5000)


    await page.frameLocator('#sbox-iframe').locator('body').filter({hasText: "You are not logged in"}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Log in'}).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('link', {name: 'Log in'}).click()
    await page.waitForTimeout(10000)
    await expect(page).toHaveURL(`${url}/login/`, { timeout: 100000 })
   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > log in', status: 'passed',reason: 'Can anonymously navigate to Drive and find link to log in'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > log in', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and find link to log in'}})}`);
  }  

});

