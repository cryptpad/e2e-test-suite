const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');

const url = 'https://cryptpad.fr'

let browser;
let page;
let pageOne;

test.beforeEach(async ({}, testInfo) => {
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
  await page.goto(`${url}/login/`);
  await page.getByPlaceholder('Username').fill('test-user');
  await page.waitForTimeout(10000)
  await page.getByPlaceholder('Password', {exact: true}).fill('password');
  // await page.waitForLoadState('networkidle');
  const login = page.locator(".login")
  await login.waitFor({ timeout: 18000 })
  await expect(login).toBeVisible({ timeout: 1800 })
  if (await login.isVisible()) {
    await login.click()
  }
  await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000)

});

// test('sign up and delete account', async () => {
  
//   try {
//     const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
//     await menu.waitFor()
//     await menu.click()
//     await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
//     await expect(page).toHaveURL(`${url}`, { timeout: 100000 })
    
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

//     await page.waitForURL(`${url}/drive`)

//     await menu.click()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
//     const pagePromise = page.waitForEvent('popup')
//     await page.frameLocator('#sbox-iframe').getByText('Settings').click()
//     const page1 = await pagePromise
//     await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
//     await expect(page1.frameLocator('#sbox-iframe').getByText('Delete your account')).toBeVisible()
//     await expect(page1.frameLocator('#sbox-iframe').getByText('Delete your account')).click()
//     await expect(page1.frameLocator('#sbox-iframe').getByText('Are you sure?')).click()
    

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'register', status: 'passed',reason: 'Can sign up'}})}`);

//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'register', status: 'failed',reason: 'Can\'t sign up'}})}`);

//   }  
// })



// test('user - add and remove other user as contact', async () => {


//   try {

//     await page.goto('https://cryptpad.fr/profile/#/2/profile/view/v5coYdvAKofy2fZkWZoAelB8KVey7SxFbDweAMZ-R3I/');
//     await page.waitForTimeout(10000)

//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()

//     ///
//     const context = await browser.newContext();
//     pageOne = await context.newPage();
//     await pageOne.goto(`${url}/login/`);
//     await pageOne.getByPlaceholder('Username').fill('test-user2');
//     await pageOne.waitForTimeout(10000)
//     await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
//     const login = pageOne.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//       await login.click()
//     }
//     await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//     await pageOne.waitForLoadState('networkidle');
//     await pageOne.waitForTimeout(10000)

//     const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
//     await notifsOne.waitFor({ timeout: 100000 })
//     await notifsOne.click()
//     await pageOne.waitForTimeout(5000)

//     await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor()
//     await pageOne.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
//     await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
//     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
//     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
//     await pageOne.close()
//     ////

//     await page.goto(`${url}/drive/`)
//     await page.waitForTimeout(10000)
//     const notifs = page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
//     await notifs.waitFor({ timeout: 100000 })
//     await notifs.click()
//     await page.waitForTimeout(5000)
//     if (await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').isHidden()) {
//       await notifs.click()
//       await page.waitForTimeout(5000)
//     }
//     await page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request').waitFor()
//     await expect(page.frameLocator('#sbox-iframe').getByText('test-user2 accepted your contact request')).toBeVisible();

//     await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: 'test-user2 accepted your contact request' }).locator('div').nth(1).click()
//     await page.goto('https://cryptpad.fr/profile/#/2/profile/view/v5coYdvAKofy2fZkWZoAelB8KVey7SxFbDweAMZ-R3I/');
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove this contact' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to remove test-user2 from your contacts?')).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();

       
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive', status: 'passed',reason: 'Can navigate to Drive as user and delete account'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive', status: 'failed',reason: 'Can\'t anonymously navigate and delete account'}})}`);

//   }  
// });




// test('drive - user - request and cancel to add user as contact', async () => {

//   try {

//     await page.goto('https://cryptpad.fr/profile/#/2/profile/view/v5coYdvAKofy2fZkWZoAelB8KVey7SxFbDweAMZ-R3I/');
//     await page.waitForTimeout(10000)

//     if ( await page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel').count() === 1) {
//       await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Cancel'}).click();
//       await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to cancel your contact request with test-user2?')).toBeVisible();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();

//     }
    
//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).waitFor()
//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'}).click()
//     await expect(page.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible()
//     await page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'Cancel'}).click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('Are you sure you want to cancel your contact request with test-user2?')).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await expect(page.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request'})).toBeVisible()

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'passed',reason: 'Can request to add user as contact'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'failed',reason: 'Can\'t request to add user as contact'}})}`);

