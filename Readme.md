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

Download, run and connect the Browserstacklocal app, instructions [here]. (https://www.browserstack.com/docs/live/local-testing)

1. If running locally, start local CryptPad instance and change the url at the top of the files to https://localhost:3000.
2. Start the Browserlocal app and connect.
2. Run `npx playwright test --headed`

Running in headed mode prevents the browsers from closing during the test run.
Alternately, you can run tests in individual files using `npx playwright test [filename] --headed`.

## Interactive mode

`npx playwright codegen [url]`

## Checklist of test coverage 

[Here] (https://cryptpad.fr/code/#/2/code/edit/JURoNH7f0zbWYBYsaPLgHqkp/)

## Multiple browser/OS testing

The default browser/OS combination which the tests are run on is set to OS Mojave/Firefox, using the 'projects' variable in module.exports, in the playwright.config.js file.
To test on other browsers/OS, use the code block before module.exports -- it creates a list of all possible browser/OS combinations and sets it to variable 'projectsList'. To make use of it, simply comment out whatever browser/OS combination 'projects' is currently set to, and set it to 'projectsList' instead.

## A note on debugging

Playwright is fickle and despite my best efforts, some tests can be flaky. This means they will occasionally randomly fail for no apparent reason. This is often because an action is performed too fast, before all the elements which are required for it have loaded properly. A lot of the time the test can be made to run correctly by sticking `await page.waitForLoadState('networkidle')` before the line which is causing it to fail. This makes the test slower but fixes the problem a lot of the time. You can also specify the number of retries for each failed test in playwright.config.js.