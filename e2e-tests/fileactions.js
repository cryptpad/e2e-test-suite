const { url } = require('../fixture.js');
const { expect } = require('@playwright/test');

export class FileActions {
	/**
	* @param {import('@playwright/test').Page} page
	*/
	constructor (page) {
		this.page = page;
        this.page.filemenu = page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
        this.page.filemenuMobile = page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
	}

	async share(isMobile) {
        if (isMobile) {
            await this.page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
        } else {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
        }
	}

	async access() {
        if (isMobile) {
            await this.page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
        } else {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
        }
		
    }

    async history(isMobile) {
        if (isMobile) {
            await this.page.filemenuMobile
        } else {
            await this.page.filemenu
        }
        if (!local) {
            await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' History' }).locator('a').click();            } else {
            await this.page.frameLocator('#sbox-iframe').getByLabel('Display the document history').click();
        }
    }

    async export(isMobile) {
        if (isMobile) {
            await this.page.filemenuMobile
        } else {
            await this.page.filemenu
        }
        await this.page.frameLocator('#sbox-iframe').getByText('Export').click();
    }

    async importTemplate(isMobile) {
        if (isMobile) {
            await this.page.filemenuMobile
        } else {
            await this.page.filemenu
        }

        if (local) {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
        } else {
            await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
        }
		
    }

    async saveTemplate(isMobile) {
        if (isMobile) {
            await this.page.filemenuMobile
        } else {
            await this.page.filemenu
        }
        if (local) {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save as template', exact: true }).click();            } else {
            await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
        }
    }


    async import(isMobile) {
        if (isMobile) {
            await this.page.filemenuMobile
        } else {
            await this.page.filemenu
        }
        await this.page.frameLocator('#sbox-iframe').getByText('Import').click();
    }




}