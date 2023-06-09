## Installation

`npm install`

## Browsertack authentication and integration

Create a `.env` file with

```env
BROWSERSTACK_USERNAME=""
BROWSERSTACK_ACCESS_KEY=""
```

Alternately replace the username and key variable placeholders in browserstack.config.js.

Once connected, the test results can be viewed at https://automate.browserstack.com/dashboard/.

## Run tests

1. If running locally, start local CryptPad instance and change the url at the top of the files to https://localhost:3000.
2. Run `npx playwright test --headed --retries=1`

Running in headed mode prevents the browsers from closing during the test run.
The retries flag is helpful when a test fails randomly e.g. because the browser tab crashes. 

Alternately, you can run tests in individual files using `npx playwright test [filename] --headed --retries=1`.

## Interactive mode

`npx playwright codegen [url]`

## Checklist of test coverage 

[Here] (https://cryptpad.fr/code/#/2/code/edit/JURoNH7f0zbWYBYsaPLgHqkp/)

## Multiple browser/OS testing

The default browser/OS combination which the tests are run on is set to Edge on OS Mojave, using the 'projects' variable in module.exports, in the playwright.config.js file. This is because the Edge browser is the most stable (results in least flaky tests).
To test on other browsers/OS, use the code block before module.exports -- it creates a list of all possible browser/OS combinations and sets it to variable 'projectsList'. To make use of it, simply comment out whatever browser/OS combination 'projects' is currently set to, and set it to 'projectsList' instead.

