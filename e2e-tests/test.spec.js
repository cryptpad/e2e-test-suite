// @ts-check
const { test, expect } = require('@playwright/test');
const url = 'http://localhost:3000'


// const url = 'https://cryptpad.fr'

// test('page title', async ({ page }) => {
//   try {
//     await page.goto(`${url}`);

//     await expect(page).toHaveTitle("CryptPad: Collaboration suite, encrypted and open-source");
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({name: 'test1', action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can navigate to page with correct title'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({name: 'test1', action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t navigate to page with correct title'}})}`);

//   }  

// });


// test('sign up', async ({ page }) => {
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
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can sign up'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t sign up'}})}`);

//   }  
// })


// test('log in', async ({ page }) => {
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
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can log in'}})}`);

//     // }
   

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t log in'}})}`);

//   }  
// });



// test('rich text doc - anon', async ({ page }) => {
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);

//     await page.getByRole('link', { name: 'Rich Text' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/pad/#/`), { timeout: 100000 })
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })

//     await iframe.click()
//     await iframe.type('Test text')
//     // await expect(iframe.locator('body').textContent()).toBe('Test text')

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({name: 't1', action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Rich Text document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({name: 't1', action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Rich Text document'}})}`);

//   }  

// });

// test('sheet doc - anon', async ({ page }) => {
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
//     await page.getByRole('link', { name: 'Sheet' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/sheet/#/`), { timeout: 100000 })
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })

//     // await iframe.click()
//     // await iframe.type('Test text')
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({name: 't2', action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Form'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({name: 't2', action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Form'}})}`);

//   }  

// });

// test('kanban board - anon', async ({ page }) => {
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
//     await page.getByRole('link', { name: 'Kanban' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(20000)
//      await expect(page).toHaveURL(new RegExp(`^${url}/kanban/#/`), { timeout: 100000 })
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })

//     // await iframe.click()
//     // await iframe.type('Test text')
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({name: 't3', action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({name: 't3', action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  

// });

// test('code doc - anon', async ({ page }) => {
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
//     await page.getByRole('link', { name: 'Code' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/code/#/`), { timeout: 100000 })
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })

//     // await iframe.click()
//     // await iframe.type('Test text')
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Code document'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Code document'}})}`);

//   }  

// });

// test('form - anon', async ({ page }) => {
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
//     await page.getByRole('link', { name: 'Form' }).click();
//     await page.waitForLoadState('networkidle');
//      await expect(page).toHaveURL(new RegExp(`^${url}/form/#/`), { timeout: 100000 })
//     await page.waitForTimeout(20000)
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })

//     // await iframe.click()
//     // await iframe.type('Test text')
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Form'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Form'}})}`);

//   }  

// });

// test('markdown - anon', async ({ page }) => {
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
//     await page.getByRole('link', { name: 'Code' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/code/#/`), { timeout: 100000 }) 
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })

//     // await iframe.click()
//     // await iframe.type('Test text')
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

//   }  

// });

// test('whiteboard - anon', async ({ page }) => {
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
//     await page.getByRole('link', { name: 'Whiteboard' }).click();
//     await expect(page).toHaveURL(new RegExp(`^${url}/whiteboard/#/`), { timeout: 100000 }) 
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(20000)
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })

//     // await iframe.click()
//     // await iframe.type('Test text')
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Whiteboard'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Whiteboard'}})}`);

//   }  

// });

test('drive - anon', async ({ page }) => {
  try {
    test.setTimeout(2400000)
    await page.goto(`${url}`);
    await page.getByRole('link', { name: 'Drive' }).click();
    await expect(page).toHaveURL(`${url}/drive/`, { timeout: 100000 })
    await page.goto(`${url}/drive/`);
    
    //the iframe is detected and can be selected with either .locator() or .frameLocator()
    const iframe = page.locator('#sbox-iframe')
    const frame = page.frameLocator('#sbox-frame');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000)

    //it can be seen in the page.content() that the iframe is present but there is nothing inside
    const html = await page.content()
    console.log(html)

    //I placed a console.log() targetting an element in the iframe on drive/inner.js -- its content prints and can be seen in the page tree produced below 
    // console.log(page)

    //but the same element isn't picked up by the Playwright .locator()
    // const driveDiv = frame.locator('#cp-app-drive-content');
    // await driveDiv.waitFor({ timeout: 24000 })

    //alternately
    const driveText = frame.getByText('Drive')
    await driveText.waitFor({ timeout: 24000 })

   
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously navigate to Drive'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously navigate to Drive'}})}`);

  }  

});

// test('page title', async ({ page }) => {
//   try {
//     await page.goto(`${url}`);

   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Kanban board'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Kanban board'}})}`);

//   }  

// });

// test('page title', async ({ page }) => {
//   try {
//     await page.goto(`${url}`);

   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Can anonymously create Form'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Can\'t anonymously create Form'}})}`);

//   }  

// });