//   }  
// });

// test('drive - user - invite contact to team and cancel', async () => {
    
//     try {
//       await page.goto(`${url}/teams/`);
//       await page.waitForTimeout(10000)
//       await page.waitForLoadState('networkidle');
      
//       await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
//       await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});

//       if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
//         await page.waitForTimeout(10000)
//         await page.waitForLoadState('networkidle');
      
//         await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
//         await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});
//       }
//       await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
//       await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
//       await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
//       await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()
//       await page.waitForLoadState('networkidle')
//       await page.frameLocator('#sbox-iframe').getByText('tetestuser', { exact: true }).waitFor()
//       await expect(page.frameLocator('#sbox-iframe').getByText('tetestuser', { exact: true })).toBeVisible();
//       await page.frameLocator('#sbox-iframe').locator('.cp-online > .fa').first().waitFor()
//       await page.frameLocator('#sbox-iframe').locator('.cp-online > .fa').first().click()
//       await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//       await page.waitForTimeout(1800)
//       const user = page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })
//       await expect(user).toBeHidden({ timeout: 100000 })

//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > add contact to team > remove', status: 'passed',reason: 'Can navigate to Drive as user and create a team'}})}`);
//     } catch (e) {
//       console.log(e);
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > add contact to team > remove', status: 'failed',reason: 'Can\'t navigate to Drive as user and create a team'}})}`);
  
//     }   
//   });

// test('user - add contact to team and remove them', async () => {


//   try {

//     await page.goto(`${url}/teams/`);
//     await page.waitForTimeout(10000)
//     await page.waitForLoadState('networkidle');
    
//     await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
//     await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});

//     if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
//       await page.waitForTimeout(10000)
//       await page.waitForLoadState('networkidle');
    
//       await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
//       await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});
//     }
//     await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
//     await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
//     await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
//     await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()

//     ///
//     const context = await browser.newContext();
//     pageOne = await context.newPage();
//     await pageOne.goto(`${url}/login/`);
//     await pageOne.getByPlaceholder('Username').fill('testuser');
//     await pageOne.waitForTimeout(10000)
//     await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
//     const login = pageOne.locator(".login")
//     await login.waitFor({ timeout: 18000 })
//     await expect(login).toBeVisible({ timeout: 1800 })
//     if (await login.isVisible()) {
//       await login.click()
//     }
//     await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
//     await pageOne.waitForTimeout(10000)

//     const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
//     await notifsOne.waitFor({ timeout: 100000 })
//     await notifsOne.click()
//     await pageOne.waitForTimeout(5000)

//     await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').waitFor()
//     await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click();
//     await pageOne.waitForTimeout(3000)
//     await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' })).toBeVisible()
//     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
//     await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
//     await pageOne.waitForTimeout(5000)
//     await pageOne.goto(`${url}/teams`)
//     await pageOne.waitForTimeout(5000)
//     await pageOne.reload()
//     await expect(pageOne.frameLocator('#sbox-iframe').getByText('tttest team')).toBeVisible()
//     await pageOne.close()
//     ////


//     await page.reload()
//     await page.waitForTimeout(10000)
//     await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
//     await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});

//     if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
//       await page.waitForTimeout(10000)
//       await page.waitForLoadState('networkidle');
    
//       await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
//       await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});
//     }
//     await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
//     await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
//     const user = page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })
//     await expect(user).toBeVisible({ timeout: 100000 })
//     await page.frameLocator('#sbox-iframe').locator('.cp-online > span:nth-child(2)').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('testuser will know that you removed them from the team. Are you sure?')).toBeVisible();
//     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await page.waitForTimeout(1800)
    
//     await expect(user).toBeHidden({ timeout: 100000 })

       
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive', status: 'passed',reason: 'Can navigate to Drive as user and delete account'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive', status: 'failed',reason: 'Can\'t anonymously navigate and delete account'}})}`);

