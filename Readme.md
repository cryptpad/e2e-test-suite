## Installation

`npm install`

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
    name: 'edge@latest:OSX Ventura',
    use: { 
      connectOptions: { wsEndpoint: getCdpEndpoint('edge@latest:OSX Ventura')
    },
  },

 ``` 

Once connected, the test results can be viewed at https://automate.browserstack.com/dashboard/.

## Run tests

1. If running locally, start local CryptPad instance.
2. If running locally or in staging, change the exported variable `url` in `browserstack.config.js` to https://localhost:3000 or https://freemium.cryptpad.fr/ accordingly. 
3. If running locally or in staging for the first time, seed the database first by running `npx playwright test dbseeding.spec.js` (see "Required environment for E2E testing" below).
3. If running tests for anonymous users, ensure `storageState: 'user.json'` is commented out in `playwright.config.js` and run `npx playwright test anon` (see "Fixtures" below).
3. If running tests for logged-in users, ensure `storageState: 'user.json'` is set in `playwright.config.js` and run `npx playwright test loggedin --workers=1` (see "Fixtures" below).

The retries flag `--retries=1` can be added to identify flaky tests.

Alternately, tests in individual files can be run using `npx playwright test [filename]`.

## Interactive mode

`npx playwright codegen [url]`

## Checklist of test coverage 

[Here] (https://cryptpad.fr/code/#/2/code/edit/JURoNH7f0zbWYBYsaPLgHqkp/)

## Required environment for E2E testing 

[Here] (https://cryptpad.fr/code/#/3/code/edit/0def72606ece1221679bd8a6a00bcad1/)

To set up the test environment, run the `dbseeding.spec.js` file ON ITS OWN, BEFORE RUNNING ANY OTHER FILE, using:

`npx playwright test dbseeding.spec.js --workers=1`

Note: Tests relying on database seeds are written to be self contained and return to the original base state, i.e. if something is changed during the course of the test (a document created, a contact added to the team), by the end of the test, that change will be reversed, (i.e a created document will be destroyed, a contact added will be removed etc). If any of the tests which rely on or change an environment variable fail (e.g. if a user's password is changed, but isn't then also changed back to the old password; if a user sends another user a contact request, but that request isn't then declined/the second user isn't removed as a contact), this is likely to cause other tests which also rely on that variable to fail. 

## Fixtures

To run tests which interact with CryptPad as a logged-in user:

`npx playwright test loggedin --workers=1`

These tests will run serially using 1 worker.
To run these tests, make sure that each project in `projects` list in `playwright.config.js` (line 109) has `storageState: 'user.json'` in the `use` variable, e.g. 

```
  [{
    name: 'chrome@latest:OSX Ventura',
    use: {
      permissions: ["clipboard-read", "clipboard-write", "notifications"],
      // storageState: 'user.json',
      connectOptions: { wsEndpoint: getCdpEndpoint('chrome@latest:OSX Ventura') },
      viewport: {width: 1440, height: 764}, 
      locale: 'en-GB'
    },
  }],

``` 

This will ensure that each test will start with the user account already logged in.


To run tests which interact with CryptPad anonymously:

`npx playwright test anon`

These tests will run in parallel mode using 2 workers (default).
To run these tests, make sure that each project in the "projects" list in `playwright.config.js` (line 109) has `storageState: 'user.json'` in the `use` variable commented out, e.g. 

```
  [{
    name: 'chrome@latest:OSX Ventura',
    use: {
      permissions: ["clipboard-read", "clipboard-write", "notifications"],
      storageState: 'user.json',
      connectOptions: { wsEndpoint: getCdpEndpoint('chrome@latest:OSX Ventura') },
      viewport: {width: 1440, height: 764}, 
      locale: 'en-GB'
    },
  }],

``` 


## Multiple browser/OS testing

The default browser/OS combination integrated with Browserstack which the tests run on is set to Chrome/OS Mojave. This is because the Chrome browser is compatible with the entire test suite. 
Playwright Firefox doesn't allow clipboard-read/write permissions to be set in the use options, and therefore cannot be used for tests which make use of clipboard functionality. Such tests are labeled with `(FF clipboard incompatibility)` and set to skip during test runs using Firefox. See 'Known issues / bugs' below.
Edge shows a security error screen when interacting with the Teams page, and therefore tests covering Teams functionality will fail during test runs using Edge and are labeled with `EDGE`.

The browser and OS can be changed using the `projects` variable in module.exports, in the `playwright.config.js` file. 
To test on other browsers/OSs, change the project name and `connectOptions` in the `use` variable. There is also code block before module.exports which creates a list of all possible browser/OS combinations and sets it to variable `projectsList`. To make use of it, simply comment out whatever browser/OS combination `projects` is currently set to, and set it to `projectsList` instead.


## Known issues / bugs

Reproducible bugs and known issues related to testing can be found [here].
Tests which are expected to fail are labeled with `THIS TEST WILL FAIL` - if this is due to browser incompatibility, this will be indicated in the label (see 'Multiple browser/OS testing' above). 
