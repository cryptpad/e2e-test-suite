const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');


// const url = 'http://localhost:3000'
const url = 'https://cryptpad.fr'

const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form'] 
// const docNames = ['pad'] 


let browser;
let page;

test.beforeEach(async ({}, testInfo) => {
  const name = testInfo.project.name
  if (name.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (name.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }
  page = await browser.newPage();
  await page.goto(`${url}`);
});


// docNames.forEach(function(name) {

//     test(`${name} - create anonymously`, async ({  }) => {

//         try {
//           test.setTimeout(240000)
//           await page.goto(`${url}`);
//           if (name === 'pad') {
//             await page.getByRole('link', { name: 'Rich text' }).click();
//           } else {
//             await page.getByRole('link', { name: `${name}` }).click();
//           }

//           await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })
//           const iframe = page.locator('#sbox-iframe')
      
//           await expect(iframe).toBeVisible({ timeout: 24000 })
          
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon ${name}` , status: 'passed',reason: `Can anonymously create ${name}`}})}`);
//         } catch (e) {
//           console.log(e);
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon ${name}`, status: 'failed',reason: `Can\'t anonymously create ${name}`}})}`);
      
//         }  
//     });
    
//     test(`${name} - create anonymously - store - delete`, async ({ }) => {
//         test.setTimeout(240000)
//         try {
          
//           await page.goto(`${url}`);
//           if (name === 'pad') {
//             await page.getByRole('link', { name: 'Rich text' }).click();
//           } else {
//             await page.getByRole('link', { name: `${name}` }).click();
//           }

//           await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })
      
//           const date = new Date()
      
//           var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
//           var weekday = days[date.getDay()]
          
//           var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
//           var month = months[date.getMonth()]

//           var title;
//           if (name === 'pad') {
//             title = `Rich text - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
//           } else if (name === 'slide') {
//             title = `Markdown slides - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
//           } else {
//             const titleName = name.charAt(0).toUpperCase() + name.slice(1)
//             title = `${titleName} - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
//           }
      
          
//           await expect(page).toHaveTitle(title)
      
//           await expect(page.frameLocator('#sbox-iframe').getByText('This pad is not in your CryptDrive')).toBeVisible();
//           await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click()
//           await page.waitForTimeout(10000)
      
//           await page.goto(`${url}/drive`);
      
//           await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toBeVisible();
//           await page.frameLocator('#sbox-iframe').getByText(`${title}`).click()
//           await page.frameLocator('#sbox-iframe').getByText(`${title}`).click({ button: 'right' })
//           if (page.frameLocator('#sbox-iframe').getByText('Move to trash').isVisible())  {
//             await page.frameLocator('#sbox-iframe').getByText('Move to trash').click()
//           } else {
//             await page.frameLocator('#sbox-iframe').getByText('Remove').first().click()
//           }

//           await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//           await page.waitForTimeout(50000)

//           await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)
      
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon ${name} > store`, status: 'passed',reason: `Can anonymously create ${name} in Drive and store`}})}`);
//         } catch (e) {
//           console.log(e);
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon ${name} > store`, status: 'failed',reason: `Can\'t anonymously create ${name} in Drive and store`}})}`);
      
//         }  
      
      
//     });
    
    
      
//     test(`${name} - anon - change title`, async () => {
//         try {
//           test.setTimeout(240000)
//           await page.goto(`${url}`);
//           if (name === 'pad') {
//             await page.getByRole('link', { name: 'Rich text' }).click();
//           } else {
//             await page.getByRole('link', { name: `${name}` }).click();
//           }

//           await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })
//           const iframe = page.locator('#sbox-iframe')
      
//           await expect(iframe).toBeVisible({ timeout: 24000 })
      
//           const date = new Date()
      
//           var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
//           var weekday = days[date.getDay()]
          
//           var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
//           var month = months[date.getMonth()]
      
