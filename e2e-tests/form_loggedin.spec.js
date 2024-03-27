const { test, url, mainAccountPassword, nextMondaySlashFormat, nextMondayUSSlashFormat } = require('../fixture.js');
const { Cleanup } = require('./test-pages.spec.js');
const { expect } = require('@playwright/test');

let isMobile;
let browserName;
let cleanUp

test.beforeEach(async ({ page}, testInfo) => {

  test.setTimeout(2400000),

  isMobile = testInfo.project.use['isMobile']  
  browserName = testInfo.project.name.split(/@/)[0]

  if (isMobile) {
    await page.goto(`${url}/login`)
    await page.getByPlaceholder('Username').fill('test-user');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill(mainAccountPassword);
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    await page.waitForTimeout(5000)
    if (await login.isVisible()) {
      await login.click()
    }
    await page.waitForTimeout(10000)
  }

  const template = testInfo.title.match(/import template/)
  if (template) {
    cleanUp = new Cleanup(page);
    await cleanUp.cleanTemplates();
  }

  await page.goto(`${url}/form`)
  await page.waitForTimeout(10000)

});



test('form - create quick scheduling poll', async ({ page, context }) => {
  
  try {

    await page.frameLocator('#sbox-iframe').getByText('Quick Scheduling Poll').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(10000)

    await expect(page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Poll$/ }).locator('span')).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.frameLocator('#sbox-iframe').getByText(`${nextMondaySlashFormat}`)).toBeVisible()

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' }).click();
    const clipboardText = await page.evaluate("navigator.clipboard.readText()");
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`)
    await page1.waitForTimeout(1000)
    await page1.waitForTimeout(5000)

    await page1.waitForTimeout(5000)
    await page1.frameLocator('#sbox-iframe').locator('.cp-poll-cell > i').first().click();
    await page1.frameLocator('#sbox-iframe').locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first().click();
    await page1.frameLocator('#sbox-iframe').getByRole('button', { name: 'Submit' }).click();

    await page.waitForTimeout(10000)
    await page.frameLocator('#sbox-iframe').getByRole('button').filter({hasText: 'Responses'}).click();
    await expect(page.frameLocator('#sbox-iframe').getByRole('heading', { name: 'Total responses: 1' })).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.frameLocator('#sbox-iframe').getByText(/Total1\(0\)0\(0\)/)).toBeVisible()

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - quick scheduling poll', status: 'passed',reason: 'Can create quick scheduling poll'}})}`);

    
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - quick scheduling poll', status: 'failed',reason: 'Can\'t create quick scheduling poll'}})}`);

  }  
  
});

test(`form - save as and import template`, async ({ page }) => {

  try {

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).first().click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).click();
    await page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Your text here' }).fill('example text');
    await page.waitForTimeout(3000)
    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('example question?');
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3000)
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Edit' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 1').fill('test option one');
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('Option 2').fill('test option two');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Add option' }).click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder('New option').fill('test option three');
    await page.waitForTimeout(3000)

    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
    await page.frameLocator('#sbox-iframe').locator('.dialog').getByRole('textbox').fill('example form template');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await page.waitForTimeout(3000)
    await page.goto(`${url}/form/`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    await page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
    await page.frameLocator('#sbox-secure-iframe').getByText('example form template').click();

    await expect(page.frameLocator('#sbox-iframe').getByText('example text')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByRole('textbox')).toHaveValue('example question?')
    await expect(page.frameLocator('#sbox-iframe').getByText('test option one')).toBeVisible(0)
    await expect(page.frameLocator('#sbox-iframe').getByText('test option two')).toBeVisible()
    await expect(page.frameLocator('#sbox-iframe').getByText('test option three')).toBeVisible()

    await page.goto(`${url}/drive/`);
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree').getByText('Templates').click();
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText('example form template').click({button: 'right'});
    await page.frameLocator('#sbox-iframe').getByText('Destroy').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    await expect(page.frameLocator('#sbox-secure-iframe').getByText('example form template')).toHaveCount(0)
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - save as template', status: 'passed',reason: 'Can save and use Form document as template '}})}`);

  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'form - save as template', status: 'failed',reason: 'Can\'t save and use Form document as template'}})}`);

  }  
});