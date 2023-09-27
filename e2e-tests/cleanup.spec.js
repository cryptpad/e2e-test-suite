const { url, titleDate, testUser2Password, testUser3Password } = require('../browserstack.config.js')
const { test, expect, firefox, chromium, webkit } = require('@playwright/test');

let page;
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

});

const toDelete = ['Sheet - ', 'Rich text - ', 'Kanban -', 'Markdown slides - ', 'Diagram - ', 'Whiteboard - ', 'Form - ']

// toDelete.forEach((file) => {
    
    // test(`test-user drive - cleanup leftover files - ${file}`, async ({ }) => {

    //     try {
    
    //         const context = await browser.newContext({ storageState: 'auth/mainuser.json' });
    //         page = await context.newPage();
    //         await page.goto(`${url}/drive`)
    //         await page.waitForTimeout(10000)
    //         let elementCount = await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({hasText: file}).count()
    
    //         if (elementCount > 0) {
    //             while (elementCount > 0) {
                    
    //                 if (elementCount > 1) {
    //                     await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${file}`).nth(elementCount-1).click({ button: 'right' })
    //                 } else {
    //                     await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${file}`).click({ button: 'right' })
    //                 }
    //                 await page.waitForTimeout(3000)
    //                 await page.frameLocator('#sbox-iframe').getByText('Destroy').click()
    //                 await page.waitForTimeout(3000)
    //                 await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    //                 await page.waitForTimeout(10000)
    //                 elementCount = elementCount-1
    //                 console.log(elementCount)
    //                 console.log('done')
    //             }
    //         }
    //         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'passed',reason: 'Can close and open Form'}})}`);
  
    //     } catch (e) {
    //       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'failed',reason: 'Can\'t close and open Form'}})}`);
      
    //       console.log(e);
    //     }
    //   });

//       test(`test-user drive - cleanup leftover files - ${file}`, async ({ }) => {

//         try {
    
//             const context = await browser.newContext({ storageState: 'auth/mainuser.json' });
//             page = await context.newPage();
//             await page.goto(`${url}/teams`)
//             await page.waitForTimeout(5000)
//             await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
//             await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({timeout:3000});
//             await page.waitForTimeout(5000)
//             let elementCount = await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({hasText: file}).count()
    
//             if (elementCount > 0) {
//                 while (elementCount > 0) {
                    
//                     if (elementCount > 1) {
//                         await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${file}`).nth(elementCount-1).click({ button: 'right' })
//                     } else {
//                         await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${file}`).click({ button: 'right' })
//                     }
//                     await page.waitForTimeout(3000)
//                     await page.frameLocator('#sbox-iframe').getByText('Destroy').click()
//                     await page.waitForTimeout(3000)
//                     await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//                     await page.waitForTimeout(10000)
//                     elementCount = elementCount-1
//                     console.log(elementCount)
//                     console.log('done')
//                 }
//             }
//             await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'passed',reason: 'Can close and open Form'}})}`);
  
//         } catch (e) {
//           await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'failed',reason: 'Can\'t close and open Form'}})}`);
      
//           console.log(e);
//         }
//       });
      

// })

// test(`test-user drive - cleanup templates`, async ({ }) => {

//     try {

//         const context = await browser.newContext({ storageState: 'auth/mainuser.json' });
//         page = await context.newPage();
//         await page.goto(`${url}/drive`)
//         await page.waitForTimeout(5000)
//         await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Templates' }).first().click();

//         await page.waitForTimeout(5000)
//         let elementCount = await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').filter({hasText: 'template'}).count()
//         console.log(elementCount)
//         if (elementCount > 0) {
//             while (elementCount > 0) {
                
