const { expect } = require('@playwright/test');
const { test, url, titleDate, mainAccountPassword, testUserPassword, testUser2Password, testUser3Password } = require('../fixture.js');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

let pageOne;
let cleanUp;
let userActions
// let fileActions

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto(`${url}`);
  await page.waitForTimeout(15000);
  userActions = new UserActions(page);
  // fileActions = new UserActions(page);

});

test('test-user account setup', async ({ page }) => {
  try {
    await userActions.register('test-user', mainAccountPassword);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'test-user account setup', status: 'passed', reason: 'Can register test-user' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'test-user account setup', status: 'failed', reason: 'Can\'t register test-user' } })}`);
  }
});

test('testuser account setup', async ({ page }) => {
  try {
    /// registering the account
    await userActions.register('testuser', testUserPassword);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'testuser account setup', status: 'passed', reason: 'Can register testuser' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'testuser account setup', status: 'failed', reason: 'Can\'t register testuser' } })}`);
  }
});

test('test-user2 account setup', async ({ page }) => {
  try {
    /// registering the account
    await userActions.register('test-user2', testUser2Password);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'test-user2 account setup', status: 'passed', reason: 'Can register test-user2' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'test-user2 account setup', status: 'failed', reason: 'Can\'t register test-user2' } })}`);
  }
});

test('test-user3 account setup', async ({ page }) => {
  try {
    /// registering the account
    await userActions.register('test-user3', testUser3Password);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'test-user3 account setup', status: 'passed', reason: 'Can register test-user3' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'test-user3 account setup', status: 'failed', reason: 'Can\'t register test-user3' } })}`);
  }
});

test('create test team', async ({ page }) => {
  try {
    await userActions.login('test-user', mainAccountPassword);

    await page.goto(`${url}/teams`);
    await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').getByText('Available team slotNew').first().click();

    await page.waitForTimeout(5000);

    await page.frameLocator('#sbox-iframe').getByRole('textbox').fill('test team');
    let   fileActions = new FileActions(page);

    await fileActions.createFile.click();

    await page.waitForTimeout(10000);
    await expect(page).toHaveURL(`${url}/teams/`, { timeout: 100000 });

    await page.frameLocator('#sbox-iframe').getByText('tt', { exact: true }).click();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create test team', status: 'passed', reason: 'Can create test team' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create test team', status: 'failed', reason: 'Can\'t create test team' } })}`);
  }
});

test('link test-user and testuser as contacts', async ({ page, browser }, testInfo) => {
  try {
    await userActions.login('testuser', testUserPassword);
    await page.goto(`${url}/profile`);
    let   fileActions = new FileActions(page);

    await fileActions.share(false);
    const testuserProfileLink = await page.evaluate('navigator.clipboard.readText()');

    // login test-user
    const context = await browser.newContext();
    pageOne = await context.newPage();
    let userActions2 = new UserActions(pageOne);
    await userActions2.login('test-user', mainAccountPassword);

    // send testuser contact request
    await pageOne.goto(`${testuserProfileLink}`);
    await pageOne.waitForTimeout(10000);
    await pageOne.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).waitFor();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible();
    await page.waitForTimeout(7000);
    await fileActions.notifications.click();
    await page.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor();
    await page.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    await page.waitForTimeout(5000);

    await pageOne.waitForTimeout(7000);
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('testuser is one of your contacts')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'link test-user and testuser as contacts', status: 'passed', reason: 'Can link test-user and testuser as contacts' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'link test-user and testuser as contacts', status: 'failed', reason: 'Can\'t link test-user and testuser as contacts' } })}`);
  }
});

