import { Page, test } from '@playwright/test';
import { BasePage } from '../../src/base/web/BasePage';
import { BaseElement } from '../../src/base/web/element/BaseElement';

export class MessagesWeb extends BasePage {
    public message: BaseElement = new BaseElement(this.page, `message "{0}"`, this.page.locator(`//li[@data-test-id="message" and contains(., "{0}")]`)); 
    public newmessage: BaseElement = new BaseElement(this.page, `Écris ton message ici`, this.page.locator(`//*[@data-test-id='newMessage']`)); 
    public send: BaseElement = new BaseElement(this.page, `Envoyer`, this.page.locator(`//*[@data-test-id='send']`)); 
    
    constructor(page: Page) {
        super(page, "http://localhost:4200/");
        this.addElement(this.message);
        this.addElement(this.newmessage);
        this.addElement(this.send);
    }

    async sendMessage(message: string) {
        await test.step(`Envoyer le message '${message}' depuis le front web`, async () => {
            await this.newmessage.setValue(message);
            await this.send.click();
        });
    }
    

    async assertMessage(message: string) {
        await test.step(`Vérifier la présence du message '${message}' dans le front web`, async () => {
            await this.message.injectValues({'{0}': message}).assertVisible(true);
        });
    }

}