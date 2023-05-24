// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { getCdpEndpoint } = require('./browserstack.config.js')
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */


// const os = ['Windows 10','Windows 11','OSX Ventura', 'OSX Monterey','OSX Big Sur', 'OSX Catalina', 'OSX Mojave']

const os = ['Windows 10']

const browsers = ['chrome', 'playwright-webkit', 'playwright-firefox', 'edge']
const browserOS = browsers.flatMap((x) => os.map((y) => `${x}@latest:${y}`));
const projects = []
var funct = function() {
  let project;
  const string = [...Array(Object.keys(browserOS).length).keys()].forEach(function(i) {
  project = { name: `${browserOS[i]}`,
    use: {
      connectOptions: { wsEndpoint: getCdpEndpoint(`${browserOS[i]}`) }
    },
  }
  projects.push(project)
  return project
  })

}

funct()



module.exports = defineConfig({
  testDir: './e2e-tests',
  /* Run tests in files in parallel */
  // fullyParallel: true,
  // /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  // /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  // /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  // /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  // /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // use: {
  //   /* Base URL to use in actions like `await page.goto('/')`. */
  //   // baseURL: 'http://127.0.0.1:3000',

  //   /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  //   trace: 'on-first-retry',
  // },
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  // timeout: 9000000 ,
  // expect: {
  //   /**
  //    * Maximum time expect() should wait for the condition to be met.
  //    * For example in `await expect(locator).toHaveText();`
  //    */
  //   timeout: 9000000 ,
  // },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',},
    


  projects: projects,
    // [{
    //   name: 'playwright-firefox@latest:OSX Mojave',
    //   use: {
    //     connectOptions: { wsEndpoint: getCdpEndpoint('playwright-firefox@latest:OSX Mojave', 'test2') }
    //   },
    // }],

    
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

