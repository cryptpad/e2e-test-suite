const { url } = require('../fixture.js');
const { expect } = require('@playwright/test');

export class FileActions {
	/**
	* @param {import('@playwright/test').Page} page
	*/
	constructor (page) {
		this.page = page;
	}

	async share(isMobile) {
        if (isMobile) {
            await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
        } else {
            await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        }
	}

	async access() {
		
    }

    async history() {
		
    }

    async export() {
		
    }

    async importTemplate() {
		
    }

    async saveTemplate() {
		
    }

    async new() {
		
    }

    async snapshots() {
		
    }

    async store() {
		
    }

    async tags() {
		
    }

    async import() {
		
    }

    async makeCopy() {
		
    }

    async trash() {
		
    }

}