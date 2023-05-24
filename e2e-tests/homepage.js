const { test, expect } = require('@playwright/test');
const { chromium } = require('@playwright/test');


// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'


// // ANONYMOUS USER


let browser;
let page;

// test.beforeEach(async () => {
//   browser = await chromium.launch();
//   page = await browser.newPage();
//   await page.goto(`${url}`);
// });

// test('home page title', async ({  }) => {
//   
//   
//   try {

//     await page.goto(`${url}`);

//     await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'title', status: 'passed',reason: 'Can navigate to home page'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'title', status: 'failed',reason: 'Can\'t navigate to home page'}})}`);

//   }  
//   
// });


// test('sign up', async ({  }) => {
//   
//   
//   try {

//     test.setTimeout(240000)
    
//     await page.goto(`${url}`)

//     await page.getByRole('link', { name: 'Sign up' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.getByPlaceholder('Username').fill('test-user-4');
//     await page.getByPlaceholder('Password', {exact: true}).fill('password');
//     await page.getByPlaceholder('Confirm your password', {exact: true}).fill('password');
//     const register = page.locator("[id='register']")
//     await register.waitFor()

//     if (`${url}`.indexOf('cryptpad') !== -1) {
//       const cb = page.locator('#userForm span').nth(2)
//       await cb.waitFor()
//       await cb.click()
//     }
    
//     await register.click()
 
//     const modal = page.getByText('Warning');
//     await expect(modal).toBeVisible({ timeout: 180000 });
//     if (await modal.isVisible({ timeout: 180000 })) {
//       await page.getByRole('button', { name: 'I have written down my username and password, proceed' } ).click()
//     }

//     const hashing = page.getByText('Hashing your password')
//     const existingUser = page.getByText('This user already exists, do you want to log in?')
//     await expect(hashing).toBeVisible({ timeout: 200000 })

//     await page.waitForTimeout(20000)
    
//     if (await existingUser.isVisible({ timeout: 200000 })) {
//       await page.getByRole('button', { name: 'Cancel' }).click();
//       await expect(page).toHaveURL(`${url}/register/`)
//     } else {
//       await expect(hashing).toBeVisible({ timeout: 180000 })
//       await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 180000  })
//     }
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'register', status: 'passed',reason: 'Can sign up'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'register', status: 'failed',reason: 'Can\'t sign up'}})}`);

//   }  
//   
// })


// test('log in', async ({  }) => {
//   
//   
//   try {
//     test.setTimeout(240000)
//     // if (url.indexOf('localhost') !== -1) {
      

//     // } else {
//       await page.goto(url);

//       await page.getByRole('link', { name: 'Log in' }).click();
  
//       await expect(page).toHaveURL(`${url}/login/`);
//       await page.getByPlaceholder('Username').fill('test-user');
//       await page.getByPlaceholder('Password', {exact: true}).fill('password');

//       const login = page.locator(".login")
//       await login.waitFor({ timeout: 18000 })
//       await expect(login).toBeVisible({ timeout: 18000 })
//       if (await login.isVisible()) {
//         await login.click()
//       }
//       await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'login', status: 'passed',reason: 'Can log in'}})}`);

//     // }
   

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'login', status: 'failed',reason: 'Can\'t log in'}})}`);

//   }  
//   
// });


// test('home page > features', async ({ }) => {
//   
//   
//   try {
//     await page.goto(`${url}`);

//     await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//     if (url.toString() === 'https://cryptpad.fr') {
//       await page.getByRole('link', {name: 'Pricing'}).waitFor()
//       await page.getByRole('link', {name: 'Pricing'}).click()
      
//     } else {
//       await page.getByRole('link', {name: 'Features'}).waitFor()
//       await page.getByRole('link', {name: 'Features'}).click()
//     }
//     await expect(page).toHaveURL(new RegExp(`^${url}/features`))
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > features', status: 'passed',reason: 'Can navigate from home page to features page'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > features', status: 'failed',reason: 'Can\'t navigate from home page to features page'}})}`);

//   }  
//   

// });

// test('home page > documentation', async ({  }) => {
//   test.setTimeout(240000)
//   
//   
//   try {
//     await page.goto(`${url}`);

//     await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//     await page.getByRole('link', {name: 'Documentation'}).waitFor()
//     await page.getByRole('link', {name: 'Documentation'}).click()
    
