const { test, url, dateTodayDashFormat, dateTodaySlashFormat, nextMondaySlashFormat, minutes, hours, todayStringFormat, nextMondayStringFormat, titleDate, titleDateComma } = require('../fixture.js');
const { expect } = require('@playwright/test');
const fs = require('fs');

require('dotenv').config();
const { FileActions } = require('./fileactions.js');

const local = !!process.env.PW_URL.includes('localhost');

let page1;
let mobile;
let browserstackMobile;
let fileActions;
let isBrowserstack;
let browserName

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);
  mobile = isMobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  isBrowserstack = !!testInfo.project.name.match(/browserstack/);
  browserName = testInfo.project.name.split(/@/)[0];

  fileActions = new FileActions(page);
  await fileActions.loadFileType("form")

});

test('anon - form - submission (one time no edit)', async ({ page, context }) => {
  try {
    await fileActions.openFormSettings()
    await fileActions.oneTimeOnly.click();
    await fileActions.closeModal.click();
    var clipboardText = await fileActions.publicLinkCopy()
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.formOptionOne.waitFor();
    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();

    await expect(fileActions1.editResponses).toBeHidden();
    await expect(fileActions1.deleteButton).toBeHidden();

    await fileActions.toSuccess('Can anonymously create form with one time submission (no edit)');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t anonymously create form with one time submission (no edit)');
  }
});

test('anon - form - submission (multiple times no edit)', async ({ page, context }) => {
  try {
    await fileActions.openFormSettings()
    await fileActions.multipleTimes.click();
    await fileActions.closeModal.click();

    var clipboardText = await fileActions.publicLinkCopy()
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.formOptionOne.waitFor();
    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();

    await expect(fileActions1.editResponses).toBeHidden();
    await expect(fileActions1.deleteButton).toBeHidden();
    await expect(fileActions1.submitAgain).toBeVisible();

    await fileActions.toSuccess('Can anonymously create form with multiple submissions (no edit)');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t anonymously create form with multiple submissions (no edit)');
  }
});

test('anon - form - submission (one time) - delete', async ({ page, context }) => {
  try {
    var clipboardText = await fileActions.publicLinkCopy()
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.formOptionOne.waitFor()
    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();

    await expect(fileActions1.submitAgain).toBeHidden();
    await fileActions1.deleteButton.click();
    await fileActions1.questionHere.waitFor();

    await fileActions.noResponses.click();
    await expect(fileActions.thereAreNoResponses).toBeVisible();

    await fileActions.toSuccess('Can anonymously create form with one time submission - delete');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t anonymously create form with one time submission - delete');
  }
});

test('anon - form - submission (multiple times) - delete', async ({ page, context }) => {
  try {
    await fileActions.openFormSettings()
    await fileActions.multipleTimesEdit.click();
    await fileActions.closeModal.click();

    var clipboardText = await fileActions.publicLinkCopy()
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();

    await expect(fileActions1.submitAgain).toBeVisible();
    await fileActions1.deleteButton.click();
    await fileActions1.questionHere.waitFor();

    await fileActions.noResponses.click();
    await expect(fileActions.thereAreNoResponses).toBeVisible();

    await fileActions.toSuccess('Can anonymously create form with multiple submissions - delete');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t anonymously create form with multiple submissions - delete');
  }
});

test('anon - form - submission (multiple times) - edit', async ({ page, context }) => {
  try {
    await fileActions.openFormSettings()
    await fileActions.multipleTimesEdit.click();
    await fileActions.closeModal.click();

    var clipboardText = await fileActions.publicLinkCopy()
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    
    await fileActions1.formOptionOne.waitFor()
    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();
    await fileActions1.editResponses.click();
    await fileActions1.formOptionTwo.click();
    await fileActions1.updateButton.click();

    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.mainFrame.getByText(/Option 21/)).toBeVisible();

    await expect(fileActions1.submitAgain).toBeVisible();

    await fileActions.toSuccess( 'Can anonymously create form with multiple submissions - edit');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t anonymously create form with multiple submissions - edit');
  }
});

test('anon - form - submission (one time) - edit', async ({ page, context }) => {
  try {
    var clipboardText = await fileActions.publicLinkCopy()
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();
    await fileActions1.editResponses.click();
    await fileActions1.formOptionTwo.click();
    await fileActions1.updateButton.click();

    await fileActions.responses(await fileActions.oneResponse.isVisible());

    await expect(fileActions.mainFrame.getByText(/Option 21/)).toBeVisible();

    await expect(fileActions1.submitAgain).toBeHidden();

    await fileActions.toSuccess('Can anonymously create form with one time submission - edit');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t anonymously create form with one time submission - edit');
  }
});

