import { Page , test} from '@playwright/test';
import { BasePage } from '../../src/base/web/BasePage';
import { BaseElement } from '../../src/base/web/element/BaseElement';
import { List } from '../../src/base/web/element/List';
import { RadioGroup } from '../../src/base/web/element/RadioGroup';

export class AutomationExerciseNewUserAccount extends BasePage {
    public title: RadioGroup = new RadioGroup(this.page, 'title', this.page.locator('div[class="clearfix"]'));
    public name: BaseElement = new BaseElement(this.page, 'name', this.page.locator('INPUT[data-qa="name"]'));
    public email: BaseElement = new BaseElement(this.page, 'email', this.page.locator('INPUT[data-qa="email"]'));
    public password: BaseElement = new BaseElement(this.page, 'password', this.page.locator('INPUT[data-qa="password"]'));
    public days: List = new List(this.page, 'days', this.page.locator('SELECT[data-qa="days"]'));
    public months: List = new List(this.page, 'months', this.page.locator('SELECT[data-qa="months"]'));
    public years: List = new List(this.page, 'years', this.page.locator('SELECT[data-qa="years"]'));
    public firstName: BaseElement = new BaseElement(this.page, 'firstName', this.page.locator('INPUT[data-qa="first_name"]'));
    public lastName: BaseElement = new BaseElement(this.page, 'lastName', this.page.locator('INPUT[data-qa="last_name"]'));
    public company: BaseElement = new BaseElement(this.page, 'company', this.page.locator('INPUT[data-qa="company"]'));
    public address: BaseElement = new BaseElement(this.page, 'address', this.page.locator('INPUT[data-qa="address"]'));
    public address2: BaseElement = new BaseElement(this.page, 'address2', this.page.locator('INPUT[data-qa="address2"]'));
    public country: List = new List(this.page, 'country', this.page.locator('SELECT[data-qa="country"]'));
    public state: BaseElement = new BaseElement(this.page, 'state', this.page.locator('INPUT[data-qa="state"]'));
    public city: BaseElement = new BaseElement(this.page, 'city', this.page.locator('INPUT[data-qa="city"]'));
    public zipcode: BaseElement = new BaseElement(this.page, 'zipcode', this.page.locator('INPUT[data-qa="zipcode"]'));
    public mobileNumber: BaseElement = new BaseElement(this.page, 'mobileNumber', this.page.locator('INPUT[data-qa="mobile_number"]'));
    public createAccount: BaseElement = new BaseElement(this.page, 'createAccount', this.page.locator('BUTTON[data-qa="create-account"]'));
    public accountCreatedMessage: BaseElement = new BaseElement(this.page, 'accountCreatedMessage', this.page.getByText('Account Created!'));
    public continueButton: BaseElement = new BaseElement(this.page, 'continueButton', this.page.locator('a[data-qa="continue-button"]'));

    constructor(page: Page) {
        super(page);
        this.addElement(this.title);
        this.addElement(this.name);
        this.addElement(this.email);
        this.addElement(this.password);
        this.addElement(this.days);
        this.addElement(this.months);
        this.addElement(this.years);
        this.addElement(this.firstName);
        this.addElement(this.lastName);
        this.addElement(this.company);
        this.addElement(this.address);
        this.addElement(this.address2);
        this.addElement(this.country);
        this.addElement(this.state);
        this.addElement(this.city);
        this.addElement(this.zipcode);
        this.addElement(this.mobileNumber);
        this.addElement(this.createAccount);
        this.addElement(this.accountCreatedMessage);
        this.addElement(this.continueButton);
    }

    async creerUnCompte(jddFile: string, idTest: string) {
            await test.step(`Créer un compte avec les données de ${jddFile} / ${idTest}`, async () => {
                await this.setValue(jddFile, idTest);
                await this.createAccount.click();
                await this.accountCreatedMessage.assertVisible(true);
                await this.continueButton.click();
            });
    }
}