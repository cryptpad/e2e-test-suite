import { test as setup, expect } from '@playwright/test';
const { url, mainAccountPassword, testUserPassword, testUser2Password, testUser3Password } = require('../fixture.js');
const { UserActions } = require('./useractions.js');

const authFileMainAccount = 'auth/mainuser.json';

setup('authenticate test-user', async ({ page }) => {
  setup.setTimeout(2400000);
  let userActions = new UserActions(page);
  await userActions.login('test-user', mainAccountPassword);
  await page.context().storageState({ path: authFileMainAccount });
});

const authFileTestUser = 'auth/testuser.json';

setup('authenticate testuser', async ({ page }) => {
  setup.setTimeout(2400000);
  let userActions = new UserActions(page);
  await userActions.login('testuser', testUserPassword);
  await page.context().storageState({ path: authFileTestUser });
});

const authFileTestUser2 = 'auth/testuser2.json';

setup('authenticate test-user2', async ({ page }) => {
  setup.setTimeout(2400000);
  let userActions = new UserActions(page);
  await userActions.login('test-user2', testUser2Password);
  await page.context().storageState({ path: authFileTestUser2 });
});

const authFileTestUser3 = 'auth/testuser3.json';

setup('authenticate test-user3', async ({ page }) => {
  setup.setTimeout(2400000);
  let userActions = new UserActions(page);
  await userActions.login('test-user3', testUser3Password);
  await page.context().storageState({ path: authFileTestUser3 });
});