test('anon - form - share (link) - auditor', async ({ page, context }) => {
  try {

    await fileActions.fileTitle('Form').waitFor();
    await fileActions.share(mobile);
    await fileActions.linkRole( /^Auditor$/ ).click();
    await fileActions.shareCopyLink.click()
    var clipboardText = await page.evaluate('navigator.clipboard.readText()');
    const page1 = await context.newPage();
    await page1.waitForTimeout(2000)
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.fileTitle('Form').waitFor();
    await expect(fileActions1.fileTitle('Form')).toBeVisible();
    await fileActions1.mainFrame.getByText('There are no responses').waitFor();
    await expect(fileActions1.mainFrame.getByText('There are no responses')).toBeVisible();

    await fileActions.toSuccess('Can anonymously create form and share link (auditor)');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t anonymously create form and share link (auditor)');
  }
});

test('anon - form - share (link) - author', async ({ page, context }) => {
  try {
    
    await fileActions.fileTitle('Form').waitFor();

    await fileActions.getShareLink(mobile);

    var clipboardText = await fileActions.getLinkAfterCopy()
    const page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.fileTitle('Form').waitFor();
    await expect(fileActions1.fileTitle('Form')).toBeVisible();

    await expect(fileActions1.readOnly).toBeHidden();

    await fileActions.toSuccess('Can anonymously create form and share link (author)');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t anonymously create form and share link (author)');
  }
});

test('anon - form - add and respond to checkbox question', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.checkbox.click();
    await fileActions.textbox.fill('What box do you choose?');
    await fileActions.editQuestion.click();
    await fileActions.textbox.nth(1).fill('box1');
    await fileActions.textbox.nth(2).fill('box2');
    await fileActions.textbox.nth(3).fill('box3');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.answerOption( 'box2' ).waitFor();
    await fileActions1.answerOption( 'box2' ).click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();
    await page1.waitForTimeout(5000);
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.mainFrame.getByText(/box10 box21 box30/)).toBeVisible();

    await fileActions.toSuccess('Can create and answer checkbox question in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and answer checkbox question in a Form');
  }
});

test('anon - form - close and open', async ({ page, context }) => {
  try {
    await fileActions.openFormSettings()

    await fileActions.setClosingDate.click();
    await fileActions.mainFrame.getByLabel(`${todayStringFormat}`).click();
    await fileActions.pickHour.click();
    await fileActions.pickHour.fill(`${hours}`);
    await fileActions.pickMinute.click();
    await fileActions.pickMinute.fill(`${minutes}`);

    if (mobile && parseInt(hours) < 12 && fileActions.mobileTimepicker.isVisible()) {
      fileActions.mobileTimepicker.click();
    }
    await page.keyboard.press('Enter');
    await fileActions.saveButton.click();
    await fileActions.closeModal.click();

    await expect(fileActions.formContainer.getByText(`This form was closed on ${dateTodaySlashFormat}`)).toBeVisible();

    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.questionHere.waitFor();
    await expect(fileActions1.questionHere).toBeVisible();
    await expect(fileActions1.mainFrame.getByText(`This form was closed on ${dateTodaySlashFormat}`)).toBeVisible();
    await expect(fileActions1.submitButton).toBeHidden();

    await fileActions.openFormSettings()
    await fileActions.openForm.click();
    await expect(fileActions.formContainer.getByText('This form is open')).toBeVisible();

    await page1.reload();
    await page1.bringToFront();
    await fileActions1.submitButton.waitFor()
    await expect(fileActions1.submitButton).toBeVisible();

    await fileActions.toSuccess( 'Can close and open Form' );
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t close and open Form');
  }
});

// test('form - set future closing date and open', async ({ page, context }) => {
//   try {
//     await fileActions.openFormSettings()

//     await fileActions.setClosingDate.click();
//     await fileActions.mainFrame.getByLabel(`${nextMondayStringFormat}`).click();
//     await fileActions.saveButton.click();
//     await fileActions.formContainer.getByText(`This form will close on ${nextMondaySlashFormat}`).waitFor();
//     await expect(fileActions.formContainer.getByText(`This form will close on ${nextMondaySlashFormat}`)).toBeVisible();
//     await fileActions.closeModal.click();
//     var clipboardText = await fileActions.publicLinkCopy()

//     // mocks future date in new context
//     const mockedDate = new Date();
//     mockedDate.setDate(mockedDate.getDate() + 30);
//     await context.addInitScript(`{
//       Date = class extends Date {
//         constructor(...args) {
//           if (args.length === 0) {
//             super(${mockedDate.getTime()})
//           } else {
//             super(...args)
//           }
//         }
//       }
      
//       const __DateNowOffset = ${mockedDate.getTime()} - Date.now()
//       const __DateNow = Date.now
//       Date.now = () => __DateNow() + __DateNowOffset
//     }`);

//     page1 = await context.newPage();
//     await page1.goto(`${clipboardText}`);
//     const fileActions1 = new FileActions(page1)
//     await fileActions1.mainFrame.getByText(`This form was closed on ${nextMondaySlashFormat}`).waitFor();
//     await expect(fileActions1.mainFrame.getByText(`This form was closed on ${nextMondaySlashFormat}`)).toBeVisible();

