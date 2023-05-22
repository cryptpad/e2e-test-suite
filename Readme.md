

## Installation

`npm install`

## Browsertack authentication

Create a `.env` file with

```env
BROWSERSTACK_USERNAME=""
BROWSERSTACK_ACCESS_KEY=""
```

Alternately replace the username and key variable placeholders in browserstack.config.js.

## Run tests
Download, run and connect the Browserstacklocal app, instructions [here]. (https://www.browserstack.com/docs/live/local-testing)


1. If running locally, start local CryptPad instance and change the url at the top of the files to https://localhost:3000.
2. Start the Browserlocal app and connect.
2. Run `npx playwright test --headed`

Running in headed mode prevents the browsers from closing during the test run.

## Interactive mode

`npx playwright codegen localhost:3000`


## Checklist of test coverage 

[Here] (https://cryptpad.fr/code/#/2/code/edit/5SDhLxs2+PfxFm3BrzfcMMLD/)