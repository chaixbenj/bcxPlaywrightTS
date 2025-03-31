import { Page, Locator, test } from '@playwright/test';
import { BaseElement } from './BaseElement'; 

export class List extends BaseElement {
    constructor(page: Page, name: string, locator: Locator) {
        super(page, name, locator);
    }

    /**
     * Définit une valeur dans un élément de liste (ex : dropdown ou menu de liste)
     * @param value - La valeur à sélectionner
     */
    async setValue(value: string): Promise<void> {
        await test.step('setValue ' + this.getName() + ' => ' + value, async () => {
            const locator = this.getLocator(); // Assurez-vous que locator renvoie le bon élément
            await this.getLocator().selectOption(value);
        });
     }
}