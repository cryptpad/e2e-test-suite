## Installation

`npm install`

## Browsertack authentication and integration

Create a `.env` file with

```env
BROWSERSTACK_USERNAME=""
BROWSERSTACK_ACCESS_KEY=""
```

Alternately replace the username and key variable placeholders in browserstack.config.js.

To run the tests with BrowserStack, make sure that each project in "projects" list in playwright.config.js (line 109) has "connectOptions: { wsEndpoint: getCdpEndpoint('DESIRED OS/BROWSER COMBO')" in the "use" variable, e.g. 

```
  {
    name: 'edge@latest:OSX Ventura',
    use: { 
      connectOptions: { wsEndpoint: getCdpEndpoint('edge@latest:OSX Ventura')
    },
  },

 ``` 

Once connected, the test results can be viewed at https://automate.browserstack.com/dashboard/.

## Run tests

1. If running locally, start local CryptPad instance and change the url in `browserstack.config.js` to https://localhost:3000. (Note: this won't work with most tests as test database seeding is not yet included in this repo)
2. Run `npx playwright test --headed --retries=1`

Running in headed mode prevents the browsers from closing during the test run.
The retries flag is helpful when a test fails randomly e.g. because the browser tab crashes. 

Alternately, you can run tests in individual files using `npx playwright test [filename] --headed --retries=1`.

This repository is a work in progress. For convenience, I have commented out most of the tests in each file so that when writing a new test, I don't have to run all tests in each file. Before running the tests in each file, please check that the tests you wish to run have been uncommented!

NOTE: AT THIS POINT -- BECAUSE SOME FILES RELY ON FIXTURES AND SOME DON'T -- EACH FILE SHOULD BE RUN SEPARATELY. SEE "FIXTURES" SECTION BELOW FOR MORE DETAILS.

## Interactive mode

`npx playwright codegen [url]`

## Checklist of test coverage 

[Here] (https://cryptpad.fr/code/#/2/code/edit/JURoNH7f0zbWYBYsaPLgHqkp/)

## Required environment for E2E testing 

[Here] (https://cryptpad.fr/code/#/3/code/edit/0def72606ece1221679bd8a6a00bcad1/)

To set up the test environment, run the `dbseeding.spec.js` file ON ITS OWN, BEFORE RUNNING ANY OTHER FILE. 

Note: All tests are written to be self contained and return to the original base state, i.e. if something is changed during the course of the test (a document created, a contact added to the team), by the end of the test, that change will be reversed, (i.e a created document will be destroyed, a contact added will be removed etc). If any of the tests which rely on or change an environment variable fail (e.g. if a user's password is changed, but isn't then also changed back to the old password; if a user sends another user a contact request, but that request isn't then declined/the second user isn't removed as a contact), this is likely to cause other tests which also rely on that variable to fail. 

## Fixtures

Test files which rely on user accounts:

* account.spec.js
* calendar.spec.js
* driveuser.spec.js
* teams.spec.js

These files will run in SERIAL MODE.
To run these tests, make sure that each project in `projects` list in `playwright.config.js` (line 109) has `storageState: 'user.json'` in the `use` variable, e.g. 

```
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      storageState: 'user.json'
    },
  },

 ``` 

 This will ensure that each test will start with the user account already logged in.

 Test files which (mostly) don't rely on user accounts/interact with CryptPad anonymously:

* code.spec.js
* driveanon.spec.js
* form.spec.js
* genericfile.spec.js
* homepage.spec.js
* kanban.spec.js
* markdown.spec.js
* pad.spec.js
* sheet.spec.js

These files will run in PARALLEL MODE.
To run these tests, make sure that each project in "projects" list in `playwright.config.js` (line 109) has `storageState: 'user.json'` in the `use` variable commented out, e.g. 

```
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      //storageState: 'user.json'
    },
  },

 ``` 


## Multiple browser/OS testing

The default browser/OS combination which the tests are run on is set to Edge on OS Mojave, using the `projects` variable in module.exports, in the `playwright.config.js` file. This is because the Edge browser is the most stable (results in least flaky tests).
To test on other browsers/OS, use the code block before module.exports -- it creates a list of all possible browser/OS combinations and sets it to variable `projectsList`. To make use of it, simply comment out whatever browser/OS combination `projects` is currently set to, and set it to `projectsList` instead.


## Known issues

Known issues can be found [here] (https://cryptpad.fr/slide/#/2/slide/edit/LKrfxxRwkS6pwombFOn8yueQ/).

