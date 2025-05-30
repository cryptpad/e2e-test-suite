// import { thresholdFreedmanDiaconis } from 'd3';
// import { title } from 'process';


const { url, titleDate, titleDateComma, titleDateTwoCommas, dateTodayDashFormat } = require('../fixture.js');
const { expect } = require('@playwright/test');

export class FileActions {
  /**
	* @param {import('@playwright/test').Page} page
	*/
  constructor (page, mobile, testName, ) {
    this.page = page;
    this.mainFrame = page.frameLocator('#sbox-iframe');
    this.secureFrame = page.frameLocator('#sbox-secure-iframe')
    this.testName = testName;
    this.mobile = mobile;
    this.titleDate = titleDate
    this.titleDateComma = titleDateComma
    this.titleDateTwoCommas = titleDateTwoCommas

    // user actions-related locators
    this.login = page.locator('.login');
    this.register = page.locator("[id='register']");
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.registerLink = page.getByRole('link', { name: 'Sign up' });
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password', { exact: true })

    // drive locators
        this.passwordPlaceholderSettings = this.mainFrame.getByPlaceholder('Password', { exact: true })

<<<<<<< HEAD
    // file actions
    this.filemenu = page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' });
    this.filemenuMobile = page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file');
    this.fileimport = page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Import' }).locator('a');
    this.filecopy = page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: ' Make a copy' }).locator('a');
    this.historyPrev = page.frameLocator('#sbox-iframe').locator('.cp-toolbar-history-previous').last();
    this.toolbar = page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Tools' });
    this.shareLink = page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' });
    this.shareSecureLink = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' });
    this.shareCopyLink = page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' });
    this.filesaved = page.frameLocator('#sbox-iframe').getByText('Saved').nth(0);
    this.deletebutton = page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' });
    // this.trash = page.frameLocator('#sbox-iframe').getByRole('listitem').filter({ hasText: 'Move to trash' });
    this.trash = page.frameLocator('#sbox-iframe').getByText('Move to trash')
