const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')

let page;
let pageOne;
let browser;

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
  await page.goto(`${url}/drive`)
  await page.waitForTimeout(5000)
});

// const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'] 
const docNames = ['pad'] 


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

    // test(`drive - ${name} - create without owner` , async ({ }) => {

    //   try {

    //     const page1Promise = page.waitForEvent('popup');
    
    //     await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).locator('span').first().click();
    //     if (name === 'pad') {
    //         await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Rich text$/ }).locator('span').first().click();
    //     } else {
    //         await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-new-ghost-dialog').getByText(`${name}`).click()
    //     }
    //     const page1 = await page1Promise;
    //     await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Owned document' }).locator('span').first().click();

    //     await page1.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
    //     await expect(page1).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })

    //     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
    //     const owner = await page.frameLocator('#sbox-secure-iframe').getByLabel('Owners')
    //     await expect(owner).toHaveCount(0)
    //     await expect(page1.frameLocator('#sbox-secure-iframe').locator('.alertify-tabs-title.disabled').locator('#cp-tab-owners')).toBeVisible()
    //     await page1.frameLocator('#sbox-secure-iframe').locator('.alertify-tabs-title.disabled').locator('#cp-tab-owners').click()
    //     await expect(owner).toHaveCount(0)
      

    //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive - ${name} - create without owner`, status: 'passed',reason: `Can create ${name} without owner`}})}`);
    //     } catch (e) {
    //     console.log(e);
    //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive - ${name} - create without owner`, status: 'failed',reason: `Can\'t create ${name} without owner`}})}`);
        
    //     }  
    // });

      // test(`drive - ${name} - move to trash` , async ({ }) => {

      //   try {

      //       const page1Promise = page.waitForEvent('popup');
        
      //       await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).locator('span').first().click();
      //       if (name === 'pad') {
      //           await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Rich text$/ }).locator('span').first().click();
      //       } else {
      //           await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-new-ghost-dialog').getByText(`${name}`).click()
      //       }
      //       const page1 = await page1Promise;
      //       await page1.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
      //       await expect(page1).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })

      //       await page.waitForTimeout(3000)
      //       if (name === 'sheet') {
      //           await page.waitForTimeout(5000)
      //       } 

      //       await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
      //       await page1.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
      //       if (await page1.frameLocator('#sbox-iframe').getByText('You must store this document in your CryptDrive').isVisible()) {
      //           await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      //           await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
      //           await page1.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
                
      //       }

      //       await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
      //       if (name === 'sheet') {
                
      //       } else {
      //           await expect(page1.frameLocator('#sbox-iframe').getByText('Moved to the trash', { exact: true })).toBeVisible({ timeout: 10000 });
      //       }


      //       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` drive > ${name}`, status: 'passed',reason: `Can log in and create ${name} from Drive`}})}`);
      //       } catch (e) {
      //       console.log(e);
      //       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` drive > ${name}`, status: 'failed',reason: `Can\'t log in and create ${name} from Drive`}})}`);
            
      //       }  
      //   });

//     test(`${name} - tag`, async ({ }) => {
  
//       try {
  
//         await page.goto(`${url}/${name}`);
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//         await page.waitForTimeout(5000)
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
//         await page.waitForTimeout(5000)
  
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tags', exact: true }).click();
//         await page.frameLocator('#sbox-iframe').locator('.token-input.ui-autocomplete-input').click()
//         await page.frameLocator('#sbox-iframe').locator('.token-input.ui-autocomplete-input').fill('testtag');
//         await page.waitForTimeout(3000)
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add' }).click();
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//         await page.waitForTimeout(3000)
        
//         await page.goto(`${url}/drive/#`);
//         await page.waitForTimeout(3000)
//         await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree').getByText('Tags').click();
//         await page.frameLocator('#sbox-iframe').getByRole('link', { name: '#testtag' }).click();
  
