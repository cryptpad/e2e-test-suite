const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate, testUser2Password, testUser3Password } = require('../browserstack.config.js')

let page;
let pageOne;
let browser;
let browserName;

test.beforeEach(async ({  }, testInfo) => {
  
  test.setTimeout(2400000);
  browserName = testInfo.project.name
  if (browserName.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (browserName.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext({ storageState: 'auth/mainuser.json' });
  if (browserName.indexOf('firefox') == -1 ) {
    context.grantPermissions(['clipboard-read', "clipboard-write"]);
  } 
  page = await context.newPage();
  if (browserName.indexOf('firefox') !== -1 ) {
    await page.waitForTimeout(15000)
  } else {
    await page.waitForTimeout(5000)
  }
});

const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'] 
// const docNames = ['code'] 


docNames.forEach(function(name) {

  var title;
  if (name === 'pad') {
      title = `Rich text - ${titleDate}`;
  } else if (name === 'slide') {
      title = `Markdown slides - ${titleDate}`
  } else {
      const titleName = name.charAt(0).toUpperCase() + name.slice(1)
      title = `${titleName} - ${titleDate}`;
  }

  test(` ${name} - create without owner` , async ({ }) => {

    try {

      await page.goto(`${url}/${name}`);

      await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Owned document' }).locator('span').first().click();
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      await expect(page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user.cp-share-column.cp-access').getByLabel('Owners')).toBeHidden()

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive - ${name} - create without owner`, status: 'passed',reason: `Can create ${name} without owner`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive - ${name} - create without owner`, status: 'failed',reason: `Can\'t create ${name} without owner`}})}`);
      
    }  
  });


  test(`${name} - tag`, async ({ }) => {

    try {

      await page.goto(`${url}/${name}`);

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tags', exact: true }).click();
      await page.frameLocator('#sbox-iframe').locator('.token-input.ui-autocomplete-input').click()
      await page.frameLocator('#sbox-iframe').locator('.token-input.ui-autocomplete-input').fill('testtag');
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.waitForTimeout(3000)
      
      await page.goto(`${url}/drive/#`);
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree').getByText('Tags').click();
      await page.frameLocator('#sbox-iframe').getByRole('link', { name: '#testtag' }).click();

      await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`)).toBeVisible();

      await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).click({ button: 'right' })
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Destroy' }).click()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
      await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`)).toHaveCount(0)

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - tag`, status: 'passed',reason: `Can tag ${name} document`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - tag`, status: 'failed',reason: `Can\'t tag ${name} document`}})}`);

    }  
  });


  test(`${name} - edit document owners`, async ({ }) => {

    try {
    
      await page.goto(`${url}/${name}/`);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

      //add test-user3 as owner
      await page.waitForTimeout(5000)
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-owners').click();
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').nth(1).click({timeout:5000});
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid > .btn').nth(1).click({timeout:5000});
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      
      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/drive`)
      await pageOne.waitForTimeout(10000)
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()

      //accept ownership invitation

      if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).count() > 1) {
        await pageOne.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).first().click();
      } else {
        await pageOne.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).click()
      }

      const pagePromise = pageOne.waitForEvent('popup')
      await pageOne.frameLocator('#sbox-iframe').getByText('Open the document in a new tab').click()
      const pageTwo = await pagePromise
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
      await pageTwo.bringToFront()
      await pageTwo.waitForTimeout(5000)

      await expect(pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
      await pageTwo.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      await expect(pageTwo.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user-name').getByText('test-user3').first()).toBeVisible({timeout:5000})

      //remove test-user3 as an owner
      await page.reload()
      await page.waitForTimeout(5000)
      if (browserName.indexOf('firefox') !== -1 ) {
        await page.waitForTimeout(10000)
      }
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-owners').click();
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user.large').filter({hasText: 'test-user3'}).locator('.fa.fa-times').click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();

      await pageTwo.reload()
      await pageTwo.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      await expect(pageTwo.frameLocator('#sbox-secure-iframe').getByText('test-user3').first()).toBeHidden({timeout:5000})
      await pageTwo.close()

      // await page.goto(`${url}/drive/#`);
      // await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).click({ button: 'right' })
      // await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Destroy' }).click()
      // await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
      // await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - edit document owners`, status: 'passed',reason: `Can edit ${name} document owners`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - edit document owners`, status: 'failed',reason: `Can\'t edit ${name} document owners`}})}`);

    }

  });

  test(` ${name} - add to team drive - (EDGE) THIS TEST WILL FAIL`, async ({ }) => {

    try {

      await page.goto(`${url}/${name}`);
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
      await page.waitForTimeout(10000)

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
      await page.frameLocator('#sbox-secure-iframe').getByText('test team').click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

      await page.waitForTimeout(5000)
      await page.goto(`${url}/teams/`);
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
      
      if (await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).count() > 1) {
        await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).first().click({ button: 'right' })
      } else {
        await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).click({ button: 'right' })
      }

      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).click()
      await page.waitForTimeout(5000)

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - add to team drive`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - add to team drive - (EDGE) THIS TEST WILL FAIL`, status: 'failed',reason: 'Can\'t acreate document and add to team drive - (EDGE) THIS TEST WILL FAIL'}})}`);

    }  
  });

  test(`${name} - move to trash and empty` , async ({ }) => {

    try {

      await page.goto(`${url}/${name}`);
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })

      await page.waitForTimeout(3000)
      if (name === 'sheet') {
        await page.waitForTimeout(5000)
      } 

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
      if (name === 'diagram') {
        await page.waitForTimeout(8000)
      } else {
        await page.waitForTimeout(3000)
      }
            
      await expect(page.frameLocator('#sbox-iframe').getByText(/^That document has been moved to the trash/, { exact: true })).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
      await page.waitForTimeout(3000)

      await page.goto(`${url}/drive`);
      await page.frameLocator('#sbox-iframe').getByText('Trash', { exact: true }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Empty the trash' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove' }).click();

      await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(title)).toBeHidden()

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - move to trash`, status: 'passed',reason: `Can create ${name} and move to trash`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - move to trash`, status: 'failed',reason: `Can\'t create ${name} and move to trash`}})}`);
      
    } 
  });

  if (name !== 'form') {

    test(`${name} - protect with and edit password`, async ({ }) => {

      var testName; 
      var testStatus;
      if (name == 'sheet') {
        testName = `${name} - protect with and edit password - THIS TEST WILL FAIL`
        testStatus = `protect ${name} document with and edit password - THIS TEST WILL FAIL`
      } else {
        testName = `${name} - protect with and edit password`
        testStatus = `${name} - protect ${name} document with and edit password`
      }

      try {
      
        test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

        await page.goto(`${url}/${name}/`);
  
        await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Add a password' }).locator('span').first().click();
        await page.frameLocator('#sbox-iframe').locator('#cp-creation-password-val').fill('password');
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
  
        await page.waitForTimeout(5000)
        await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
  
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
        await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({timeout: 3000});
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
        await page.waitForTimeout(5000)
        
        const clipboardText = await page.evaluate("navigator.clipboard.readText()");
  
        const context = await browser.newContext();
        const page1 = await context.newPage();
        
        await page1.goto(`${clipboardText}`)
        
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^This document is protected with a new password/)).toBeVisible({timeout: 30000})
        await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click();
        await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('password');
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
        await page1.waitForTimeout(5000)
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
        // await page1.close()
  
        await page.bringToFront();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click({timeout: 3000});
        await page.frameLocator('#sbox-secure-iframe').locator('#cp-app-prop-change-password').fill('newpassword')
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Submit' }).click({timeout: 3000});
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click({timeout: 3000});
        if (name === 'sheet') {
          await page.waitForTimeout(30000)
        } else {
          await page.waitForTimeout(5000)
        }
        
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click({timeout: 30000});
  
        await page.waitForTimeout(5000)
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
  
        await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
        await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({timeout: 3000});
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
  
        const clipboardText1 = await page.evaluate("navigator.clipboard.readText()");
  
        await page1.bringToFront()
        await page1.goto(`${clipboardText1}`)
  
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^This document is protected with a new password/)).toBeVisible({timeout:5000})
        await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click({timeout:5000});
        await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('newpassword');
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
        await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
  
        // await page.goto(`${url}/drive/#`);
        // await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`).click({ button: 'right' })
        // await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Destroy' }).click()
        // await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
        // await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)
  
        
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${testName}`, status: 'passed',reason: `Can ${testStatus}`}})}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${testName} - (FF clipboard incompatibility)`, status: 'failed',reason: `Can\'t ${testStatus} - (FF clipboard incompatibility)`}})}`);
  
      }
  
    });

    test(`${name} - share with contact (to view)`, async ({ }) => {

      try {

        await page.goto(`${url}/${name}`);
        await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()

        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^View$/ }).locator('span').first().click();
        await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

        ///
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
        pageOne = await context.newPage();
        await pageOne.goto(`${url}/drive`)
        await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
        
        const page2Promise = pageOne.waitForEvent('popup')
        if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).count() > 1) {

          await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
        } else {
          await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click()
        }
        const pageTwo = await page2Promise

        
        await expect(pageTwo.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
        await expect(pageTwo.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible({timeout: 5000})

        ////

        await page.bringToFront()
        await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer')).toBeVisible({timeout: 5000})

        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - share with contact (to view)`, status: 'passed',reason: `Can share ${name} with contact (to view)`}})}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - share with contact (to view)`, status: 'failed',reason: `Can\'t share ${name} with contact (to view)`}})}`);
    
      }  
    });

  test(`${name} - share with contact - edit`, async ({ }) => {

    var testName; 
    var testStatus;
    if (name == 'whiteboard' || name == 'diagram') {
      testName = `${name} - share with contact - edit - THIS TEST WILL FAIL`
      testStatus = `share ${name} with contact (to edit) - THIS TEST WILL FAIL`
    } else {
      testName = `${name} - share with contact - edit`
      testStatus = `share ${name} with contact (to edit)`
    }

    try {

      await page.goto(`${url}/${name}`);
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
      await page.waitForTimeout(3000)

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-secure-iframe').getByText('Edit').click();
      await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

      ///
      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/drive`)
      await pageOne.waitForTimeout(10000)
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
      const page1Promise = pageOne.waitForEvent('popup');
      if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).count() > 1) {
        await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
      } else {
        await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click()
      }
      const page1 = await page1Promise;

      await page1.waitForTimeout(10000)
      await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
      await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden()

      await page.waitForTimeout(3000)
      await page.bringToFront()
      if (name === 'pad') {
        await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-pad-editor').getByText('test-user3')).toBeVisible()
      } else if (name === 'sheet') {
        await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-oo-container').getByText('test-user3')).toBeVisible();
      } else if (name === 'diagram') {
        await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-diagram-editor').getByText('test-user3')).toBeVisible();
      } else if (name === 'code') {
        await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-code-editor').getByText('test-user3')).toBeVisible();
      } else if (name === 'slide') {
        await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-slide-editor').getByText('test-user3')).toBeVisible();
      } else if (name === 'whiteboard') {
        await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-whiteboard-canvas-area').getByText('test-user3')).toBeVisible();
      } else if (name === 'kanban') {
        await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-kanban-editor').getByText('test-user3')).toBeVisible();
      }

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${testName}`, status: 'passed',reason: `Can ${testStatus}`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${testName}`, status: 'failed',reason: `Can\'t ${testStatus}`}})}`);
  
    }  
  });


  test(` ${name} - share with contact - view and delete`, async ({ }) => {

    try {

      await page.goto(`${url}/${name}`);
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
      await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^View$/ }).locator('span').first().click();
      await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: 'View once and self-destruct' }).locator('span').first().click();
      await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

      ///
      const context = await browser.newContext({ storageState: 'auth/testuser3.json' });
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/drive`)
      await pageOne.waitForTimeout(10000)
      await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
      
      const page1Promise = pageOne.waitForEvent('popup');
      if (await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).count() > 1) {
        await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
      } else {
        await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).click()
      }
      const page1 = await page1Promise;
      
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'view and delete' }).click();
      await page1.waitForTimeout(20000)
      await expect(page1.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
      await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible()
      await page1.reload()
      await expect(page1.frameLocator('#sbox-iframe').getByText('This document has been destroyed by an owner
')).toBeVisible()

      ////

      await expect(page.frameLocator('#sbox-iframe').getByText('This document has been destroyed by an owner
')).toBeVisible()
      
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - view once and delete`, status: 'passed',reason: `Can share ${name} with contact (to view once and delete)`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - view once and delete`, status: 'failed',reason: `Can\'t share ${name} with contact (to view once and delete)`}})}`);
  
    }  
  });

  test(` ${name} - share (link) - view and delete - (FF clipboard incompatibility)`, async ({ }) => {

    try {

      test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

      await page.goto(`${url}/${name}`);
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
      await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
      await page.frameLocator('#sbox-secure-iframe').getByText('View once and self-destruct').click({timeout: 3000});
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Create link' }).click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

      const clipboardText = await page.evaluate("navigator.clipboard.readText()");

      ///
      const context = await browser.newContext();
      const pageOne = await context.newPage();
      await pageOne.goto(`${clipboardText}`)
      await pageOne.waitForTimeout(60000)
    
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'view and delete' }).click();
      await pageOne.waitForTimeout(20000)
      await expect(pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})

      await pageOne.reload()
      await pageOne.waitForTimeout(20000)
      await expect(pageOne.frameLocator('#sbox-iframe').getByText('This document has been destroyed by an owner
')).toBeVisible()
      await pageOne.close()

      ////

      await expect(page.frameLocator('#sbox-iframe').getByText('This document has been destroyed by an owner
')).toBeVisible()
      
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share link - view once and delete`, status: 'passed',reason: `Can share link to ${name} (to view once and delete)`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share link - view once and delete - (FF clipboard incompatibility)`, status: 'failed',reason: `Can\'t share link to ${name} (to view once and delete) - (FF clipboard incompatibility)`}})}`);
  
    }  
  });

  test(`${name} - enable and add to access list - (FF clipboard incompatibility)`, async ({ }) => {

    try {

      test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')
    
      await page.goto(`${url}/${name}/`);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

      //enable access list and add test-user3 to it
      await page.waitForTimeout(5000)
      await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      await page.frameLocator('#sbox-secure-iframe').getByText('List', { exact: true }).click();
      await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: 'Enable access list' }).locator('span').first().click();
      await page.waitForTimeout(5000)
      await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').first().click();
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid.cp-overlay-container').locator('.btn.btn-primary.cp-access-add').click();
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();
      
      //share link and attempt to access document anonymously
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
      await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
      await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({timeout: 3000});
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
      const clipboardText = await page.evaluate("navigator.clipboard.readText()");

      const context = await browser.newContext();
      pageOne = await context.newPage();  
      await pageOne.goto(`${clipboardText}`)
      await pageOne.waitForTimeout(30000)
      await expect(pageOne.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/)).toBeVisible({timeout: 30000})

      //access document as test-user3
      await pageOne.goto(`${url}/login`)
      await pageOne.getByPlaceholder('Username').fill('test-user3');
      await pageOne.waitForTimeout(2000)
      await pageOne.getByPlaceholder('Password', {exact: true}).fill(testUser3Password);
      const login = pageOne.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
        await login.click()
      }
      await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
      await pageOne.goto(`${clipboardText}`)
      await expect(pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)).toBeVisible({timeout: 5000})
      // await pageOne.close()


      //remove test-user3 from access list
      await page.waitForTimeout(30000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      await page.frameLocator('#sbox-secure-iframe').getByText('List', { exact: true }).click();
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user > .fa').first().click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();

      await pageOne.reload()
      await page.waitForTimeout(5000)

      await expect(pageOne.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/)).toBeVisible({timeout: 200000})

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - enable and add to access list`, status: 'passed',reason: `Can enable and add to access list in ${name} document`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - enable and add to access list`, status: 'failed',reason: `Can\'t enable and add to access list in ${name} document`}})}`);

    }

  });

  }

})

test.afterEach(async ({  }) => {

  await browser.close()

});