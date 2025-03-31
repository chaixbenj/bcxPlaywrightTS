import { Page, test } from '@playwright/test';
import { BasePage } from '../../src/base/web/BasePage';
import { BaseElement } from '../../src/base/web/element/BaseElement';

export class AutomationExerciseProducts extends BasePage {
    public searchProduct: BaseElement = new BaseElement(this.page, 'search_product', this.page.locator('#search_product')); 
    public submitSearch: BaseElement = new BaseElement(this.page, 'submit_search', this.page.locator('#submit_search'));
    public productCard: BaseElement = new BaseElement(this.page, 'product card', this.page.locator(`div[class*='productinfo'] a[class='btn btn-default add-to-cart']`));
    public addToCart: BaseElement = new BaseElement(this.page, 'add_to_cart', this.page.locator(`div[class*='product-overlay'] a[class='btn btn-default add-to-cart']`));
    public continueShopping: BaseElement = new BaseElement(this.page, 'continue shopping', this.page.locator(`button[data-dismiss='modal']`));

    constructor(page: Page) {
        super(page);
    }

    async addProductToCart(product: string) {
        await test.step('rechercher et ajouter le produit ' + product, async () => {
            await this.searchProduct.setValue(product);
            await this.submitSearch.click();
            await this.productCard.moveOver();
            await this.addToCart.click();
            await this.continueShopping.click();
        });
    }
    
}