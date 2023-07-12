// const { test, expect } = require('@playwright/test');
// const { firefox, chromium, webkit } = require('@playwright/test');
// const { url, titleDate } = require('browserstack.config.js')


// test.describe.configure({ mode: 'serial' });

// let testuserProfileLink;
// let testuser3ProfileLink;

// test.beforeEach(async ({ page }) => {
//     test.setTimeout(2400000);
//     await page.goto(`${url}`)
  
//   });

// test('test-user account setup', async ({ page }) => {
  
//   try {

//     ///registering the account
    
//     await page.getByRole('link', { name: 'Sign up' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.getByPlaceholder('Username').fill('test-user');
//     await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//     await page.getByPlaceholder('Confirm your password', {exact: true}).fill('newpassword');
//     const register = page.locator("[id='register']")
//     await register.waitFor()

//     if (`${url}`.indexOf('cryptpad') !== -1) {
//       await page.locator('#userForm span').nth(2).waitFor()
//       await page.locator('#userForm span').nth(2).click()
//     }
//     await register.click()
 
//     const modal = page.getByText('Warning');
//     await expect(modal).toBeVisible({ timeout: 180000 });
//     if (await modal.isVisible({ timeout: 180000 })) {
//       await page.getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
//     }
//     const hashing = page.getByText('Hashing your password')
//     await expect(hashing).toBeVisible({ timeout: 200000 })

