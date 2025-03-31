import { Page } from '@playwright/test';
import { BasePage } from '../../src/base/web/BasePage';
import { Grid } from '../../src/base/web/element/Grid';

export class AutomationExerciseCart extends BasePage {
    public cartInfoTable: Grid = new Grid(this.page, `cart_info_table`, this.page.locator(`#cart_info_table`)); //table
    
    constructor(page: Page) {
        super(page);
        this.addElement(this.cartInfoTable);
    }
}