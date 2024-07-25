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

}