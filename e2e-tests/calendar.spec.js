const { test, expect } = require('@playwright/test');
const { firefox, chromium, webkit } = require('@playwright/test');

const url = 'https://cryptpad.fr'

let browser;
let page;
let pageOne;

test.beforeEach(async ({}, testInfo) => {
  test.setTimeout(2400000);
  const name = testInfo.project.name
  if (name.indexOf('firefox') !== -1 ) {
    browser = await firefox.launch();
  } else if (name.indexOf('webkit') !== -1 ) {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }
  page = await browser.newPage();
  await page.goto(`${url}/login/`);
  await page.getByPlaceholder('Username').fill('test-user');
  await page.waitForTimeout(5000)
  await page.getByPlaceholder('Password', {exact: true}).fill('password');
  // await page.waitForLoadState('networkidle');
  const login = page.locator(".login")
  await login.waitFor({ timeout: 18000 })
  await expect(login).toBeVisible({ timeout: 1800 })
  if (await login.isVisible()) {
    await login.click()
  }
  await expect(page).toHaveURL(`${url}/drive/#`, { timeout: 100000 })
  await page.waitForLoadState('networkidle');
//   await page.waitForTimeout(5000)

});


test('user - create event in calendar', async ({}) => {

    try {
        const date = new Date()
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        const dateString = month + '/' + day + '/' + year;

        await page.goto(`${url}/calendar/`);
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).waitFor();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' New event' }).click();
        await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').click();
        await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').fill('new event');
        await page.frameLocator('#sbox-iframe').getByPlaceholder('Title').press('Tab');
        await page.frameLocator('#sbox-iframe').getByPlaceholder('Location').fill('test location');
        await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();

        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).click();
        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Year' }).fill(`${year}`);

        await page.frameLocator('#sbox-iframe').getByText(`${day}`, { exact: true }).nth(2).click();
        await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
        await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').waitFor()
        await page.frameLocator('#sbox-iframe').getByPlaceholder('Start date').click();

        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('00');
        await page.frameLocator('#sbox-iframe').getByPlaceholder('End date').click();
        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).click();
        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Hour' }).fill('20');
        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).click();
        await page.frameLocator('#sbox-iframe').getByRole('spinbutton', { name: 'Minute' }).fill('30');
        await page.frameLocator('#sbox-iframe').getByText('RepeatOne timeOne timeDaily').click();

        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Save' }).click();

        await page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('new event').click();

        await page.frameLocator('#sbox-iframe').getByText( `${dateString} 08:00 PM - 08:30 PM`).click();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: ' Delete' }).click();
        await page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();

        await expect(page.frameLocator('#sbox-iframe').getByText( `${dateString} 08:00 PM - 08:30 PM`)).toBeHidden();
    
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad', status: 'passed',reason: 'Can anonymously create Rich Text document'}})}`);
        } catch (e) {
        console.log(e);
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {name: 'anon - pad', status: 'failed',reason: 'Can\'t anonymously create Rich Text document'}})}`);
    
        }  
  });



test.afterEach(async () => {
  await browser.close()
});

