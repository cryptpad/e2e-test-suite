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

// test('drive - anon - markdown', async ({ }) => {
//   
//   

//     try {
//         test.setTimeout(240000)
//         await page.goto(`${url}`);
//         await page.getByRole('link', { name: 'Drive' }).click();
//         await expect(page).toHaveURL(`${url}/drive/`, { timeout: 100000 })
//         await page.goto(`${url}/drive/`);
        

//         await page.waitForLoadState('networkidle');
//         await page.waitForTimeout(20000)

//         await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().waitFor()
//         await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click();
//         const page1Promise = page.waitForEvent('popup');
        
//         await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().waitFor()
//         await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Markdown slides' }).click();
//         const page1 = await page1Promise;
//         await page1.waitForLoadState('networkidle');
//         await page1.waitForTimeout(50000)
//         await page1.frameLocator('#sbox-iframe').locator('body').waitFor()
//         await expect(page1).toHaveURL(new RegExp(`^${url}/slide/#/`), { timeout: 100000 })

    
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > markdown', status: 'passed',reason: 'Can anonymously navigate to Drive and create Markdown slides'}})}`);
//     } catch (e) {
//         console.log(e);
//         await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive > markdown', status: 'failed',reason: 'Can\'t anonymously navigate to Drive and create Markdown slides'}})}`);

//     }  
//     

// });



// test('markdown - anon', async ({ }) => {
//   
//   try {
//     test.setTimeout(240000)
//     await page.goto(`${url}`);
//     await page.getByRole('link', { name: 'Markdown slides' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(20000)
//     await expect(page).toHaveURL(new RegExp(`^${url}/slide/#/`), { timeout: 100000 }) 
//     const iframe = page.locator('#sbox-iframe')

//     await expect(iframe).toBeVisible({ timeout: 24000 })

//     // await iframe.click()
//     // await iframe.type('Test text')
   
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'passed',reason: 'Can anonymously create Markdown slides'}})}`);
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'markdown', status: 'failed',reason: 'Can\'t anonymously create Markdown slides'}})}`);

//   }  
//   

// });

// test.afterEach(async () => {
//   await browser.close()
// });