//     await expect(page).toHaveURL('https://docs.cryptpad.org/en/')
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > documentation', status: 'passed',reason: 'Can navigate from home page to documentation'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > documentation', status: 'failed',reason: 'Can\'t navigate from home page to documentation'}})}`);

//   }  
//   

// });

// test('home page > contact', async ({ }) => {
//   test.setTimeout(100000)
//   
//   
//   try {

//     await page.goto(`${url}`);

//     await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//     await page.getByRole('link', {name: 'Contact'}).waitFor()
//     await page.getByRole('link', {name: 'Contact'}).click()
//     await expect(page).toHaveURL(new RegExp(`^${url}/contact`))
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > contact', status: 'passed',reason: 'Can navigate from home page to contact page'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > contact', status: 'failed',reason: 'Can\'t navigate from home page to contact page'}})}`);

//   }  
//   

// });

// test('home page > project website', async ({  }) => {
//   
//   
//   try {
//     await page.goto(`${url}`);

//     await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//     await page.getByRole('link', {name: 'Project website'}).waitFor()
//     const pagePromise = page.waitForEvent('popup')
//     await page.getByRole('link', {name: 'Project website'}).click()
//     const page1 = await pagePromise
//     await expect(page1).toHaveURL('https://cryptpad.org')
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > project website', status: 'passed',reason: 'Can navigate from home page to project website'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > project website', status: 'failed',reason: 'Can\'t navigate from home page to project website'}})}`);

//   }  
//   

// });

// test('home page > donate', async ({  }) => {
//   
//   
//   try {
//     await page.goto(`${url}`);

//     await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//     await page.getByRole('link', {name: 'Donate'}).waitFor()
//     const pagePromise = page.waitForEvent('popup')
//     await page.getByRole('link', {name: 'Donate'}).click()
//     const page1 = await pagePromise
//     await expect(page1).toHaveURL('https://opencollective.com/cryptpad/contribute')
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > donate', status: 'passed',reason: 'Can navigate from home page to donation website'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > donate', status: 'failed',reason: 'Can\'t navigate from home page to donation website'}})}`);

//   }  
//   

// });



// if (url.toString() === 'https://cryptpad.fr') {

//   test('home page > privacy policy', async ({ }) => {
//     
//     
//     try {
//       test.setTimeout(100000)
//         await page.goto(`${url}`);
  
//         await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//         await page.getByRole('link', {name: 'Privacy Policy'}).waitFor()
//         await page.getByRole('link', {name: 'Privacy Policy'}).click()
//         await expect(page).toHaveURL('https://cryptpad.fr/pad/#/2/pad/view/GcNjAWmK6YDB3EO2IipRZ0fUe89j43Ryqeb4fjkjehE/')
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > privacy', status: 'passed',reason: 'Can navigate from home page to privacy policy'}})}`);
      
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > privacy', status: 'failed',reason: 'Can\'t navigate from home page to privacy policy'}})}`);
  
//     }  
//     
  
//   });
  
//   test('home page > tos', async ({  }) => {
//     
//     
//     try {
//       test.setTimeout(100000)
//         await page.goto(`${url}`);
  
//         await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//         await page.getByRole('link', {name: 'Terms of Service'}).waitFor()
//         await page.getByRole('link', {name: 'Terms of Service'}).click()
//         await expect(page).toHaveURL('https://cryptpad.fr/code/#/2/code/view/QpPIuoUAHytCF8JjkunAPqnO7yuu1GWd3OUDwYe5ZA8/present/')
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > tos', status: 'passed',reason: 'Can navigate from home page to TOS'}})}`);
      
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus',arguments: {name: 'homepage > tos', status: 'failed',reason: 'Can\'t navigate from home page to TOS'}})}`);
  
//     }  
//     
  
//   });




// }

// //LOGGED IN USER

// test('log out', async ({  }) => {
//   
//   
//   try {
//     test.setTimeout(240000)
//     // if (url.indexOf('localhost') !== -1) {
      

//     // } else {
//       await page.goto(`${url}/login/`);
//       await page.getByPlaceholder('Username').fill('test-user');
//       await page.getByPlaceholder('Password', {exact: true}).fill('password');

//       const login = page.locator(".login")
//       await login.waitFor({ timeout: 18000 })
//       await expect(login).toBeVisible({ timeout: 18000 })
//       if (await login.isVisible()) {
//         await login.click()
//       }
//       await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//       await page.frameLocator('#sbox-frame').locator(":has-text('Account name')").waitFor()
//       await page.frameLocator('#sbox-frame').locator(":has-text('Account name')").click()
//       await page.frameLocator('#sbox-frame').locator('a', {hasText: 'Log out'}).waitFor()
//       await page.frameLocator('#sbox-frame').locator('a', {hasText: 'Log out'}).click()
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'logout', status: 'passed',reason: 'Can log out'}})}`);

//     // }
   

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'logout', status: 'failed',reason: 'Can\'t log out'}})}`);

//   }  
//   
// });

// test.afterEach(async () => {
//   await browser.close()
// });