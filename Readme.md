

## Installation

`npm install`

## Browsertack authentication

Create a `.env` file with

```env
BROWSERSTACK_USERNAME=""
BROWSERSTACK_ACCESS_KEY=""
```

## Run tests

1. Start local CryptPad instance 
2. `npx playwright test`

## Interactive mode

`npx playwright codegen localhost:3000`