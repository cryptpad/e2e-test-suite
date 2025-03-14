const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
require('dotenv').config();

const local = !!process.env.PW_URL.includes('localhost');

test.beforeEach(async ({ page }) => {
  test.setTimeout(210000);

  await page.goto(`${url}`);
  // await page.waitForTimeout(10000);
});

test('home page title', async ({ page }) => {
  try {
    if (url === 'https://cryptpad.fr') {
      await expect(page).toHaveTitle('CryptPad: Collaboration suite, encrypted and open-source');
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage title', status: 'passed', reason: 'Can navigate to home page' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage title', status: 'failed', reason: 'Can\'t navigate to home page' } })}`);
  }
});

test('homepage - access sign up', async ({ page }) => {
  try {
    await page.getByRole('link', { name: 'Sign up' }).click();
    // await page.waitForTimeout(5000);
    await expect(page).toHaveURL(`${url}/register/`);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - access sign up', status: 'passed', reason: 'Can access sign up from homepage' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - access sign up', status: 'failed', reason: 'Can\'t access sign up from homepage' } })}`);
  }
});

test('homepage - access log in', async ({ page }) => {
  try {
    await page.getByRole('link', { name: 'Log in' }).click();

    await expect(page).toHaveURL(`${url}/login/`);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - access log in', status: 'passed', reason: 'Can acces login from homepage' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage - access log in', status: 'failed', reason: 'Can\'t acces login from homepage' } })}`);
  }
});

test('home page > features', async ({ page }) => {
  try {
    if (!local) {
      await page.getByRole('link', { name: 'Pricing' }).waitFor();
      await page.getByRole('link', { name: 'Pricing' }).click();
    } else {
      await page.getByRole('link', { name: 'Features' }).waitFor();
      await page.getByRole('link', { name: 'Features' }).click();
    }
    await expect(page).toHaveURL(`${url}/features.html`);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > features', status: 'passed', reason: 'Can navigate from home page to features page' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > features', status: 'failed', reason: 'Can\'t navigate from home page to features page' } })}`);
  }
});

test('home page > documentation', async ({ page }) => {
  try {
    await page.getByRole('link', { name: 'Documentation' }).waitFor();
    await page.getByRole('link', { name: 'Documentation' }).click();

    await expect(page).toHaveURL('https://docs.cryptpad.org/en/');
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > documentation', status: 'passed', reason: 'Can navigate from home page to documentation' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > documentation', status: 'failed', reason: 'Can\'t navigate from home page to documentation' } })}`);
  }
});

test('home page > contact', async ({ page }) => {
  try {
    await page.getByRole('link', { name: 'Contact' }).waitFor();
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(new RegExp(`^${url}/contact`));
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > contact', status: 'passed', reason: 'Can navigate from home page to contact page' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > contact', status: 'failed', reason: 'Can\'t navigate from home page to contact page' } })}`);
  }
});

test('home page > project website', async ({ page }) => {
  try {
    await page.getByRole('link', { name: 'Project website' }).waitFor();
    const pagePromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Project website' }).click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL('https://cryptpad.org');
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > project website', status: 'passed', reason: 'Can navigate from home page to project website' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > project website', status: 'failed', reason: 'Can\'t navigate from home page to project website' } })}`);
  }
});

test('home page > donate', async ({ page }) => {
  try {
    await page.getByRole('link', { name: 'Donate' }).waitFor();
    const pagePromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Donate' }).click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL('https://opencollective.com/cryptpad/contribute');
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > donate', status: 'passed', reason: 'Can navigate from home page to donation website' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > donate', status: 'failed', reason: 'Can\'t navigate from home page to donation website' } })}`);
  }
});

test('home page - translation - french - (***)', async ({ page }) => {
  try {
    if (url === 'https://cryptpad.fr') {
      await page.getByRole('listbox').selectOption('fr');
      await expect(page.getByText('Instance officielle de CryptPad, suite collaborative chiffrée de bout en bout')).toBeVisible();
    }

    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > translation', status: 'passed', reason: 'Can change site language from homepage' } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > translation', status: 'failed', reason: 'Can\'t change site language from homepage' } })}`);
  }
});

if (url.toString() === 'https://cryptpad.fr') {
  test('home page > privacy policy', async ({ page }) => {
    try {
      await page.getByRole('link', { name: 'Privacy Policy' }).waitFor();
      await page.getByRole('link', { name: 'Privacy Policy' }).click();
      await expect(page).toHaveURL('https://cryptpad.fr/pad/#/2/pad/view/GcNjAWmK6YDB3EO2IipRZ0fUe89j43Ryqeb4fjkjehE/');
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > privacy', status: 'passed', reason: 'Can navigate from home page to privacy policy' } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > privacy', status: 'failed', reason: 'Can\'t navigate from home page to privacy policy' } })}`);
    }
  });

  test('home page > tos', async ({ page }) => {
    try {
      await page.getByRole('link', { name: 'Terms of Service' }).waitFor();
      await page.getByRole('link', { name: 'Terms of Service' }).click();
      await expect(page).toHaveURL('https://cryptpad.fr/code/#/2/code/view/QpPIuoUAHytCF8JjkunAPqnO7yuu1GWd3OUDwYe5ZA8/present/');
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > tos', status: 'passed', reason: 'Can navigate from home page to TOS' } })}`);
    } catch (e) {
      console.log(e);
      await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { name: 'homepage > tos', status: 'failed', reason: 'Can\'t navigate from home page to TOS' } })}`);
    }
  });
}
