const { execSync } = require('child_process');
const { bsLocal, BS_LOCAL_ARGS } = require('./browserstack.config');

module.exports = async () => {
  console.log('Starting test run...');

  if (!(process.env.BROWSERSTACK && process.env.PW_URL.includes('localhost'))) {
    return;
  }

  // Kill any stale BrowserStack Local daemon from a previous interrupted run.
  try {
    execSync('pkill -f BrowserStackLocal');
  } catch (_) {
    // Nothing to kill.
  }

  await new Promise((resolve, reject) => {
    bsLocal.start(BS_LOCAL_ARGS, err => {
      if (err) return reject(err);
      console.log('BrowserStackLocal Started');
      resolve();
    });
  });
};