//     await page.waitForTimeout(20000)
//     await page.waitForURL(`${url}/drive`)
    
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'passed',reason: 'Can sign up'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'failed',reason: 'Can\'t sign up'}})}`);
//   }  

// })

// test('testuser account setup', async ({ page }) => {
  
//     try {
  
//       ///registering the account
//       await page.goto(`${url}`)
      
//       await page.getByRole('link', { name: 'Sign up' }).click();
//       await page.waitForLoadState('networkidle');
//       await page.getByPlaceholder('Username').fill('testuser');
//       await page.getByPlaceholder('Password', {exact: true}).fill('password');
//       await page.getByPlaceholder('Confirm your password', {exact: true}).fill('password');
//       const register = page.locator("[id='register']")
//       await register.waitFor()
  
//       if (`${url}`.indexOf('cryptpad') !== -1) {
//         await page.locator('#userForm span').nth(2).waitFor()
//         await page.locator('#userForm span').nth(2).click()
//       }
//       await register.click()
   
//       const modal = page.getByText('Warning');
//       await expect(modal).toBeVisible({ timeout: 180000 });
//       if (await modal.isVisible({ timeout: 180000 })) {
//         await page.getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
//       }
//       const hashing = page.getByText('Hashing your password')
//       await expect(hashing).toBeVisible({ timeout: 200000 })
  
//       await page.waitForTimeout(20000)
//       await page.waitForURL(`${url}/drive`)
      
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'passed',reason: 'Can sign up'}})}`);
  
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'failed',reason: 'Can\'t sign up'}})}`);
//     }  
  
//   })

//   test('testuser profile link', async ({ page }) => {
  
//     try {
  

//     await page.goto(`${url}/login`);
//     await page.getByPlaceholder('Username').fill('testuser');
//     await page.waitForTimeout(10000)
//     await page.getByPlaceholder('Password', {exact: true}).fill('password');
//     const login = page.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//         await login.click()
//     }
//     await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })   
//     await page.goto(`${url}/profile`)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     testuserProfileLink = await page.evaluate("navigator.clipboard.readText()");
//     console.log('testuser profile link: ', testuserProfileLink) 
      
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'passed',reason: 'Can sign up'}})}`);
  
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'failed',reason: 'Can\'t sign up'}})}`);
//     }  
  
//   })


//   test('test-user2 account setup', async ({ page }) => {
  
//     try {
  
//       ///registering the account
//       await page.goto(`${url}`)
      
//       await page.getByRole('link', { name: 'Sign up' }).click();
//       await page.waitForLoadState('networkidle');
//       await page.getByPlaceholder('Username').fill('test-user2');
//       await page.getByPlaceholder('Password', {exact: true}).fill('password');
//       await page.getByPlaceholder('Confirm your password', {exact: true}).fill('password');
//       const register = page.locator("[id='register']")
//       await register.waitFor()
  
//       if (`${url}`.indexOf('cryptpad') !== -1) {
//         await page.locator('#userForm span').nth(2).waitFor()
//         await page.locator('#userForm span').nth(2).click()
//       }
//       await register.click()
   
//       const modal = page.getByText('Warning');
//       await expect(modal).toBeVisible({ timeout: 180000 });
//       if (await modal.isVisible({ timeout: 180000 })) {
//         await page.getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
//       }
//       const hashing = page.getByText('Hashing your password')
//       await expect(hashing).toBeVisible({ timeout: 200000 })
  
//       await page.waitForTimeout(20000)
//       await page.waitForURL(`${url}/drive`)
      
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'passed',reason: 'Can sign up'}})}`);
  
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'failed',reason: 'Can\'t sign up'}})}`);
//     }  
  
//   })

//   test('test-user3 account setup', async ({ page }) => {
  
//     try {
  
//       ///registering the account
//       await page.goto(`${url}`)
      
//       await page.getByRole('link', { name: 'Sign up' }).click();
//       await page.waitForLoadState('networkidle');
//       await page.getByPlaceholder('Username').fill('test-user3');
//       await page.getByPlaceholder('Password', {exact: true}).fill('password');
//       await page.getByPlaceholder('Confirm your password', {exact: true}).fill('password');
//       const register = page.locator("[id='register']")
//       await register.waitFor()
  
//       if (`${url}`.indexOf('cryptpad') !== -1) {
//         await page.locator('#userForm span').nth(2).waitFor()
//         await page.locator('#userForm span').nth(2).click()
//       }
//       await register.click()
   
//       const modal = page.getByText('Warning');
//       await expect(modal).toBeVisible({ timeout: 180000 });
//       if (await modal.isVisible({ timeout: 180000 })) {
//         await page.getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
//       }
//       const hashing = page.getByText('Hashing your password')
//       await expect(hashing).toBeVisible({ timeout: 200000 })
  
//       await page.waitForTimeout(20000)
//       await page.waitForURL(`${url}/drive`)
      
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'passed',reason: 'Can sign up'}})}`);
  
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'failed',reason: 'Can\'t sign up'}})}`);
//     }  
  
//   })

//   test('test-user3 profile link', async ({ page }) => {
  
//     try {
  
//     await page.goto(`${url}/login`);
//     await page.getByPlaceholder('Username').fill('test-user3');
//     await page.waitForTimeout(10000)
//     await page.getByPlaceholder('Password', {exact: true}).fill('password');
//     const login = page.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//         await login.click()
//     }
//     await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })   
//     await page.goto(`${url}/profile`)
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     testuser3ProfileLink = await page.evaluate("navigator.clipboard.readText()");
//     console.log('test-user3 profile link: ', testuser3ProfileLink) 
      
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'passed',reason: 'Can sign up'}})}`);
  
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - register', status: 'failed',reason: 'Can\'t sign up'}})}`);
//     }  
  
//   })


//   test('user - link test-user and testuser as contacts', async ({ page }, testInfo) => {

//     try {
    
//     //login test-user
//     await page.goto(`${url}/login`);
//     await page.getByPlaceholder('Username').fill('test-user');
//     await page.waitForTimeout(10000)
//     await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//     const login = page.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//         await login.click()
//     }
//     await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })  

//     //send contact request to testuser 
//     await page.goto(`${testuserProfileLink}`)  
//     await page.waitForTimeout(10000)
//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()

//     ///
//     //testuser: log in
//     const name = testInfo.project.name
//     if (name.indexOf('firefox') !== -1 ) {
//       browser = await firefox.launch();
//     } else if (name.indexOf('webkit') !== -1 ) {
//       browser = await webkit.launch();
//     } else {
//       browser = await chromium.launch();
//     }
//     const context = await browser.newContext();
//     pageOne = await context.newPage();
//     await pageOne.goto(`${url}/login`);
//     await pageOne.getByPlaceholder('Username').fill('testuser');
//     await pageOne.waitForTimeout(10000)
//     await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
//     const login1 = pageOne.locator(".login")
//     await login1.waitFor({ timeout: 18000 })
//     await expect(login1).toBeVisible({ timeout: 1800 })
//     if (await login1.isVisible()) {
//       await login1.click()
//     }
//     await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//     await pageOne.waitForLoadState('networkidle');
//     await pageOne.waitForTimeout(10000)

//     //user 2: accept contact request
//     const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
//     await notifsOne.waitFor({ timeout: 100000 })
//     await notifsOne.click()
//     await pageOne.waitForTimeout(5000)

//     await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor()
//     await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
//     await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
//     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
//     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
//     await pageOne.waitForTimeout(5000)
//     await pageOne.close()
//     ////
       
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user - add and remove other user as contact', status: 'passed',reason: 'Can add and remove other user as contact'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user - add and remove other user as contact', status: 'failed',reason: 'Can\'t add and remove other user as contact'}})}`);
//   } 

// });

// test('user - link test-user and testuser as contacts', async ({ page }, testInfo) => {

//     try {
    
//     //login test-user
//     await page.goto(`${url}/login`);
//     await page.getByPlaceholder('Username').fill('test-user');
//     await page.waitForTimeout(10000)
//     await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//     const login = page.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//         await login.click()
//     }
//     await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })  

//     //send contact request to test-user3 
//     await page.goto(`${testuser3ProfileLink}`)  
//     await page.waitForTimeout(10000)
//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()

