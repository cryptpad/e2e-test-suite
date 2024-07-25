const { url } = require('../fixture.js');
const { expect } = require('@playwright/test');

export class UserActions {
	/**
	* @param {import('@playwright/test').Page} page
	*/
	constructor (page) {
			this.page = page;
	}

	async login(username, password) {
		await this.page.goto(`${url}/login`);
		await this.page.getByPlaceholder('Username').fill(username);
		await this.page.waitForTimeout(10000);
		await this.page.getByPlaceholder('Password', { exact: true }).fill(password);
		const login = this.page.locator('.login');
		await login.waitFor({ timeout: 18000 });
		await expect(login).toBeVisible({ timeout: 1800 });
		if (await login.isVisible()) {
			await login.click();
		}
		await expect(this.page).toHaveURL(`${url}/drive/#`, { timeout: 100000 });
	}

	async register(username, password) {
		await page.goto(`${url}/register`);

		await page.waitForTimeout(5000);
		await page.getByPlaceholder('Username').fill(username);
		await page.getByPlaceholder('Password', { exact: true }).fill(password);
		await page.getByPlaceholder('Confirm your password', { exact: true }).fill(password);
		await page.waitForTimeout(3000);
		const register = page.locator("[id='register']");
		await register.waitFor();

		if (await page.locator('#userForm span').nth(2).isVisible()) {
			await page.locator('#userForm span').nth(2).click();
		}
		await register.click();

		const modal = page.getByText('Warning');
		await expect(modal).toBeVisible({ timeout: 180000 });
		if (await modal.isVisible({ timeout: 180000 })) {
			await page.getByRole('button', { name: 'I have written down my username and password, proceed' }).click();
		}
		const hashing = page.getByText('Hashing your password');
		await expect(hashing).toBeVisible({ timeout: 200000 });

		await page.waitForTimeout(20000);
			await page.waitForURL(`${url}/drive/#`);
		}

}