//         var title;
//         if (name === 'pad') {
//           title = `Rich text - ${titleDate}`;
//         } else if (name === 'slide') {
//           title = `Markdown slides - ${titleDate}`
//         } else {
//           const titleName = name.charAt(0).toUpperCase() + name.slice(1)
//           title = `${titleName} - ${titleDate}`;
//         }
//         await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${title}`)).toBeVisible();
  
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - tag`, status: 'passed',reason: `Can tag ${name} document`}})}`);
//       } catch (e) {
//         console.log(e);
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - tag`, status: 'failed',reason: `Can\'t tag ${name} document`}})}`);
  
//       }  
//     });

  // test(`${name} - protect with and edit password`, async ({ }) => {

  //   try {
    
  //     await page.goto(`${url}/${name}/`);

  //     await page.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Add a password' }).locator('span').first().click();
  //     await page.frameLocator('#sbox-iframe').locator('#cp-creation-password-val').fill('password');
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

  //     await page.waitForTimeout(5000)
  //     await expect(page).toHaveTitle((`${title}`))

  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
  //     await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({timeout: 3000});
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

  //     const clipboardText = await page.evaluate("navigator.clipboard.readText()");

  //     const context = await browser.newContext();
  //     const page1 = await context.newPage();
      
  //     await page1.goto(`${clipboardText}`)
  //     await page1.waitForTimeout(60000)
      
  //     await expect(page1.frameLocator('#sbox-iframe').getByText(/^The document you are trying to open no longer exists/)).toBeVisible({timeout: 200000})
  //     await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click();
  //     await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('password');
  //     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
  //     await page1.waitForTimeout(5000)
  //     await expect(page1).toHaveTitle((`${title}`))

  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').locator('#cp-app-prop-change-password').fill('newpassword')
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Submit' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click({timeout: 60000});
  //     await page.waitForTimeout(5000)
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click();
  //     await page.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click();
  //     await page.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('newpassword');
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

  //     await page1.waitForTimeout(5000)
  //     await page1.reload()
  //     await expect(page1.frameLocator('#sbox-iframe').getByText(/^The document you are trying to open no longer exists/)).toBeVisible({timeout: 200000})
  //     await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click();
  //     await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('newpassword');
  //     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
  //     await expect(page1.frameLocator('#sbox-iframe').getByText(/^The document you are trying to open no longer exists/)).toBeVisible({timeout: 200000})


  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
  //     await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({timeout: 3000});
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

  //     const clipboardText1 = await page.evaluate("navigator.clipboard.readText()");

  //     await page1.goto(`${clipboardText1}`)

  //     await page1.waitForTimeout(5000)
  //     await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').click();
  //     await page1.frameLocator('#sbox-iframe').getByPlaceholder('Type the password here...').fill('newpassword');
  //     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();
  //     await expect(page1).toHaveTitle((`${title}`))
      
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - protect with and edit password`, status: 'passed',reason: `Can protect with and edit password`}})}`);
  //   } catch (e) {
  //     console.log(e);
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - protect with and edit password`, status: 'failed',reason: `Can\'t protect with and edit password`}})}`);

  //   }

  // });

  // test(`${name} - destroy`, async ({ }) => {

  //   try {
    
  //     await page.goto(`${url}/${name}/`);
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

  //     await page.waitForTimeout(5000)
  //     await expect(page).toHaveTitle((`${title}`))
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).waitFor()
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click({force: true})

  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Destroy' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Are you sure?' }).click();
  //     await page.waitForTimeout(5000)
      
  //     await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-spinner').getByText('Document destroyed')).toBeVisible({timeout: 200000})

  //     await page.goto(`${url}/drive/`);
  //     await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)
  //     await page.frameLocator('#sbox-iframe').getByText('Trash', { exact: true }).click();
  //     await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)
      
      
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - protect with and edit password`, status: 'passed',reason: `Can protect with and edit password`}})}`);
  //   } catch (e) {
  //     console.log(e);
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - protect with and edit password`, status: 'failed',reason: `Can\'t protect with and edit password`}})}`);

  //   }

  // });

  // test(`${name} - enable and add to access list`, async ({ }) => {

  //   try {
    
  //     await page.goto(`${url}/${name}/`);
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

  //     //enable access list and add test-user3 to it
  //     await page.waitForTimeout(5000)
  //     await expect(page).toHaveTitle((`${title}`))
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').getByText('List', { exact: true }).click();
  //     await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: 'Enable access list' }).locator('span').first().click();
  //     await page.waitForTimeout(5000)
  //     await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').first().click();
  //     await page.waitForTimeout(3000)
  //     await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid.cp-overlay-container').locator('.btn.btn-primary.cp-access-add').click();
  //     await page.waitForTimeout(3000)
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();
      
  //     //share link and attempt to access document anonymously
  //     await page.waitForTimeout(3000)
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
  //     await page.frameLocator('#sbox-secure-iframe').getByText('View', { exact: true }).click({timeout: 3000});
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
  //     const clipboardText = await page.evaluate("navigator.clipboard.readText()");

  //     const context = await browser.newContext();
  //     pageOne = await context.newPage();
  //     await pageOne.goto(`${url}/drive`)
  //     await pageOne.waitForTimeout(10000)
  //     const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
  //     await menu.waitFor()
  //     await menu.click()
  //     await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
  //     await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
  //     await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()      
  //     await pageOne.goto(`${clipboardText}`)
  //     await pageOne.waitForTimeout(60000)
  //     await expect(pageOne.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/)).toBeVisible({timeout: 200000})

  //     //access document as test-user3
  //     await pageOne.goto(`${url}/login`)
  //     await pageOne.getByPlaceholder('Username').fill('test-user3');
  //     await pageOne.waitForTimeout(5000)
  //     await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
  //     const login = pageOne.locator(".login")
  //     await login.waitFor({ timeout: 18000 })
  //     await expect(login).toBeVisible({ timeout: 1800 })
  //     if (await login.isVisible()) {
  //       await login.click()
  //     }
  //     await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
  //     await pageOne.goto(`${clipboardText}`)
  //     await expect(pageOne).toHaveTitle(`${title}`)

  //     //remove test-user3 from access list
  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').getByText('List', { exact: true }).click();
  //     await page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-user > .fa').first().click();
  //     await pageOne.waitForTimeout(5000)
  //     await expect(pageOne.frameLocator('#sbox-iframe').getByText(/^You are not authorized to access this document/)).toBeVisible({timeout: 200000})

      
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - protect with and edit password`, status: 'passed',reason: `Can protect with and edit password`}})}`);
  //   } catch (e) {
  //     console.log(e);
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - protect with and edit password`, status: 'failed',reason: `Can\'t protect with and edit password`}})}`);

  //   }

  // });

  test(`${name} - edit document owners`, async ({ }) => {

    try {
    
      await page.goto(`${url}/${name}/`);
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

      //enable access list and add test-user3 to it
      await page.waitForTimeout(5000)
      await expect(page).toHaveTitle((`${title}`))
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
      await page.frameLocator('#sbox-secure-iframe').getByText('Owners', { exact: true }).click();
      await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').first().click();
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-share-column-mid.cp-overlay-container').locator('.btn.btn-primary.cp-access-add').click();
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      // await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' }).click();
      
      //share link and attempt to access document anonymously

      const context = await browser.newContext();
      pageOne = await context.newPage();
      await pageOne.goto(`${url}/drive`)
      await pageOne.waitForTimeout(10000)
      const menu = pageOne.frameLocator('#sbox-iframe').getByAltText('User menu')
      await menu.waitFor()
      await menu.click()
      await pageOne.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
      await expect(pageOne).toHaveURL(`${url}`, { timeout: 100000 })
      await expect(pageOne.getByRole('link', { name: 'Log in' })).toBeVisible()      
      await pageOne.getByRole('link', { name: 'Log in' }).click()

      //access document as test-user3
     
      await pageOne.getByPlaceholder('Username').fill('test-user3');
      await pageOne.waitForTimeout(5000)
      await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
      const login = pageOne.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
        await login.click()
      }
      await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
      
      const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
      await notifsOne.waitFor({ timeout: 100000 })
      await notifsOne.click()
      await pageOne.waitForTimeout(5000)

      await pageOne.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).waitFor()
      await pageOne.frameLocator('#sbox-iframe').getByText(`test-user wants you to be an owner of ${title}`).click();
      const pagePromise = pageOne.waitForEvent('popup')
      await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
      const pageTwo = await pagePromise
      await expect(pageTwo).toHaveTitle(`${title}`, { timeout: 100000 })

      //remove test-user3 as an owner
      await page.frameLocator('#sbox-secure-iframe').locator('.cp-usergrid-grid > div:nth-child(2) > .fa').click();
      await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' }).click();

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - protect with and edit password`, status: 'passed',reason: `Can protect with and edit password`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name} - protect with and edit password`, status: 'failed',reason: `Can\'t protect with and edit password`}})}`);

    }

  });


//     test(` ${name} - add to team drive`, async ({ }) => {

//         try {

//             await page.goto(`${url}/${name}`);
//             await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
//             await page.waitForTimeout(10000)

//             await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//             await page.frameLocator('#sbox-secure-iframe').getByText('test team').click();
//             await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();
//             await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();

//             await page.goto(`${url}/teams/`);
//             await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
//             await page.frameLocator('#sbox-iframe').getByText('tttest team').click();

//             var title;
//             if (name === 'pad') {
//                 title = `Rich text - ${titleDate}`;
//             } else if (name === 'slide') {
//                 title = `Markdown slides - ${titleDate}`
//             } else {
//                 const titleName = name.charAt(0).toUpperCase() + name.slice(1)
//                 title = `${titleName} - ${titleDate}`;
//             }
            
//             await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toBeVisible()
//             await page.waitForTimeout(10000)

//             await page.frameLocator('#sbox-iframe').getByText(`${title}`).click({ button: 'right' })
//             await page.waitForLoadState('networkidle', { timeout: 5000 });
//             await page.waitForTimeout(10000)
//             if (await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).isVisible()) {
//                 await page.waitForLoadState('networkidle', { timeout: 5000 });
//                 await page.waitForTimeout(10000)
//                 await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).click()
//             } else {
//                 await page.waitForLoadState('networkidle', { timeout: 5000 });
//                 await page.waitForTimeout(10000)
//                 await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Remove' }).last().click()
                
//             }

//             await page.waitForTimeout(8000)
//             await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)

//             await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - add to team drive`, status: 'passed',reason: 'Can create document and add to team drive'}})}`);
//         } catch (e) {
//             console.log(e);
//             await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - add to team drive`, status: 'failed',reason: 'Can\'t acreate document and add to team drive'}})}`);
  
//         }  
//     });

//   test(` ${name} - share with contact - view`, async ({ }) => {

//     try {

//       await page.goto(`${url}/${name}`);
//       await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()

//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//       await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^View$/ }).locator('span').first().click();
//       await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
//       await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

//       ///
//       const context = await browser.newContext();
//       const pageOne = await context.newPage();
//       await pageOne.goto(`${url}/login/`);
//       await pageOne.getByPlaceholder('Username').fill('test-user3');
//       await pageOne.waitForTimeout(10000)
//       await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
//       const loginOne = pageOne.locator(".login")
//       await loginOne.waitFor({ timeout: 18000 })
//       await expect(loginOne).toBeVisible({ timeout: 1800 })
//       if (await loginOne.isVisible()) {
//         await loginOne.click()
//       }
//       await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//       await pageOne.waitForTimeout(5000)

//       const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
//       await notifsOne.waitFor({ timeout: 100000 })
//       await notifsOne.click()
//       await pageOne.waitForTimeout(5000)

//       const date = new Date()

//       var title;
//       if (name === 'pad') {
//         title = `Rich text - ${titleDate}`;
//       } else if (name === 'slide') {
//         title = `Markdown slides - ${titleDate}`
//       } else {
//         const titleName = name.charAt(0).toUpperCase() + name.slice(1)
//         title = `${titleName} - ${titleDate}`;
//       }
      
//       const page1Promise = pageOne.waitForEvent('popup');
//       await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().waitFor();
//       await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
//       const page1 = await page1Promise;
      
//       await expect(page1).toHaveTitle(`${title}`)
//       await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible()

//       ////

//       await expect(page.frameLocator('#sbox-iframe').getByText('1 viewer')).toBeVisible()
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
//       if (await page.frameLocator('#sbox-iframe').getByText('You must store this document in your CryptDrive').isVisible()) {
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//         await page.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
        
//       }

//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
//       await page.waitForTimeout(5000)

//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - view`, status: 'passed',reason: `Can share ${name} with contact (to view)`}})}`);
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - view`, status: 'failed',reason: `Can\'t share ${name} with contact (to view)`}})}`);
  
//     }  
//   });

//   test(` ${name} - share with contact - edit`, async ({ }) => {

//     try {


//       await page.goto(`${url}/${name}`);
//       await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()

//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//       await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
//       await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

//       ///
//       const context = await browser.newContext();
//       const pageOne = await context.newPage();
//       await pageOne.goto(`${url}/login/`);
//       await pageOne.getByPlaceholder('Username').fill('test-user3');
//       await pageOne.waitForTimeout(10000)
//       await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
//       const loginOne = pageOne.locator(".login")
//       await loginOne.waitFor({ timeout: 18000 })
//       await expect(loginOne).toBeVisible({ timeout: 1800 })
//       if (await loginOne.isVisible()) {
//         await loginOne.click()
//       }
//       await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//       await pageOne.waitForTimeout(5000)

//       const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
//       await notifsOne.waitFor({ timeout: 100000 })
//       await notifsOne.click()
//       await pageOne.waitForTimeout(5000)

//       var title;
//       if (name === 'pad') {
//         title = `Rich text - ${titleDate}`;
//       } else if (name === 'slide') {
//         title = `Markdown slides - ${titleDate}`
//       } else {
//         const titleName = name.charAt(0).toUpperCase() + name.slice(1)
//         title = `${titleName} - ${titleDate}`;
//       }
      
//       const page1Promise = pageOne.waitForEvent('popup');
//       await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().waitFor();
//       await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
//       const page1 = await page1Promise;
      
//       await expect(page1).toHaveTitle(`${title}`)
//       await page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').waitFor()
//       await page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').locator('body').fill('TEST TEXT');
//       await page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT').waitFor()
//       await expect(page1.frameLocator('#sbox-iframe').frameLocator('iframe[title="Rich Text Editor\\, editor1"]').getByText('TEST TEXT')).toBeVisible()

//       ////

//       await expect(page.frameLocator('#sbox-iframe').getByText('tetest-user3', { exact: true })).toBeVisible()
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
//       if (await page.frameLocator('#sbox-iframe').getByText('You must store this document in your CryptDrive').isVisible()) {
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
//         await page.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
        
//       }

//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)', exact: true }).click();
//       await page.waitForTimeout(5000)

//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - edit`, status: 'passed',reason: `Can share ${name} with contact (to edit)`}})}`);
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - edit`, status: 'failed',reason: `Can\'t share ${name} with contact (to edit)`}})}`);
  
//     }  
//   });


//   test(` ${name} - share with contact - view and delete`, async ({ }) => {

//     try {

//       await page.goto(`${url}/${name}`);
//       await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()

//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//       await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: /^View$/ }).locator('span').first().click();
//       await page.frameLocator('#sbox-secure-iframe').locator('label').filter({ hasText: 'View once and self-destruct' }).locator('span').first().click();
//       await page.frameLocator('#sbox-secure-iframe').getByText('test-user3').click();
//       await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' }).click();

//       ///
//       const context = await browser.newContext();
//       const pageOne = await context.newPage();
//       await pageOne.goto(`${url}/login/`);
//       await pageOne.getByPlaceholder('Username').fill('test-user3');
//       await pageOne.waitForTimeout(10000)
//       await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
//       const loginOne = pageOne.locator(".login")
//       await loginOne.waitFor({ timeout: 18000 })
//       await expect(loginOne).toBeVisible({ timeout: 1800 })
//       if (await loginOne.isVisible()) {
//         await loginOne.click()
//       }
//       await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//       await pageOne.waitForTimeout(5000)

//       const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
//       await notifsOne.waitFor({ timeout: 100000 })
//       await notifsOne.click()
//       await pageOne.waitForTimeout(5000)

//       var title;
//       if (name === 'pad') {
//         title = `Rich text - ${titleDate}`;
//       } else if (name === 'slide') {
//         title = `Markdown slides - ${titleDate}`
//       } else {
//         const titleName = name.charAt(0).toUpperCase() + name.slice(1)
//         title = `${titleName} - ${titleDate}`;
//       }
      
//       const page1Promise = pageOne.waitForEvent('popup');
//       await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().waitFor();
//       await pageOne.frameLocator('#sbox-iframe').getByText(`test-user has shared a document with you: ${title}`).first().click();
//       const page1 = await page1Promise;
      
//       await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'view and delete' }).click();
//       await page1.waitForTimeout(20000)
//       await expect(page1).toHaveTitle(`${title}`)
//       await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible()
//       await page1.reload()
//       await expect(page1.frameLocator('#sbox-iframe').getByText('Document not found!')).toBeVisible()

//       ////

//       await expect(page.frameLocator('#sbox-iframe').getByText('The document you are trying to open no longer exists')).toBeVisible()
      
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - view once and delete`, status: 'passed',reason: `Can share ${name} with contact (to view once and delete)`}})}`);
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - view once and delete`, status: 'failed',reason: `Can\'t share ${name} with contact (to view once and delete)`}})}`);
  
//     }  
//   });

  // test(` ${name} - share (link) - view and delete`, async ({ }) => {

  //   try {

  //     await page.goto(`${url}/${name}`);
  //     await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()

  //     var title;
  //     if (name === 'pad') {
  //       title = `Rich text - ${titleDate}`;
  //     } else if (name === 'slide') {
  //       title = `Markdown slides - ${titleDate}`
  //     } else {
  //       const titleName = name.charAt(0).toUpperCase() + name.slice(1)
  //       title = `${titleName} - ${titleDate}`;
  //     }

  //     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
  //     await page.frameLocator('#sbox-secure-iframe').getByText('View once and self-destruct').click({timeout: 3000});
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Create link' }).click();
  //     await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

  //     const clipboardText = await page.evaluate("navigator.clipboard.readText()");

  //     ///
  //     const context = await browser.newContext();
  //     const pageOne = await context.newPage();
  //     await pageOne.goto(`${clipboardText}`)
  //     await pageOne.waitForTimeout(60000)
  //     // await expect(page1).toHaveTitle(`${title}`)
  
      
  //     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'view and delete' }).click();
  //     await pageOne.waitForTimeout(20000)
  //     await expect(page).toHaveURL(new RegExp(`^${url}/${name}`), { timeout: 100000 })

  //     // await expect(pageOne).toHaveTitle(`${title}`, {timeout: 100000})
  //     await pageOne.reload()
  //     await pageOne.waitForTimeout(20000)
  //     await expect(pageOne.frameLocator('#sbox-iframe').getByText('Document not found!')).toBeVisible()
  //     await pageOne.close()

  //     ////

  //     await expect(page.frameLocator('#sbox-iframe').getByText('The document you are trying to open no longer exists')).toBeVisible()
      
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - view once and delete`, status: 'passed',reason: `Can share ${name} with contact (to view once and delete)`}})}`);
  //   } catch (e) {
  //     console.log(e);
  //     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - share with contact - view once and delete`, status: 'failed',reason: `Can\'t share ${name} with contact (to view once and delete)`}})}`);
  
  //   }  
  // });


})

test.afterEach(async ({  }) => {
    await browser.close()
  });