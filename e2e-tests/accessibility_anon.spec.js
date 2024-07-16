const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright')
const fs = require('fs');
require('dotenv').config();
const os = require('os');

let pageOne;
let isMobile;
let browserstackMobile;
let platform;
const local = !!process.env.PW_URL.includes('localhost');

test.beforeEach(async ({ page }, testInfo) => {
  test.setTimeout(210000);

  isMobile = testInfo.project.use.isMobile;
  browserstackMobile = testInfo.project.name.match(/browserstack-mobile/);
  platform = os.platform();

});

let results ='';

test('documentation - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`https://docs.cryptpad.org/en/`);
    await page.waitForTimeout(10000);
    let accessibilityScanResultsString;
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
    results = results + '\n| Documentation  |     |    |     |'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        accessibilityScanResultsString = `Documentation \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
        console.log(accessibilityScanResultsString)
        results = results +  `\n|     | ${index}     | ${violation.description}  | ${violation.help}  |`
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'documentation - accessibility', status: 'failed', reason: 'Documentation is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'documentation - accessibility', status: 'passed', reason: 'Documentation is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'documentation - input text', status: 'failed', reason: 'Documentation is not accessible' } })}`);
  }
});

test('project website - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`https://cryptpad.org/`);
    await page.waitForTimeout(10000);
    let accessibilityScanResultsString;
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    if (accessibilityScanResults.violations.length) {
     results = results + '\n| Project website  |     |    |     |'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        accessibilityScanResultsString = `Project website \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
        console.log(accessibilityScanResultsString)
        results = results +  `\n|     | ${index}     | ${violation.description}  | ${violation.help}  |`
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'project website - accessibility', status: 'failed', reason: 'Project website is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'project website - accessibility', status: 'passed', reason: 'Project website is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'project website - accessibility', status: 'failed', reason: 'Project website is not accessible' } })}`);
  }
});

// test('contact - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/contact`);
//     let accessibilityScanResultsString ='';
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Contact \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'failed', reason: 'Contact page is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'passed', reason: 'Contact page is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'failed', reason: 'Contact page is not accessible' } })}`);
//   }
// });

// test('homepage - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}`);
//     let accessibilityScanResultsString ='';
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Homepage \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - accessibility', status: 'failed', reason: 'Homepage is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - accessibility', status: 'passed', reason: 'Homepage is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - accessibility', status: 'failed', reason: 'Homepage is not accessible' } })}`);
//   }
// });

// test('sign up - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/register`);
//     await page.waitForTimeout(5000);
//     let accessibilityScanResultsString ='';
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Sign up \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sign up - accessibility', status: 'failed', reason: 'Sign up is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sign up - accessibility', status: 'passed', reason: 'Sign up is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sign up - accessibility', status: 'failed', reason: 'Sign up is not accessible' } })}`);
//   }
// });

// test('login - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/login`);
//     let accessibilityScanResultsString ='';
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Log in \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'login - accessibility', status: 'failed', reason: 'Log in is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'login - accessibility', status: 'passed', reason: 'Log in is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'login - accessibility', status: 'failed', reason: 'Log in is not accessible' } })}`);
//   }
// });

// test('code - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/code`);
//     await page.waitForTimeout(30000)
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Code \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - accessibility', status: 'failed', reason: 'Code is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - accessibility', status: 'passed', reason: 'Code is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - accessibility', status: 'failed', reason: 'Code is not accessible' } })}`);
//   }
// });

// test('file menu - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/code`);
//     await page.waitForTimeout(30000)
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
//     if (isMobile) {
//       await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
//     } else {
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
//     }
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `File menu \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'file menu - accessibility', status: 'failed', reason: 'Document file menu is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'file menu - accessibility', status: 'passed', reason: 'Document file menu  is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'file menu - accessibility', status: 'failed', reason: 'Document file menu  is not accessible' } })}`);
//   }
// });

