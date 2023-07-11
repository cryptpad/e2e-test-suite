require('dotenv').config();

const base = require('@playwright/test');
const cp = require('child_process');
const clientPlaywrightVersion = cp
  .execSync('npx playwright --version')
  .toString()
  .trim()
  .split(' ')[1];
const BrowserStackLocal = require('browserstack-local');
const util = require('util');

// BrowserStack Specific Capabilities.
// Set 'browserstack.local:true For Local testing

const dateToday = new Date()
const caps = {
  browser: 'firefox',
  os: 'osx',
  os_version: 'catalina',
  name: 'cp-playwright-test',
  build: 'cp-playwright-mobiletests',
  // 'browserstack.networkLogs': true,
  // build: `cp-playwright-build: ${dateToday}`,
  'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME_HERE',
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_KEY_HERE',
  'browserstack.local': process.env.BROWSERSTACK_LOCAL || true, 
  'browserstack.playwrightVersion': '1.33.0',
  'client.playwrightVersion': '1.33.0',
};

exports.url = 'https://cryptpad.fr'

const date = new Date()      
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const weekday = days[date.getDay()]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[date.getMonth()]
exports.titleDate = `${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()}`

exports.bsLocal = new BrowserStackLocal.Local();

// replace YOUR_ACCESS_KEY with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
exports.BS_LOCAL_ARGS = {
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'ACCESSKEY',
};

// Patching the capabilities dynamically according to the project name.
const patchCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, browser_version] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let os_version = osCapsSplit.join(' ');
  caps.browser = browser ? browser : 'chrome';
  caps.browser_version = browser_version ? browser_version : 'latest';
  caps.os = os ? os : 'osx';
  caps.os_version = os_version ? os_version : 'catalina';
  caps.name = name;
  caps.title = title;
};

exports.getCdpEndpoint = (name, title) => {
    patchCaps(name, title)    
    const cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`
    return cdpUrl;
}
