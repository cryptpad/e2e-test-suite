const { url } = require('../fixture.js');
const { FileActions } = require('./fileactions.js');
const os = require('os');


export class Cleanup {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor (page) {
    this.page = page;
    this.driveContentFolder = page.frameLocator('#sbox-iframe').locator('#cp-app-drive-content-folder');
    this.fileActions = new FileActions(this.page)
    this.platform = os.platform();

  }

  async cleanFiles (titles) {
    await this.page.goto(`${url}/drive`);
    await this.fileActions.drivemenu.waitFor();
    let fileCount = await this.fileActions.driveElementText.getByText(titles[0]).count();
    if (fileCount > 0) {
      while (fileCount > 0) {
        if (fileCount > 1) {
          await this.fileActions.driveElementText.getByText(titles[0]).nth(fileCount - 1).click({ button: 'right' });
        } else {
          await this.fileActions.driveElementText.getByText(titles[0]).click({ button: 'right' });
        }
        if (await this.fileActions.destroyItem.isVisible()) {
          await this.fileActions.destroyItem.click();
          await this.fileActions.okButton.click();
        } else {
          await this.fileActions.moveToTrash.click();
        }

        await this.page.waitForTimeout(1000);
        fileCount = fileCount - 1;
      }
    }
    let fileCount1 = await this.fileActions.driveElementText.getByText(titles[1]).count();
    if (fileCount1 > 0) {
      while (fileCount1 > 0) {
        if (fileCount1 > 1) {
          await this.fileActions.driveElementText.getByText(titles[1]).nth(fileCount1 - 1).click({ button: 'right' });
        } else {
          await this.fileActions.driveElementText.getByText(titles[2]).click({ button: 'right' });
        }
        if (await this.fileActions.destroyItem.isVisible()) {
          await this.fileActions.destroyItem.click();
          await this.fileActions.okButton.click();
        } else {
          await this.fileActions.moveToTrash.click();
        }

        await this.page.waitForTimeout(1000);
        fileCount1 = fileCount1 - 1;
      }
    }
    let fileCount2 = await this.fileActions.driveElementText.getByText(titles[2]).count();
    if (fileCount2 > 0) {
      while (fileCount2 > 0) {
        if (fileCount2 > 1) {
          await this.fileActions.driveElementText.getByText(titles[2]).nth(fileCount2 - 1).click({ button: 'right' });
        } else {
          await this.fileActions.driveElementText.getByText(titles[2]).click({ button: 'right' });
        }
        if (await this.fileActions.destroyItem.isVisible()) {
          await this.fileActions.destroyItem.click();
          await this.fileActions.okButton.click();
        } else {
          await this.fileActions.moveToTrash.click();
        }

        await this.page.waitForTimeout(1000);
        fileCount2 = fileCount2 - 1;
      }
    }
    let fileCount3 = await this.fileActions.driveElementText.getByText(titles[3]).count();
    if (fileCount3 > 0) {
      while (fileCount3 > 0) {
        if (fileCount3 > 1) {
          await this.fileActions.driveElementText.getByText(titles[0]).nth(fileCount - 1).click({ button: 'right' });
        } else {
          await this.fileActions.driveElementText.getByText(titles[0]).click({ button: 'right' });
        }
        if (await this.fileActions.destroyItem.isVisible()) {
          await this.fileActions.destroyItem.click();
          await this.fileActions.okButton.click();
        } else {
          await this.fileActions.moveToTrash.click();
        }

        await this.page.waitForTimeout(1000);
        fileCount3 = fileCount3 - 1;
      }
    }
  }

  async cleanCalendar () {
    await this.page.goto(`${url}/calendar`);
    await this.fileActions.newEventMobile.waitFor();
    let eventCount = await this.fileActions.calendarTestEvent.count();
    if (eventCount > 0) {
      while (eventCount > 0) {
        if (eventCount > 1) {
          await this.fileActions.calendarTestEvent.nth(eventCount - 1).click();
        } else {
          await this.fileActions.calendarTestEvent.click();
        }
        await this.fileActions.deleteButton.click();
        await this.fileActions.areYouSureButton.click();
        await this.page.waitForTimeout(3000);
        eventCount = eventCount - 1;
      }
    }
    await this.fileActions.nextWeek.click();
    let nextWeekEventCount = await this.fileActions.calendarTestEvent.count();
    if (nextWeekEventCount > 0) {
      while (nextWeekEventCount > 0) {
        if (nextWeekEventCount > 1) {
          await this.fileActions.calendarTestEvent.nth(nextWeekEventCount - 1).click();
        } else {
          await this.fileActions.calendarTestEvent.click();
        }
        await this.fileActions.deleteButton.click();
        await this.fileActions.areYouSureButton.click();
        await this.page.waitForTimeout(3000);
        nextWeekEventCount = nextWeekEventCount - 1;
      }
    }
    await this.fileActions.prevWeek.click();
  }

