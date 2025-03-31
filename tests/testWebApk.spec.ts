import { test as baseTest, expect } from '@playwright/test';
import { Headers } from '../src/base/test/Headers';
import { AppiumDriver } from '../src/base/mobile/AppiumDriver';
import { MessagesWeb } from './pages/MessagesWeb';
import { MessagesAndroid } from './pages/MessagesAndroid';

baseTest.describe('Test web front et mobile apk', () => {

    baseTest('Echange messages web / apk', async ({ page }) => {
        Headers.feature('Messagerie');
        Headers.story('US-01');

        const webFront = new MessagesWeb(page);
        await webFront.navigateTo();
        
        const driver = await AppiumDriver.getAndroidDriver('simu_nxs', 'C:/temp/apk/app-debug.apk');
        const androidFront = new MessagesAndroid(driver);

        await webFront.sendMessage('Hello from Web !');
        await androidFront.assertMessage('Hello from Web ?');

        await androidFront.sendMessage('Hello from Android !');
        await webFront.assertMessage('Hello from Android !');

        AppiumDriver.quitDriver(driver);
    });


});