test('link test-user and test-user3 as contacts', async ({ page, browser }, testInfo) => {
  try {
    await userActions.login('test-user3', testUser3Password);
    await page.goto(`${url}/profile`);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
    const testuserProfileLink = await page.evaluate('navigator.clipboard.readText()');

    // login test-user
    const context = await browser.newContext();
    pageOne = await context.newPage();
    let userActions2 = new UserActions(pageOne);
    await userActions2.login('test-user', mainAccountPassword);

    // send testuser contact request
    await pageOne.goto(`${testuserProfileLink}`);
    await pageOne.waitForTimeout(10000);
    await pageOne.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).waitFor();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button').filter({ hasText: 'contact request' }).click();
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('Contact request pending...Cancel')).toBeVisible();

    await page.waitForTimeout(7000);
        let   fileActions = new FileActions(page);

    await fileActions.notifications.click();
    await page.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').waitFor();
    await page.frameLocator('#sbox-iframe').getByText('test-user sent you a contact request').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test-user would like to add you as a contact. Accept?')).toBeVisible();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    await page.waitForTimeout(5000);

    await pageOne.waitForTimeout(7000);
    await expect(pageOne.frameLocator('#sbox-iframe').getByText('test-user3 is one of your contacts')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'link test-user and test-user3 as contacts', status: 'passed', reason: 'Can link test-user and test-user3 as contacts' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'link test-user and test-user3 as contacts', status: 'failed', reason: 'Can\'t link test-user and test-user3 as contacts' } })}`);
  }
});

test('add test-user3 to test team', async ({ page, browser }) => {
  try {
    await userActions.login('test-user', mainAccountPassword);
    await page.goto(`${url}/teams`);

    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({ timeout: 3000 });

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();

    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite members' }).click();
    await page.frameLocator('#sbox-iframe').getByRole('paragraph').getByText('test-user3').click();
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Invite', exact: true }).click();

    ///

    pageOne = await browser.newPage();
    let userActions2 = new UserActions(pageOne);
    await userActions2.login('test-user3', testUser3Password);
    await pageOne.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container').click();

    await pageOne.frameLocator('#sbox-iframe').getByText('test-user has invited you to join their team: test team').click({ timeout: 3000 });
    await pageOne.waitForTimeout(3000);
    await expect(pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' })).toBeVisible();
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).waitFor();
    const page2Promise = pageOne.waitForEvent('popup');
    await pageOne.frameLocator('#sbox-iframe').getByRole('button', { name: 'Accept (Enter)' }).click();
    const pageTwo = await page2Promise;

    await pageTwo.waitForTimeout(6000);
    await pageTwo.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await pageTwo.close();
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' })).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'add test-user3 to test team', status: 'passed', reason: 'Can add test-user3 to test team' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'add test-user3 to test team', status: 'failed', reason: 'Can\'t add test-user3 to test team' } })}`);
  }
});