//                 if (elementCount > 1) {
//                     await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({hasText: 'template'}).nth(elementCount-1).click({ button: 'right' })
//                 } else {
//                     await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({hasText: 'template'}).click({ button: 'right' })
//                 }
//                 await page.waitForTimeout(3000)
//                 await page.frameLocator('#sbox-iframe').getByText('Destroy').click()
//                 await page.waitForTimeout(3000)
//                 await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
//                 await page.waitForTimeout(10000)
//                 elementCount = elementCount-1
//                 console.log(elementCount)
//                 console.log('done')
//             }
//         }
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'passed',reason: 'Can close and open Form'}})}`);

//     } catch (e) {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'failed',reason: 'Can\'t close and open Form'}})}`);
  
//       console.log(e);
//     }
//   });

// test(`cleanup user notifications`, async ({ }) => {

//     try {

//         //clear test-user notifications
//         const context = await browser.newContext({ storageState: 'auth/mainuser.json' });
//         page = await context.newPage();
//         await page.goto(`${url}/drive`)
//         await page.waitForTimeout(5000)
//         await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
//         await page.waitForTimeout(5000)
//         const page1Promise = page.waitForEvent('popup');
//         await page.frameLocator('#sbox-iframe').getByText('Open notifications panel').click();
//         const page1 = await page1Promise;
//         await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Notifications - All$/ }).locator('div').nth(1).click();
//         await page1.waitForTimeout(5000)

//         //clear testuser notifications
//         const context2 = await browser.newContext({ storageState: 'auth/testuser.json' });
//         const page2 = await context2.newPage();
//         await page2.goto(`${url}/drive`)
//         await page2.waitForTimeout(5000)
//         await page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
//         await page2.waitForTimeout(5000)
//         const page3Promise = page2.waitForEvent('popup');
//         await page2.frameLocator('#sbox-iframe').getByText('Open notifications panel').click();
//         const page3 = await page3Promise;
//         await page3.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Notifications - All$/ }).locator('div').nth(1).click();
//         await page3.waitForTimeout(5000)

//         // remove test-user2 notifications
//         const context3 = await browser.newContext({ storageState: 'auth/testuser2.json' });
//         const page4 = await context3.newPage();
//         await page4.goto(`${url}/drive`)
//         await page4.waitForTimeout(5000)
//         await page4.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
//         await page4.waitForTimeout(5000)
//         const page5Promise = page4.waitForEvent('popup');
//         await page4.frameLocator('#sbox-iframe').getByText('Open notifications panel').click();
//         const page5 = await page5Promise;
//         await page5.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Notifications - All$/ }).locator('div').nth(1).click();
//         await page5.waitForTimeout(5000)

//         // //remove test-user3 notifications
//         const context4 = await browser.newContext({ storageState: 'auth/testuser3.json' });
//         const page6 = await context4.newPage();
//         await page6.goto(`${url}/drive`)
//         await page6.waitForTimeout(5000)
//         await page6.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click()
//         await page6.waitForTimeout(5000)
//         const page7Promise = page6.waitForEvent('popup');
//         await page6.frameLocator('#sbox-iframe').getByText('Open notifications panel').click();
//         const page7 = await page7Promise;
//         await page7.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Notifications - All$/ }).locator('div').nth(1).click();
//         await page7.waitForTimeout(5000)

//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'passed',reason: 'Can close and open Form'}})}`);

//     } catch (e) {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'failed',reason: 'Can\'t close and open Form'}})}`);
  
//       console.log(e);
//     }
//   });

test(`cleanup team membership`, async ({ }) => {

  try {

      const context = await browser.newContext({ storageState: 'auth/mainuser.json' });
      page = await context.newPage();
      await page.goto(`${url}/teams`)
      await page.waitForTimeout(5000)

      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
      await page.waitForTimeout(2000)
      await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({timeout:3000});
  
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
      await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

      if (await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'}).isVisible()) {
        await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'}).locator('.fa.fa-times').click();

      }

      if (await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').isVisible()) {
        while (await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').isVisible()) {
          await page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').click();
        }
      }


      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'passed',reason: 'Can close and open Form'}})}`);

  } catch (e) {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'cleanup leftover files and notifications', status: 'failed',reason: 'Can\'t close and open Form'}})}`);

    console.log(e);
  }
});





  

  
  test.afterEach(async () => {
    await browser.close()
  });
  