=======
>>>>>>> main

    this.loginLinkDrive = this.mainFrame.getByRole('link', { name: 'Log in' });
    this.registerLinkDrive = this.mainFrame.getByRole('link', { name: 'Sign up' });
    this.drivemenu = this.mainFrame.locator('.cp-toolbar-user-dropdown.cp-dropdown-container');
    this.driveadd = this.mainFrame.locator('#cp-app-drive-content-folder span').first();
    this.notifications = this.mainFrame.getByRole('button', { name: 'Notifications' })
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
    this.fileUploadClose = this.mainFrame.locator('.cp-fileupload-header-close > .fa')
    this.notifPanel = this.mainFrame.getByText('Open notifications panel')
    this.filesButton = this.mainFrame.getByRole('button', { name: ' Files' })
    this.template = this.mainFrame.locator('.cp-app-drive-element-name').filter({ hasText: 'template' })
    this.cleanNotifs = this.mainFrame.locator('div').filter({ hasText: /^Notifications - All$/ }).locator('span')

    // file locators
    // this.newFile = this.mainFrame.getByRole('menuitem', { name: 'New' }).locator('a');
    // this.storeFile = this.mainFrame.getByRole('menuitem', { name: 'Store' }).locator('a');
    // this.trashFile = this.mainFrame.getByRole('menuitem', { name: 'Move to trash' }).locator('a');
    this.alertMessage = this.mainFrame.locator('.alertify').locator('.msg');
    this.okButton = this.mainFrame
      .locator('.dialog')
      .getByRole('button', { name: 'OK (enter)' })
      .first();
    this.cancelButtonEsc = this.mainFrame.getByRole('button', { name: 'Cancel (esc)' });
    this.storageSuccess = this.mainFrame.locator('alertify-logs');

    this.shareButton = this.mainFrame.getByRole('button', { name: 'Share' });

    this.fileName = this.mainFrame.locator('.cp-toolbar-title');
    this.titleEditBox = this.mainFrame.locator('.cp-toolbar-title-edit > .fa');
    this.titleInput = this.mainFrame.locator('.cp-toolbar-title').locator('input');
    this.saveTitle = this.mainFrame.locator('.cp-toolbar-title-save');

    this.filemenu = this.mainFrame.getByRole('button', { name: ' File' });
    this.filemenuMobile = this.mainFrame.locator('.cp-toolbar-file');
    // this.fileimport = this.mainFrame.getByRole('menuitem', { name: ' Import' }).locator('a');
    // this.fileMenuItem(' Make a copy') = this.mainFrame.getByRole('menuitem', { name: ' Make a copy' }).locator('a');
    this.historyPrevFirst = this.mainFrame.locator('.cp-toolbar-history-previous').first();
    this.historyPrevLast = this.mainFrame.locator('.cp-toolbar-history-previous').last();
    this.toolbarButton = this.mainFrame.getByRole('button', { name: 'Tools' });
    // this.shareButton = this.mainFrame.getByRole('button', { name: ' Share' });
    this.shareByLink = this.mainFrame.locator('#cp-share-link-preview')
    this.shareSecureLink = this.page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Share' });
    this.shareCopyLink = this.page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: ' Copy link' });
    this.fileSaved = this.mainFrame.getByText('Saved');
    this.deleteButton = this.mainFrame.getByRole('button', { name: 'Delete' });
    this.moveToTrash = this.mainFrame.getByText('Move to trash')
    this.passwordChangeSuccess = this.secureFrame.getByText('The password was successfully')

    this.destroy = this.mainFrame.getByRole('listitem').filter({ hasText: 'Destroy' });
    this.destroyItem = this.mainFrame.getByText('Destroy')
    this.destroyButton = this.mainFrame.getByRole('button', { name: ' Destroy' })
    this.linkTab = this.page.frameLocator('#sbox-secure-iframe').locator('#cp-tab-link');
    this.linkTabMobile = this.page.frameLocator('#sbox-secure-iframe').getByLabel('Link');
    this.createFile = this.mainFrame.getByRole('button', { name: 'Create' });
    this.oneTimeLocal = this.mainFrame.getByRole('button', { name: 'One time ' })
    this.oneTime = this.mainFrame.getByRole('button', { name: ' One time' })
    this.textbox = this.mainFrame.getByRole('textbox')
    this.areYouSure = this.mainFrame.getByText('Are you sure?')
    this.areYouSureButton = this.mainFrame.getByRole('button', { name: 'Are you sure?' })
    this.pickHour = this.mainFrame.getByRole('spinbutton', { name: 'Hour' })
    this.pickMinute = this.mainFrame.getByRole('spinbutton', { name: 'Minute' })
    
    this.downloadCryptDrive = this.mainFrame.getByText('Download my CryptDrive')
    this.driveSideBar = this.mainFrame.locator('#cp-sidebarlayout-leftside')
    this.filterDrive = this.mainFrame.getByRole('button', { name: 'Filter' })
    this.newItem = this.mainFrame.getByRole('button', { name: ' New' })
    this.newPasswordMessage = this.mainFrame.getByText(/^This document is protected with a new password/)
    this.typePassword = this.mainFrame.getByPlaceholder('Type the password here...')
    this.readOnly = this.mainFrame.getByText('Read only')
    this.destroyedByOwner = this.mainFrame.getByText('This document was destroyed by an owner')
    this.notAuthorisedToAccess = this.mainFrame.getByText(/^You are not authorized to access this document/)
    this.teamSlot = this.mainFrame.locator('#cp-sidebarlayout-rightside')
    this.emptyTrash = this.mainFrame.getByRole('button', { name: ' Empty the trash' })
    this.teamNotif = this.mainFrame.getByText('test-user has invited you to join their team: test team')
    

    // buttons
    this.closeButtonSecure = this.page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'Close' });
    this.closeButton = this.mainFrame.getByRole('button', { name: 'Close' });
    this.okButtonSecure = this.page.frameLocator('#sbox-secure-iframe').getByRole('button', { name: 'OK (enter)' });
    this.okButton = this.mainFrame.getByRole('button', { name: 'OK (enter)' });
    this.saveButton = this.mainFrame.getByRole('button', { name: 'Save' })
    this.updateButton = this.mainFrame.getByRole('button', { name: 'Update' })
    this.addButton = this.mainFrame.getByRole('button', { name: ' Add' })
    this.submitButton = this.mainFrame.getByRole('button', { name: 'Submit' })
    this.submitButtonSecure = this.secureFrame.getByRole('button', { name: 'Submit' })
    this.openButton = this.mainFrame.getByRole('button', { name: 'Open' })
    this.acceptButton = this.mainFrame.getByRole('button', { name: 'Accept (Enter)' })

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
    this.answerAnonSpan = this.mainFrame.locator('label').filter({ hasText: 'Answer anonymously' }).locator('span').first()
    this.editResponses = this.mainFrame.getByRole('button', { name: ' Edit my responses' })
    this.editQuestion = this.mainFrame.getByRole('button', { name: ' Edit' })
    this.checkbox = this.mainFrame.getByRole('button', { name: ' Checkbox' })
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
    this.textButton = this.mainFrame.getByRole('button', { name: ' Text' })
    this.mobileTimepicker = this.mainFrame.locator('.flatpickr-am-pm')
    this.formContainer = this.mainFrame.locator('#cp-app-form-container')
    this.formEditor = this.mainFrame.locator('#cp-app-form-editor')
    this.openForm = this.mainFrame.getByRole('button', { name: 'Open', exact: true })
    this.formStatus = this.mainFrame.locator('#cp-form-settings')
    this.conditionalSection = this.mainFrame.getByRole('button', { name: ' Conditional section' })
    this.orCondition = this.mainFrame.getByRole('button', { name: ' Add OR condition' })
    this.andCondition = this.mainFrame.getByRole('button', { name: ' Add AND condition' })
    this.chooseQuestion = this.mainFrame.getByRole('button', { name: ' Choose a question' })
    this.chooseValue = this.mainFrame.getByRole('button', { name: ' Choose a value' })
    this.removeClosingDate = this.mainFrame.getByRole('button', { name: 'Remove closing date', exact: true })
    this.anonymizeResponses = this.mainFrame.locator('label').filter({ hasText: 'Anonymize responses' }).locator('span').first()
    this.showIndividualAnswers = this.mainFrame.getByRole('button', { name: 'Show individual answers' })
    this.oneTotalResponse = this.mainFrame.getByRole('heading', { name: 'Total responses: 1' })
    this.formTextBox = this.mainFrame.locator('#cp-app-form-container input[type="text"]')
    this.formEditorButton = this.mainFrame.getByRole('button', { name: ' Editor' })
    this.exportToSheet = this.mainFrame.getByRole('button', { name: ' Export to Sheet' })
    this.pageBreak = this.mainFrame.getByRole('button', { name: ' Page break' })
    this.nextPage = this.mainFrame.locator('.btn.btn-secondary.cp-next')
    this.pollCell = this.mainFrame.locator('.cp-poll-cell > i').first()
    this.poll = this.mainFrame.getByRole('button', { name: ' Poll' })
    this.listOption = this.mainFrame.getByText(/^\?test option/)
    this.orderedListOption = this.mainFrame.getByText(/^test option/)
    this.addQuestion = this.mainFrame.locator('.btn.cp-form-creator-inline-add').nth(2)
    this.textQuestion = this.mainFrame.locator('.cptools.cptools-form-text').nth(2)
    this.orderedList = this.mainFrame.getByRole('button', { name: ' Ordered list' })
    this.paragraphQuestion = this.mainFrame.getByRole('button', { name: ' Paragraph' })
    this.paragraphQuestionContent = this.mainFrame.locator('#cp-app-form-container textarea')
    this.paragraphAnswer = this.mainFrame.locator('textarea')
    this.choiceQuestion = this.mainFrame.getByRole('button', { name: ' Choice' })
    this.choiceQuestionInput = this.mainFrame.locator('.cp-form-edit-block-input > input')
    this.checkboxGridQuestion = this.mainFrame.getByRole('button', { name: ' Checkbox Grid' })
    this.dateQuestion = this.mainFrame.getByRole('button', { name: ' Date' })
    this.choiceGridItem = this.mainFrame.locator('div').filter({ hasText: /^Add item$/ }).getByRole('textbox')
    this.choiceGridOption = this.mainFrame.locator('div').filter({ hasText: /^Add option$/ }).getByRole('textbox')
    this.choiceGridQuestion = this.mainFrame.getByRole('button', { name: ' Choice Grid' })
    this.requiredQuestion = this.mainFrame.locator('.cp-checkmark-label').getByText('Required').nth(0)
    this.viewAllResponses = this.mainFrame.getByRole('button', { name: ' View all responses (1)' })

    // pad
    this.padEditor = this.mainFrame.frameLocator('iframe[title="Editor\\, editor1"]')
    this.padEditorBody = this.mainFrame.frameLocator('iframe[title="Editor\\, editor1"]').locator('body');
    this.padEditorHTML = this.mainFrame.frameLocator('iframe[title="Editor\\, editor1"]').locator('html');
    this.padToolbar = this.mainFrame.locator('.cke_toolbox_main.cke_reset_all')
    this.html = this.mainFrame.getByRole('button', { name: ' .html' })
    this.snapshots = this.mainFrame.getByText('Snapshots')
    this.newSnapshot = this.mainFrame.getByRole('button', { name: 'New snapshot' })
    this.addComment = this.mainFrame.locator('.cp-comment-bubble').locator('button')
    this.commenttextbox = this.mainFrame.getByRole('textbox', { name: 'Comment' })
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
    this.kanbanControls = this.mainFrame.locator('#cp-kanban-controls')

    // teams
    this.typeMessage = this.mainFrame.getByRole('textbox', { name: 'Type a message here...' }).first()
    this.teamAddNotif = this.mainFrame.getByText('test-user has invited you to join their team: test team')
    this.demoteTestUser3Arrow = this.mainFrame.locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').last()
    this.promoteTestUser3Arrow = this.mainFrame.locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-up')
    this.inviteMembers = this.mainFrame.getByText('Invite members')
    this.teamAdmin = this.mainFrame.getByText('Administration')
    this.inviteMembersButton = this.mainFrame.getByRole('button', { name: 'Invite members' })
    this.inviteButton = this.mainFrame.getByRole('button', { name: 'Invite', exact: true })
    this.leaveTeam = this.mainFrame.getByRole('button', { name: 'Leave this team' })
    this.download = this.mainFrame.getByRole('button', { name: 'Download' })
    this.teamRemovalNotification = this.mainFrame.getByText('test-user has kicked you from the team: test team')
    this.dismissNotification = this.mainFrame.locator('.cp-notification-dismiss').first()

    // user settings
    this.passwordChanged = this.mainFrame.getByText('Your password is being')
    this.securityPrivacy = this.mainFrame.getByText('Security & Privacy')
    this.currentPassword = this.mainFrame.getByRole('textbox', { name: 'Current password' })
    this.changePassword = this.mainFrame.getByRole('button', { name: 'Change password' })
    this.cancelButton = this.mainFrame.getByRole('button').filter({ hasText: 'Cancel' })
    this.displayName = this.mainFrame.locator('#cp-settings-displayname')
    this.saveDisplayName = this.mainFrame.locator('div').filter({ hasText: /^Display nameSave$/ }).getByRole('button', { name: 'Save' })
    this.newPassword = this.mainFrame.getByPlaceholder('New password', { exact: true })
    this.doneButton = this.mainFrame.getByRole('button', { name: ' Done' })
    this.continueButton = this.page.getByRole('button', { name: 'Continue' })
    this.continueButton2FA = this.mainFrame.getByRole('button', { name: 'Continue' })
    this.confirmPassword = this.mainFrame.getByPlaceholder('Confirm new password')
    this.contactRequest = this.mainFrame.getByRole('button').filter({ hasText: 'contact request' })
    this.removeContact = this.mainFrame.getByRole('button', { name: ' Remove this contact' })
    this.cancelRequest = this.mainFrame.getByText('Contact request pending...Cancel')
    this.cancelIconButton = this.mainFrame.getByRole('button', { name: ' Cancel' })
    this.enable2FA = this.mainFrame.getByRole('button', { name: ' Enable 2FA' })
    this.loadingMessage = this.mainFrame.locator('#cp-loading-message')
    this.done = this.mainFrame.locator('div').filter({ hasText: /^Done$/ }).getByRole('textbox')
    this.disable2FA = this.mainFrame.getByRole('button', { name: 'Disable 2FA' })
    this.confirmButton = this.page.getByRole('button', { name: 'Confirm' })
    this.twoFAinput = this.mainFrame.locator('#cp-sidebarlayout-rightside div').filter({ hasText: 'Two-Factor Authentication (' }).locator('input[type="text"]')
    this.recoverAccount = this.page.getByRole('link', { name: 'Recover your account' })
    this.confirmDisable2FA = this.mainFrame.getByRole('button', { name: 'Confirm disable 2FA' })
    this.verificationCode = this.page.getByPlaceholder('Verification code')
    this.verificationCodeFrame = this.mainFrame.getByPlaceholder('Verification code')
    this.shareLinkButton = page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' });
    
    // calendar 
    this.newEvent = this.mainFrame.getByRole('button', { name: 'New event' })
    this.newEventMobile = this.mainFrame.locator('.cp-calendar-newevent')
    this.calendarTitle =  this.mainFrame.getByPlaceholder('Title')
    this.calendarTestEvent = this.mainFrame.locator('.tui-full-calendar-time-schedule-content').getByText('test event')
    this.nextWeek = this.mainFrame.getByLabel('Right')
    this.prevWeek = this.mainFrame.getByRole('button', { name: 'Left' })
    this.editEvent = this.mainFrame.getByRole('button', { name: ' Edit' })
    this.eventLocation = this.mainFrame.getByPlaceholder('Location')
    this.startDate = this.mainFrame.getByPlaceholder('Start date')
    this.endDate = this.mainFrame.getByPlaceholder('End date')
    this.calendarSlot = this.mainFrame.locator('#cp-sidebarlayout-rightside')
    this.newCalendar = this.mainFrame.getByRole('button', { name: 'New calendar' })
    this.calendarSettings = this.mainFrame.getByLabel('Calendar Settings')
    this.myCalendar = this.mainFrame.getByRole('button', { name: 'My calendar' })
    this.remove = this.mainFrame.locator('a').filter({ hasText: 'Remove' }).nth(1)
    this.testEvent = this.mainFrame.getByText('test event')
    this.testCalendar = this.mainFrame.getByText('test calendar')
    this.testCalendarSettings = this.mainFrame.locator('div').filter({ hasText: /^test calendar/ }).locator('.btn.btn-default.fa.fa-gear.small.cp-calendar-actions')
    this.contactList = this.mainFrame.locator('#cp-app-contacts-friendlist')
    this.displayName =  this.mainFrame.locator('#cp-settings-displayname')

    this.owners = this.secureFrame.locator('#cp-tab-owners')
    this.tagInput = this.mainFrame.locator('.token-input.ui-autocomplete-input')
    this.tag = this.mainFrame.getByRole('link', { name: '#testtag' })
    this.addOwner = this.secureFrame.locator('.cp-share-column-mid > .btn').nth(1)
    this.usersPanel = this.mainFrame.locator('.fa.fa-users').nth(1)
    this.templateName = this.mainFrame.locator('.dialog').getByRole('textbox')
    this.creationPassword = this.mainFrame.locator('#cp-creation-password-val')
    this.changePasswordInput = this.secureFrame.locator('#cp-app-prop-change-password')
    this.formTextInput = this.mainFrame.locator('span').filter({ hasText: 'Your text here' })
    this.whiteBoardCanvas = this.mainFrame.locator('canvas').nth(1)
    this.clearButton = this.mainFrame.getByRole('button', { name: 'Clear' })
    this.whiteBoardText = this.mainFrame.locator('.cp-whiteboard-text')
    this.whiteBoardDelete = this.mainFrame.locator('#cp-app-whiteboard-delete')
    this.whiteBoardArrows = this.mainFrame.locator('.btn.move.fa.fa-arrows')
    this.whiteBoardWidth = this.mainFrame.getByLabel('Width:')
    this.whiteBoardOpacity = this.mainFrame.getByLabel('Opacity:')

    this.displayNamePlaceholder = this.mainFrame.getByPlaceholder('Guest')
    this.newTeam = this.mainFrame.getByText('Available team slotNew').first()
    this.declineButton = this.mainFrame.getByRole('button', { name: 'Decline' })
    this.begin2FASetup = this.mainFrame.getByRole('button', { name: 'Begin 2FA setup' })
    this.passwordConfirmation = this.mainFrame.getByRole('button', { name: 'I have written down my username and password, proceed' })
    this.passwordPlaceholder = this.page.getByPlaceholder('Password')
    this.twoFAIsActive = this.mainFrame.getByText('2FA is active')
    this.profileDisplayName = this.mainFrame.locator('#cp-app-profile-displayname')
    this.driveElementText = this.mainFrame.locator('.cp-app-drive-element-name-text')
    this.trash = this.mainFrame.getByText('Trash', { exact: true })
    this.removeButton = this.mainFrame.getByRole('button', { name: ' Remove' })

    this.slideEditorContainer = this.mainFrame.locator('#cp-app-slide-editor')
    this.padEditorContainer = this.mainFrame.locator('#cp-app-pad-editor')
    this.codeEditorContainer = this.mainFrame.locator('#cp-app-code-editor')
    this.whiteBoardEditorContainer = this.mainFrame.locator('#cp-app-whiteboard-canvas-area')
    this.diagramEditorContainer = this.mainFrame.locator('#cp-app-diagram-editor')
    this.kanbanEditorContainer = this.mainFrame.locator('#cp-app-kanban-editor')
    this.sheetEditorContainer = this.mainFrame.locator('#cp-app-oo-container')

    this.viewAndDelete = this.mainFrame.getByRole('button', { name: 'view and delete' })
    this.viewOnce = this.secureFrame.getByText('View once and self-destruct')
    this.createLink = this.secureFrame.getByRole('button', { name: 'Create link' })
    this.accessList = this.secureFrame.locator('span').filter({ hasText: 'List' }).first()
    this.enableAccessList = this.secureFrame.locator('label').filter({ hasText: 'Enable access list' }).locator('span').first()
    this.addToAccessList = this.secureFrame.locator('.cp-share-column-mid.cp-overlay-container').locator('.btn.btn-primary.cp-access-add')
    this.removeFromAccessList = this.secureFrame.locator('.cp-usergrid-user > .fa').first()
    this.movedToTrash = this.mainFrame.getByText(/^That document has been moved to the trash/, { exact: true })
    
  }

