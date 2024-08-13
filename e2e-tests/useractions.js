const { url } = require('../fixture.js');
const { expect } = require('@playwright/test');

export class UserActions {
	/**
	* @param {import('@playwright/test').Page} page
	*/
	constructor (page) {
		this.page = page;

		// this.login = page.locator('.login');
		// this.register = page.locator("[id='register']");
		// this.loginLink = page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Log in' })
		// this.registerLink = page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Sign up' })
	}

	async login(username, password) {
		await this.page.goto(`${url}/login`);
		await this.page.getByPlaceholder('Username').fill(username);
		await this.page.waitForTimeout(10000);
		await this.page.getByPlaceholder('Password', { exact: true }).fill(password);
		
		await this.page.login.waitFor({ timeout: 18000 });
		await expect(this.page.login).toBeVisible({ timeout: 1800 });
		if (await this.page.login.isVisible()) {
			await this.page.login.click();
		}
		await expect(this.page).toHaveURL(`${url}/drive/#`, { timeout: 100000 });
	}

	async register(username, password) {
		await this.page.goto(`${url}/register`);
		await this.page.register.waitForTimeout(5000);
		await this.page.register.getByPlaceholder('Username').fill(username);
		await this.page.register.getByPlaceholder('Password', { exact: true }).fill(password);
		await this.page.register.getByPlaceholder('Confirm your password', { exact: true }).fill(password);
		await this.page.register.waitForTimeout(3000);
		await this.page.register.waitFor();

		if (await this.page.locator('#userForm span').nth(2).isVisible()) {
			await this.page.locator('#userForm span').nth(2).click();
		}
		await this.page.register.click();

		const modal = this.page.getByText('Warning');
		await expect(modal).toBeVisible({ timeout: 180000 });
		if (await modal.isVisible({ timeout: 180000 })) {
			await this.page.getByRole('button', { name: 'I have written down my username and password, proceed' }).click();
		}
		const hashing = this.page.getByText('Hashing your password');
		await expect(hashing).toBeVisible({ timeout: 200000 });

		await this.page.waitForTimeout(20000);
		await this.page.waitForURL(`${url}/drive/#`);
	}

}