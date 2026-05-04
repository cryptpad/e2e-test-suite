// global-setup.js
const { bsLocal, BS_LOCAL_ARGS } = require('./browserstack.config');
const redColour = '\x1b[31m';
const whiteColour = '\x1b[0m';

module.exports = async (name, title) => {
  console.log('Starting test run...');
  // Starts the Local instance with the required arguments
  if (!!process.env.BROWSERSTACK && !!process.env.PW_URL.includes('localhost')) {
    bsLocal.start(BS_LOCAL_ARGS, (err) => {
      if (err) {
        console.error(err,
          `${redColour}Error starting BrowserStackLocal${whiteColour}`
        );
      } else {
        console.log('BrowserStackLocal Started');
      }
    });
  }
};