  async cleanTemplates () {
    await this.page.goto(`${url}/drive`);
    await this.fileActions.drivemenu.waitFor();
    if (await this.fileActions.driveSideBarItem('Templates').first().isVisible()) {
      await this.fileActions.driveSideBarItem('Templates').first().click();

      let elementCount = await this.fileActions.template.count();
      if (elementCount > 0) {
        let key;
        if (this.platform === 'darwin') {
          key = 'Meta';
        } else {
          key = 'Control';
        }
        await this.page.keyboard.press(`${key}+a`);
        await this.fileActions.template.first().click({ button: 'right' });
        // while (elementCount > 0) {
        //   if (elementCount > 1) {
        //     await this.fileActions.template.nth(elementCount - 1).click({ button: 'right' });
        //   } else {
        //     await
        //      this.fileActions.template.click({ button: 'right' });
        //   }
          await this.fileActions.destroyItem.click();
          await this.fileActions.okButton.click();
          await this.page.waitForTimeout(5000);
        //   elementCount = elementCount - 1;
        // }
      }
    }

  }

  /**
   * @param {string} file
   */
  async cleanUserDrive (file) {
    await this.page.goto(`${url}/drive`);
    await this.fileActions.drivemenu.waitFor();
    let elementCount = await this.fileActions.driveElement(file).count();
    if (elementCount > 0) {
      while (elementCount > 0) {
        if (elementCount > 1) {
          await this.driveContentFolder.getByText(`${file}`).nth(elementCount - 1).click({ button: 'right' });
        } else {
          await this.driveContentFolder.getByText(`${file}`).click({ button: 'right' });
        }
        await this.page.waitForTimeout(1000);
        if (await this.fileActions.destroyItem.isVisible()) {
          await this.fileActions.destroyItem.click();
          await this.fileActions.okButton.click();
        } else {
          await this.fileActions.moveToTrash.click();
        }
        await this.page.waitForTimeout(3000);
        elementCount = elementCount - 1;
      }
    }
  }

  /**
   * @param {string} file
   */
  async cleanTeamDrive (file) {
    let elementCount = await this.fileActions.driveElement(file).count();
    if (elementCount > 0) {
      while (elementCount > 0) {
        if (elementCount > 0) {
          await this.driveContentFolder.getByText(`${file}`).nth(elementCount - 1).click({ button: 'right' });
        } else {
          await this.driveContentFolder.getByText(`${file}`).click({ button: 'right' });
        }
        await this.page.waitForTimeout(1000);
        if (await this.fileActions.destroyItem.isVisible()) {
          await this.fileActions.destroyItem.click();
          await this.fileActions.okButton.click();
        } else {
          await this.fileActions.moveToTrash.click();
        }
        await this.page.waitForTimeout(1000);
        elementCount = elementCount - 1;
      }
    }
  }

  async cleanTeamMembership () {
    await this.page.goto(`${url}/teams`);
    await this.fileActions.accessTeam()
    await this.fileActions.teamTab(/^Members$/).waitFor();
    await this.fileActions.teamTab(/^Members$/).click();

    if (await this.fileActions.teamMemberFilter('testuser').isVisible()) {
      await this.fileActions.removeMember('testuser')
      await this.fileActions.okButton.click();
    }

    if (await this.fileActions.demoteTestUser3Arrow.isVisible()) {
      await this.fileActions.demoteTestUser3()
      await this.page.waitForTimeout(1000);
      if (await this.fileActions.demoteTestUser3Arrow.isVisible()) {
        await this.fileActions.demoteTestUser3();
        await this.page.waitForTimeout(1000);
        if (await this.fileActions.demoteTestUser3Arrow.isVisible()) {
          await this.fileActions.demoteTestUser3();
          await this.page.waitForTimeout(1000);
        }
        
      }
    }
  }

  async cleanNotifs () {
    await this.page.goto(`${url}/drive`);
    await this.fileActions.notifications.waitFor();
    await this.fileActions.notifications.click();
    const page1Promise = this.page.waitForEvent('popup');
    await this.fileActions.notifPanel.click();
    const page1 = await page1Promise;
    const fileActions1 = new FileActions(page1);
    await fileActions1.cleanNotifs.click();
  }
}