test('create test files in test-user drive', async ({ page }) => {
  try {
    test.setTimeout(510000);

    await userActions.login('test-user', mainAccountPassword);

    cleanUp = new Cleanup(page);
    const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'];
    for (const i in docNames) {
      const name = `test ${docNames[i]}`;
      await cleanUp.cleanTeamDrive(name);
    }

    await page.goto(`${url}/pad/`);
    let fileActions = new FileActions(page);

    await fileActions.createFile.click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Rich text - ${titleDate}`)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(`Rich text - ${titleDate}`).fill('test pad');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test pad')).toBeVisible();

    await page.goto(`${url}/sheet/`);
    await fileActions.createFile.click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Sheet - ${titleDate}`)).toBeVisible();
    await page.waitForTimeout(3000);
     await page.frameLocator('#sbox-iframe').getByText('Saved').waitFor()
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(`Sheet - ${titleDate}`).fill('test sheet');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test sheet')).toBeVisible();

    await page.goto(`${url}/code/`);
    await fileActions.createFile.click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Code - ${titleDate}`)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(`Code - ${titleDate}`).fill('test code');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test code')).toBeVisible();

    await page.goto(`${url}/slide/`);
    await fileActions.createFile.click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Markdown slides - ${titleDate}`)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(`Markdown slides - ${titleDate}`).fill('test slide');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test slide')).toBeVisible();

    await page.goto(`${url}/form/`);
    await fileActions.createFile.click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Form - ${titleDate}`)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(`Form - ${titleDate}`).fill('test form');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test form')).toBeVisible();

    await page.goto(`${url}/whiteboard/`);
    await fileActions.createFile.click();
    await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Whiteboard - ${titleDate}`)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').getByText('Saved').waitFor()
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(`Whiteboard - ${titleDate}`).fill('test whiteboard');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test whiteboard')).toBeVisible();

    await page.goto(`${url}/diagram/`);
    await fileActions.createFile.click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Diagram - ${titleDate}`)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(`Diagram - ${titleDate}`).fill('test diagram');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test diagram')).toBeVisible();

    await page.goto(`${url}/kanban/`);
    await fileActions.createFile.click();
    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Store', exact: true }).click();
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Kanban - ${titleDate}`)).toBeVisible();
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page.frameLocator('#sbox-iframe').getByPlaceholder(`Kanban - ${titleDate}`).fill('test kanban');
    await page.waitForTimeout(3000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page.frameLocator('#sbox-iframe').getByText('test kanban')).toBeVisible();

    await page.goto(`${url}/drive`);
    await page.waitForTimeout(5000);
    await expect(page.frameLocator('#sbox-iframe').getByText('test diagram')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test whiteboard')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test form')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test sheet')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test pad')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test code')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test slide')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test kanban')).toBeVisible();

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create test files in test-user drive', status: 'passed', reason: 'Can create test files in test-user drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create test files in test-user drive', status: 'failed', reason: 'Can\'t create test files in test-user drive' } })}`);
  }
});

test('create test files in team drive and add avatar', async ({ page }) => {
  try {
    test.setTimeout(2100000);

    await userActions.login('test-user', mainAccountPassword);

    await page.goto(`${url}/teams`);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    await page.waitForTimeout(5000);

    cleanUp = new Cleanup(page);
    const docNames = ['pad', 'sheet', 'code', 'slide', 'kanban', 'whiteboard', 'form', 'diagram'];
    for (const i in docNames) {
      const name = `test ${docNames[i]}`;
      await cleanUp.cleanTeamDrive(name);
    }
    let fileActions = new FileActions(page);

    await fileActions.driveContentFolder.getByText('New').click();
    const page2Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').locator('#cp-app-drive-new-ghost-dialog').getByText('Rich text').click({ timeout: 3000 });
    const page2 = await page2Promise;
    await page2.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page2.waitForTimeout(5000);
    await expect(page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Rich text - ${titleDate}`)).toBeVisible();
    await page2.waitForTimeout(3000);
    await page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page2.frameLocator('#sbox-iframe').getByPlaceholder(`Rich text - ${titleDate}`).fill('test pad');
    await page2.waitForTimeout(3000);
    await page2.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page2.frameLocator('#sbox-iframe').getByText('test pad')).toBeVisible();
    await page2.close();

    await page.waitForTimeout(5000);
    await page.frameLocator('#sbox-iframe').locator('button').filter({ hasText: /^New$/ }).click();
    const page3Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: ' Sheet' }).click();
    const page3 = await page3Promise;
    await page3.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page3.waitForTimeout(5000);
    await expect(page3.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Sheet - ${titleDate}`)).toBeVisible();
    await page3.waitForTimeout(3000);
    await page3.frameLocator('#sbox-iframe').getByText('Saved').waitFor()
    await page3.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page3.frameLocator('#sbox-iframe').getByPlaceholder(`Sheet - ${titleDate}`).fill('test sheet');
    await page3.waitForTimeout(5000);
    await page3.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page3.frameLocator('#sbox-iframe').getByText('test sheet')).toBeVisible();
    await page3.close();

    await page.frameLocator('#sbox-iframe').locator('button').filter({ hasText: /^New$/ }).click();
    const page4Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Code' }).click({ timeout: 5000 });
    const page4 = await page4Promise;
    await page4.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page4.waitForTimeout(5000);
    await expect(page4.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Code - ${titleDate}`)).toBeVisible();
    await page4.waitForTimeout(3000);
    await page4.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page4.frameLocator('#sbox-iframe').getByPlaceholder(`Code - ${titleDate}`).fill('test code');
    await page4.waitForTimeout(3000);
    await page4.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page4.frameLocator('#sbox-iframe').getByText('test code')).toBeVisible();
    await page4.close();

    await page.frameLocator('#sbox-iframe').locator('button').filter({ hasText: /^New$/ }).click();
    const page5Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Markdown slides' }).click();
    const page5 = await page5Promise;
    await page5.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page5.waitForTimeout(5000);
    await expect(page5.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Markdown slides - ${titleDate}`)).toBeVisible();
    await page5.waitForTimeout(3000);
    await page5.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page5.frameLocator('#sbox-iframe').getByPlaceholder(`Markdown slides - ${titleDate}`).fill('test slide');
    await page5.waitForTimeout(3000);
    await page5.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page5.frameLocator('#sbox-iframe').getByText('test slide')).toBeVisible();
    await page5.close();

    await page.reload();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({ timeout: 3000 });
    await page.waitForTimeout(10000);

    await page.frameLocator('#sbox-iframe').locator('button').filter({ hasText: /^New$/ }).click();
    const page6Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Form' }).click();
    const page6 = await page6Promise;
    await page6.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page6.waitForTimeout(5000);
    await expect(page6.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Form - ${titleDate}`)).toBeVisible();
    await page6.waitForTimeout(3000);
    await page6.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page6.frameLocator('#sbox-iframe').getByPlaceholder(`Form - ${titleDate}`).fill('test form');
    await page6.waitForTimeout(3000);
    await page6.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page6.frameLocator('#sbox-iframe').getByText('test form')).toBeVisible();
    await page6.close();

    await page.reload();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({ timeout: 3000 });
    await page.waitForTimeout(10000);

    await page.frameLocator('#sbox-iframe').locator('button').filter({ hasText: /^New$/ }).click();
    const page7Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Whiteboard' }).click();
    const page7 = await page7Promise;
    await page7.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page7.waitForTimeout(10000);
    await expect(page7.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Whiteboard - ${titleDate}`)).toBeVisible();
    await page7.waitForTimeout(3000);
    await page7.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page7.frameLocator('#sbox-iframe').getByPlaceholder(`Whiteboard - ${titleDate}`).fill('test whiteboard');
    await page7.waitForTimeout(3000);
    await page7.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page7.frameLocator('#sbox-iframe').getByText('test whiteboard')).toBeVisible();
    await page7.close();

    await page.reload();
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({ timeout: 3000 });
    await page.waitForTimeout(10000);

    await page.frameLocator('#sbox-iframe').locator('button').filter({ hasText: /^New$/ }).click();
    const page8Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Diagram' }).click();
    const page8 = await page8Promise;
    await page8.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page8.waitForTimeout(5000);
    await expect(page8.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Diagram - ${titleDate}`)).toBeVisible();
    await page8.waitForTimeout(3000);
    await page8.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page8.frameLocator('#sbox-iframe').getByPlaceholder(`Diagram - ${titleDate}`).fill('test diagram');
    await page8.waitForTimeout(3000);
    await page8.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page8.frameLocator('#sbox-iframe').getByText('test diagram')).toBeVisible();
    await page8.close();

    await page.frameLocator('#sbox-iframe').locator('button').filter({ hasText: /^New$/ }).click();
    const page9Promise = page.waitForEvent('popup');
    await page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Kanban' }).click();
    const page9 = await page9Promise;
    await page9.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' }).click();
    await page9.waitForTimeout(5000);
    await expect(page9.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`Kanban - ${titleDate}`)).toBeVisible();
    await page9.waitForTimeout(3000);
    await page9.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-edit > .fa').click();
    await page9.frameLocator('#sbox-iframe').getByPlaceholder(`Kanban - ${titleDate}`).fill('test kanban');
    await page9.waitForTimeout(3000);
    await page9.frameLocator('#sbox-iframe').locator('.cp-toolbar-title-save').click();
    await expect(page9.frameLocator('#sbox-iframe').getByText('test kanban')).toBeVisible();

    await expect(page.frameLocator('#sbox-iframe').getByText('test diagram')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test whiteboard')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test form')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test sheet')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test pad')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test code')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test slide')).toBeVisible();
    await expect(page.frameLocator('#sbox-iframe').getByText('test kanban')).toBeVisible();

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Upload a new avatar' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('testdocuments/teamavatar-empty.png');
    await fileActions.okButton.click();
    await page.waitForTimeout(5000);

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create test files in team drive', status: 'passed', reason: 'Can create test files in team drive' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'create test files in team drive', status: 'failed', reason: 'Can\'t create test files in team drive' } })}`);
  }
});
