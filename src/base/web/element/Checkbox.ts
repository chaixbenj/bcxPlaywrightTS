import { Page, Locator, test } from '@playwright/test';
import { BaseElement } from './BaseElement';

export class Checkbox extends BaseElement {
    constructor(page: Page, name: string, locator: Locator) {
        super(page, name, locator);
    }

    /**
     * Définit une valeur dans un élément de choix type radio
     * @param value - La valeur à sélectionner
     */
    async setValue(value: string): Promise<void> {
        await test.step('setValue ' + this.getName() + ' => ' + value, async () => {
            if (value === 'true') {
                await this.getLocator().check();
            } else {
                await this.getLocator().uncheck();
            }
        });
    }
}