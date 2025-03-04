const { url } = require('../fixture.js');

export class Cleanup {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor (page) {
    this.page = page;
    this.driveContentFolder = page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder');
  }

  async cleanFiles (title) {
    await this.page.goto(`${url}/drive`);
    await this.page.waitForTimeout(10000);
    await this.page.frameLocator('#sbox-iframe').locator('.cp-toolbar-user-dropdown.cp-dropdown-container').waitFor();
    let fileCount = await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(title).count();
    console.log(fileCount);
    if (fileCount > 0) {
      console.log('fileCount');

      while (fileCount > 0) {
        if (fileCount > 1) {
          await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(title).nth(fileCount - 1).click({ button: 'right' });
        } else {
          await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name-text').getByText(title).click({ button: 'right' });
        }
        await this.page.frameLocator('#sbox-iframe').getByText('Destroy').click();
        await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();

        await this.page.waitForTimeout(3000);
        fileCount = fileCount - 1;
      }
    }
  }

  async cleanCalendar () {
    await this.page.goto(`${url}/calendar`);
    await this.page.waitForTimeout(5000);
    await this.page.frameLocator('#sbox-iframe').locator('.cp-calendar-newevent').waitFor();
    let eventCount = await this.page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').count();
    console.log(eventCount);
    if (eventCount > 0) {
      while (eventCount > 0) {
        if (eventCount > 1) {
          await this.page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(eventCount - 1).click();
        } else {
          await this.page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').click();
        }
        await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
        await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
        await this.page.waitForTimeout(3000);
        eventCount = eventCount - 1;
      }
    }
    await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Right' }).click();
    let nextWeekEventCount = await this.page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').count();
    console.log(nextWeekEventCount);
    if (nextWeekEventCount > 0) {
      while (nextWeekEventCount > 0) {
        if (nextWeekEventCount > 1) {
          await this.page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').nth(nextWeekEventCount - 1).click();
        } else {
          await this.page.frameLocator('#sbox-iframe').locator('.tui-full-calendar-time-schedule-content').getByText('test event').click();
        }
        await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Delete' }).click();
        await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Are you sure?' }).click();
        await this.page.waitForTimeout(3000);
        nextWeekEventCount = nextWeekEventCount - 1;
      }
    }
    await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'Left' }).click();
  }

  async cleanTemplates () {
    await this.page.goto(`${url}/drive`);
    await this.page.waitForTimeout(5000);
    await this.page.frameLocator('#sbox-iframe').locator('span').filter({ hasText: 'Templates' }).first().click();

    await this.page.waitForTimeout(5000);
    let elementCount = await this.driveContentFolder.filter({ hasText: 'template' }).count();
    console.log(elementCount);
    if (elementCount > 0) {
      while (elementCount > 0) {
        if (elementCount > 1) {
          await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({ hasText: 'template' }).nth(elementCount - 1).click({ button: 'right' });
        } else {
          await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({ hasText: 'template' }).click({ button: 'right' });
        }
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator('#sbox-iframe').getByText('Destroy').click();
        await this.page.waitForTimeout(3000);
        await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
        await this.page.waitForTimeout(10000);
        elementCount = elementCount - 1;
      }
    }
  }

  /**
   * @param {string} file
   */
  async cleanUserDrive (file) {
    await this.page.goto(`${url}/drive`);
    await this.page.waitForTimeout(10000);
    let elementCount = await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({ hasText: file }).count();
    if (elementCount > 0) {
      while (elementCount > 0) {
        if (elementCount > 1) {
          await this.driveContentFolder.getByText(`${file}`).nth(elementCount - 1).click({ button: 'right' });
        } else {
          await this.driveContentFolder.getByText(`${file}`).click({ button: 'right' });
        }
        await this.page.waitForTimeout(3000);
        if (await this.page.frameLocator('#sbox-iframe').getByText('Destroy').isVisible()) {
          await this.page.frameLocator('#sbox-iframe').getByText('Destroy').click();
          await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
        } else {
          await this.page.frameLocator('#sbox-iframe').getByText('Move to trash').click();
        }
        await this.page.waitForTimeout(3000);
        await this.page.waitForTimeout(10000);
        elementCount = elementCount - 1;
      }
    }
  }

  /**
   * @param {string} file
   */
  async cleanTeamDrive (file) {
    let elementCount = await this.page.frameLocator('#sbox-iframe').locator('.cp-app-drive-element-name').filter({ hasText: file }).count();
    if (elementCount > 0) {
      while (elementCount > 0) {
        if (elementCount > 0) {
          await this.driveContentFolder.getByText(`${file}`).nth(elementCount - 1).click({ button: 'right' });
        } else {
          await this.driveContentFolder.getByText(`${file}`).click({ button: 'right' });
        }
        await this.page.waitForTimeout(3000);
        if (await this.page.frameLocator('#sbox-iframe').getByText('Destroy').isVisible()) {
          await this.page.frameLocator('#sbox-iframe').getByText('Destroy').click();
          await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
        } else {
          await this.page.frameLocator('#sbox-iframe').getByText('Move to trash').click();
        }
        await this.page.waitForTimeout(10000);
        elementCount = elementCount - 1;
      }
    }
  }

  async cleanTeamMembership () {
    await this.page.goto(`${url}/teams`);
    // await this.page.waitForTimeout(5000);
    await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').waitFor();
    await this.page.waitForTimeout(2000);
    await this.page.frameLocator('#sbox-iframe').locator('#cp-sidebarlayout-rightside').getByText('test team').click();
    await this.page.waitForTimeout(5000);
    await this.page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().waitFor();
    await this.page.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Members$/ }).locator('span').first().click();

    if (await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'testuser' }).isVisible()) {
      await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'testuser' }).locator('.fa.fa-times').click();
      await this.page.frameLocator('#sbox-iframe').getByRole('button', { name: 'OK (enter)' }).click();
    }

    if (await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').isVisible()) {
      await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').click();
      await this.page.waitForTimeout(2000);
      if (await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').isVisible()) {
        await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').click();
        await this.page.waitForTimeout(2000);
        if (await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').isVisible()) {
          await this.page.frameLocator('#sbox-iframe').locator('.cp-team-roster-member').filter({ hasText: 'test-user3' }).locator('.fa.fa-angle-double-down').click();
        }
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async cleanNotifs () {
    await this.page.goto(`${url}/drive`);
    await this.page.waitForTimeout(10000);
    await this.page.frameLocator('#sbox-iframe').getByLabel('Notifications').click();
    const page1Promise = this.page.waitForEvent('popup');
    await this.page.frameLocator('#sbox-iframe').getByRole('menuitem', { name: 'Open notifications panel' }).locator('a').click();
    const page1 = await page1Promise;
    await page1.frameLocator('#sbox-iframe').locator('div').filter({ hasText: /^Notifications - All$/ }).locator('span').click();
  }
}
