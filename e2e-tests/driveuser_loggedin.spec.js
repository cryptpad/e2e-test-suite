const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')

var fs = require('fs');
var unzipper = require('unzipper');

let browser;
let page;

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


const userMenuItems = ['profile', 'contacts', 'calendar', 'support', 'teams', 'log out'] 

userMenuItems.forEach(function(item) {

  test(`drive -  user menu - ${item}`, async ({ }) => {   
  
    try {
      const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
      await menu.waitFor()
      await menu.click()
      if (item === 'log out') {
        await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: /^Log out$/ }).click()
        await expect(page).toHaveURL(`${url}`, { timeout: 100000 })
        await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible()
      } else {
        const pagePromise = page.waitForEvent('popup')
        await page.frameLocator('#sbox-iframe').locator('a').filter({ hasText: `${item}` }).click()
        const page1 = await pagePromise
        await expect(page1).toHaveURL(`${url}/${item}/`, { timeout: 100000 })
      }

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive - user menu - ${item}`, status: 'passed',reason: `Can access ${item} from Drive menu`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `drive - user menu - ${item}`, status: 'failed',reason: `Can\'t access ${item} from Drive menu`}})}`);

    }    
  });

})

test('drive -  upgrade account', async ({ }) => {   
    
  try {
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Upgrade account').click()
    const page1 = await pagePromise

    await expect(page1).toHaveURL(`${url}/accounts/#`, { timeout: 100000 })

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - upgrade account', status: 'passed',reason: 'Can upgrade account from Drive'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - upgrade account', status: 'failed',reason: 'Can\'t upgrade account from Drive'}})}`);

  }    
  });

test('drive -  upload file', async ({ }) => {   
    
  try {
    const fileChooserPromise = page.waitForEvent('filechooser');
  
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Upload files' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/myfile.doc');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    if  (await page.frameLocator('#sbox-iframe').getByText('You already have an upload in progress. Cancel it and upload your new file?').count() == 1) {
      console.log('upload in progress')
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    }
    
    await page.waitForTimeout(5000)
    await page.frameLocator('#sbox-iframe').getByText('Your file (myfile.doc) has been successfully uploaded and added to your').waitFor()

    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('myfile.doc').click({ button: 'right' });
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    await page.waitForTimeout(10000)
    if (await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).isVisible()) {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      await page.waitForTimeout(10000)
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).click()
    } else {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      await page.waitForTimeout(10000)
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Remove' }).last().click()
      
    }
    await expect(page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('myfile.doc')).toHaveCount(0)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - upload file', status: 'passed',reason: 'Can upload a file in Drive'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - upload file', status: 'failed',reason: 'Can\'t upload a file in Drive'}})}`);

  }    
});
    


test('drive -  recent files', async ({ }) => {   
    
  try {
    const page1Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).locator('span').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Rich text$/ }).locator('span').first().click();

    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
    
    var title = `Rich text - ${titleDate}`;
    await page1.waitForTimeout(10000)
    await page1.close()
    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Recent' }).first().click();
    await expect(page.frameLocator('#sbox-iframe').getByText(title)).toBeVisible()
    await page.frameLocator('#sbox-iframe').getByText(`${title}`).click({ button: 'right' })
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    await page.waitForTimeout(10000)
    if (await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).isVisible()) {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      await page.waitForTimeout(10000)
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).click()
    } else {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      await page.waitForTimeout(10000)
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Remove' }).last().click()
      
    }
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - recent files', status: 'passed',reason: 'Can access recent files in Drive'}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - recent files', status: 'failed',reason: 'Can\'t access recent files in Drive'}})}`);

  }    
  });

test('drive -  empty trash', async ({ }) => {   
    
    try {
      const page1Promise = page.waitForEvent('popup');
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).locator('span').first().click();
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Rich text$/ }).locator('span').first().click();

      const page1 = await page1Promise;
      await page1.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
  
      var title = `Rich text - ${titleDate}`;
      await page1.waitForTimeout(10000)
      await page1.close()
      await page.waitForTimeout(10000)
      await expect(page.frameLocator('#sbox-iframe').getByText(title)).toBeVisible()
      await page.frameLocator('#sbox-iframe').getByText(`${title}`).click({ button: 'right' })
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      await page.waitForTimeout(10000)
      if (await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).isVisible()) {
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        await page.waitForTimeout(10000)
        await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).click()
      } else {
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        await page.waitForTimeout(10000)
        await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Remove' }).last().click()
        
      }

      await page.frameLocator('#sbox-iframe').getByText('Trash', { exact: true }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Empty the trash' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Remove' }).click();

      await expect(page.frameLocator('#sbox-iframe').getByText(title)).toHaveCount(0)
  
     
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - empty trash', status: 'passed',reason: 'Can empty trash in Drive'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - empty trash', status: 'failed',reason: 'Can\'t empty trash in Drive'}})}`);
  
    }    
  });

