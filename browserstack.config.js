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

// BrowserStack Specific Capabilities

const dateToday = new Date()
const caps = {
  name: "my playwright test",
  build: "freemium-log",
  "browserstack.username": process.env.BROWSERSTACK_USERNAME,
  "browserstack.accessKey": process.env.BROWSERSTACK_ACCESS_KEY,
  "browserstack.local": process.env.PW_URL.includes('localhost') ? true : false,
  // "browserstack.idleTimeout" : "300",
  "browserstack.playwrightVersion" : clientPlaywrightVersion

};

exports.patchMobileCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, deviceName] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let osVersion = osCapsSplit.join(" ");
  caps.browser = browser ? browser : "chrome";
  caps.deviceName = deviceName ? deviceName : "Samsung Galaxy S22 Ultra";
  caps.osVersion = osVersion ? osVersion : "12.0";
  caps.name = title;
  caps.realMobile = "true";
};


exports.caps = caps;
exports.bsLocal = new BrowserStackLocal.Local();

exports.BS_LOCAL_ARGS = {
  key: process.env.BROWSERSTACK_ACCESS_KEY,
};

// Patching the capabilities dynamically according to the project name.
exports.patchCaps = (name, title) => {
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
  caps.firefox_user_prefs = { 'dom.events.asyncClipboard.readText': true, 'dom.events.testing.asyncClipboard': true }
};

exports.getCdpEndpoint = (name, title) => {
    patchCaps(name, title)    
    const cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`
    return cdpUrl;
}