//     await fileActions.openFormSettings()
//     await fileActions.removeClosingDate.click();
//     await expect(fileActions.formStatus.getByText('This form is open')).toBeVisible();

//     await page1.reload();
//     await fileActions1.formStatus.getByText('This form was closed on').waitFor({state: "hidden"})

//     await expect(fileActions1.formStatus.getByText('This form was closed on')).toBeHidden();

//     await fileActions.toSuccess('Can set closing date for and open Form');
//   } catch (e) {
//     await fileActions.toFailure(e, 'Can\'t set closing date for and open Form');
//   }
// });

test('anon - form - anonymize responses', async ({ page, context }) => { 
  test.skip(browserName === 'playwright-firefox', 'playwright firefox bug')
  test.skip(browserName === 'playwright-webkit', 'playwright webkit bug')

  try {
    var clipboardText = await fileActions.publicLinkCopy()

    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.mainFrame.getByText('Please choose how you would like to answer this form:').waitFor();
    await expect(fileActions1.mainFrame.getByText('Please choose how you would like to answer this form:')).toBeVisible();

    await fileActions.formSettings.click();
    await fileActions.anonymizeResponses.click();
    await fileActions.closeModal.click();

    await expect(fileActions1.mainFrame.getByText('Responses to this form are anonymized').first()).toBeVisible();
    await expect(fileActions1.mainFrame.getByText('Answer as')).toBeHidden();

    await fileActions1.formOptionOne.click();
    await fileActions1.submitButton.click();

    await page.bringToFront();
    await fileActions.responses(mobile);
    await fileActions.showIndividualAnswers.waitFor();
    await page.waitForTimeout(5000)
    await fileActions.showIndividualAnswers.click({force: true});
    await fileActions.mainFrame.getByText(/^Anonymous answer/).click();

    await fileActions.toSuccess('Can anonymize Form responses');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t anonymize Form responses');
  }
});

test('anon - form - publish responses', async ({ page, context }) => {
  try {
    var clipboardText = await fileActions.publicLinkCopy()

    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.formOptionOne.waitFor();
    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await expect(fileActions1.viewAllResponses).toBeHidden();

    await fileActions.formSettings.click();
    await fileActions.publishResponses.click();
    await fileActions.okButton.click();

    await fileActions1.viewAllResponses.waitFor()
    await fileActions1.viewAllResponses.click();
    await fileActions1.mainFrame.getByText(/Your question here\?Option 11 Option 20/).click();

    await fileActions.toSuccess( 'Can publish Form responses');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t publish Form responses');
  }
});

test('anon - form - view history and share at a specific moment in history', async ({ page, context }) => {
  try {
    await fileActions.editQuestion.nth(1).waitFor();
    await fileActions.editQuestion.nth(1).click();
    await fileActions.addOption.click();
    await fileActions.textbox.nth(1).fill('new option');
    await fileActions.textbox.nth(1).press('Enter');

    await fileActions.history(mobile);
    await fileActions.historyPrevLast.click();
    await expect(fileActions.mainFrame.getByText('new option')).toHaveCount(0);    

    const clipboardText = await fileActions.getShareLink()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await expect(fileActions1.mainFrame.getByText('new option')).toHaveCount(0);

    await fileActions.toSuccess('Can view Form history and share at a specific moment in history');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t view Form history and share at a specific moment in history');
  }
});

test('anon - form - import file', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile import incompatibility');

  try {
    await fileActions.copyPublicLink.waitFor();
    await fileActions.filemenuClick(mobile);
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      await fileActions.importClick()
    ]);
    await fileChooser.setFiles('testdocuments/testform.json');

    await expect(fileActions.textbox).toHaveValue('What to do today?');
    await expect(fileActions.mainFrame.getByText('Surf')).toBeVisible();
    await expect(fileActions.mainFrame.getByText('Cinema')).toBeVisible();

    await fileActions.toSuccess('Can import a Form from a .json');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t import a Form from a .json');
  }
});

test('anon - form - make a copy', async ({ page }) => {
  try {
    await fileActions.textbox.waitFor();
    await fileActions.textbox.click();
    await fileActions.textbox.fill('What to do today?');
    await page.keyboard.press('Enter');

    await fileActions.editQuestion.nth(1).click();
    // console.log(fileActions.optionPlaceholder('Option 1'))
    // console.log(await fileActions.optionPlaceholder('Option 1'))
    await fileActions.optionPlaceholder('Option 1').click();
    await fileActions.optionPlaceholder('Option 1').fill('Surf');
    await fileActions.optionPlaceholder('Option 2').click();
    await fileActions.optionPlaceholder('Option 2').fill('Cinema');
    await fileActions.mainFrame.getByRole('button', { name: 'Preview form', exact: true }).click();
    await fileActions.filemenuClick(mobile);
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      await fileActions.fileMenuItem('Make a copy').click()
    ]);

    const fileActions1 = new FileActions(page1)
    await fileActions1.textbox.waitFor();

    await expect(fileActions1.textbox).toHaveValue('What to do today?');
    await expect(fileActions1.mainFrame.getByText('Surf')).toBeVisible();
    await expect(fileActions1.mainFrame.getByText('Cinema')).toBeVisible();

    await fileActions.toSuccess( 'Can create a copy of a Form');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create a copy of a Form');
  }
});

