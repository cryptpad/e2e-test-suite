[TOC]

## Introduction and setup

### Introduction 

This is an end-to-end suite using Playwright and Browserstack to test the functionality of CryptPad in production, staging and development.

Playwright is an automated testing framework for writing end-to-end tests, which are run using locally installed browsers. BrowserStack is a testing platform which can be integrated with Playwright to run tests in the cloud. It allows for recording videos and logging the results of each run.

A list of functionality currently covered by the test suite, as well as areas to work on, is available [here](https://cryptpad.fr/code/#/2/code/edit/JURoNH7f0zbWYBYsaPLgHqkp/). 

### Download and installation

To download this repository and install dependencies, run:

```
git clone https://git.xwikisas.com/cryptpad/playwright-tests.git
cd playwright-tests
npm install
```


### Required environment for authenticated tests

Some of the suite is focused on anonymous interaction with CryptPad and its apps, and requires no database setup or authentication.

These tests have `_anon` in the file name, and can be run collectively using the `anon` command line variable (see 'Running tests' below.)

The rest deals with the functionality related to user accounts, and relies on seeding the database with accounts, documents, teams etc. before any tests can be run. A description of the required initial data can be found [here](https://cryptpad.fr/code/#/3/code/edit/0def72606ece1221679bd8a6a00bcad1/). This environment must be kept constant and replicable between tests, i.e. if as part of a test a document is created and added to the user's drive, it must be deleted before the test is run again. To ensure this in case of code malfunction or test failure, there are several cleanup scripts in `test-pages.spec.js` integrated into the test files, which run in order to return the test environment to base state. However, there may be situations in which these do not work as expected, and one may be required to manually intervene in the test environment.

These tests have `_loggedin` in the file name, and can be run collectively using the `loggedin` command line variable (see 'Running tests' below.)


#### Seeding the database

>  :exclamation:
> The setup, authentication and teardown scripts **must** be run on Chrome as it is the most stable browser and least likely to result in failures or errors. 

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

to your `.env` file and setting the variables to your chosen password, or replacing the password placeholders in `fixture.js`.


2. Set up the test environment:

* run the `dbseeding.spec.js` file on its own, before any other file, using:

`npx playwright test dbseeding --workers=1 --project='chrome@latest:OSX Ventura'`

You can specify another OS name or run the file using Browserstack as desired (see 'Running tests' below).


3. To save the authentication information for test accounts:

* change directory to auth folder and create files to store authentication information for each test account using:

```bash
cd auth
touch mainuser.json testuser.json testuser2.json testuser3.json
```

* then change back to project root directory and run the auth script using: 

```
cd ..
npx playwright test auth --workers=1 --project='chrome@latest:OSX Ventura'
```

### Browsertack authentication and integration

Create an `.env` file with the following variables and set them to your Browserstack username and access key:

```env
BROWSERSTACK_USERNAME=""
BROWSERSTACK_ACCESS_KEY=""
```

Alternately replace the username and key variable placeholders in `browserstack.config.js`.

Once connected, the test results can be viewed at https://automate.browserstack.com/dashboard/.

## Running tests

### Development vs. live testing

The tests run on the [CryptPad staging instance](https://freemium.cryptpad.fr/) by default. They can also be run against the [flagship CryptPad instance](https://cryptpad.fr/) or a development instance running locally. To change, set the `exports.url` variable under `GLOBAL VARIABLES` in `fixture.js`. To test against a development instance, make sure it is running locally when running the tests.

### Choose browser and OS/device

The tests can be run on different browser and OS/device combinations, set under `projects` in `playwright.config.js`. The format is as follows:

`[browser name]@[os/device name]`, for example `chrome@latest:OSX Ventura`. 

The project uses Chrome, Edge, Firefox and Webkit on the latest available versions of OSX and Chrome on Android. 

You can choose a browser and OS/device combination from those available in `playwright.config.js`, or you can add your own. You can see a full list of supported browsers and OS/devices [here](https://playwright.dev/docs/browsers). To see how they compare to what is supported by integration with Browserstack, see [here](https://www.browserstack.com/docs/automate/playwright/browsers-and-os). 

### Choose Playwright only or Plawright and Browserstack

The tests can be run locally using Playwright only. This is usually slightly quicker and does not require connection to Browserstack. 

To run the tests using Browserstack, add `@browserstack` (for desktop) or `@browserstack-mobile` (for mobile) to the project name, for example `chrome@latest:OSX Ventura@browserstack`.

### Running tests

> :exclamation:
> It is strongly recommended that the tests be run over a strong and stable internet connection, **especially** when using Browserstack. Tests run over slow connections will often time out and fail or hang indefinitely. 

1. If running tests for anonymous users, run: 

```
npx playwright test anon --project='chrome@latest:OSX Ventura'
```

These tests will run in parallel mode using two workers (default).
You can set another browser/OS combination of your choosing using the `projects` flag (see 'Choose browser and OS/device').

> :information_source:
> If the command to run tests is used without the `projects` flag, the chosen tests will run on all available `projects` listed in `playwright.config.js`. 


2. If running tests for logged-in users (see 'Required environment for authenticated tests' above) run: 

```
npx playwright test loggedin --workers=1 --project='chrome@latest:OSX Ventura'
```

3. Alternately, tests in individual files can be run using: 

```
npx playwright test [filename] --project='chrome@latest:OSX Ventura'
```
**If running a test file with `loggedin` in the name, a `--workers=1` flag must be added**, for example:

```
npx playwright test code_loggedin --workers=1 --project='chrome@latest:OSX Ventura'

```

> :information_source:
> The `--headed` flag can be added to run the tests in headed browsers and be able to see the progression of the test in real time.


## Troubleshooting

Some tests are 'flaky', i.e. will occasionally fail due to timeouts, inconsistency with rendering DOM elements, connection errors, etc. Adding the retries flag `--retries=1` to the `npx playwright test` command will retry any test in case of failure once, and can be used to identify flaky tests.

### Updating Playwright 

Running tests using an outdated local version of Playwright and/or a mismatch between the local Playwright version and the one used by Browserstack can result in bugs. Because the local version needs to be checked for Browserstack compatibility, it is recommended to update manually.

1. Check the local Playwright version using:

```
 npx playwright --version

 ```
2. Check the latest Playwright version listed [here](https://www.browserstack.com/docs/automate/playwright/browsers-and-os). You can compare this to the version used by Browserstack in the 'Input Capabilities' section of each test recording. 
   * Issues with connecting to Browserstack can be caused by an outdated Playwright version as well as a conflict between individual browser versions used by Playwright and Browserstack. 
    * It is recommended to install and use the latest Playwright version listed as compatible with Browserstack under the link above.
3. To update locally, run:

```
npm install -D @playwright/test@[version number]
```

4. To download Playwright browsers run:

```
npx playwright install
```

### Known bugs (Playwright issues) 

Currently some mobile tests are marked as skipped when running with Browserstack due to an incompatibility of Playwright v. 1.41.2 and Browserstack's Chrome (Android), which results with a bug when downloading/importing files.

This and other issues are documented in the Issues section of the repository.


### Known bugs (CryptPad issues)

Reproducible bugs and problem behaviours which cause tests to fail are listed [here](https://cryptpad.fr/code/#/2/code/view/dva4JIIHCrRYWkBRub8LhYTWJ7o2cmiq-4zC3hbNRfc/). Most of the tests which consistently fail are listed here, and labeled with the number of the related GitHub issue both in this document and in the test name.

Currently all tests interacting with the Teams functionality are set to skip if running on Edge browser due to an unfixable incompatibility. 


## Contributing 

The list of areas currently in need of expanding coverage can be found above.

### Interactive mode

When writing tests, the Playwright [code generator](https://playwright.dev/docs/codegen) can be used to identify actions and DOM locators. To use, run:

```
npx playwright codegen [url]
```


