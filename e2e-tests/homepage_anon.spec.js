const { test, url } = require('../fixture.js');
const { expect } = require('@playwright/test');
require('dotenv').config();
const { FileActions } = require('./fileactions.js');

const local = !!process.env.PW_URL.includes('localhost');
let fileActions

test.beforeEach(async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(`${url}`);
  fileActions = new FileActions(page);
});

test('home page title', async ({ page }) => {
  try {
    if (url === 'https://cryptpad.fr') {
      await expect(page).toHaveTitle('CryptPad: Collaboration suite, encrypted and open-source');
    }
    await fileActions.toSuccess( 'Can navigate to home page');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t navigate to home page');
  }
});

test('homepage - access sign up', async ({ page }) => {
  try {
    await fileActions.registerLink.waitFor();
    await fileActions.registerLink.click();
    await expect(page).toHaveURL(`${url}/register/`);
    await fileActions.toSuccess( 'Can access sign up from homepage');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t access sign up from homepage');
  }
});

test('homepage - access log in', async ({ page }) => {
  try {
    await fileActions.loginLink.click();
    await expect(page).toHaveURL(`${url}/login/`);
    await fileActions.toSuccess('Can acces login from homepage');
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t acces login from homepage');
  }
});

test('home page > features', async ({ page }) => {
  try {
    if (!local) {
      await fileActions.homePageLink('Pricing' ).waitFor();
      await fileActions.homePageLink('Pricing' ).click();
    } else {
      await fileActions.homePageLink('Features' ).waitFor();
      await fileActions.homePageLink('Features' ).click();
    }
    await expect(page).toHaveURL(`${url}/features.html`);
    await fileActions.toSuccess( 'Can navigate from home page to features page');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t navigate from home page to features page');
  }
});

test('home page > documentation', async ({ page }) => {
  try {
    await fileActions.homePageLink('Documentation' ).waitFor();
    await fileActions.homePageLink('Documentation' ).click();
    await expect(page).toHaveURL('https://docs.cryptpad.org/en/');
    await fileActions.toSuccess( 'Can navigate from home page to documentation' );
  } catch (e) {
    await fileActions.toFailure(e,'Can\'t navigate from home page to documentation');
  }
});

test('home page > contact', async ({ page }) => {
  try {
    await fileActions.homePageLink('Contact' ).waitFor();
    await fileActions.homePageLink('Contact' ).click();
    await expect(page).toHaveURL(new RegExp(`^${url}/contact`));
    await fileActions.toSuccess( 'Can navigate from home page to contact page');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t navigate from home page to contact page');
  }
});

test('home page > project website', async ({ page }) => {
  try {
    await fileActions.homePageLink('Project website' ).waitFor();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.homePageLink('Project website' ).click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL('https://cryptpad.org');
    await fileActions.toSuccess( 'Can navigate from home page to project website');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t navigate from home page to project website');
  }
});

test('home page > donate', async ({ page }) => {
  try {
    await fileActions.homePageLink('Donate' ).waitFor();
    const pagePromise = page.waitForEvent('popup');
    await fileActions.homePageLink('Donate' ).click();
    const page1 = await pagePromise;
    await expect(page1).toHaveURL('https://opencollective.com/cryptpad/contribute?hostname=opencollective.com');
    await fileActions.toSuccess( 'Can navigate from home page to donation website');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t navigate from home page to donation website');
  }
});

test('home page - translation - french - (***)', async ({ page }) => {
  try {
    if (url === 'https://cryptpad.fr') {
      await page.getByLabel('Select a language').selectOption('fr');
      await expect(page.getByText('Instance officielle de CryptPad, suite collaborative chiffrée de bout en bout')).toBeVisible();
    }
    await fileActions.toSuccess( 'Can change site language from homepage');
  } catch (e) {
    await fileActions.toFailure(e, 'Can\'t change site language from homepage');
  }
});

if (url.toString() === 'https://cryptpad.fr') {
  test('home page > privacy policy', async ({ page }) => {
    try {
      await fileActions.homePageLink('Privacy Policy' ).waitFor();
      await fileActions.homePageLink('Privacy Policy' ).click();
      await expect(page).toHaveURL('https://cryptpad.fr/pad/#/2/pad/view/GcNjAWmK6YDB3EO2IipRZ0fUe89j43Ryqeb4fjkjehE/');
      await fileActions.toSuccess( 'Can navigate from home page to privacy policy');
    } catch (e) {
      await fileActions.toFailure(e, 'Can\'t navigate from home page to privacy policy');
    }
  });

  test('home page > tos', async ({ page }) => {
    try {
      await fileActions.homePageLink('Terms of Service').waitFor();
      await fileActions.homePageLink('Terms of Service').click();
      await expect(page).toHaveURL('https://cryptpad.fr/code/#/2/code/view/j18D9zbfY98cwWPGHPv91vllEYOy0tCGk1gCD5UOzlk/present/');
      await fileActions.toSuccess( 'Can navigate from home page to TOS');
    } catch (e) {
      await fileActions.toFailure(e,'Can\'t navigate from home page to TOS');
    }
  });
}