<<<<<<< HEAD
  async moveToTrash() {
      await this.trash.click()  
=======
  newDriveFile (file) {
    return this.mainFrame.getByRole('listitem').filter({ hasText: file }).locator('span').first()
  
>>>>>>> main
  }
  

  async newFileClick () {
    await this.newFile.click();
    return new NewFileModal(this);
  }


  removeOwner(user) {
    return this.secureFrame.locator('.cp-usergrid-user.large').filter({ hasText: user }).locator('.fa.fa-times')
  }

  ownersGrid(user) {
    return this.secureFrame.locator('.cp-usergrid-user.large').filter({ hasText: user })
  }

  driveElement(file) {
    return this.mainFrame.locator('.cp-app-drive-element-name').filter({ hasText: file })

  }

  declinedYourContactRequest(user) {
    return this.mainFrame.getByText(`${user} declined your contact request`)
  }

  cleanChatHistory(user) {
    return this.mainFrame.locator('#cp-app-contacts-messaging div').filter({ hasText: user }).locator('span').nth(4)
  }

  contactRequestAccepted (user) {
    return this.mainFrame.getByText('test-user2 accepted your contact request')
  }

  cancelContactRequestMessage (user) {
    return this.mainFrame.getByText(`Are you sure you want to cancel your contact request with ${user}?`)
  }

  contactRequestMessage (user) {
    return this.mainFrame.getByText(`${user} would like to add you as a contact. Accept?`)
  }


  contactRequestNotif (user) {
    return this.mainFrame.getByText(`${user} sent you a contact request`)
  }

  memberRemovalNotification (member) {
    return this.mainFrame.getByText(`${member} will know that you removed them from the team. Are you sure?`)
  
  }

  contactToInvite (member) {
    return this.mainFrame.getByRole('paragraph').getByText(member)
  }
  
  removeMember (member) {
    return this.mainFrame.locator('.cp-team-roster-member').filter({ hasText: member }).locator('.fa.fa-times').click()
  }


  async shareWithContact (role, contact, destruct) {
    await this.share(this.mobile);
    await this.secureFrame.locator('label').filter({ hasText: role }).locator('span').first().click();
    if (destruct) {
      await this.linkRole('View once and self-destruct').click();
    }
    await this.secureFrame.getByText('test-user3').click();
    await this.shareSecureLink.click();
  
  }

  creationOption (option) {
    return this.mainFrame.locator('label').filter({ hasText: option }).locator('span').first()
  
  }

  checkboxGridAnswer (child) {
    return this.mainFrame.locator(`label:nth-child(${child}) > .cp-checkmark-mark`)
  }

  choiceGridAnswer (answer) {
    return this.mainFrame.locator('div').filter({ hasText: answer}).locator('span')
  }

  conditionalOption (option) {
    return this.mainFrame.getByRole('menuitem', { name: option })
  }

  conditionalQuestion (question) {
    return this.mainFrame.getByRole('menuitem', { name: question }).locator('a')
  }

  optionPlaceholder (option) {
    return this.mainFrame.getByPlaceholder(option)
  }

  async setHour (hours, minutesStart, minutesEnd) {
    if (this.mobile) {
      await this.startDate.nth(1).fill(`${dateTodayDashFormat}T${hours}:${minutesStart}`);
      await this.page.keyboard.press('Enter');
      await this.endDate.nth(1).fill(`${dateTodayDashFormat}T${hours}:${minutesEnd}`);
      await this.page.keyboard.press('Enter');
    } else {
      await this.startDate.click({ timeout: 3000 });
      await this.pickHour.click();
      await this.pickHour.fill(hours);
      await this.pickMinute.fill(minutesStart);
      await this.page.keyboard.press('Enter');
      await this.endDate.click({ timeout: 3000 });
      await this.pickHour.click();
      await this.pickHour.fill(hours);
      await this.pickMinute.click();
      await this.pickMinute.fill(minutesEnd);
      await this.page.keyboard.press('Enter');
    }
  
  }

  answerOption (option) {
    return this.mainFrame.locator('label').filter({ hasText: option }).locator('span').first()
  }

  async setEventTitle () {
    await this.calendarTitle.click();
    await this.calendarTitle.fill('test event');
    await this.calendarTitle.press('Tab');

  }

  async loadFileType (fileType) {
    await this.page.goto(`${url}/${fileType}/`);
    // loading a new file takes longer than the default timeout for expect calls,
    // so we explicitly wait for it.
    await this.fileSaved.waitFor({state: "visible"})
    await expect(this.fileSaved).toBeVisible()
  }

  async demoteTestUser3 () {
    await this.demoteTestUser3Arrow.waitFor();
    await this.demoteTestUser3Arrow.click();
    await this.page.waitForTimeout(2000);
  }


  async openFormSettings () {
    await this.formSettings.waitFor();
    await this.formSettings.click();

    const visible = await this.mainFrame.getByRole('heading', { name: ' Form settings' }).locator('span').isVisible();

    if (visible === false) {
      await this.formSettings.waitFor();
      await this.formSettings.click();
    }
  
  }

  async newCalendarEvent (mobile) {
    if (mobile) {
      await this.newEventMobile.waitFor();
      await this.newEventMobile.click({ force: true });
    } else {
      await this.newEvent.waitFor();
      await this.newEvent.click();
    }
  }

  async promoteTestUser3 () {
    await this.promoteTestUser3Arrow.waitFor();
    await this.promoteTestUser3Arrow.click();
    await this.page.waitForTimeout(2000);
  
  }

  async accessTeam () {
    await this.teamSlot.getByText('test team').waitFor();
    await this.teamSlot.getByText('test team').click();
  
  }

  teamTab (item) {
    return  this.mainFrame.locator('div').filter({ hasText: item }).locator('span').first()
  
  }

  teamMemberContainer (member) {
    return this.mainFrame.locator('#cp-team-roster-container').getByText(member)
  }

  teamMember (member) {
    return this.mainFrame.locator('.cp-team-roster-member').getByText(member, { exact: true })
  }

  teamMemberFilter (member) {
   return this.mainFrame.locator('.cp-team-roster-member').filter({ hasText: member })
  }

  dropDownItem (item) {
    return this.mainFrame.getByRole('menuitem', { name: item }).locator('a');
  }

  fileMenuItem (item) {
    return this.dropDownItem(item)
  }

  // async moveToTrash() {
  //     await this.trash.click()
  // }

  async oneTimeClick(local) {
    if (local) {
      await this.oneTimeLocal.click()
    } else {
      await this.oneTime.click()
    }
  
  }

  linkRole (role) {
    return this.secureFrame.locator('label').filter({ hasText: role }).locator('span').first()
  
  }

<<<<<<< HEAD
=======
  async clearFormQuestions() {
    await this.deleteButton.first().waitFor();
    await this.deleteButton.first().click();
    await this.areYouSureButton.waitFor();
    await this.areYouSureButton.click();
    await this.deleteButton.first().click();
    await this.areYouSureButton.waitFor();
    await this.areYouSureButton.click();
  
  }

  shareNotif (user, fileName) {
    var titles = this.getTitle(fileName)
    var title = titles[0]
    var titleComma = titles[1]
    var titleTwoCommas = titles[2]

    return this.mainFrame.getByText(`${user} has shared a document with you: ${title}`).or(this.mainFrame.getByText(`${user} has shared a document with you: ${titleComma}`)).or(this.mainFrame.getByText(`${user} has shared a document with you: ${titleTwoCommas}`))
  }

  ownershipNotif (user, fileName) {
    var titles = this.getTitle(fileName)
    var title = titles[0]
    var titleComma = titles[1]
    var titleTwoCommas = titles[2]

    return this.mainFrame.getByText(`${user} wants you to be an owner of ${title}`).or(this.mainFrame.getByText(`${user} wants you to be an owner of ${titleComma}`)).or(this.mainFrame.getByText(`${user} wants you to be an owner of ${titleTwoCommas}`))
  }

  driveSideBarItem(item) {
    return this.mainFrame.locator('span').filter({ hasText: item })
  }

  templateSpan (templateName) {

    return this.secureFrame.locator('span').filter({ hasText: templateName }).nth(1)
  
  }
>>>>>>> main

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
      await this.share(this.mobile);
      await this.clickLinkTab(this.mobile);
      await this.page.waitForTimeout(2000);
      clipboardText = await this.page.evaluate(() => navigator.clipboard.readText());
    }

    return clipboardText
  }

  async getLinkAfterCopyRole (role) {
    await this.clickLinkTab(this.mobile);
    await this.linkRole(role).click();
    await this.shareCopyLink.click();
    let clipboardText = await this.page.evaluate('navigator.clipboard.readText()');
    if (clipboardText === "") {
      await this.page.waitForTimeout(2000);
      await this.clickLinkTab(this.mobile);
      await this.linkRole().click();
      await this.shareCopyLink.click();
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

  homePageLink (item) {
    return this.page.getByRole('link', { name: item }) 
  }

  driveListViewSpan (item) {
    const regex = new RegExp(`^${item}$`);
    return this.mainFrame.locator('span').filter({ hasText: regex })
  }

  async responses (visible) {
    if (visible) {
      await this.mainFrame.getByRole('button', { name: ' Responses (1)' }).waitFor();
      await this.mainFrame.getByRole('button', { name: ' Responses (1)' }).click();
    } else {
      await this.page.reload();
      await this.mainFrame.getByRole('button', { name: ' Responses (1)' }).waitFor()
      await this.page.waitForTimeout(1000)
      await this.mainFrame.getByRole('button', { name: ' Responses (1)' }).click();
    }
  }

  async filemenuClick (mobile) {
    await this.page.waitForTimeout(1000)
    await this.fileSaved.first().waitFor()
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
    await this.page.waitForTimeout(1000)
    return this.getLinkAfterCopyForm()
  
  }

  driveMenuItem (item, first) {
    return first ? this.mainFrame.locator('a').filter({ hasText: item }).first() : this.mainFrame.locator('a').filter({ hasText: item })
  
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

  getTitle (fileName) {
    const name = this.iconName(fileName)
    var titleDate = `${name} - ${this.titleDate}`;
    var titleDateComma = `${name} - ${this.titleDateComma}`
    var titleDateTwoCommas = `${name} - ${this.titleDateTwoCommas}`
    return [titleDate, titleDateComma, titleDateTwoCommas]
  }

  driveFileTitle (fileName) {
    var titles = this.getTitle(fileName)
    var title = titles[0]
    var titleComma = titles[1]
    var titleTwoCommas = titles[2]
    return this.driveElementText.getByText(title).or(this.driveElementText.getByText(titleComma)).or(this.driveElementText.getByText(titleTwoCommas))
  }

  trashFileTitle (fileName) {
    var titles = this.getTitle(fileName)
    var title = titles[0]
    var titleComma = titles[1]
    var titleTwoCommas = titles[2]
    return this.driveContentFolder.getByText(title).or(this.driveContentFolder.getByText(titleComma)).or(this.driveContentFolder.getByText(titleTwoCommas))
  }

  fileTitle (fileName) {
    var titles = this.getTitle(fileName)
    var title = titles[0]
    var titleComma = titles[1]
    var titleTwoCommas = titles[2]
    return this.fileName.getByText(`${title}`).or(this.fileName.getByText(`${titleComma}`)).or(this.fileName.getByText(`${titleTwoCommas}`));
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
    await this.fileMenuItem(' Import').click();
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

  async accessTeam (mobile, local) {
    await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await this.page.waitForTimeout(2000);
    await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    console.log(await this.page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().isVisible())
    if (!await this.page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().isVisible()){
      while (!await this.page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().isVisible()) {
        await this.page.waitForTimeout(2000);
        await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
      }
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