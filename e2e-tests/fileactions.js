import { title } from 'process';

const { url, titleDate, titleDateComma } = require('../fixture.js');
const { expect } = require('@playwright/test');

export class FileActions {
  /**
	* @param {import('@playwright/test').Page} page
	*/
  constructor (page, testName, mobile) {
    this.page = page;
    this.mainFrame = page.frameLocator('#sbox-iframe');
    this.testName = testName;
    this.mobile = mobile;
    this.titleDate = titleDate
    this.titleDateComma = titleDateComma

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
    this.driveHistory = this.mainFrame.locator('[data-original-title="Display the document history"]')
    this.noNotifications = this.mainFrame.getByText('No notifications')
    this.notLoggedIn = this.mainFrame.locator('body').filter({ hasText: 'You are not logged in' })
    this.changeDriveView = this.mainFrame.locator('.cp-app-drive-viewmode-button')
    this.driveContentList = this.mainFrame.locator('.cp-app-drive-content-list')
    this.driveContentGrid = this.mainFrame.locator('.cp-app-drive-content-grid')
    this.eraseDrive = this.mainFrame.locator('.cp-toolbar-bottom-right').getByRole('button').nth(1)

    // file locators
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
    this.historyPrevFirst = this.mainFrame.locator('.cp-toolbar-history-previous').first();
    this.historyPrevLast = this.mainFrame.locator('.cp-toolbar-history-previous').last();
    this.toolbarButton = this.mainFrame.getByRole('button', { name: 'Tools' });
    // this.shareButton = this.mainFrame.getByRole('button', { name: ' Share' });
    this.shareByLink = this.mainFrame.locator('#cp-share-link-preview')
    this.shareSecureLink = this.page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' });
    this.shareCopyLink = this.page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' });
    this.fileSaved = this.mainFrame.getByText('Saved');
    this.deletebutton = this.mainFrame.getByRole('button', { name: 'Delete' });
    this.trash = this.mainFrame.getByText('Move to trash')

    this.destroy = this.mainFrame.getByRole('listitem').filter({ hasText: 'Destroy' });
    this.linkTab = this.page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link');
    this.linkTabMobile = this.page.frameLocator('#sbox-secure-iframe').getByLabel('Link');
    this.createFile = this.mainFrame.getByRole('button', { name: 'Create' });
    this.oneTimeLocal = this.mainFrame.getByRole('button', { name: 'One time ' })
    this.oneTime = this.mainFrame.getByRole('button', { name: ' One time' })
    this.textbox = this.mainFrame.getByRole('textbox')
    this.areYouSure = this.mainFrame.getByText('Are you sure?')
    this.pickHour = this.mainFrame.getByRole('spinbutton', { name: 'Hour' })
    this.pickMinute = this.mainFrame.getByRole('spinbutton', { name: 'Minute' })

    // buttons
    this.closeButtonSecure = this.page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' });
    this.closeButton = this.mainFrame.getByRole('button', { name: 'Close' });
    this.okButtonSecure = this.page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' });
    this.okButton = this.mainFrame.getByRole('button', { name: 'OK (enter)' });
    this.saveButton = this.page.getByRole('button', { name: 'Save' })
    this.updateButton = this.page.getByRole('button', { name: 'Update' })
    this.addButton = this.page.getByRole('button', { name: ' Add' })
    this.submitAnswer = this.mainFrame.getByRole('button', { name: 'Submit' })
    this.openButton = this.mainFrame.getByRole('button', { name: 'Open' })

    // code
    this.codeEditor = this.mainFrame.locator('.CodeMirror-scroll');
    this.codepreview = this.mainFrame.locator('#cp-app-code-preview-content');
    this.codeToolbar = this.mainFrame.locator('.cp-markdown-toolbar');

    // form
    this.copyPublicLink = this.mainFrame.getByRole('button', { name: 'Copy public link' });
    this.formSettings = this.mainFrame.getByRole('button', { name: ' Form settings' })
    this.closeModal = this.mainFrame.locator('.cp-modal-close')
    this.formOptionOne = this.mainFrame.getByText('Option 1')
    this.formOptionTwo = this.mainFrame.getByText('Option 2')
    this.answerAnon = this.mainFrame.getByText('Answer anonymously')
    this.editResponses = this.mainFrame.getByRole('button', { name: ' Edit my responses' })
    this.editQuestion = this.mainFrame.getByRole('button', { name: ' Edit' })
    this.checkbox = this.mainFrame.getByRole('button', { name: ' Checkbox' })
    this.answerOptionOne = this.mainFrame.locator('label').filter({ hasText: 'Option 1' }).locator('span').first()
    this.setClosingDate = this.mainFrame.getByRole('button', { name: 'Set closing date' })
    this.noResponses = this.mainFrame.getByRole('button', { name: ' Responses (0)' })
    this.oneResponse = this.mainFrame.getByRole('button', { name: ' Responses (1)' })
    this.oneTimeOnly = this.mainFrame.locator('#cp-form-settings').getByText('One time only')
    this.multipleTimes = this.mainFrame.locator('#cp-form-settings').getByText('Multiple times', { exact: true })
    this.multipleTimesEdit = this.mainFrame.locator('#cp-form-settings').getByText('Multiple times and edit/delete')
    this.submitAgain = this.mainFrame.getByRole('button', { name: ' Submit again' })
    this.thereAreNoResponses = this.mainFrame.getByText('There are no responses')
    this.questionHere = this.mainFrame.getByText('Your question here?')
    this.publishResponses = this.mainFrame.getByRole('button', { name: 'Publish responses' })
    this.addOption = this.mainFrame.getByRole('button', { name: ' Add option' })
    this.editOption = this.mainFrame.getByPlaceholder('Option 1')

    // pad
    this.padEditorBody = this.mainFrame.frameLocator('iframe[title="Editor\\, editor1"]').locator('body');
    this.padEditorHTML = this.mainFrame.frameLocator('iframe[title="Editor\\, editor1"]').locator('html');
    this.padToolbar = this.mainFrame.locator('.cke_toolbox_main.cke_reset_all')
    this.html = this.mainFrame.getByRole('button', { name: ' .html' })
    this.snapshots = this.mainFrame.getByText('Snapshots')
    this.newSnapshot = this.mainFrame.getByRole('button', { name: 'New snapshot' })
    this.addComment = this.mainFrame.locator('.cp-comment-bubble').locator('button')
    this.commentTextBox = this.mainFrame.getByRole('textbox', { name: 'Comment' })
    this.snapshotTitle = this.mainFrame.getByPlaceholder('Snapshot title')

    // markdown
    this.slideEditor = this.mainFrame.locator('.CodeMirror-code');
    this.slideContent = this.mainFrame.locator('#cp-app-slide-modal-content')
    this.nextSlide = this.mainFrame.locator('#cp-app-slide-modal-right span')

    //kanban
    this.addBoard = this.mainFrame.locator('#kanban-addboard')
    this.boardTitle = this.mainFrame.getByLabel('Title')
    this.editDoneBoard = this.mainFrame.getByRole('banner').filter({ hasText: 'Done' }).getByLabel('Edit this board')
    this.addItem = this.mainFrame.locator('.kanban-title-button')
    this.editItem = this.mainFrame.locator('#kanban-edit')
    this.editItemContent = this.mainFrame.getByRole('button', { name: 'Edit this card' })
    this.editItemTitle = this.mainFrame.getByRole('main').getByRole('button', { name: 'Edit this card' })
    this.kanbanContainer = this.mainFrame.locator('#cp-app-kanban-content')
    this.kanbanEditor = this.mainFrame.locator('.CodeMirror-lines')
    this.newBoard = this.mainFrame.getByText('New board')
    this.editNewBoard = this.mainFrame.getByRole('banner').filter({ hasText: 'New board' }).getByLabel('Edit this board')
    this.editKanbanTags = this.mainFrame.locator('#cp-kanban-edit-tags')
    this.kanbanContent = this.mainFrame.locator('#cp-app-kanban-content')
    this.clearFilter = this.mainFrame.getByRole('button', { name: ' Clear filter' })
    this.kanbanControls = this.mainFrame.frameLocator('#sbox-iframe').locator('#cp-kanban-controls')

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

  async clearFormQuestions() {
    await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().waitFor();
    await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
    await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).first().click();
    await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
  
  }

