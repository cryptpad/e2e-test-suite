## Installation

`npm install`

## Updating Playwright 

Running tests using an outdated local version of Playwright and/or a mismatch between the local Playwright version and the one used by Browserstack can result in bugs. Because the local version needs to be checked for Browserstack compatibility, it is recommended to update manually.

1. Check the local Playwright version using `npx playwright --version`
2. Check the latest Playwright version listed [here] (https://www.browserstack.com/docs/automate/playwright/browsers-and-os). You can compare this to the Issues with connecting to Browserstack can be caused both by outdated and mismatched Playwright browser versions. Sometimes the most recent Playwright version listed as compatible includes a browser which is not compatible with the version used by Browserstack (this can be verified by checking the 'Input Capabilities'). It is recommended to try installing and running the tests using the latest Playwright version and 
3. To update locally, run `npm install -D @playwright/test@[version number]`
4. Run `npx playwright install` to download Playwright browsers

## Browsertack authentication and integration

Create an `.env` file with

```env
BROWSERSTACK_USERNAME=""
BROWSERSTACK_ACCESS_KEY=""
```

Alternately replace the username and key variable placeholders in `browserstack.config.js`.

To run the tests with BrowserStack, make sure that each project in the `projects` list in `playwright.config.js` (line 109) has `connectOptions: { wsEndpoint: getCdpEndpoint('[desired browser]@latest[desired OS]')` in the `use` variable, e.g. 

```
  {
    name: 'edge',
    use: { 
      connectOptions: { wsEndpoint: getCdpEndpoint('edge@latest:OSX Ventura')
    },
  },

 ``` 

Once connected, the test results can be viewed at https://automate.browserstack.com/dashboard/.

## Run tests

0. To update Playwright to the latest version compatible with Browserstack, run `npm install @playwright/test@1.39.0` and then `npx playwright install`. 

1. If running locally, start local CryptPad instance.
2. If running locally or in production, change the exported variable `url` in `browserstack.config.js` to https://localhost:3000 or https://cryptpad.fr/ accordingly.
3. If running for the first time, set test account passwords (see "Required environment for E2E testing" below).
4. If running for the first time, seed the database, create files for storing user authentication details, and run the auth script (see "Required environment for E2E testing" below).
5. If running tests for anonymous users, run `npx playwright test anon --project=[project_]` (see "Fixtures" below).
6. If running tests for logged-in users, run `npx playwright test loggedin --workers=1 --project=[BROWSER_NAME]` (see "Fixtures" below).
7. To remove any extra files etc. created during the test run, run the cleanup script using `npx playwright test cleanup --workers=1 --project='chrome'`. 
8. Once done with testing, to remove the user accounts from the database, run the teardown script using `npx playwright test teardown --workers=1 --project='chrome'`.

The retries flag `--retries=1` can be added to identify flaky tests.

Alternately, tests in individual files can be run using `npx playwright test [filename] --project=[BROWSER_NAME]`.

## Interactive mode

`npx playwright codegen [url]`

## Checklist of test coverage 

[Here] (https://cryptpad.fr/code/#/2/code/edit/JURoNH7f0zbWYBYsaPLgHqkp/)

## Required environment for E2E testing 

[Here] (https://cryptpad.fr/code/#/3/code/edit/0def72606ece1221679bd8a6a00bcad1/)

NOTE: The setup, authentication, cleanup and teardown scripts MUST be run on Chrome browser as it is the most stable and least likely to result in failures or errors. 

1. Set passwords for the following test accounts:

* test-user
* testuser
* test-user2
* test-user3

either by adding 

```
MAINACCOUNTPASSWORD = ""
TESTUSERPASSWORD = ""
TESTUSER2PASSWORD = ""
TESTUSER3PASSWORD = ""
```

to your .env file and setting the variables to your chosen password, or replacing the password placeholders in `browserstack.config.js`.

2. To set up the test environment, run the `dbseeding.spec.js` file on its own, before any other file, using:

`npx playwright test dbseeding --workers=1 --project='chrome'`

The database seeding must be run using Chrome, as it is the most stable browser and minimises the chances of failure or error.

3. To save the authentication information for test accounts:

* change directory to auth folder using `cd auth` and create files to store authentication information for each test account using:

```bash
touch mainuser.json testuser.json testuser2.json testuser3.json
```

* then run 

`npx playwright test auth --workers=1 --project='chrome'`

from project root directory.

The user authentication must be run using Chrome, as it is the most stable browser and minimises the chances of failure or error.


Note: Tests relying on database seeds are written to be self contained and return to the original base state, i.e. if something is changed during the course of the test (a document created, a contact added to the team), by the end of the test, that change will be reversed, (i.e a created document will be destroyed, a contact added will be removed etc). If any of the tests which rely on or change an environment variable fail (e.g. if a user's password is changed, but isn't then also changed back to the old password; if a user sends another user a contact request, but that request isn't then declined/the second user isn't removed as a contact), this is likely to cause other tests which also rely on that variable to fail. In order to ensure there are no stray/leftover files from failed tests, it's advised to run the cleanup script between test runs.

## Fixtures

To run tests which interact with CryptPad as a logged-in user:

`npx playwright test loggedin --workers=1 --project='BROWSER_NAME'`

This will ensure that each test will start with the user account already logged in. These tests must be run serially using 1 worker.


To run tests which interact with CryptPad anonymously:

`npx playwright test anon --project='BROWSER_NAME'`

These tests will run in parallel mode using 2 workers (default).


## Multiple browser/OS testing

NOTE: As of 14/12/23, the test suite only supports Chrome browser and should be run with the flag `--project=chrome@latest:OSX Ventura@browserstack`.

The Chrome browser is compatible with the entire test suite and is most stable, and so is the recommended browser to run tests on. 
Playwright Firefox doesn't allow clipboard-read/write permissions to be set in the use options, and therefore cannot be used for tests which make use of clipboard functionality. Such tests are labeled with `(FF clipboard incompatibility)` and set to skip during test runs using Firefox. See 'Known issues / bugs' below.
Edge shows a security error screen when interacting with the Teams page, and therefore tests covering Teams functionality will fail during test runs using Edge. They are labeled with `(EDGE)` for clarity.

The chosen browser for a test run must be specified using the `--projects` flag. The available browsers are `chrome`, `firefox`, and `edge`.


## Known issues / bugs

Reproducible bugs and known issues related to testing can be found [here] (https://cryptpad.fr/code/#/2/code/view/6QTjYfGzXVSPUrZx0qW8FX3cH5-cyI8GilCLN9G7IUc/).
Most of the tests which have identified unexpected behaviour are labeled with `THIS TEST WILL FAIL` - if this is due to browser incompatibility, this will be indicated in the label (see 'Multiple browser/OS testing' above). 