test('anon - form - export file', async ({ page }) => {
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');

  try {
    await fileActions.editQuestion.first().waitFor();
    await fileActions.editQuestion.first().click();
    await fileActions.mainFrame.locator('span').filter({ hasText: 'Your text here' }).click();
    await fileActions.mainFrame.locator('span').filter({ hasText: 'Your text here' }).fill('example text');

    await fileActions.textbox.fill('example question?');
    await fileActions.editQuestion.click();
    await fileActions.optionPlaceholder('Option 1').click();
    await fileActions.optionPlaceholder('Option 1').fill('test option one');
    await fileActions.optionPlaceholder('Option 2').click();
    await fileActions.optionPlaceholder('Option 2').fill('test option two');
    await fileActions.addOption.click();
    await fileActions.mainFrame.getByPlaceholder('New option').fill('test option three');

    await fileActions.export(mobile);
    await fileActions.mainFrame.locator('p').filter({ hasText: '.json.json' }).getByRole('textbox').fill('test form');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);
    await download.saveAs('/tmp/test form');

    const actualFormJSONObject = JSON.parse(fs.readFileSync('/tmp/test form'));

    const actualFormJSONString = JSON.stringify(actualFormJSONObject);

    const testFormJSONString = /^{"form":{"1":{"type":"md","opts":{"text":"example text"}},"2":{"type":"radio","opts":{"values":\[{"uid":"([a-z0-9]{10,11})","v":"test option one"},{"uid":"([a-z0-9]{10,11})","v":"test option two"},{"uid":"([a-z0-9]{10,11})","v":"test option three"}]},"q":"example question\?"}},"order":\["1","2"],"version":1}$/;
    if (testFormJSONString.test(actualFormJSONString)) {
      await fileActions.toSuccess( 'Can create and export a Form into a .json');
    } else {
      await fileActions.toFailure(e, 'Can\'t create and export a Form into a .json');
    }
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create and export a Form into a .json');
  }
});

test('anon - form - add description', async ({ page, context }) => {
  try {
    await fileActions.editQuestion.first().waitFor();
    await fileActions.editQuestion.first().click();
    await fileActions.mainFrame.locator('span').filter({ hasText: 'Your text here' }).click();
    await fileActions.mainFrame.locator('span').filter({ hasText: 'Your text here' }).fill('New description');
     var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.mainFrame.getByText('New description').waitFor();

    await expect(fileActions1.mainFrame.getByText('New description')).toBeVisible();

    await fileActions.toSuccess('Can create Form with a description');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create Form with a description');
  }
});

test('anon - form - add submission message', async ({ page, context }) => {
  try {
    if (mobile) {
      await fileActions.mainFrame.getByRole('button', { name: 'Store', exact: true }).click();
    }
    await fileActions.mainFrame.getByRole('button', { name: 'Add submit message' }).waitFor();
    await fileActions.mainFrame.getByRole('button', { name: 'Add submit message' }).click();

    await fileActions.mainFrame.locator('pre').nth(1).fill('Thank you for submitting your answer!');
     var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.formOptionOne.waitFor();

    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await expect(fileActions1.mainFrame.getByText('Thank you for submitting your answer!')).toBeVisible();
    await fileActions.toSuccess( 'Can create Form with a submission message');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create Form with a submission message');
  }
});

test('anon - form - anon (guest) access - allowed', async ({ page, context }) => {
  try {
    await fileActions.editQuestion.nth(1).waitFor();
    await fileActions.textbox.fill('What to do today?');
    await fileActions.editQuestion.nth(1).click();
    await fileActions.optionPlaceholder('Option 1').fill('sleep');
    await fileActions.optionPlaceholder('Option 2').fill('eat');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.answerAnonSpan.waitFor();

    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await fileActions.responses(await fileActions.oneResponse.isVisible());

    await expect(fileActions.oneTotalResponse).toBeVisible();
    await fileActions.showIndividualAnswers.click();
    await expect(fileActions.mainFrame.getByText(/^Anonymous answer/)).toBeVisible();
    await fileActions.toSuccess( 'Can create and answer question with permitted guest access in a Form');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create and answer question with permitted guest access in a Form');
  }
});

test('anon - form - add and respond to text question', async ({ page, context }) => {
  try {
    await fileActions.textButton.waitFor();
    await fileActions.textButton.click();
    await fileActions.textbox.nth(1).click();
    await fileActions.textbox.nth(1).fill('What is your name?');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.formTextBox.waitFor();

    await fileActions1.formTextBox.click();
    await fileActions1.formTextBox.fill('Anon user');
    await page1.waitForTimeout(1000);
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await page1.waitForTimeout(3000);
    await page1.close();
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.mainFrame.getByText('Anon user')).toBeVisible();

    await fileActions.toSuccess('Can create and answer text question in a Form');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create and answer text question in a Form');
  }
});

