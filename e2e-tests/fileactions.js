import { title } from 'process';

const { url, titleDate, titleDateComma } = require('../fixture.js');
const { expect } = require('@playwright/test');

export class FileActions {
  /**
	* @param {import('@playwright/test').Page} page
	*/
  constructor (page, testName, mobile) {
    this.page = page;

    // user actions-related locators
    this.login = page.locator('.login');
    this.register = page.locator("[id='register']");
    this.loginLink = this.mainFrame.getByRole('link', { name: 'Log in' });
    this.registerLink = this.mainFrame.getByRole('link', { name: 'Sign up' });

    // drive locators
    this.drivemenu = this.mainFrame.locator('.cp-toolbar-user-dropdown.cp-dropdown-container');
    this.driveadd = this.mainFrame.locator('#cp-app-drive-content-folder span').first();
    this.notifications = this.mainFrame.getByLabel('Notifications');
    this.driveContentFolder = this.mainFrame.locator('#cp-app-drive-content-folder');
    this.newFile = this.mainFrame.getByRole('listitem').filter({ hasText: /^New$/ });
    this.settings = this.mainFrame.getByText('Settings');
    this.driveSideMenu = this.mainFrame.locator('#cp-app-drive-tree');

    // file locators

    this.page = page;
    this.testName = testName;
    this.mobile = mobile;
    

    // locators
    this.mainFrame = page.frameLocator('#sbox-iframe');
    this.newFile = this.mainFrame.getByRole('menuitem', { name: 'New' }).locator('a');
    this.storeFile = this.mainFrame.getByRole('menuitem', { name: 'Store' }).locator('a');
    this.trashFile = this.mainFrame.getByRole('menuitem', { name: 'Move to trash' }).locator('a');
    this.alertMessage = this.mainFrame.locator('.alertify').locator('.msg');
    this.okButton = this.mainFrame
      .locator('.dialog')
      .getByRole('button', { name: 'OK (enter)' })
      .first();
    this.cancelButton = this.mainFrame.getByRole('button', { name: 'Cancel (esc)' });
    this.storageSuccess = this.mainFrame.locator('alertify-logs');

    this.shareButton = this.mainFrame.getByRole('button', { name: 'Share' });

    this.fileName = this.mainFrame.locator('.cp-toolbar-title');
    this.titleEditBox = this.mainFrame.locator('.cp-toolbar-title-edit > .fa');
    this.titleInput = this.mainFrame.locator('.cp-toolbar-title').locator('input');
    this.saveTitle = this.mainFrame.locator('.cp-toolbar-title-save');

    this.filemenu = this.mainFrame.getByRole('button', { name: ' File' });
    this.filemenuMobile = this.mainFrame.locator('.cp-toolbar-file');
    this.fileimport = this.mainFrame.getByRole('menuitem', { name: ' Import' }).locator('a');
    this.filecopy = this.mainFrame.getByRole('menuitem', { name: ' Make a copy' }).locator('a');
    this.historyPrev = this.mainFrame.locator('.cp-toolbar-history-previous').last();
    this.toolbar = this.mainFrame.getByRole('button', { name: 'Tools' });
    this.shareLink = this.mainFrame.getByRole('button', { name: ' Share' });
    this.shareSecureLink = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' });
    this.shareCopyLink = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' });
    this.filesaved = this.mainFrame.getByText('Saved');
    this.deletebutton = this.mainFrame.getByRole('button', { name: 'Delete' });
    this.trash = this.mainFrame.getByText('Move to trash')

    this.destroy = this.mainFrame.getByRole('listitem').filter({ hasText: 'Destroy' });
    this.linkTab = page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link');
    this.linkTabMobile = page.frameLocator('#sbox-secure-iframe').getByLabel('Link');
    this.createFile = this.mainFrame.getByRole('button', { name: 'Create' });
    this.oneTimeLocal = this.mainFrame.getByRole('button', { name: 'One time ' })
    this.oneTime = this.mainFrame.getByRole('button', { name: ' One time' })

    // buttons
    this.closeButtonSecure = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' });
    this.closeButton = this.mainFrame.getByRole('button', { name: 'Close' });
    this.okButtonSecure = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' });
    this.okButton = this.mainFrame.getByRole('button', { name: 'OK (enter)' });


    // code
    this.codeeditor = this.mainFrame.locator('.CodeMirror-scroll');
    this.codepreview = this.mainFrame.locator('#cp-app-code-preview-content');

    // form
    this.copyPublicLink = this.mainFrame.getByRole('button', { name: 'Copy public link' });

    // pad
    this.padeditor = this.mainFrame.frameLocator('iframe[title="Editor\\, editor1"]');

    // markdown
    this.slideeditor = this.mainFrame.locator('.CodeMirror-code');
  }

  async moveToTrash() {
      await this.trash.click()
  }

  async oneTimeClick(local) {
    if (local) {
      await this.oneTimeLocal.click()
    } else {
      await this.oneTime.click()
    }
  
  }

  async title (title) {
    return this.this.mainFrame.locator('.cp-toolbar-title').getByText(`${title}`);
  }

  async clickTags (local) {
    await this.this.mainFrame.getByRole('menuitem', { name: ' Tags' }).locator('a').click();
  }

  async clickLinkTab (mobile) {
    if (mobile) {
      await this.page.frameLocator('#sbox-secure-iframe').getByLabel('Link').click();
    } else {
      await this.page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
    }
  }

  async responses (visible) {
    if (visible) {
      await this.this.mainFrame.getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await this.page.reload();
      await this.this.mainFrame.getByRole('button', { name: ' Responses (1)' }).waitFor()
      await this.this.mainFrame.getByRole('button', { name: ' Responses (1)' }).click();
    }
  }