// test('share modal - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/code`);
//     await page.waitForTimeout(30000)
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
//     if (isMobile) {
//       await page.frameLocator('#sbox-iframe').locator('.cp-toolar-share-button').click();
//     } else {
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Share' }).click();
//     }
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Share modal \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'share modal - accessibility', status: 'failed', reason: 'Share modal is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'share modal - accessibility', status: 'passed', reason: 'Share modal is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'share modal - accessibility', status: 'failed', reason: 'Share modal is not accessible' } })}`);
//   }
// });

// test('access modal - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/code`);
//     await page.waitForTimeout(30000)
//     await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
//     if (isMobile) {
//       await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
//     } else {
//       await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
//     }
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Access modal \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access modal - accessibility', status: 'failed', reason: 'Access modal is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access modal - accessibility', status: 'passed', reason: 'Access modal is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access modal - accessibility', status: 'failed', reason: 'Access modal is not accessible' } })}`);
//   }
// });

// test('drive (anon) - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/drive`);
//     await page.waitForTimeout(10000);
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Drive (anon) \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (anon) - accessibility', status: 'failed', reason: 'Drive is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (anon) - accessibility', status: 'passed', reason: 'Drive is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (anon) - accessibility', status: 'failed', reason: 'Drive is not accessible' } })}`);
//   }
// });

// test('form - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/form`);
//     await page.waitForTimeout(10000);
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Form \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - accessibility', status: 'failed', reason: 'Form is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - accessibility', status: 'passed', reason: 'Form is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - input text', status: 'failed', reason: 'Form is not accessible' } })}`);
//   }
// });

// test('kanban - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/kanban`);
//     await page.waitForTimeout(10000);
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Kanban \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - accessibility', status: 'failed', reason: 'Kanban is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - accessibility', status: 'passed', reason: 'Kanban is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - accessibility', status: 'failed', reason: 'Kanban is not accessible' } })}`);
//   }
// });

// test('markdown - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/slide`);
//     await page.waitForTimeout(10000);
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Markdown \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - accessibility', status: 'failed', reason: 'Markdown is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - accessibility', status: 'passed', reason: 'Markdown is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - accessibility', status: 'failed', reason: 'Markdown is not accessible' } })}`);
//   }
// });

// test('pad - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/pad`);
//     await page.waitForTimeout(10000);
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Pad \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad - accessibility', status: 'failed', reason: 'Pad is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad - accessibility', status: 'passed', reason: 'Pad is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad - accessibility', status: 'failed', reason: 'Pad is not accessible' } })}`);
//   }
// });

// test('sheet - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/sheet`);
//     await page.waitForTimeout(10000);
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Sheet \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sheet - accessibility', status: 'failed', reason: 'Sheet is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sheet - accessibility', status: 'passed', reason: 'Sheet is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sheet - accessibility', status: 'failed', reason: 'Sheet is not accessible' } })}`);
//   }
// });

// test('diagram - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/diagram`);
//     await page.waitForTimeout(10000);
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Diagram \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'diagram - accessibility', status: 'failed', reason: 'Diagram is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'diagram - accessibility', status: 'passed', reason: 'Diagram is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'diagram - accessibility', status: 'failed', reason: 'Diagram is not accessible' } })}`);
//   }
// });

// test('whiteboard - accessibility', async ({ page }, testInfo) => {
//   try {
//     await page.goto(`${url}/whiteboard`);
//     await page.waitForTimeout(10000);
//     let accessibilityScanResultsString;
//     const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
//     if (accessibilityScanResults.violations.length) {
//       accessibilityScanResults.violations.forEach(function(violation, index) {
//         accessibilityScanResultsString = `Whiteboard \n Issue ${index} \n Info: ${violation.description} \n Help: ${violation.help}`
//         console.log(accessibilityScanResultsString)
//       })
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - accessibility', status: 'failed', reason: 'Whiteboard is not accessible' } })}`);
//     } else {
//       await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - accessibility', status: 'passed', reason: 'Whiteboard is accessible' } })}`);
//     }
//   } catch (e) {
//     console.log(e);
//     await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - input text', status: 'failed', reason: 'Whiteboard is not accessible' } })}`);
//   }
// });

test.afterAll(async ({ }) => {
  var resultsString = "| App / page  | Issue     | Info  | Help  | \n|---|----|---|---|" + results
  
  console.log(resultsString)
});

