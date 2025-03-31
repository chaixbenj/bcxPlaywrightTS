import { Page, test } from '@playwright/test';
import { BasePage } from '../../src/base/web/BasePage';
import { BaseElement } from '../../src/base/web/element/BaseElement';

export class AutomationExerciseLogin extends BasePage {
    public consent: BaseElement = new BaseElement(this.page, 'Consent', this.page.locator('button[aria-label=\'Consent\']'));
    public loginEmail: BaseElement = new BaseElement(this.page, 'login-email', this.page.locator('input[data-qa=\'login-email\']'));
    public loginPassword: BaseElement = new BaseElement(this.page, 'login-password', this.page.locator('input[data-qa=\'login-password\']'));
    public loginButton: BaseElement = new BaseElement(this.page, 'login-button', this.page.locator('button[data-qa=\'login-button\']'));
    public signupName: BaseElement = new BaseElement(this.page, 'signup-name', this.page.locator('input[data-qa=\'signup-name\']'));
    public signupEmail: BaseElement = new BaseElement(this.page, 'signup-email', this.page.locator('input[data-qa=\'signup-email\']'));
    public signupButton: BaseElement = new BaseElement(this.page, 'signup-button', this.page.locator('button[data-qa=\'signup-button\']'));

    constructor(page: Page) {
        super(page);
        this.addElement(this.consent);
        this.addElement(this.loginEmail);
        this.addElement(this.loginPassword);
        this.addElement(this.loginButton);
        this.addElement(this.signupName);
        this.addElement(this.signupEmail);
        this.addElement(this.signupButton);
    }

    async connexion(email: string, pwd: string) {
        await test.step(`Se connecter avec ${email} / ${pwd}`, async () => {
            await this.loginEmail.setValue(email);
            await this.loginPassword.setValue(pwd);
            await this.loginButton.click();
        });
    }

    async demandeDeCreationDeCompte(name: string, email: string) {
        await test.step(`Demande de création de compte avec ${name} / ${email}`, async () => {
            await this.signupName.setValue(name);
            await this.signupEmail.setValue(email);
            await this.signupButton.click();
        });
    }
}


    