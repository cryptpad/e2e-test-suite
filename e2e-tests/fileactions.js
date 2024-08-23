import { title } from 'process';

const { url, titleDate, titleDateComma } = require('../fixture.js');
const { expect } = require('@playwright/test');

export class FileActions {
	/**
	* @param {import('@playwright/test').Page} page
	*/
	constructor (page) {
		this.page = page;

        //user actions
        this.login = page.locator('.login');
		this.register = page.locator("[id='register']");
		this.loginLink = page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Log in' })
		this.registerLink = page.frameLocator('#sbox-iframe').getByRole('link', { name: 'Sign up' })

        //drive
        this.drivemenu = page.frameLocator('#sbox-iframe').locator('.cp-toolbar-user-dropdown.cp-dropdown-container');
        this.driveadd = page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder span').first()
        this.notifications = page.frameLocator('#sbox-iframe').locator('.cp-toolbar-notifications.cp-dropdown-container')
        this.driveContentFolder = page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder')
        this.newFile = page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: /^New$/ })
        this.settings = page.frameLocator('#sbox-iframe').getByText('Settings')
        this.driveSideMenu = page.frameLocator('#sbox-iframe').locator('#cp-app-drive-tree')

        //file actions
        this.filemenu = page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' })
        this.filemenuMobile = page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file')
        this.fileimport = page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import' }).locator('a')
        this.filecopy = page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Make a copy' }).locator('a')
        this.historyPrev = page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last()
        this.toolbar = page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' })
        this.shareLink = page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' })
        this.shareSecureLink = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' })
        this.shareCopyLink = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' })
        this.filesaved = page.frameLocator('#sbox-iframe').getByText('Saved')
        this.deletebutton = page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' })
        this.moveToTrash = page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' })
        this.destroy = page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Destroy' })
        this.linkTab = page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link')
        this.linkTabMobile = page.frameLocator('#sbox-secure-iframe').getByLabel('Link')
        this.createFile = page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Create' })

        //buttons
        this.closeButtonSecure = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' })
        this.closeButton = page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Close' })
        this.okButtonSecure = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' })
        this.okButton = page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' })
        
        // this.preview = 
        
        //code
        this.codeeditor = page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll')
        this.codepreview = page.frameLocator('#sbox-iframe').locator('#cp-app-code-preview-content')

        //form
        this.copyPublicLink = page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Copy public link' })

        //pad
        this.padeditor = page.frameLocator('#sbox-iframe').frameLocator('iframe[title="Editor\\, editor1"]')

        //markdown
        this.slideeditor = page.frameLocator('#sbox-iframe').locator('.CodeMirror-code')
        
	}

    async title(title) {
     return this.page.frameLocator('#sbox-iframe').locator('.cp-toolbar-title').getByText(`${title}`)
    
    }

    async titleDate(mobile, isBrowserstack) {
        if (mobile && isBrowserstack || !mobile && !isBrowserstack) {
            return titleDateComma
        } else {
            return titleDate
        }
    
    }

    async clickTags(local) {
        await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Tags' }).locator('a').click();
    
    }

    async clickLinkTab(mobile) {
        if (mobile) {
            await this.page.frameLocator('#sbox-secure-iframe').getByLabel('Link').click();
        } else {
            await this.page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
        }
    
    }

    async responses(visible) {
        if (visible) {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
        } else {
            await this.page.reload()
            await this.page.waitForTimeout(20000)
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Responses (1)' }).click();
        }
    }

    async filemenuClick(mobile) {
        if (mobile) {
            await this.filemenuMobile.click()
        } else {
            await this.filemenu.click()
        }
	}

    async togglePreview(mobile) {
        if (mobile) {
            await this.page.frameLocator('#sbox-iframe').locator('.cp-toolbar-rightside-button').locator('.fa.fa-eye').click();
        } else {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Preview' }).click();
        }
    }

    async toggleTools(mobile) {
        if (mobile) {
            await this.page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').waitFor();
            await this.page.frameLocator('#sbox-iframe').locator('.cp-toolbar-tools').click();
        } else {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).waitFor();
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Tools' }).click();
        }
    }

    async importClick(mobile) {
        await this.fileimport.click();
    }

    async typeTestTextCode(mobile, string) {
        await this.filesaved.waitFor()
        // let letterArray = string.split('')
        for (var i = 0; i < string.length; i++) {
            await this.page.keyboard.press(`${string.charAt(i)}`)
        }
    }

	async share(mobile) {
        if (mobile) {
            await this.page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
        } else {
            await this.shareLink.click();
        }
	}

	async access(mobile) {
        if (mobile) {
            await this.page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
        } else {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
        }
		
    }

    async history(mobile) {
        if (mobile) {
            await this.filemenuMobile.click()
        } else {
            await this.filemenu.click()
        }
        await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' History' }).locator('a').click(); 
    }

    async export(mobile) {
        if (mobile) {
            await this.filemenuMobile.click()
        } else {
            await this.filemenu.click()
        }
        await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Export' }).locator('a').click();
    }

    async importTemplate(mobile, local) {
        if (mobile) {
            await this.filemenuMobile.click()
        } else {
            await this.filemenu.click()
        }

        if (local) {
            await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Import a template', exact: true }).click();
        } else {
            await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
        }
    }

    async saveTemplate(mobile, local) {
        if (mobile) {
            await this.filemenuMobile.click()
        } else {
            await this.filemenu.click()
        }
        await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
    }


}