test('anon - form - edit response', async ({ page, context }) => {
  try {
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.formOptionOne.waitFor();
    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();
    await fileActions1.editResponses.click();
    await fileActions1.formOptionTwo.click();
    await fileActions1.updateButton.click();

    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.mainFrame.getByText(/Option 21/)).toBeVisible();

    await fileActions.toSuccess('Can edit response in a Form');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t edit response in a Form');
  }
});

test('anon - form - delete response', async ({ page, context }) => {
  try {
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.formOptionOne.waitFor();
    await fileActions1.formOptionOne.click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();

    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.mainFrame.getByText(/Option 11/)).toBeVisible();

    await fileActions1.deleteButton.click();
    await fileActions1.questionHere.waitFor();
    await fileActions.formEditorButton.click();
    await fileActions.noResponses.click();
    await expect(fileActions.thereAreNoResponses).toBeVisible();

    await fileActions.toSuccess('Can edit response in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t edit response in a Form');
  }
});

test('anon - form - add and respond to paragraph question', async ({ page, context }) => {
  try {
    await fileActions.paragraphQuestion.waitFor();
    await fileActions.paragraphQuestion.click();
    await fileActions.paragraphQuestionContent.click();
    await fileActions.paragraphQuestionContent.fill('Tell me about yourself');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.paragraphAnswer.waitFor();

    await fileActions1.paragraphAnswer.click();
    await page1.waitForTimeout(1000);
    await fileActions1.paragraphAnswer.fill('I am a guest');
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await page1.waitForTimeout(1000);
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.formContainer.getByText('I am a guest')).toBeVisible();

    await fileActions.toSuccess( 'Can create and answer paragraph question in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and answer paragraph question in a Form');
  }
});

test('anon - form - add and respond to choice question (optional)', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.choiceQuestion.click();
    await fileActions.textbox.fill('What is your choice?');

    await fileActions.editQuestion.click();
    await fileActions.choiceQuestionInput.first().click();
    await fileActions.choiceQuestionInput.first().fill('test option one');
    await fileActions.choiceQuestionInput.nth(1).click();
    await fileActions.choiceQuestionInput.nth(1).fill('test option two');
    await fileActions.addOption.click();
    await fileActions.choiceQuestionInput.nth(2).click();
    await fileActions.choiceQuestionInput.nth(2).fill('test option three');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.answerOption('test option one' ).waitFor();
    await fileActions1.answerOption('test option one' ).click();
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await page1.waitForTimeout(3000);
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.mainFrame.getByText(/test option one1/)).toBeVisible();

    await fileActions.toSuccess('Can create and answer choice question (optional) in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and answer choice question (optional) in a Form');
  }
});

test('anon - form - add and respond to choice question (required)', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.choiceQuestion.click();
    await fileActions.textbox.fill('What is your choice?');

    await fileActions.editQuestion.click();

    await fileActions.choiceQuestionInput.first().click();
    await fileActions.choiceQuestionInput.first().fill('test option one');
    await fileActions.choiceQuestionInput.nth(1).click();
    await fileActions.choiceQuestionInput.nth(1).fill('test option two');
    await fileActions.addOption.click();
    await fileActions.choiceQuestionInput.nth(2).click();
    await fileActions.choiceQuestionInput.nth(2).fill('test option three');
    await fileActions.requiredQuestion.click();
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.mainFrame.getByText('The following questions require an answer:Question 1.').waitFor();
    await expect(fileActions1.mainFrame.getByText('The following questions require an answer:Question 1.')).toBeVisible();
    await expect(fileActions1.submitButton).toBeDisabled();
    await fileActions1.answerOption('test option one' ).click();
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();

    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.mainFrame.getByText(/test option one1/)).toBeVisible();

    await fileActions.toSuccess('Can create and answer choice question (required) in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and answer choice question (required) in a Form');
  }
});

test('anon - form - add and respond to choice grid question', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.choiceGridQuestion.click();
    await fileActions.textbox.click();
    await fileActions.textbox.fill('What is your choice grid?');
    await page.keyboard.press('Enter');

    await fileActions.editQuestion.click();
    await fileActions.choiceGridItem.first().fill('General');
    await fileActions.choiceGridOption.first().fill('Choice1');
    await fileActions.choiceGridItem.nth(1).fill('Particular');
    await fileActions.choiceGridOption.nth(1).fill('Choice2');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.choiceGridAnswer(/^GeneralGeneral$/ ).first().waitFor();
    await fileActions1.choiceGridAnswer(/^GeneralGeneral$/).first().click();
    await page1.waitForTimeout(1000);
    await fileActions1.choiceGridAnswer(/^ParticularParticular$/).nth(2).click();
    await fileActions1.answerAnonSpan.click();
    await page1.waitForTimeout(1000);
    await fileActions1.submitButton.click();
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await fileActions.mainFrame.getByText(/Choice10 Choice21/).waitFor();
    await expect(fileActions.mainFrame.getByText(/Choice10 Choice21/)).toBeVisible();
    await expect(fileActions.mainFrame.getByText(/Choice11 Choice20/)).toBeVisible();

    await fileActions.toSuccess('Can create and answer choice grid question in a Form');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create and answer choice grid question in a Form');

    console.log(e);
  }
});