//   }  
// });


test('user - add contact to team and contact leaves team', async () => {


  try {

    await page.goto(`${url}/teams/`);
    await page.waitForTimeout(10000)
    await page.waitForLoadState('networkidle');
    
    await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
    await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)
      await page.waitForLoadState('networkidle');
    
      await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
      await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click()
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('testuser').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', {name: 'Invite', exact: true}).click()

    ///
    const context = await browser.newContext();
    pageOne = await context.newPage();
    await pageOne.goto(`${url}/login/`);
    await pageOne.getByPlaceholder('Username').fill('testuser');
    await pageOne.waitForTimeout(10000)
    await pageOne.getByPlaceholder('Password', {exact: true}).fill('password');
    const login = pageOne.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(pageOne).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await pageOne.waitForTimeout(10000)

    const notifsOne = pageOne.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
    await notifsOne.waitFor({ timeout: 100000 })
    await notifsOne.click()
    await pageOne.waitForTimeout(5000)

    await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click();
    await pageOne.waitForTimeout(3000)
    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' })).toBeVisible()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    await pageOne.waitForTimeout(5000)
    await pageOne.goto(`${url}/teams`)
    await pageOne.waitForTimeout(5000)
    await pageOne.reload()
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('tttest team')).toBeVisible()
    await pageOne.frameLocator('#sbox-iframe').getByText('tttest team').click()
    await pageOne.waitForTimeout(5000)
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await pageOne.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    await pageOne.frameLocator('#sbox-iframe').getByText('Leave this team').click()
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await pageOne.waitForTimeout(5000)
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('tttest team')).toHaveCount(0)
    await pageOne.close()
    ////

    await page.reload()
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
    await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});

    if (await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().count() === 0) {
      await page.waitForTimeout(10000)
      await page.waitForLoadState('networkidle');
    
      await page.frameLocator('#sbox-iframe').getByText('tttest team').waitFor();
      await page.frameLocator('#sbox-iframe').getByText('tttest team').click({force: true});
    }
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()
    const user = page.frameLocator('#sbox-iframe').getByText('testuser', { exact: true })

    await expect(user).toHaveCount(0)
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive', status: 'passed',reason: 'Can navigate to Drive as user and delete account'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive', status: 'failed',reason: 'Can\'t anonymously navigate and delete account'}})}`);

  }  
});

// test('drive - user - user menu - make and delete team ', async () => {
  
//   try {
//     const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
//     await menu.waitFor()
//     await menu.click()
//     await expect(page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Teams$/ })).toBeVisible()
    
//     const pagePromise = page.waitForEvent('popup')
//     await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Teams$/ }).click()
//     const page1 = await pagePromise

//     await expect(page1).toHaveURL(`${url}/teams/`, { timeout: 100000 })
//     await page1.frameLocator('#sbox-iframe').getByText('Available team slotNew').first().click();

//     await page1.waitForLoadState('networkidle');

//     await page1.frameLocator('#sbox-iframe').getByRole('textbox').fill('example team')
//     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
//     await page1.waitForLoadState('networkidle');
//     await page1.waitForTimeout(10000)
//     await expect(page1).toHaveURL(`${url}/teams/`, { timeout: 100000 })
//     await page1.waitForLoadState('networkidle');

//     await page1.frameLocator('#sbox-iframe').getByText('example team').first().waitFor({ timeout: 10000 })
//     await page1.frameLocator('#sbox-iframe').getByText('example team').first().click()s
//     await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-leftside').hover();
//     await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();
//     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
//     await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//     await page1.frameLocator('#sbox-iframe').getByText('Available team slotNew').first().click();
//     await expect(page.frameLocator('#sbox-iframe').getByText('example team', { exact: true })).toHaveCount(0)

//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'passed',reason: 'Can navigate to Drive as user and create a team'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'user drive > make team', status: 'failed',reason: 'Can\'t navigate to Drive as user and create a team'}})}`);

//   }  
// });




test.afterEach(async () => {
  await browser.close()
});