//     ///
//     //test-user3: log in
//     const name = testInfo.project.name
//     if (name.indexOf('firefox') !== -1 ) {
//       browser = await firefox.launch();
//     } else if (name.indexOf('webkit') !== -1 ) {
//       browser = await webkit.launch();
//     } else {
//       browser = await chromium.launch();
//     }
//     const context = await browser.newContext();
//     pageOne = await context.newPage();
//     await pageOne.goto(`${url}/login`);
//     await pageOne.getByPlaceholder('Username').fill('test-user3');
//     await pageOne.waitForTimeout(10000)
//     await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
//     const login1 = pageOne.locator(".login")
//     await login1.waitFor({ timeout: 18000 })
//     await expect(login1).toBeVisible({ timeout: 1800 })
//     if (await login1.isVisible()) {
//       await login1.click()
//     }
//     await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//     await pageOne.waitForLoadState('networkidle');
//     await pageOne.waitForTimeout(10000)

//     //test-user3: accept contact request
//     const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
//     await notifsOne.waitFor({ timeout: 100000 })
//     await notifsOne.click()
//     await pageOne.waitForTimeout(5000)

//     await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor()
//     await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
//     await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
//     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
//     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
//     await pageOne.waitForTimeout(5000)
//     await pageOne.close()
//     ////
       
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user - add and remove other user as contact', status: 'passed',reason: 'Can add and remove other user as contact'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user - add and remove other user as contact', status: 'failed',reason: 'Can\'t add and remove other user as contact'}})}`);
//   } 

// });

// test('test-user - create test team and example document', async ({ page }) => {
  
//   try {
//     await page.goto(`${url}/login`);
//     await page.getByPlaceholder('Username').fill('test-user');
//     await page.waitForTimeout(10000)
//     await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//     const login = page.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//         await login.click()
//     }
//     await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })  

//     await page.goto(`${url}/teams`);
//     await page.waitForTimeout(10000)
//     await page.waitForLoadState('networkidle');
//     await page.frameLocator('#sbox-iframe').getByText('Available team slotNew').first().click();

//     await page.waitForLoadState('networkidle');

//     await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test team')
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(10000)
//     await expect(page1).toHaveURL(`${url}/teams/`, { timeout: 100000 })
//     await page.waitForLoadState('networkidle');

//     await page.frameLocator('#sbox-iframe').getByText('tt', { exact: true }).click();
//     await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().click();
//     const page1Promise = page.waitForEvent('popup');
//     await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Rich text$/ }).locator('span').first().click();
//     const page1 = await page1Promise;
//     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

//     await expect(page).toHaveURL(new RegExp(`^${url}/pad`), { timeout: 100000 })

//     var title = `Rich text - ${titleDate}`;
    
//     await page.frameLocator('#sbox-iframe').getByText(`${title}`).toBeVisible()
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').waitFor()
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click({force: true});
//     await page.frameLocator('#sbox-iframe').getByPlaceholder(title).fill('example document');
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').waitFor()
//     await page.waitForTimeout(10000)
//     await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('example document')).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'passed',reason: 'Can navigate to Drive as user and create a team'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'failed',reason: 'Can\'t navigate to Drive as user and create a team'}})}`);

//   }  
// });

// test('test-user - create test documents in drive', async ({ page }) => {
  
//     try {
//       await page.goto(`${url}/login`);
//       await page.getByPlaceholder('Username').fill('test-user');
//       await page.waitForTimeout(10000)
//       await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//       const login = page.locator(".login")
//       await login.waitFor({ timeout: 18000 })
//       await expect(login).toBeVisible({ timeout: 1800 })
//       if (await login.isVisible()) {
//           await login.click()
//       }
//       await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })  

//       const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form'] 


//       docNames.forEach(function(name) {

//         await page.goto(`${url}/${name}`);
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//         await page.waitForTimeout(5000)
//         await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
//         await page.waitForTimeout(5000)

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

//         await page.frameLocator('#sbox-iframe').getByText(`${title}`).toBeVisible()
//         await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').waitFor()
//         await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click({force: true});

//         let newTitle;

//         if (name === 'slide') {
//             newTitle = 'test markdown';
//           } else {
//             newTitle = `test ${name}`;
            
//           }


//         await page.frameLocator('#sbox-iframe').getByPlaceholder(title).fill(`${newTitle}`);
//         await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').waitFor()
//         await page.waitForTimeout(10000)
//         await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
//         await expect(page.frameLocator('#sbox-iframe').getByText(`${newTitle}`)).toBeVisible()

//       })
  


  
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'passed',reason: 'Can navigate to Drive as user and create a team'}})}`);
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'failed',reason: 'Can\'t navigate to Drive as user and create a team'}})}`);
  
//     }  
//   });