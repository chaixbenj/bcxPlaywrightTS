import { remote } from 'webdriverio';
import { APPIUM_HOST, APPIUM_PORT } from '../../../config/env';
import { test } from '@playwright/test';

export class AppiumDriver {
    public static async getAndroidDriver(deviceName: string, appPath: string): Promise<WebdriverIO.Browser> {
        return await test.step(`Start Android device ${deviceName}, APK: ${appPath}`, async () => {
            const driver = await remote({
                hostname: APPIUM_HOST,
                port: APPIUM_PORT,
                path: '/',
                capabilities: {
                    platformName: 'Android',
                    'appium:deviceName': deviceName,
                    'appium:automationName': 'UiAutomator2',
                    'appium:app': appPath,
                    'appium:avd': deviceName,
                    'appium:avdReadyTimeout': 120000,
                    'appium:appWaitActivity': '*',
                },
                waitforTimeout: 10000, // Timeout global pour les attentes
            });
            return driver;
        });
    }

    // Méthode pour quitter proprement (optionnel)
    public static async quitDriver(driver: WebdriverIO.Browser): Promise<void> {
        if (driver) {
            await driver.deleteSession();
        }
    }
}