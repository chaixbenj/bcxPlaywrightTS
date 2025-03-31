import { Page } from '@playwright/test';
import { BasePage } from '../../src/base/web/BasePage';
import { BaseElement } from '../../src/base/web/element/BaseElement';
import { BASE_URL } from '../../config/env';

export class AutomationExerciseHome extends BasePage {
    override url = BASE_URL;
    public consent: BaseElement = new BaseElement(this.page, 'Consent', this.page.locator('button[aria-label=\'Consent\']')); 
    public products: BaseElement = new BaseElement(this.page, 'products', this.page.locator('a[href=\'/products\']')); //products
    public viewCart: BaseElement = new BaseElement(this.page, `/view_cart`, this.page.locator(`ul A[href="/view_cart"]`)); //a
    public signupLogin: BaseElement = new BaseElement(this.page, 'signup / login', this.page.locator('a[href=\'/login\']'));
    public deleteAccount: BaseElement = new BaseElement(this.page, 'delete account', this.page.locator('a[href=\'/delete_account\']'));
    public testCases: BaseElement = new BaseElement(this.page, `/test_cases`, this.page.locator(`A[href="/test_cases"]`)); //a
    public apiList: BaseElement = new BaseElement(this.page, `/api_list`, this.page.locator(`A[href="/api_list"]`)); //a
    public httpsWwwYoutubeComCAutomationexercise: BaseElement = new BaseElement(this.page, `https://www.youtube.com/c/AutomationExercise`, this.page.locator(`A[href="https://www.youtube.com/c/AutomationExercise"]`)); //a
    public contactUs: BaseElement = new BaseElement(this.page, `/contact_us`, this.page.locator(`A[href="/contact_us"]`)); //a
    public loggedInAs0: BaseElement = new BaseElement(this.page, 'logged In As {0}', this.page.getByText('Logged in as {0}'));
    
    constructor(page: Page) {
        super(page);
        this.addElement(this.consent);
        this.addElement(this.products);
        this.addElement(this.viewCart);
        this.addElement(this.signupLogin);
        this.addElement(this.deleteAccount);
        this.addElement(this.testCases);
        this.addElement(this.apiList);
        this.addElement(this.httpsWwwYoutubeComCAutomationexercise);
        this.addElement(this.contactUs);
        this.addElement(this.loggedInAs0);
    }
}