const { test, url, mainAccountPassword } = require('../fixture.js');
const { expect } = require('@playwright/test');
const { Cleanup } = require('./cleanup.js');
const { UserActions } = require('./useractions.js');
const { FileActions } = require('./fileactions.js');

const fs = require('fs');
const unzipper = require('unzipper');

let page1;
let mobile;
let browserName;
let cleanUp;
let browserstackMobile;
let fileActions;

test.beforeEach(async ({ page, isMobile }, testInfo) => {
  test.setTimeout(90000);

  mobile = isMobile;
  browserName = testInfo.project.name.split(/@/)[0];
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);

  await page.goto(`${url}/teams`);
  fileActions = new FileActions(page);
});

test('loggedin - user menu - make and delete team', async ({ page }) => {
  test.skip(browserName === 'edge', 'microsoft edge incompatibility');

  try {
    await fileActions.newTeam.waitFor();

    await expect(page).toHaveScreenshot( );


    await fileActions.toSuccess( 'Can create a team');
  } catch (e) {
    await fileActions.toFailure(e,  'Can\'t create a team' );
  }
});