  async filemenuClick (mobile) {
    await this.page.waitForTimeout(1000)
    await this.filesaved.waitFor()
    if (mobile) {
      await this.filemenuMobile.waitFor();
      await this.filemenuMobile.click();
    } else {
      await this.filemenu.waitFor();
      await this.filemenu.click();
    }
  }

  async togglePreview (mobile) {
    if (mobile) {
      await this.this.mainFrame.locator('.cp-toolbar-rightside-button').locator('.fa.fa-eye').click();
    } else {
      await this.this.mainFrame.getByRole('button', { name: 'Preview' }).click();
    }
  }

  async toggleTools (mobile) {
    if (mobile) {
      await this.this.mainFrame.locator('.cp-toolbar-tools').waitFor();
      await this.this.mainFrame.locator('.cp-toolbar-tools').click();
    } else {
      await this.this.mainFrame.getByRole('button', { name: 'Tools' }).waitFor();
      await this.this.mainFrame.getByRole('button', { name: 'Tools' }).click();
    }
  }

  async importClick (mobile) {
    await this.fileimport.click();
  }

  async typeTestTextCode (mobile, string) {
    await this.filesaved.waitFor();
    for (let i = 0; i < string.length; i++) {
      await this.page.keyboard.press(`${string.charAt(i)}`);
    }
  }

  async share (mobile) {
    if (mobile) {
      await this.this.mainFrame.locator('.cp-toolar-share-button').waitFor()
      await this.this.mainFrame.locator('.cp-toolar-share-button').click();
    } else {
      await this.shareLink.waitFor()
      await this.shareLink.click();
    }
  }

  async access (mobile) {
    if (mobile) {
      await this.this.mainFrame.locator('.cp-toolar-access-button').click();
    } else {
      await this.this.mainFrame.getByRole('button', { name: ' Access' }).click();
    }
  }

  async history (mobile) {
    await this.filemenuClick(mobile);
    await this.this.mainFrame.getByRole('menuitem', { name: ' History' }).locator('a').click();
  }

  async export (mobile) {
    await this.filemenuClick(mobile);
    await this.this.mainFrame.getByRole('menuitem', { name: ' Export' }).locator('a').click();
  }

  async importTemplate (mobile, local) {
    await this.filemenuClick(mobile);
    console.log()
    if (local) {
      await this.this.mainFrame.getByRole('button', { name: ' Import a template', exact: true }).waitFor()
      await this.this.mainFrame.getByRole('button', { name: ' Import a template', exact: true }).click();
    } else {
      await this.this.mainFrame.getByRole('menuitem', { name: ' Import a template' }).locator('a').waitFor()
      await this.this.mainFrame.getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
    }
  }

  async saveTemplate (mobile, local) {
    await this.filemenuClick(mobile);
    await this.this.mainFrame.getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
  }

  
}

class NewFileModal {
  constructor (filePage) {
    this.filePage = filePage;
    this.modalRoot = filePage.mainFrame.locator('#cp-app-toolbar-creation-dialog');
    this.close = this.modalRoot.locator('.cp-modal-close');
  }

  async createFileOfType (context, fileType) {
    // For new tabs, see https://playwright.dev/docs/pages#handling-new-pages
    const pagePromise = context.waitForEvent('page');
    await this.iconLocator(fileType).click();
    const nextPage = await pagePromise;
    return new FilePage(nextPage, this.filePage.testName, this.filePage.mobile);
  }

  iconLocator (fileType) {
    return this
      .filePage
      .mainFrame
      .getByText(
        this.iconName(fileType),
        { exact: true }
      );
  }

  iconName (fileType) {
    switch (fileType) {
      case 'pad':
        return 'Rich text';
      case 'slide':
        return 'Markdown slides';
      default:
        return `${fileType.charAt(0).toUpperCase() + fileType.slice(1)}`;
    }
  }
}


class ShareFileModal {
  constructor (filePage) {
    this.filePage = filePage;
    this.shareFrame = filePage.page.frameLocator('#sbox-secure-iframe');
    this.openButton = this.shareFrame.getByRole('button', { name: 'Open Link' });
    this.copyButton = this.shareFrame.getByRole('button', { name: 'Copy Link' });
  }

  toggle (text) {
    return this.shareFrame.getByText(text, { exact: true });
  }

  viewToggle (fileType) {
    if (fileType === 'form') {
      return this.toggle('Participant');
    } else {
      return this.toggle('View');
    }
  }

  async getLinkAfterCopy () {
    return await this.filePage.page.evaluate('navigator.clipboard.readText()');
  }

  async openLinkClick (context) {
    const pagePromise = context.waitForEvent('page');
    await this.openButton.click();
    const nextPage = await pagePromise;
    return new FilePage(nextPage, this.filePage.testName, this.filePage.mobile);
  }
}

class ChatModal {
  constructor (filePage) {
    this.filePage = filePage;
    this.chatPane = this.filePage.mainFrame.locator('.cp-app-contacts-chat');
    this.chatInput = this.chatPane.getByPlaceholder('Type a message here...');
  }

  async enterText (text) {
    await this.chatInput.click();
    await this.chatInput.fill(text);
    await this.chatInput.press('Enter');
  }
}

class StoreModal {
  constructor (filePage) {
    this.filePage = filePage;
    this.storePane = this.filePage.mainFrame.locator('.cp-corner-container');
    this.dismissButton = this.storePane.getByRole('button', { name: 'Don\'t store', exact: true });
    this.storeButton = this.storePane.getByRole('button', { name: 'Store', exact: true });
  }
}

