import { test } from '@playwright/test';
import { MobBasePage } from '../../src/base/mobile/MobBasePage';
import { MobBaseElement } from '../../src/base/mobile/element/MobBaseElement';

export class MessagesAndroid extends MobBasePage {
    public message: MobBaseElement = new MobBaseElement(this.driver, `message "{0}"`, `//android.widget.TextView[@resource-id='com.example.mymessageapp:id/textViewMessage' and @text="{0}"]`); 
    public newmessage: MobBaseElement = new MobBaseElement(this.driver, `Écris ton message ici`, `id=com.example.mymessageapp:id/editTextMessage`); 
    public send: MobBaseElement = new MobBaseElement(this.driver, `Envoyer`, `id=com.example.mymessageapp:id/buttonSend`); 
    
    constructor(driver: WebdriverIO.Browser) {
        super(driver);
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
        await test.step(`Vérifier la présence du message '${message}' dans l'app android`, async () => {
            await this.message.injectValues({'{0}': message}).assertVisible(true);
        });
    }

}