test('anon - form - add and respond to date question', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.dateQuestion.click();
    await fileActions.textbox.first().fill('What is today\'s date?');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)

    await fileActions1.formTextBox.waitFor();
    await fileActions1.formTextBox.click();
    await fileActions1.mainFrame.getByLabel(`${todayStringFormat}`).click();
    await page1.keyboard.press('Enter');
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await fileActions.mainFrame.getByText(`${dateTodayDashFormat}`).waitFor();
    await expect(fileActions.mainFrame.getByText(`${dateTodayDashFormat}`)).toBeVisible();

    await fileActions.toSuccess( 'Can create and answer date question in a Form');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create and answer date question in a Form');
  }
});

test('anon - form - add and respond to checkbox grid question', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.checkboxGridQuestion.click();
    await fileActions.textbox.fill('Which checkbox grid do you choose?');
    await fileActions.textbox.press('Enter');
    await fileActions.editQuestion.click();
    await fileActions.choiceGridItem.first().fill('General');
    await fileActions.choiceGridItem.nth(1).fill('Particular');
    await fileActions.choiceGridOption.first().fill('Box1');
    await fileActions.choiceGridOption.nth(1).fill('Box2');
    await fileActions.choiceGridOption.nth(2).fill('Box3');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.checkboxGridAnswer(5).first().waitFor()
    await fileActions1.checkboxGridAnswer(5).first().click();
    await fileActions1.checkboxGridAnswer(4).first().click();
    await fileActions1.checkboxGridAnswer(4).nth(1).click();
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await fileActions.responses(await fileActions.oneResponse.isVisible());

    await expect(fileActions.mainFrame.getByText(/GeneralBox10 Box21 Box31/)).toBeVisible();
    await expect(fileActions.mainFrame.getByText(/ParticularBox10 Box21 Box30/)).toBeVisible();

    await fileActions.toSuccess('Can create and answer checkbox grid question in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and answer checkbox grid question in a Form');
  }
});

test('anon - form - add and respond to ordered list question (schulze method)', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.orderedList.click();
    await fileActions.textbox.fill('What is your preference?');
    await fileActions.editQuestion.click();
    await fileActions.textbox.nth(1).fill('test option 1');
    await fileActions.textbox.nth(2).fill('test option 2');
    await fileActions.addOption.click();
    await fileActions.optionPlaceholder('New option').fill('test option 3');

    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.listOption.first().waitFor();
    const firstOption = await fileActions1.listOption.first().textContent();
    const thirdOption = await fileActions1.listOption.nth(2).textContent();

    await fileActions1.mainFrame.getByText(`${thirdOption}`).hover();
    await page1.mouse.down();
    await page1.mouse.move(0, 100);
    await fileActions1.mainFrame.getByText(`${firstOption}`).hover();
    await page1.mouse.up();

    const firstOption2 = await fileActions1.orderedListOption.first().textContent();
    const secondOption2 = await fileActions1.orderedListOption.nth(1).textContent();
    const thirdOption2 = await fileActions1.orderedListOption.nth(2).textContent();

    const answerOrder = {};
    answerOrder[firstOption2] = 3;
    answerOrder[secondOption2] = 2;
    answerOrder[thirdOption2] = 1;

    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await page1.waitForTimeout(5000);
    await fileActions.responses(await fileActions.oneResponse.isVisible());

    const expectedAnswer = `test option 1${answerOrder['test option 1']} test option 2${answerOrder['test option 2']} test option 3${answerOrder['test option 3']}`;
    const expectedAnswerRegex = new RegExp(expectedAnswer);
    const results = await fileActions.mainFrame.locator('.cp-form-creator-results-content').textContent();

    if (expectedAnswerRegex.test(results)) {
      await fileActions.toSuccess( 'Can create and answer ordered list question in a Form');
    } else {
      await fileActions.toFailure(e, 'Can\'t create and answer ordered list question in a Form');
    }
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create and answer ordered list question in a Form');
  }
});

