const { url, mainAccountPassword, testUser2Password, testUserPassword, testUser3Password } = require('../browserstack.config.js')

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
  
test('delete test-user account', async ({ }) => {

    try {
        
        const context = await browser.newContext({ storageState: 'auth/mainuser.json' });

        page = await context.newPage();
        await page.goto(`${url}/drive`)
        await page.waitForTimeout(5000)
        await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

        await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
        const pagePromise = page.waitForEvent('popup')
        await page.frameLocator('#sbox-iframe').getByText('Settings').click()
        const page1 = await pagePromise
        await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(mainAccountPassword);
        await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
        await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

        await page1.waitForTimeout(5000)
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^Your user account is now deleted/)).toBeVisible({timeout: 30000})
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user account', status: 'passed',reason: 'Can delete test-user account'}})}`);
  
    } catch(e) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user account', status: 'failed',reason: 'Can\'t delete test-user account'}})}`);
  
      console.log(e);
    }
});
  
test('delete testuser account', async ({ }) => {

    try {
  
        const context = await browser.newContext({ storageState: 'auth/testuser.json' });
        page = await context.newPage();
        await page.goto(`${url}/drive`)
        await page.waitForTimeout(5000)
        await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

        await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
        const pagePromise = page.waitForEvent('popup')
        await page.frameLocator('#sbox-iframe').getByText('Settings').click()
        const page1 = await pagePromise
        await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(mainAccountPassword);
        await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
        await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

        await page1.waitForTimeout(5000)
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^Your user account is now deleted/)).toBeVisible({timeout: 30000})
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete testuser account', status: 'passed',reason: 'Can delete testuser account'}})}`);
  
    } catch(e) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete testuser account', status: 'failed',reason: 'Can\'t delete testuser account'}})}`);
  
      console.log(e);
    }
});

test('delete test-user2 account', async ({ }) => {

    try {
  
        const context = await browser.newContext({ storageState: 'auth/testuser2.json' });
        page = await context.newPage();
        await page.goto(`${url}/drive`)
        await page.waitForTimeout(5000)
        await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

        await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
        const pagePromise = page.waitForEvent('popup')
        await page.frameLocator('#sbox-iframe').getByText('Settings').click()
        const page1 = await pagePromise
        await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(mainAccountPassword);
        await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
        await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

        await page1.waitForTimeout(5000)
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^Your user account is now deleted/)).toBeVisible({timeout: 30000})
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
        
  
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user2 account', status: 'passed',reason: 'Can delete test-user2 account'}})}`);
  
    } catch(e) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user2 account', status: 'failed',reason: 'Can\'t delete test-user2 account'}})}`);
  
      console.log(e);
    }
});

test('delete test-user3 account', async ({ }) => {

    try {
  
        const context = await browser.newContext({ storageState: 'auth/testuser3.json' });

        page = await context.newPage();
        await page.goto(`${url}/drive`)
        await page.waitForTimeout(5000)
        await page.frameLocator('#sbox-iframe').getByAltText('User menu').click()

        await expect(page.frameLocator('#sbox-iframe').getByText('Settings')).toBeVisible()
        const pagePromise = page.waitForEvent('popup')
        await page.frameLocator('#sbox-iframe').getByText('Settings').click()
        const page1 = await pagePromise
        await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 })
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).click();
        await page1.frameLocator('#sbox-iframe').getByRole('textbox', { name: 'Current password' }).fill(mainAccountPassword);
        await page1.frameLocator('#sbox-iframe').getByText('Delete your account').click()
        await page1.frameLocator('#sbox-iframe').getByText('Are you sure?').click()

        await page1.waitForTimeout(5000)
        await expect(page1.frameLocator('#sbox-iframe').getByText(/^Your user account is now deleted/)).toBeVisible({timeout: 30000})
        await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user3 account', status: 'passed',reason: 'Can delete test-user3 account'}})}`);
  
    } catch(e) {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'delete test-user3 account', status: 'failed',reason: 'Can\'t delete test-user3 account'}})}`);
  
      console.log(e);
    }
});

test.afterEach(async () => {
    await browser.close()
  });
  