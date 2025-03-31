import { Page } from '@playwright/test';
import { BasePage } from '../../src/base/web/BasePage';
import { BaseElement } from '../../src/base/web/element/BaseElement';

export class AutomationExerciseDeleteAccount extends BasePage {
    public accountDeletedMessage: BaseElement = new BaseElement(this.page, 'account deleted message', this.page.getByText('Account Deleted!'));
    public continueButton: BaseElement = new BaseElement(this.page, 'continue-button', this.page.locator('a[data-qa="continue-button"]'));

    constructor(page: Page) {
        super(page);
        this.addElement(this.accountDeletedMessage);
        this.addElement(this.continueButton);
    }
}