const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');

const url = 'https://cryptpad.fr'

let browser;
let page;

test.beforeEach(async ({}, testInfo) => {
  test.setTimeout(24000000)
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

const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form'] 

docNames.forEach(function(name) {
    
  test(`anon - ${name} - store - delete`, async () => {

    try {
      if (name === 'pad') {
        await page.getByRole('link', { name: 'Rich text' }).waitFor()
        await page.getByRole('link', { name: 'Rich text' }).click();
      } else {
        await page.getByRole('link', { name: `${name}` }).waitFor()
        await page.getByRole('link', { name: `${name}` }).click();
      }
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}`), { timeout: 100000 })
  
      const date = new Date()
  
      var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      var weekday = days[date.getDay()]
      
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      var month = months[date.getMonth()]

      var title;
      if (name === 'pad') {
        title = `Rich text - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
      } else if (name === 'slide') {
        title = `Markdown slides - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
      } else {
        const titleName = name.charAt(0).toUpperCase() + name.slice(1)
        title = `${titleName} - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
      }
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(20000)

      await expect(page).toHaveTitle(`${title}`, {timeout: 10000})
  
      await expect(page.frameLocator('#sbox-iframe').getByText('This pad is not in your CryptDrive')).toBeVisible();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click()
      await page.waitForTimeout(10000)
  
      await page.goto(`${url}/drive`);
      await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toBeVisible();
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      await page.waitForTimeout(10000)
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

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.waitForTimeout(10000)
      await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} > store`, status: 'passed',reason: `Can anonymously create ${name} in Drive and store`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} > store`, status: 'failed',reason: `Can\'t anonymously create ${name} in Drive and store`}})}`);
  
    }  
  });
  
  test(`anon - ${name} - change title`, async () => {

    try {
      if (name === 'pad') {
        await page.getByRole('link', { name: 'Rich text' }).click();
      } else {
        await page.getByRole('link', { name: `${name}` }).click();
      }

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(50000)
      
      await expect(page).toHaveURL(new RegExp(`^${url}/${name}`), { timeout: 100000 })
      const iframe = page.locator('#sbox-iframe')
  
      await expect(iframe).toBeVisible({ timeout: 24000 })
  
      const date = new Date()
  
      var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      var weekday = days[date.getDay()]
      
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      var month = months[date.getMonth()]
  
      var title;
      if (name === 'pad') {
        title = `Rich text - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
      } else if (name === 'slide') {
        title = `Markdown slides - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`
      } else {
        const titleName = name.charAt(0).toUpperCase() + name.slice(1)
        title = `${titleName} - ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
      }

      await page.frameLocator('#sbox-iframe').getByText(`${title}`)
  
  
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
      await page.frameLocator('#sbox-iframe').getByPlaceholder(title).fill('new doc title');
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').waitFor()
      await page.waitForTimeout(10000)
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
      await expect(page.frameLocator('#sbox-iframe').getByText('new doc title')).toBeVisible()

      await expect(page.frameLocator('#sbox-iframe').getByText('This pad is not in your CryptDrive')).toBeVisible();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click()

      await page.waitForTimeout(3000)

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();

      if (page.frameLocator('#sbox-iframe').getByText('Are you sure you want to remove this item').isVisible()) {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
        
      }

      await page.on('dialog', dialog => dialog.accept());
      await expect(page.frameLocator('#sbox-iframe').getByText('Deleted')).toBeVisible();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click()

      if (name === 'code') {
        await page.frameLocator('#sbox-iframe').getByText('Moved to the trash').waitFor()
        await expect(page.frameLocator('#sbox-iframe').getByText('Moved to the trash')).toBeVisible();
      } else {

      }
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} > change title`, status: 'passed',reason: `Can change ${name} title`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} > change title`, status: 'failed',reason: `Can change ${name} title`}})}`);
  
    }  
  });
      
      
  test(`anon - drive - ${name}`, async () => {
    
    try {
    await page.goto(`${url}/drive`);
  
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().waitFor()
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first().click();
    const page1Promise = page.waitForEvent('popup');
    
    await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'New' }).locator('span').first().waitFor()
    if (name === 'pad') {
        await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Rich text' }).click();
        
      } else {
        await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: `${name}` }).click();
      }
      const page1 = await page1Promise;
      await page1.waitForTimeout(50000)
      await page1.frameLocator('#sbox-iframe').locator('body').waitFor()
      await expect(page1).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 50000 })

      await page.waitForTimeout(3000)
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
      await page1.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
      if (page1.frameLocator('#sbox-iframe').getByText('You must store this document in your CryptDrive').isVisible()) {
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      }
      await page.waitForTimeout(5000)
      await page1.frameLocator('#sbox-iframe').getByText('Deleted').waitFor()
      await expect(page1.frameLocator('#sbox-iframe').getByText('Deleted')).toBeVisible()
      
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - drive > ${name}`, status: 'passed',reason: `Can anonymously navigate to Drive and create ${name}`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - drive > ${name}`, status: 'failed',reason: `Can\'t anonymously navigate to Drive and create ${name}`}})}`);
  
    }  
  });
    
  test(`user - drive > ${name}` , async () => {

    try {
      await page.goto(`${url}/login/`);
      await page.getByPlaceholder('Username').fill('test-user');
      await page.getByPlaceholder('Password', {exact: true}).waitFor()
      await page.getByPlaceholder('Password', {exact: true}).fill('password');
      await page.waitForLoadState('networkidle');
      const login = page.locator(".login")
      await login.waitFor({ timeout: 18000 })
      await expect(login).toBeVisible({ timeout: 1800 })
      if (await login.isVisible()) {
          await login.click()
      }
    
      await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
      if ( await page.frameLocator('#sbox-iframe').getByText('Your shared folder My shared folder is no longer available. It has either been d').count() === 1) {
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click()
    
      }

      const page1Promise = page.waitForEvent('popup');
  
      await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ }).locator('span').first().click();
      if (name === 'pad') {
          await page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^Rich text$/ }).locator('span').first().click();
      } else {
          await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-new-ghost-dialog').getByText(`${name}`).click()
      }
      const page1 = await page1Promise;
      await page1.frameLocator('#sbox-iframe').getByRole('button', {name: 'Create', exact: true}).click()
      await expect(page1).toHaveURL(new RegExp(`^${url}/${name}/#/`), { timeout: 100000 })

      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
      await page1.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();
      await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page1.waitForLoadState('networkidle')

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - drive > ${name}`, status: 'passed',reason: `Can log in and create ${name} from Drive`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `user - drive > ${name}`, status: 'failed',reason: `Can\'t log in and create ${name} from Drive`}})}`);
    
    }  
  });

})


test.afterEach(async () => {
  await browser.close()
});