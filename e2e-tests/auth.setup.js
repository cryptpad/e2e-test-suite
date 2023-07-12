// import { test as setup, expect } from '@playwright/test';

// const authFile = 'user.json';

// setup('authenticate', async ({ page }) => {
//   setup.setTimeout(2400000);
//   console.log('AUTH')
//   await page.goto('https://cryptpad.fr/login');
//   await page.getByPlaceholder('Username').fill('test-user');
//   await page.waitForTimeout(10000)
//   await page.getByPlaceholder('Password', {exact: true}).fill('newpassword');
//   const login = page.locator(".login")
//   await login.waitFor({ timeout: 18000 })
//   await expect(login).toBeVisible({ timeout: 1800 })
//   if (await login.isVisible()) {
//     await login.click()
//   }
//   await expect(page).toHaveURL(`https://cryptpad.fr/drive/#`, { timeout: 100000 })
//   await page.waitForLoadState('networkidle');
//   await page.waitForTimeout(5000)
//   await page.context().storageState({ path: authFile });
// });