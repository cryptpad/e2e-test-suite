const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');
const { url, titleDate } = require('../browserstack.config.js')

let page;
let pageOne;
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

  page = await browser.newPage();
});

const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'] 

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

  test(`anon - ${name} - create new file from file menu`, async ({ }) => {

    try {

      await page.goto(`${url}/${name}/`);
      if (browserName.indexOf('firefox') !== -1 ) {
        await page.waitForTimeout(15000)
      } else {
        await page.waitForTimeout(5000)
      }

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New', exact: true }).click();
      const page2Promise = page.waitForEvent('popup');
      if (name === 'pad') {
        await page.frameLocator('#sbox-iframe').getByText('Rich text', {exact: true}).click();
      } else if (name === 'slide') {
        await page.frameLocator('#sbox-iframe').getByText('Markdown slides', {exact: true}).click();
      } else {
        await page.frameLocator('#sbox-iframe').getByText(`${name.charAt(0).toUpperCase() + name.slice(1)}`, {exact: true}).click();
      }
      const page2 = await page2Promise;
      await page2.waitForTimeout(5000)

      await expect(page2.frameLocator('#sbox-iframe').getByText(`${title}`).first()).toBeVisible()

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - create new file from file menu`, status: 'passed',reason: `Can create new ${name} document from file menu`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: ` ${name} - create new file from file menu`, status: 'failed',reason: `Can\'t create new ${name} document from file menu`}})}`);
  
    }  
  });

  if (name !== 'form') {

    test(`anon - ${name} - share (link) - edit - (FF clipboard incompatibility)`, async ({ }) => {

      try {
  
        test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

        await page.goto(`${url}/${name}/`);
        await page.waitForTimeout(10000)
  
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();
  
        const clipboardText = await page.evaluate("navigator.clipboard.readText()");
  
        const page1 = await browser.newPage();
        
        await page1.goto(`${clipboardText}`)
        await page.waitForTimeout(10000)
        await expect(page1.frameLocator('#sbox-iframe').getByText(`${title}`).first()).toBeVisible()
  
        await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeHidden()
    
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - share (link)`, status: 'passed',reason: `Can anonymously create ${name} and share link (to edit)`}})}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - share (link) - (FF clipboard incompatibility)`, status: 'failed',reason: `Can\'t anonymously create ${name} and share link (to edit) - (FF clipboard incompatibility)`}})}`);
    
      }  
    });


    test(`anon - ${name} - share (link) - view - (FF clipboard incompatibility)`, async ({ }) => {

      try {

        test.skip(browserName.indexOf('firefox') !== -1, 'firefox clipboard incompatibility')

        await page.goto(`${url}/${name}/`);
        await page.waitForTimeout(10000)

        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        await page.frameLocator('#sbox-secure-iframe').locator('#cp-share-link-preview').click();
        await page.frameLocator('#sbox-secure-iframe').getByText('View').click({timeout: 3000});
        await page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' }).click();

        const clipboardText = await page.evaluate("navigator.clipboard.readText()");

        const page1 = await browser.newPage();
        
        await page1.goto(`${clipboardText}`)
        await page1.waitForTimeout(10000)
        await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`).first()).toBeVisible()

        await expect(page1.frameLocator('#sbox-iframe').getByText('Read only')).toBeVisible()
        
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - share (link) - view`, status: 'passed',reason: `Can anonymously create ${name} and share link (to view)`}})}`);
      } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - share (link) - view - (FF clipboard incompatibility)`, status: 'failed',reason: `Can\'t anonymously create ${name} and share link (to view) - (FF clipboard incompatibility)`}})}`);
    
      }  
    });
    
  }


  test(`anon - ${name} - chat`, async ({ }) => {

    try {

      await page.goto(`${url}/${name}`);
      if (browserName.indexOf('firefox') !== -1 ) {
        await page.waitForTimeout(15000)
      } else {
        await page.waitForTimeout(5000)
      }

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Chat' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store', exact: true }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Don\'t store', exact: true }).click({force: true})
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Type a message here...').waitFor({timeout: 5000})
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Type a message here...').click();
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Type a message here...').fill('test message');
      await page.frameLocator('#sbox-iframe').getByPlaceholder('Type a message here...').press('Enter');
      await expect(page.frameLocator('#sbox-iframe').getByText('test message')).toBeVisible();
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - chat`, status: 'passed',reason: `Can use chat in ${name} document`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - chat`, status: 'failed',reason: `Can\'t use chat in ${name} document`}})}`);
  
    }  
  });


    
  test(`anon - ${name} - create from drive - move to trash`, async ({ }) => {

    try {

      await page.goto(`${url}/drive`);
      if (browserName.indexOf('firefox') !== -1 ) {
        await page.waitForTimeout(15000)
      } else {
        await page.waitForTimeout(5000)
      }

      await page.frameLocator('#sbox-iframe').getByText('New', { exact: true }).click();

      const page2Promise = page.waitForEvent('popup');
      if (name === 'pad') {
        await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-new-ghost-dialog').getByText('Rich text').click({timeout:3000});
      } else if (name === 'slide') {
        await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-new-ghost-dialog').getByText('Markdown slides', {exact: true}).click();
      } else {
        await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-new-ghost-dialog').getByText(`${name.charAt(0).toUpperCase() + name.slice(1)}`, {exact: true}).click();
      }
      const page2 = await page2Promise;
      
      await expect(page2).toHaveURL(new RegExp(`^${url}/${name}`), { timeout: 60000 })
      page.waitForTimeout(5000)
      await expect(page2.frameLocator('#sbox-iframe').getByText(`${title}`).first()).toBeVisible()

      await page2.goto(`${url}/drive`);
      await page2.waitForTimeout(10000)
      await expect(page2.frameLocator('#sbox-iframe').getByText(`${title}`)).toBeVisible();
      await page2.waitForTimeout(10000)
      await page2.frameLocator('#sbox-iframe').getByText(`${title}`).click({ button: 'right' })
      await page2.waitForTimeout(10000)
      await page2.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' }).click()

      await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page2.waitForTimeout(10000)
      await expect(page2.frameLocator('#sbox-iframe').getByText(`${title}`)).toHaveCount(0)

      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} > store`, status: 'passed',reason: `Can anonymously create ${name} in Drive and store`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} > store`, status: 'failed',reason: `Can\'t anonymously create ${name} in Drive and store`}})}`);
  
    }  
  });
  
  test(`anon - ${name} - change title`, async ({ }) => {

    try {

      await page.goto(`${url}/${name}/`);
      if (browserName.indexOf('firefox') !== -1 ) {
        await page.waitForTimeout(15000)
      } else {
        await page.waitForTimeout(5000)
      }

      await expect(page.frameLocator('#sbox-iframe').getByText(`${title}`).first()).toBeVisible()
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
      await page.frameLocator('#sbox-iframe').getByPlaceholder(`${title}`).fill('new doc title');
      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
      await expect(page.frameLocator('#sbox-iframe').getByText('new doc title')).toBeVisible()
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} > change title`, status: 'passed',reason: `Can change ${name} title`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} > change title`, status: 'failed',reason: `Can change ${name} title`}})}`);
  
    }  
  });

  test(`anon - ${name} - move to trash`, async ({ }) => {

    try {
      await page.goto(`${url}/${name}/`);
      if (browserName.indexOf('firefox') !== -1 ) {
        await page.waitForTimeout(15000)
      } else {
        await page.waitForTimeout(5000)
      }
      await expect(page.frameLocator('#sbox-iframe').getByText('This pad is not in your CryptDrive')).toBeVisible();
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click()

      await page.waitForTimeout(3000)
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).waitFor()
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'File' }).click();
      await page.frameLocator('#sbox-iframe').getByRole('button', {name: ' Move to trash', exact: true}).click();

      await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();

      if (name === 'sheet') {
        
      } else {
        await expect(page.frameLocator('#sbox-iframe').getByText('Moved to the trash', { exact: true })).toBeVisible({ timeout: 10000 });
      }
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - move to trash`, status: 'passed',reason: `Can move ${name} to trash`}})}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: `anon - ${name} - move to trash`, status: 'failed',reason: `Can move ${name} to trash`}})}`);
  
    }  
  });  
      

})

test.afterEach(async ({  }) => {
  await browser.close()
});