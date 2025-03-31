import { expect, test } from '@playwright/test';
import { ACTION_TIMEOUT, ASSERT_TIMEOUT} from '../../../../config/env'
import { DataUtil } from '../../../utils/DataUtil'
import { Browser } from 'webdriverio';

export class MobBaseElement {
    private name: string; // Nom de l'élément
    private initName: string; // Nom de l'élément initial
    private locator: string; // Locator
    private initLocator: string; // Locator
    private driver: WebdriverIO.Browser; // Référence au driver
 
    constructor(driver: WebdriverIO.Browser, name: string, locator: string) {
        this.driver = driver;
        this.name = name;
        this.initName = name;
        this.locator = locator;
        this.initLocator = locator;
    }

    getDriver(): WebdriverIO.Browser {
        return this.driver;
    }

    getName(): string{
        return this.name;
    }

    getLocator(): string {
        return this.locator;
    }


    injectValues(values: Record<string, string>): this {
        this.locator = DataUtil.replacePlaceholders(this.initLocator, values);
        this.name = DataUtil.replacePlaceholders(this.initName, values);
        return this;
    }

    async findElement(): Promise<ReturnType<Browser['$']> | undefined> {
        try {
            const element = await this.driver.$(this.locator);
            await element.waitForDisplayed({ timeout: ASSERT_TIMEOUT });
            return element;
        } catch (error) {
            return undefined
        }
    }


    async click() {
        await test.step(`click ${this.name}`, async () => {
            try {
                console.log(`click ${this.name}`);
                const element = await this.driver.$(this.locator);
                await element.waitForDisplayed({ timeout: ACTION_TIMEOUT });
                await element.click();
            } catch (error) {
                await this.takeScreenshot(`click_failed_${this.name}`);
                throw error;
            }
        });
    }

    async setValue(value: string) {
        await test.step(`setValue ${this.name} => ${value}`, async () => {
            try {
                console.log(`setValue ${this.name} => ${value}`);
                const element = await this.driver.$(this.locator);
                await element.waitForDisplayed({ timeout: ACTION_TIMEOUT });
                await element.setValue(value);
            } catch (error) {
                await this.takeScreenshot(`setValue_failed_${this.name}`);
                throw error;
            }
        });
    }

    async assertValue(value: string) {
        await test.step(`assertValue ${this.name} => ${value}`, async () => {
            console.log(`assertValue ${this.name} => ${value}`);
            const element = await this.findElement();
            const elementValue = (await element?.getText()) ?? `Element ${this.name} not found`;
            
            expect.soft(elementValue).toBe(value);
            
            if (test.info().errors.length > 0) {
                await this.takeScreenshot(`assertValue_failed_${this.name}`);
            }
        });
    }

    async assertVisible(visible: boolean) {
        await test.step(`assertVisible ${this.name}`, async () => {
            console.log(`assertVisible ${this.name}`);
            const element = await this.findElement();
            
            if (visible) {
                expect.soft(element).toBeDefined();
            } else {
                expect.soft(element).not.toBeDefined();
            }

            if (test.info().errors.length > 0) {
                await this.takeScreenshot(`assertVisible_failed_${this.name}`);
            }
        });
    }


    private async takeScreenshot(fileName: string) {
        try {
            const screenshotBuffer = await this.driver.takeScreenshot();

            test.info().attach(fileName, {
                body: Buffer.from(screenshotBuffer, 'base64'),
                contentType: 'image/png',
            });

            console.log(`Screenshot attached to Allure: ${fileName}`);
        } catch (error) {
            console.error('Failed to take screenshot', error);
        }
    }

}