test('anon - form - add and respond to ordered list question', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.orderedList.click();
    await fileActions.textbox.fill('What is your preference?');
    await fileActions.editQuestion.click();
    await fileActions.textbox.nth(1).fill('test option 1');
    await fileActions.textbox.nth(2).fill('test option 2');
    await fileActions.addOption.click();
    await fileActions.optionPlaceholder('New option').fill('test option 3');

    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.listOption.first().waitFor();
    const firstOption = await fileActions1.listOption.first().textContent();
    const thirdOption = await fileActions1.listOption.nth(2).textContent();

    await fileActions1.mainFrame.getByText(`${thirdOption}`).hover();
    await page1.mouse.down();
    await page1.mouse.move(0, 100);
    await fileActions1.mainFrame.getByText(`${firstOption}`).hover();
    await page1.mouse.up();

    const firstOption2 = await fileActions1.orderedListOption.first().textContent();
    const secondOption2 = await fileActions1.orderedListOption.nth(1).textContent();
    const thirdOption2 = await fileActions1.orderedListOption.nth(2).textContent();

    const answerOrder = {};
    answerOrder[firstOption2] = 3;
    answerOrder[secondOption2] = 2;
    answerOrder[thirdOption2] = 1;

    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await fileActions.responses(await fileActions.oneResponse.isVisible());

    const expectedAnswer = `test option 1${answerOrder['test option 1']} test option 2${answerOrder['test option 2']} test option 3${answerOrder['test option 3']}`;
    const expectedAnswerRegex = new RegExp(expectedAnswer);
    const results = await fileActions.mainFrame.locator('.cp-form-creator-results-content').textContent();

    if (expectedAnswerRegex.test(results)) {
      await fileActions.toSuccess('Can create and answer ordered list question in a Form');
    } else {
      await fileActions.toFailure(e, 'Can\'t create and answer ordered list question in a Form');
    }
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t create and answer ordered list question in a Form');
  }
});

test('anon - form - add and respond to poll question', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.poll.click();
    await fileActions.textbox.fill('What do you want to do?');
    await fileActions.editQuestion.click();
    await fileActions.textbox.first().fill('Hiking');
    await fileActions.textbox.nth(1).fill('Yoga');
    await fileActions.textbox.nth(2).fill('Campfire');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.pollCell.waitFor();
    await fileActions1.pollCell.click();
    await fileActions1.answerAnonSpan.click();
    await fileActions1.submitButton.click();
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await expect(fileActions.mainFrame.getByText(/Total1\(0\)0\(0\)/)).toBeVisible();

    await fileActions.toSuccess( 'Can create and answer poll question in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and answer poll question in a Form');
  }
});

test('anon - form - add and respond to form with page break', async ({ page, context }) => {
  try {
    await fileActions.textbox.first().waitFor();
    await fileActions.textbox.first().click();
    await fileActions.textbox.first().fill('Question one');
    await fileActions.pageBreak.waitFor();
    await fileActions.pageBreak.click();
    await fileActions.textButton.click();
    await fileActions.textbox.nth(1).click();
    await fileActions.textbox.nth(1).fill('Question two');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.mainFrame.getByText('Question one').waitFor();
    await expect(fileActions1.mainFrame.getByText('Question one')).toBeVisible();
    await expect(fileActions1.mainFrame.getByText('Question two')).toBeHidden();
    await fileActions1.nextPage.click();
    await expect(fileActions1.mainFrame.getByText('Question one')).toBeHidden();
    await expect(fileActions1.mainFrame.getByText('Question two')).toBeVisible();

    await fileActions.toSuccess('Can create and answer Form with a page break');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and answer Form with a page break');
  }
});

test('anon - form - add and respond to conditional section question (OR)', async ({ page, context }) => {
  try {
    await fileActions.deleteButton.first().waitFor();
    await fileActions.deleteButton.first().click();
    await fileActions.areYouSure.click();

    await fileActions.textbox.fill('example question?');
    await fileActions.editQuestion.click();
    await fileActions.optionPlaceholder('Option 1').click();
    await fileActions.optionPlaceholder('Option 1').fill('test option one');
    await fileActions.optionPlaceholder('Option 2').click();
    await fileActions.optionPlaceholder('Option 2').fill('test option two');
    await fileActions.addOption.click();
    await fileActions.optionPlaceholder('New option').fill('test option three');

    await fileActions.conditionalSection.click();
    await fileActions.orCondition.click();
    await fileActions.chooseQuestion.click();

    await fileActions.mainFrame.getByText('example question?').click();
    await fileActions.chooseValue.click();
    await fileActions.conditionalOption('test option one' ).click();

    await fileActions.orCondition.click();
    await fileActions.chooseQuestion.click();
    await fileActions.conditionalQuestion('example question?' ).click()
    await fileActions.chooseValue.click();
    await fileActions.conditionalOption('test option three' ).click();

    await fileActions.addQuestionInsideConditional.click();
    await fileActions.textQuestionInsideConditional.click();

    await fileActions.textbox.nth(1).fill('example question two?');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.answerOption('test option one' ).waitFor();
    await fileActions1.answerOption('test option one' ).click();

    await expect(fileActions1.mainFrame.getByText('example question two?')).toBeVisible();

    await fileActions1.answerOption('test option two' ).click();
    await expect(fileActions1.mainFrame.getByText('example question two?')).toBeHidden();

    await fileActions1.answerOption('test option three' ).click();
    await expect(fileActions1.mainFrame.getByText('example question two?')).toBeVisible();

    await fileActions.toSuccess('Can create and respond to conditional section question (OR) in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and respond to conditional section question (OR) in a Form');
  }
});

