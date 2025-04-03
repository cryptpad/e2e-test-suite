const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright');
const fs = require('fs');
require('dotenv').config();
const os = require('os');

let page1;
let mobile;
let browserstackMobile;
let platform;
const local = !!process.env.PW_URL.includes('localhost');

let results = '';

test('settings - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/drive`);
    // await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').locator('.cp-toolbar-user-dropdown.cp-dropdown-container').click();
    await expect(fileActions.settings).toBeVisible();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.settings.click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL(`${url}/settings/#account`, { timeout: 100000 });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    if (accessibilityScanResults.violations.length) {
      results += '\n# CryptPad Accessibility tests\n\n## Settings \n';
      accessibilityScanResults.violations.forEach(function (violation, index) {
        results += `\n### Issue ${index}\n - Description: ${violation.description.replace(/<|>/g, '')} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`;
        violation.nodes.forEach(function (node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, '')}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, '')} \n      - Severity: ${node.impact} \n`;
        });
      });
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'failed', reason: 'Contact page is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'passed', reason: 'Contact page is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - input text', status: 'failed', reason: 'Contact page is not accessible' } })}`);
  }
});

test('calendar - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/calendar`);
    // await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    if (accessibilityScanResults.violations.length) {
      results += '\n ## Calendar \n';
      accessibilityScanResults.violations.forEach(function (violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g, '')} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`;
        violation.nodes.forEach(function (node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, '')}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, '')} \n      - Severity: ${node.impact} \n`;
        });
      });
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'failed', reason: 'Code is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'contact - accessibility', status: 'passed', reason: 'Contact page is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'code - input text', status: 'failed', reason: 'Code is not accessible' } })}`);
  }
});

test('drive (user) - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/drive`);
    // await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Drive (user) \n';
      accessibilityScanResults.violations.forEach(function (violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g, '')} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`;
        violation.nodes.forEach(function (node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, '')}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, '')} \n      - Severity: ${node.impact} \n`;
        });
      });
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (user) - accessibility', status: 'failed', reason: 'Drive (user) is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (user) - accessibility', status: 'passed', reason: 'Drive (user) is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'drive (user) - accessibility', status: 'failed', reason: 'Drive (user) is not accessible' } })}`);
  }
});

test('teams - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/teams`);
    // await page.waitForTimeout(10000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Teams \n';
      accessibilityScanResults.violations.forEach(function (violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g, '')} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`;
        violation.nodes.forEach(function (node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, '')}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, '')} \n      - Severity: ${node.impact} \n`;
        });
      });
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'teams - accessibility', status: 'failed', reason: 'Teams is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'teams - accessibility', status: 'passed', reason: 'Teams is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'teams - accessibility', status: 'failed', reason: 'Teams is not accessible' } })}`);
  }
});

test('teams (admin) - accessibility', async ({ page }, testInfo) => {
  try {
    await page.goto(`${url}/teams`);
    // await page.waitForTimeout(10000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    // await page.waitForTimeout(2000);
    await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click({ timeout: 3000 });

    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().waitFor();
    await page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Administration$/ }).locator('span').first().click();
    // await page.waitForTimeout(2000);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    if (accessibilityScanResults.violations.length) {
      results += '\n ## Teams (admin) \n';
      accessibilityScanResults.violations.forEach(function (violation, index) {
        results += `\n### Issue ${index} \n - Description: ${violation.description.replace(/<|>/g, '')} \n - Help:  ${violation.help} \n - Help URL:  ${violation.helpUrl} \n - Affected nodes: \n`;
        violation.nodes.forEach(function (node, index) {
          results += `   - Node ${index} \n      - HTML: \`\`\` ${node.html.replace(/(\r\n|\n|\r)/gm, '')}\`\`\` \n       - ${node.failureSummary.replace(/(\r\n|\n|\r)/gm, '')} \n      - Severity: ${node.impact} \n`;
        });
      });
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'teams (admin) - accessibility', status: 'failed', reason: 'Teams (admin) is not accessible' } })}`);
    } else {
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'teams (admin) - accessibility', status: 'passed', reason: 'Teams (admin) is accessible' } })}`);
    }
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'teams (admin) - accessibility', status: 'failed', reason: 'Teams (admin) is not accessible' } })}`);
  }
});

test.afterAll(async ({ }) => {
  const resultsString = '' + results;
  fs.writeFile('accessibilityresults_loggedin.md', resultsString, function (err) {
    if (err) {
      return console.log(err);
    }
  });

  console.log(resultsString);
});