test('drive -  notifications panel', async ({ }) => {

    try {
      const notifs = page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Allow notifications' }).last()
      await notifs.waitFor()
      
      await expect(notifs).toBeVisible()
      await notifs.click()
      await page.frameLocator('#sbox-iframe').getByText('Open notifications panel').waitFor()
      const pagePromise = page.waitForEvent('popup')
      await page.frameLocator('#sbox-iframe').getByText('Open notifications panel').click()
      const page1 = await pagePromise
      await page1.waitForLoadState('networkidle');
      await expect(page1).toHaveURL(`${url}/notifications/#all`, { timeout: 100000 })
      
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - notifications panel', status: 'passed',reason: 'Can navigate to Drive and open notifications panel'}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - notifications panel', status: 'failed',reason: 'Can\'t navigate to Drive and open notifications panel'}})}`);

    }  
});

test('drive - filter' , async ({ }) => {
  try {
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByText('test sheet').waitFor()
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByText('test whiteboard').waitFor()
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Filter' }).click();
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Sheet' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.frameLocator('#sbox-iframe').getByText('test sheet')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test whiteboard')).toHaveCount(0)
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - filter', status: 'passed',reason: `Can filter files by file type in Drive`}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - filter', status: 'failed',reason: `Can\'t filter files by file type in Drive`}})}`);
    
  }  
});

test('drive - create link' , async ({ }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().click();
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New Link' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('My link').fill('Cryptpad Docs');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('https://example.com').fill('https://docs.cryptpad.org');
    
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add' }).click();
    await page.frameLocator('#sbox-iframe').getByText('Cryptpad Docs').waitFor()
    await page.frameLocator('#sbox-iframe').getByText('Cryptpad Docs').click({ button: 'right' })
    if (page.frameLocator('#sbox-iframe').getByText('Move to trash').isVisible())  {
      await page.frameLocator('#sbox-iframe').getByText('Move to trash').click()
    } else {
      await page.frameLocator('#sbox-iframe').getByText('Remove').first().click()
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - link', status: 'passed',reason: `Can create link in Drive`}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - link', status: 'failed',reason: `Can\'t create link in Drive`}})}`);
    
  }  
});

test('drive - create folder' , async ({ }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).click();
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Folder$/ }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New folder').fill('My test folder');
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').click();
    await page.waitForTimeout(10000)
    await expect(page.frameLocator('#sbox-iframe').getByText('My test folder00')).toBeVisible()
    await page.frameLocator('#sbox-iframe').getByText('My test folder00').click({ button: 'right' })
    if (page.frameLocator('#sbox-iframe').getByText('Move to trash').isVisible())  {
      await page.frameLocator('#sbox-iframe').getByText('Move to trash').click()
    } else {
      await page.frameLocator('#sbox-iframe').getByText('Remove').first().click()
    }
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-folder')).toHaveCount(0)

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - folder', status: 'passed',reason: `Can create folder in Drive`}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - folder', status: 'failed',reason: `Can\'t create folder in Drive`}})}`);
    
  }  
});

