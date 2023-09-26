import { test as setup, expect } from '@playwright/test';
const { url, mainAccountPassword, testUserPassword, testUser2Password, testUser3Password } = require('../browserstack.config.js')

const authFileMainAccount = 'auth/mainuser.json';

setup('authenticate test-user', async ({ page }) => {
  setup.setTimeout(2400000);
  await page.goto(`${url}/login`);
  await page.getByPlaceholder('Username').fill('test-user');
  await page.waitForTimeout(10000)
  await page.getByPlaceholder('Password', {exact: true}).fill(mainAccountPassword);
  const login = page.locator(".login")
  await login.waitFor({ timeout: 18000 })
  await expect(login).toBeVisible({ timeout: 1800 })
  if (await login.isVisible()) {
    await login.click()
  }
  await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
  await page.waitForTimeout(10000)
  await page.context().storageState({ path: authFileMainAccount });
  console.log('AUTH')

});

const authFileTestUser = 'auth/testuser.json';

setup('authenticate testuser', async ({ page }) => {
    setup.setTimeout(2400000);
    console.log('AUTH')
    await page.goto(`${url}/login`);
    await page.getByPlaceholder('Username').fill('testuser');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill(testUserPassword);
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await page.waitForTimeout(10000)
    await page.context().storageState({ path: authFileTestUser });
});

const authFileTestUser2 = 'auth/testuser2.json';

setup('authenticate test-user2', async ({ page }) => {
    setup.setTimeout(2400000);
    console.log('AUTH')
    await page.goto(`${url}/login`);
    await page.getByPlaceholder('Username').fill('test-user2');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill(testUser2Password);
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
        await login.click()
    }
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await page.waitForTimeout(10000)
    await page.context().storageState({ path: authFileTestUser2 });
});

const authFileTestUser3 = 'auth/testuser3.json';

setup('authenticate test-user3', async ({ page }) => {
    setup.setTimeout(2400000);
    console.log('AUTH')
    await page.goto(`${url}/login`);
    await page.getByPlaceholder('Username').fill('test-user3');
    await page.waitForTimeout(10000)
    await page.getByPlaceholder('Password', {exact: true}).fill(testUser3Password);
    const login = page.locator(".login")
    await login.waitFor({ timeout: 18000 })
    await expect(login).toBeVisible({ timeout: 1800 })
    if (await login.isVisible()) {
      await login.click()
    }
    await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
    await page.waitForTimeout(10000)
    await page.context().storageState({ path: authFileTestUser3 });
});