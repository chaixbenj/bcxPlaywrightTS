import { test as baseTest, expect } from '@playwright/test';
import { MYSQL_CONFIG, SQL_PATH } from '../config/env';
import { Headers } from '../src/base/test/Headers';
import { QueryResult } from '../src/utils/QueryResult';
import { AppiumDriver } from '../src/base/mobile/AppiumDriver';
import { MobBaseElement } from '../src/base/mobile/element/MobBaseElement';

baseTest.describe('Tests requete bdd', () => {

    baseTest('Tests requete bdd', async () => {
        Headers.feature('Connexion BDD');
        Headers.story('fiches');
        const mysqlResult = await QueryResult.executeQueryFromFile("mysql", SQL_PATH + "fiche.sql", [3], MYSQL_CONFIG);
        expect(mysqlResult.size()).toBe(5)

        await QueryResult.executeQueryFromFile("mysql", SQL_PATH + "updatefiche.sql", [1], MYSQL_CONFIG);
    });

    baseTest('Test mobile', async () => {
        const driver = await AppiumDriver.getAndroidDriver('simu_nxs', 'C:/temp/apk/app-debug.apk');
        
        try {
            console.log('Émulateur démarré et APK installé.');
            await driver.pause(5000);
            const element = new MobBaseElement(driver, 'send button', 'id=com.example.mymessageapp:id/buttonSend');
            await element.assertValue('bad value')
            await element.click();
        } finally {
            await driver.deleteSession();
        }
    });
});