test('anon - form - add and respond to conditional section question (AND)', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.checkbox.click();
    await fileActions.textbox.fill('example question?');

    await fileActions.conditionalSection.click();
    await fileActions.orCondition.click();
    await fileActions.chooseQuestion.click();
    await fileActions.mainFrame.getByText('example question?').click();
    await fileActions.chooseValue.click();
    await fileActions.conditionalOption('Option 1').click();
    await fileActions.andCondition.click();
    await fileActions.chooseQuestion.click();
    await fileActions.conditionalQuestion( 'example question?' ).click()
    await fileActions.chooseValue.click();
    await fileActions.conditionalOption('Option 3').click();
    await fileActions.addQuestionInsideConditional.click();
    await fileActions.textQuestionInsideConditional.click();
    await fileActions.textbox.nth(1).fill('example question two?');
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.answerOption('Option 1').waitFor();
    await fileActions1.answerOption('Option 1').click();
    await expect(fileActions1.mainFrame.getByText('example question two?')).toBeHidden();
    await fileActions1.answerOption( 'Option 3' ).click();
    await expect(fileActions1.mainFrame.getByText('example question two?')).toBeVisible();

    await fileActions.toSuccess('Can create and respond to conditional section question (AND) in a Form');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t create and respond to conditional section question (AND) in a Form');
  }
});

test('anon - form - export responses as .csv', async ({ page, context }) => {
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');
  test.skip(browserName === 'playwright-firefox', 'playwright firefox bug')
  test.skip(browserName === 'playwright-webkit', 'playwright webkit bug')


  try {
    await fileActions.clearFormQuestions()

    await fileActions.checkbox.click();
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.answerOption('Option 1').waitFor();
    await fileActions1.answerOption('Option 1').click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();
    const UTChours = new Date().getUTCHours();
    const UTCminutes = new Date().getUTCMinutes();

    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await fileActions.export(mobile);
    await fileActions.textbox.first().fill('form responses');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);
    await download.saveAs('/tmp/form responses');
    const csv = fs.readFileSync('/tmp/form responses', 'utf8').toString().replace(/\s|\\n?/g, '');
    const regexString = new RegExp(/^{"form":{/);

    if (regexString.test(csv)) {
      await fileActions.toSuccess('Can export Form reponses as .csv');
    } else {
      await fileActions.toFailure(e, 'Can\'texport Form reponses as .csv');
    }
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Form reponses as .csv');
  }
});

test('anon - form - export responses as .json', async ({ page, context }) => {
  test.skip(browserstackMobile, 'browserstack mobile download incompatibility');
  test.skip(browserName === 'playwright-firefox', 'playwright firefox bug')
  test.skip(browserName === 'playwright-webkit', 'playwright webkit bug')

  try {
    await fileActions.clearFormQuestions()

    await fileActions.checkbox.click();
    var clipboardText = await fileActions.publicLinkCopy()
    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.answerOption('Option 1').waitFor();
    await fileActions1.answerOption('Option 1').click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();

    const UTChours = new Date().getUTCHours();
    const UTCminutes = new Date().getUTCMinutes();

    await fileActions.responses(await fileActions.oneResponse.isVisible());
    await fileActions.export(mobile);
    await fileActions.textbox.first().fill('form responses');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      await fileActions.okButton.click()
    ]);
    await download.saveAs('/tmp/form responses');
    const responseJSONObject = JSON.parse(fs.readFileSync('/tmp/form responses'));
    const responseJSONString = `${JSON.stringify(responseJSONObject)}`;
    const regexString = /^\{"form":{/;
    if (regexString.test(responseJSONString)) {
      await fileActions.toSuccess('Can export Form responses as .json');
    } else {
      await fileActions.toFailure('Can\'t export Form responses as .json');
    }
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Form responses as .json');
  }
});

test('anon - form - export responses (to sheet document)', async ({ page, context }) => {
  try {
    await fileActions.clearFormQuestions()

    await fileActions.checkbox.click();
    var clipboardText = await fileActions.publicLinkCopy()

    page1 = await context.newPage();
    await page1.goto(`${clipboardText}`);
    const fileActions1 = new FileActions(page1)
    await fileActions1.answerOption('Option 1').waitFor();
    await fileActions1.answerOption('Option 1').click();
    await fileActions1.answerAnon.click();
    await fileActions1.submitButton.click();
    await page1.close();
    await fileActions.responses(await fileActions.oneResponse.isVisible());
    const page2Promise = page.waitForEvent('popup');
    await fileActions.exportToSheet.click();
    const page2 = await page2Promise;

    await expect(page2).toHaveURL(new RegExp(`^${url}/sheet`));

    await fileActions.toSuccess('Can export Form responses to Sheet document');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t export Form reponses to Sheet document');
  }
});