test('drive - create shared folder' , async ({ }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).click();
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Shared folder$/ }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Shared folder$/ }).click({force: true});
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New folder').fill('My shared folder');
    await page.frameLocator('#sbox-iframe').getByLabel('Protect this folder with a password (optional)').fill('folderpassword');
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).waitFor()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').waitFor()
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder')).toBeVisible(5000)
    await page.waitForLoadState('networkidle');

    await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').click({button: 'right'});
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByText('Share', { exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByText('test-user3', { exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element > .cptools-shared-folder').click({button: 'right'})
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByText('Destroy').waitFor()
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click()
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).waitFor()
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000)

    await page.reload()
    await expect(page.frameLocator('#sbox-iframe').getByText('Your shared folder My shared folder is no longer available.')).toBeVisible()
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(5000)
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - shared folder', status: 'passed',reason: `Can create shared folder in Drive`}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - shared folder', status: 'failed',reason: `Can\'t create shared folder in Drive`}})}`);
    
  }  
});

test('drive - toggle sidebar' , async ({ }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Files' }).click();
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Files' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.frameLocator('#sbox-iframe').getByText('Search...')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('Recent')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Drive' }).nth(3)).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Templates' }).first()).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Trash' }).first()).toBeVisible();
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Files' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.frameLocator('#sbox-iframe').getByText('Search...')).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').getByText('Recent')).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Drive' }).nth(3)).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Templates' }).first()).toBeHidden();
    await expect(page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Trash' }).first()).toBeHidden();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - toggle sidebar', status: 'passed',reason: `Can toggle sidebar in Drive`}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - toggle sidebar', status: 'failed',reason: `Can\'t toggle sidebar in Drive`}})}`);
    
  }  
});

test('drive - search' , async ({ }) => {
  try {
    await page.frameLocator('#sbox-iframe').getByText('test sheet').waitFor()
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByText('test whiteboard').waitFor()
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Search...' }).first().click()
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Search').fill('sheet');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Search').press('Enter');
    await page.waitForLoadState('networkidle');
    await page.frameLocator('#sbox-iframe').getByText('test sheet').waitFor()
    await page.waitForLoadState('networkidle');
    await expect(page.frameLocator('#sbox-iframe').getByText('test whiteboard')).toHaveCount(0)
    
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - search', status: 'passed',reason: `Can search files in Drive`}})}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'drive - search', status: 'failed',reason: `Can\'t search files in Drive`}})}`);
    
  }  
});

test('can download drive contents THIS TEST WILL FAIL - WHITEBOARD FILES DON\'T DOWNLOAD', async ({ }) => {


  try {

    const menu = page.frameLocator('#sbox-iframe').getByAltText('User menu')
    await menu.click()
    await page.waitForTimeout(6000)
    await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
    
    const pagePromise = page.waitForEvent('popup')
    await page.frameLocator('#sbox-iframe').getByText('Settings').click()
    const page1 = await pagePromise
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })

    await page1.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-leftside').getByText('CryptDrive').click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Download my CryptDrive' }).click();
    await page1.frameLocator('#sbox-iframe').getByRole('textbox').fill('mydrivecontents.zip');
    const download1Promise = page1.waitForEvent('download');
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    const download1 = await download1Promise;

    await download1.saveAs('/tmp/mydrivecontents.zip');

    await expect(page1.frameLocator('#sbox-iframe').getByText('Your download is ready!')).toBeVisible();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'View errors' }).click();
    await expect(page1.frameLocator('#sbox-iframe').getByText('An error occured')).toHaveCount(0);

    const expectedFiles = ["Drive/", "Drive/test code.md", "Drive/test form", "Drive/test kanban.json", "Drive/test pad.html", "Drive/test markdown.md", "Drive/test sheet.xlsx", "Drive/test whiteboard.png", "Drive/test diagram.drawio"]
    let actualFiles = [];

    fs.createReadStream('/tmp/mydrivecontents.zip')
    .pipe(unzipper.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      actualFiles.push(fileName)
    });

    if (actualFiles == expectedFiles) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change display name', status: 'passed',reason: 'Can download drive contents'}})}`);

    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change display name', status: 'failed',reason: 'Can\'t download drive contents'}})}`);

    }
    
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'change display name', status: 'failed',reason: 'Can\'t download drive contents'}})}`);

  }  
});

test.afterEach(async ({  }) => {
  await browser.close()
});