  async clickTags (local) {
    await this.mainFrame.getByRole('menuitem', { name: ' Tags' }).locator('a').click();
  }

  async clickLinkTab (mobile) {
    if (mobile) {
      await this.page.frameLocator('#sbox-secure-iframe').getByLabel('Link').click();
    } else {
      await this.page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link').click();
    }
  }

  async getLinkAfterCopy () {
    let clipboardText = await this.page.evaluate('navigator.clipboard.readText()');
    if (clipboardText === "") {
      console.log("empty string")
      await this.page.waitForTimeout(2000);
      await this.fileActions.share(this.mobile);
      await this.page.waitForTimeout(2000);

      await this.fileActions.clickLinkTab.click();
      clipboardText = await this.page.evaluate(() => navigator.clipboard.readText());
    }

    return clipboardText
  }

  async getLinkAfterCopyForm () {
    let clipboardText = await this.page.evaluate('navigator.clipboard.readText()');
    if (clipboardText === "") {
      await this.page.waitForTimeout(2000);
      await this.copyPublicLink.click();
      await this.page.waitForTimeout(2000);
      clipboardText = await this.page.evaluate(() => navigator.clipboard.readText());
    }
    return clipboardText
  }

  async getShareLink (mobile) {
    await this.share(mobile);
    await this.shareCopyLink.click();
    const clipboardText = this.getLinkAfterCopy()
    return clipboardText
  }

