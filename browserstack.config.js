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
  build: 'cp-playwright-mobiletests-corrections',
  // 'browserstack.networkLogs': true,
  // build: `cp-playwright-build: ${dateToday}`,
  'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'YOUR_USERNAME_HERE',
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'YOUR_KEY_HERE',
  'browserstack.local': process.env.BROWSERSTACK_LOCAL || true, 
  'browserstack.playwrightVersion': '1.37.1',
  'client.playwrightVersion': '1.37.1',
};

exports.url = 'https://cryptpad.fr'

exports.mainAccountPassword = process.env.MAINACCOUNTPASSWORD || 'PASSWORD_HERE' 
exports.testUserPassword = process.env.TESTUSERPASSWORD || 'PASSWORD_HERE' 
exports.testUser2Password = process.env.TESTUSER2PASSWORD || 'PASSWORD_HERE' 
exports.testUser3Password = process.env.TESTUSER3PASSWORD || 'PASSWORD_HERE' 


const date = new Date()      
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const weekday = days[date.getDay()]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const month = months[date.getMonth()]
exports.titleDate = `${weekday}, ${date.getDate()} ${month} ${date.getFullYear()}`




const now = new Date();

const monthNumeric = now.getMonth() + 1
const monthFormatted = monthNumeric.toString().length > 1 ? monthNumeric : '0' + monthNumeric;

const today = now.getDate();
const todayFormatted = today.toString().length > 1 ? today : '0' + today;

exports.dateTodayDashFormat = now.getFullYear() + '-' + monthFormatted + '-' + todayFormatted
exports.dateTodaySlashFormat = todayFormatted + '/' + monthFormatted + '/' + now.getFullYear()

const nextMonday = new Date()
nextMonday.getDay() !== 0 ? nextMonday.setDate(nextMonday.getDate()  + ( ((1 + 7 - nextMonday.getDay()) % 7) || 7 )) : nextMonday.setDate(nextMonday.getDate() + 8 )
const nextMondayFormatted = nextMonday.getDate().toString().length > 1 ? nextMonday.getDate() : '0' + nextMonday.getDate();
const nextMondayMonth = nextMonday.getMonth() + 1

const nextMondayMonthFormatted = nextMondayMonth.toString().length > 1 ? nextMondayMonth : '0' + nextMondayMonth;
exports.nextMondayDashFormat = nextMonday.getFullYear() + '-' + nextMondayMonthFormatted + '-' + nextMondayFormatted
exports.nextMondaySlashFormat =  nextMondayFormatted + '/' + nextMondayMonthFormatted + '/' +  nextMonday.getFullYear()

const nextMondayMonthString = months[nextMonday.getMonth()]
exports.nextMondayStringFormat = `${nextMondayMonthString} ${nextMonday.getDate()}, ${nextMonday.getFullYear()}`

exports.year = now.getFullYear()
exports.minutes = now.getMinutes().toString().length > 1 ? now.getMinutes() : '0' + now.getMinutes()
exports.hours = now.getHours()
const monthString = months[now.getMonth()]
exports.todayStringFormat = `${monthString} ${now.getDate()}, ${now.getFullYear()}`



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
