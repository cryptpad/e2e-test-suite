const { test, url, mainAccountPassword, nextMondaySlashFormat, nextMondayUSSlashFormat } = require('../fixture.js');


export class Cleanup {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async cleanTemplates() {

		await this.page.goto(`${url}/drive`)
		await this.page.waitForTimeout(5000)
		await this.page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Templates' }).first().click();

		await this.page.waitForTimeout(5000)
		let elementCount = await this.page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').filter({hasText: 'template'}).count()
		if (elementCount > 0) {
			while (elementCount > 0) {
				if (elementCount > 1) {
					await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({hasText: 'template'}).nth(elementCount-1).click({ button: 'right' })
				} else {
					await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({hasText: 'template'}).click({ button: 'right' })
				}
				await this.page.waitForTimeout(3000)
				await this.page.frameLocator('#sbox-iframe').getByText('Destroy').click()
				await this.page.waitForTimeout(3000)
				await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
				await this.page.waitForTimeout(10000)
				elementCount = elementCount-1
			}
		}
  }

  /**
   * @param {string} file
   */
	async cleanUserDrive(file) {
		await this.page.goto(`${url}/drive`)
		await this.page.waitForTimeout(10000)
		let elementCount = await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({hasText: file}).count()
		if (elementCount > 0) {
			while (elementCount > 0) {
				if (elementCount > 1) {
					await this.page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${file}`).nth(elementCount-1).click({ button: 'right' })
				} else {
					await this.page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${file}`).click({ button: 'right' })
				}
				await this.page.waitForTimeout(3000)
				if (await this.page.frameLocator('#sbox-iframe').getByText('Destroy').isVisible()) {
					await this.page.frameLocator('#sbox-iframe').getByText('Destroy').click()
					await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
				} else {
					await this.page.frameLocator('#sbox-iframe').getByText('Move to trash').click()
				}
				await this.page.waitForTimeout(3000)
				await this.page.waitForTimeout(10000)
				elementCount = elementCount-1
			}
		}
	}

	/**
	* @param {string} file
	*/
	async cleanTeamDrive(file) {

		await this.page.goto(`${url}/teams`)
		await this.page.waitForTimeout(10000)
		await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
		await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
		await this.page.waitForTimeout(5000)
		let elementCount = await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({hasText: file}).count()

		if (elementCount > 0) {
			while (elementCount > 0) {
					
				if (elementCount > 1) {
					await this.page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${file}`).nth(elementCount-1).click({ button: 'right' })
				} else {
					await this.page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder').getByText(`${file}`).click({ button: 'right' })
				}
				await this.page.waitForTimeout(3000)
				if (await this.page.frameLocator('#sbox-iframe').getByText('Destroy').isVisible()) {
					await this.page.frameLocator('#sbox-iframe').getByText('Destroy').click()
					await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
				} else {
					await this.page.frameLocator('#sbox-iframe').getByText('Move to trash').click()
				}
				await this.page.waitForTimeout(10000)
				elementCount = elementCount-1
			}
		}

	}

	async cleanTeamMembership() {

		await this.page.goto(`${url}/teams`)
		await this.page.waitForTimeout(5000)
		await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
		await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
		await this.page.waitForTimeout(5000)
		await this.page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor()
		await this.page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click()

		if (await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'}).isVisible()) {
			await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'testuser'}).locator('.fa.fa-times').click();
		}

		if (await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').isVisible()) {
			while (await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').isVisible()) {
				await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({hasText: 'test-user3'}).locator('.fa.fa-angle-double-down').click();
			}
		}

	}

}