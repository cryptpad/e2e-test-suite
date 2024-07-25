const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright')
const fs = require('fs');
require('dotenv').config();
const os = require('os');
const { FileActions } = require('./fileactions.js');

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

test('404 page - accessibility', async ({ page }) => {
  try {
    await page.goto(`${url}/randommadeuppage`);
    await page.waitForTimeout(10000)
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n# CryptPad Accessibility tests\n\n## Error page 404 \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index}\n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'failed', reason: 'Contact page is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'passed', reason: 'Contact page is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'failed', reason: 'Contact page is not accessible' } })}`);
  }
});

test('contact - accessibility', async ({ page }) => {
  try {
    await page.goto(`${url}/contact.html`);
    await page.waitForTimeout(10000)
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Contact \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'failed', reason: 'Contact page is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'passed', reason: 'Contact page is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'failed', reason: 'Contact page is not accessible' } })}`);
  }
});

test('homepage - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}`);
    await page.waitForTimeout(10000)
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Homepage \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - accessibility', status: 'failed', reason: 'Homepage is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - accessibility', status: 'passed', reason: 'Homepage is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - accessibility', status: 'failed', reason: 'Homepage is not accessible' } })}`);
  }
});

test('sign up - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/register`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Sign up \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sign up - accessibility', status: 'failed', reason: 'Sign up is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sign up - accessibility', status: 'passed', reason: 'Sign up is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sign up - accessibility', status: 'failed', reason: 'Sign up is not accessible' } })}`);
  }
});

test('login - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/login`);
    await page.waitForTimeout(10000)
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Log in \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'login - accessibility', status: 'failed', reason: 'Log in is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'login - accessibility', status: 'passed', reason: 'Log in is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'login - accessibility', status: 'failed', reason: 'Log in is not accessible' } })}`);
  }
});

test('code - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/code`);
    await page.waitForTimeout(30000)
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    if (accessibilityScanResults.violations.length) {
      results += '\n ## Code \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - accessibility', status: 'failed', reason: 'Code is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - accessibility', status: 'passed', reason: 'Code is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - accessibility', status: 'failed', reason: 'Code is not accessible' } })}`);
  }
});

test('file menu - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/code`);
    await page.waitForTimeout(30000)
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-file').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' File' }).click();
    }
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    if (accessibilityScanResults.violations.length) {
      results += '\n ## File menu \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'file menu - accessibility', status: 'failed', reason: 'Document file menu is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'file menu - accessibility', status: 'passed', reason: 'Document file menu  is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'file menu - accessibility', status: 'failed', reason: 'Document file menu  is not accessible' } })}`);
  }
});

test('share modal - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/code`);
    await page.waitForTimeout(30000)
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
    let fileActions = new FileActions(page);
    await fileActions.share(isMobile);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    if (accessibilityScanResults.violations.length) {
      results += '\n ## Share modal \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'share modal - accessibility', status: 'failed', reason: 'Share modal is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'share modal - accessibility', status: 'passed', reason: 'Share modal is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'share modal - accessibility', status: 'failed', reason: 'Share modal is not accessible' } })}`);
  }
});

test('access modal - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/code`);
    await page.waitForTimeout(30000)
    await page.frameLocator('#sbox-iframe').locator('.CodeMirror-scroll').waitFor();
    if (isMobile) {
      await page.frameLocator('#sbox-iframe').locator('.cp-toolar-access-button').click();
    } else {
      await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Access' }).click();
    }
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    if (accessibilityScanResults.violations.length) {
      results += '\n ## Access modal \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access modal - accessibility', status: 'failed', reason: 'Access modal is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access modal - accessibility', status: 'passed', reason: 'Access modal is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'access modal - accessibility', status: 'failed', reason: 'Access modal is not accessible' } })}`);
  }
});

test('drive (anon) - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/drive`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Drive anon \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (anon) - accessibility', status: 'failed', reason: 'Drive is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (anon) - accessibility', status: 'passed', reason: 'Drive is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (anon) - accessibility', status: 'failed', reason: 'Drive is not accessible' } })}`);
  }
});

test('form - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/form`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n # CryptPad \n ## Contact \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - accessibility', status: 'failed', reason: 'Form is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - accessibility', status: 'passed', reason: 'Form is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'form - input text', status: 'failed', reason: 'Form is not accessible' } })}`);
  }
});

test('kanban - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/kanban`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Kanban \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - accessibility', status: 'failed', reason: 'Kanban is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - accessibility', status: 'passed', reason: 'Kanban is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'kanban - accessibility', status: 'failed', reason: 'Kanban is not accessible' } })}`);
  }
});

test('markdown - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/slide`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Markdown \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - accessibility', status: 'failed', reason: 'Markdown is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - accessibility', status: 'passed', reason: 'Markdown is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'markdown - accessibility', status: 'failed', reason: 'Markdown is not accessible' } })}`);
  }
});

test('pad - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/pad`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Pad \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad - accessibility', status: 'failed', reason: 'Pad is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad - accessibility', status: 'passed', reason: 'Pad is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'pad - accessibility', status: 'failed', reason: 'Pad is not accessible' } })}`);
  }
});

test('sheet - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/sheet`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Sheet \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sheet - accessibility', status: 'failed', reason: 'Sheet is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sheet - accessibility', status: 'passed', reason: 'Sheet is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'sheet - accessibility', status: 'failed', reason: 'Sheet is not accessible' } })}`);
  }
});

test('diagram - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/diagram`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Diagram \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'diagram - accessibility', status: 'failed', reason: 'Diagram is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'diagram - accessibility', status: 'passed', reason: 'Diagram is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'diagram - accessibility', status: 'failed', reason: 'Diagram is not accessible' } })}`);
  }
});

test('whiteboard - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/whiteboard`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Whiteboard \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
      })
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - accessibility', status: 'failed', reason: 'Whiteboard is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - accessibility', status: 'passed', reason: 'Whiteboard is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'whiteboard - input text', status: 'failed', reason: 'Whiteboard is not accessible' } })}`);
  }
});


test('documentation - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`https://docs.cryptpad.org/en/`);
    await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n # Documentation \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
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
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    if (accessibilityScanResults.violations.length) {
      results += '\n # Project Website \n'
      accessibilityScanResults.violations.forEach(function(violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g,"")} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`
        violation.nodes.forEach(function(node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, "")}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, "")} \n      - Severity: ${node.impact} \n`
        })
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

test.afterAll(async ({ }) => {
  var resultsString = "" + results
  fs.writeFile("accessibilityresults_anon.md", resultsString, function(err) {
    if(err) {
        return console.log(err);
    }

});

  console.log(resultsString)
});

