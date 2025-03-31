import { test as baseTest } from '@playwright/test';
import { WSUtil } from '../src/utils/WSUtil'
import { BASE_URL } from '../config/env';
import { AutomationExerciseProducts } from './pages/AutomationExerciseProducts';
import { AutomationExerciseHome } from './pages/AutomationExerciseHome';
import { AutomationExerciseCart } from './pages/AutomationExerciseCart';

baseTest.describe('Tests produit', () => {

    baseTest('Ajout produit', { tag: '@api' }, async ({ page }) => {
        await WSUtil.init();
        const response = await WSUtil.callWS(
            BASE_URL +  "/api/productsList",
            "GET",
            null,
            "Accept=application/json",
            null,
            null,
            200,
            true
        );
        const json = JSON.parse(response);
        const firstProductName = json.products?.[0]?.name;
        const secondProductName = json.products?.[1]?.name;
        
        const homePage = new AutomationExerciseHome(page);
        await homePage.navigateTo();
        await homePage.consent.click();
        await homePage.products.click();
            
        const productsPage = new AutomationExerciseProducts(page);
        await productsPage.addProductToCart(firstProductName);
        await productsPage.addProductToCart(secondProductName);

        await homePage.viewCart.click();
        const cartPage = new AutomationExerciseCart(page);
        await cartPage.cartInfoTable.assertOneRowContains(firstProductName);
        await cartPage.cartInfoTable.assertOneRowContains(secondProductName);
        //await cartPage.cartInfoTable.assertOneRowContains("ben non t'es pas là");


    });


});