  driveListViewSpan (item) {
    const regex = new RegExp(`^${item}$`);
    return this.mainFrame.locator('span').filter({ hasText: regex })
  }

  async responses (visible) {
    if (visible) {
      await this.mainFrame.getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await this.page.reload();
      await this.mainFrame.getByRole('button', { name: ' Responses (1)' }).waitFor()
      await this.mainFrame.getByRole('button', { name: ' Responses (1)' }).click();
    }
  }

  async filemenuClick (mobile) {
    await this.page.waitForTimeout(1000)
    await this.fileSaved.waitFor()
    if (mobile) {
      await this.filemenuMobile.waitFor();
      await this.filemenuMobile.click();
    } else {
      await this.filemenu.waitFor();
      await this.filemenu.click();
    }
  }
  
  async publicLinkCopy () {
    await this.copyPublicLink.waitFor();
    await this.copyPublicLink.click();
    return this.getLinkAfterCopyForm()
  
  }

  driveMenuItem (item, first) {
    return first ? this.mainFrame.locator('a').filter({ hasText: `${item}` }).first() : this.mainFrame.locator('a').filter({ hasText: `${item}` })
  
  }

  getTitle (fileName) {
    var titleDate = `${fileName} - ${this.titleDate}`;
    var titleDateComma = `${fileName} - ${this.titleDateComma}`
    return [titleDate, titleDateComma]
  }

  driveFileTitle (fileName) {
    var titles = this.getTitle(fileName)
    var title = titles[0]
    var titleComma = titles[1]
    return this.mainFrame.getByText(title).or(this.mainFrame.getByText(titleComma))
  }

  fileTitle (fileName) {
    var titles = this.getTitle(fileName)
    var title = titles[0]
    var titleComma = titles[1]
    return this.fileName.getByText(`${title}`).or(this.fileName.getByText(`${titleComma}`));
  }

  driveAddMenuItem (item, first) {
    return this.mainFrame.getByRole('listitem').filter({ hasText: item })
  }

  async togglePreview (mobile) {
    if (mobile) {
      await this.mainFrame.locator('.cp-toolbar-rightside-button').locator('.fa.fa-eye').click();
    } else {
      await this.mainFrame.getByRole('button', { name: 'Preview' }).click();
    }
  }

  async toggleTools (mobile) {
    if (mobile) {
      await this.mainFrame.locator('.cp-toolbar-tools').waitFor();
      await this.mainFrame.locator('.cp-toolbar-tools').click();
    } else {
      await this.mainFrame.getByRole('button', { name: 'Tools' }).waitFor();
      await this.mainFrame.getByRole('button', { name: 'Tools' }).click();
    }
  }

  async importClick (mobile) {
    await this.fileimport.click();
  }

  async typeTestTextCode (mobile, string) {
    await this.fileSaved.waitFor();
    for (let i = 0; i < string.length; i++) {
      await this.page.keyboard.press(`${string.charAt(i)}`);
    }
  }

  async share (mobile) {
    if (mobile) {
      await this.mainFrame.locator('.cp-toolar-share-button').waitFor()
      await this.mainFrame.locator('.cp-toolar-share-button').click();
    } else {
      await this.shareButton.waitFor()
      await this.shareButton.click();
    }
  }

  async access (mobile) {
    if (mobile) {
      await this.mainFrame.locator('.cp-toolar-access-button').click();
    } else {
      await this.mainFrame.getByRole('button', { name: ' Access' }).click();
    }
  }

  async history (mobile) {
    await this.filemenuClick(mobile);
    await this.mainFrame.getByRole('menuitem', { name: ' History' }).locator('a').click();
  }

  async export (mobile) {
    await this.filemenuClick(mobile);
    await this.mainFrame.getByRole('menuitem', { name: ' Export' }).locator('a').click();
  }

  async importTemplate (mobile, local) {
    await this.filemenuClick(mobile);
    await this.mainFrame.getByRole('menuitem', { name: ' Import a template' }).locator('a').waitFor()
    await this.mainFrame.getByRole('menuitem', { name: ' Import a template' }).locator('a').click();
  }

  async saveTemplate (mobile, local) {
    await this.filemenuClick(mobile);
    await this.mainFrame.getByRole('menuitem', { name: ' Save as template' }).locator('a').click();
  }

  async setStatus (status, reason) {
    await this.page.evaluate(
      _ => {
      },
      `browserstack_executor: ${JSON.stringify({
        action: 'setSessionStatus',
        arguments: {
          name: this.testName,
          status,
          reason
        }
      })}`
    );
  }

    /**
   * Marks the test as successful.
   * @param reason
   * @returns {Promise<void>}
   */
  async toSuccess (reason) {
    await this.setStatus('passed', reason);
  }

  /**
   * Marks the test as failed.
   * @param exception
   * @param reason
   * @returns {Promise<void>}
   */
  async toFailure (exception, reason) {
    console.log(exception);
    await this.setStatus('failed', reason);
    throw exception;
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

exports.StoreModal = StoreModal;