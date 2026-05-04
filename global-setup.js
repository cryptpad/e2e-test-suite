// global-setup.js
const { bsLocal, BS_LOCAL_ARGS } = require('./browserstack.config');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const redColour = '\x1b[31m';
const whiteColour = '\x1b[0m';

/* eslint-disable no-unused-vars */

module.exports = async () => {
  console.log('Starting test run...');
  // Starts the Local instance with the required arguments
    let localResponseReceived = false;
  bsLocal.start(BS_LOCAL_ARGS, (err) => {
    if (err) {
      console.error(err,
        `${redColour}Error starting BrowserStackLocal${whiteColour}`
      );
    } else {
      console.log('BrowserStackLocal Started');
    }
    localResponseReceived = true;
  });
  while (!localResponseReceived) {
    await sleep(1800);
  }
};

/* eslint-enable no-unused-vars */