//           var title;
//           if (name === 'pad') {
//             title = `Rich text - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
//           } else if (name === 'slide') {
//             title = `Markdown slides - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
//           } else {
//             const titleName = name.charAt(0).toUpperCase() + name.slice(1)
//             title = `${titleName} - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
//           }
//           await expect(page).toHaveTitle(title)
      
      
//           await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
//           await page.frameLocator('#sbox-iframe').getByPlaceholder(title).fill('new doc title');
//           await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
//           await expect(page.frameLocator('#sbox-iframe').getByText('new doc title')).toBeVisible()
      
          
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name}`, status: 'passed',reason: `Can change ${name} title`}})}`);
//         } catch (e) {
//           console.log(e);
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `${name}`, status: 'failed',reason: `Can change ${name} title`}})}`);
      
//         }  
//     });
      
      
//     test(`drive - anon - ${name}`, async () => {
      
//         try {
//         test.setTimeout(2400000)
//         await page.goto(`${url}/drive`);

      
//         await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().waitFor()
//         await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click();
//         const page1Promise = page.waitForEvent('popup');
        
//         await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().waitFor()
//         if (name === 'pad') {
//             await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Rich text' }).click();
            
//           } else {
//             await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: `${name}` }).click();
//           }
//         const page1 = await page1Promise;
//         await page1.waitForLoadState('networkidle');
//         await page1.waitForTimeout(50000)
//         await page1.frameLocator('#sbox-iframe').locator('body').waitFor()
//         await expect(page1).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })
      
         
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive > ${name}`, status: 'passed',reason: 'Can anonymously navigate to Drive and create Kanban'}})}`);
//         } catch (e) {
//           console.log(e);
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive > ${name}`, status: 'failed',reason: 'Can\'t anonymously navigate to Drive and create Kanban'}})}`);
      
//         }  
      
//       });
    
//     test(`drive - user - ${name}` , async ({  }) => {
//         try {
//           test.setTimeout(240000)
//           await page.goto(`${url}/login/`);
//           await page.getByPlaceholder('Username').fill('test-user');
//           await page.waitForTimeout(10000)
//           await page.getByPlaceholder('Password', {exact: true}).fill('password');
//           await page.waitForLoadState('networkidle');
//           const login = page.locator(".login")
//           await login.waitFor({ timeout: 18000 })
//           await expect(login).toBeVisible({ timeout: 1800 })
//           if (await login.isVisible()) {
//               await login.click()
//           }
        
//           await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
  
  
//           const page1Promise = page.waitForEvent('popup');
  
                  
//           await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).locator('span').first().click();
//           if (name === 'pad') {
//               await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Rich text$/ }).locator('span').first().click();
//           } else {
//               await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-new-ghost-dialog').getByText(`${name}`).click()

//           }
//           const page1 = await page1Promise;
//           await page1.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
//           await expect(page1).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })
          
          
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive - user - ${name}`, status: 'passed',reason: `Can log in and create ${name} from Drive`}})}`);
//     } catch (e) {
//         console.log(e);
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive - user - ${name}`, status: 'failed',reason: `Can\'t log in and create ${name} from Drive`}})}`);
      
//     }  
// });

// // test(`${name} - create anonymously`, async () => {
// //     try {
// //       if (name === 'pad') {
// //         await page.getByRole('link', { name: 'Rich text' }).click();
// //       } else {
// //         await page.getByRole('link', { name: `${name}` }).click();
// //       }

// //       await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })
// //       const iframe = page.locator('#sbox-iframe')
  
// //       await expect(iframe).toBeVisible({ timeout: 24000 })
// //       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
// //       await page.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
// //       await page.frameLocator('#sbox-iframe').getByText('You must store this document in your CryptDrive').click();
// //       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      
// //       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon ${name}` , status: 'passed',reason: `Can anonymously create ${name}`}})}`);
// //     } catch (e) {
// //       console.log(e);
// //       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon ${name}`, status: 'failed',reason: `Can\'t anonymously create ${name}`}})}`);
  
// //     }  
// // });

// // test(`${name} - create anonymously - store - delete`, async ({ }) => {
// //     test.setTimeout(240000)
// //     try {
      
// //       await page.goto(`${url}`);
// //       if (name === 'pad') {
// //         await page.getByRole('link', { name: 'Rich text' }).click();
// //       } else {
// //         await page.getByRole('link', { name: `${name}` }).click();
// //       }

// //       await expect(page).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })
  
// //       const date = new Date()
  
// //       var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
// //       var weekday = days[date.getDay()]
      
// //       var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
// //       var month = months[date.getMonth()]

// //       var title;
// //       if (name === 'pad') {
// //         title = `Rich text - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
// //       } else if (name === 'slide') {
// //         title = `Markdown slides - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
// //       } else {
// //         const titleName = name.charAt(0).toUpperCase() + name.slice(1)
// //         title = `${titleName} - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
// //       }
  
      
// //       await expect(page).toHaveTitle(title)
  
// //       await expect(page.frameLocator('#sbox-iframe').getByText('This pad is not in your CryptDrive')).toBeVisible();
// //       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click()

// //       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
// //       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Move to trash' }).click();
// //       await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      

// //       await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)
  
// //       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon ${name} > store`, status: 'passed',reason: `Can anonymously create ${name} in Drive and store`}})}`);
// //     } catch (e) {
// //       console.log(e);
// //       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon ${name} > store`, status: 'failed',reason: `Can\'t anonymously create ${name} in Drive and store`}})}`);
  
// //     }  
  
  
// // });

// })


  

test.afterEach(async () => {
  await browser.close()
});