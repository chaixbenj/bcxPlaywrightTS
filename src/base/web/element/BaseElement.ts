import { Page, Locator, ElementHandle, expect, test } from '@playwright/test';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { ACTION_TIMEOUT, ASSERT_TIMEOUT, ATTRIBUTE_POTENTIAL_ELEMENT, CLICKABLE_ELEMENT, ENTRY_ELEMENT, USE_AI } from '../../../../config/env'
import { DataUtil } from '../../../utils/DataUtil'

export class BaseElement {
    private name: string; // Nom de l'élément
    private initName: string; // Nom de l'élément initial
    private locator: Locator; // Locator
    private page: Page; // Référence à la page
    readonly locatorType: string; // Type du locator
    readonly selector: string; // Selecteur
    private container: Page | Locator; // Conteneur de l'élément

    constructor(page: Page, name: string, locator: Locator) {
        this.page = page;
        this.name = name;
        this.initName = name;
        this.locator = locator;
        this.locatorType = this.extractLocatorType();
        this.selector = this.extractSelector();
        this.container = page;
    }

    getPage(): Page {
        return this.page;
    }

    getName(): string{
        return this.name;
    }

    getLocator(): Locator {
        return this.locator;
    }

    setContainer(element: BaseElement): this {
        this.container = element.getLocator();
        this.locator = this.getLocatorFromSelector(this.selector);
        return this;
    }

    resetContainer(): this {
        this.container = this.page;
        this.locator = this.getLocatorFromSelector(this.selector);
        return this;
    }

    injectValues(values: Record<string, string>): this {
        const selector = DataUtil.replacePlaceholders(this.selector, values);
        this.locator = this.getLocatorFromSelector(selector);
        this.name = DataUtil.replacePlaceholders(this.initName, values);
        return this;
    }

    async findElement(typeElement?: string): Promise<Locator | ElementHandle<Node>> {
        try {
            await this.getLocator().first().waitFor({ timeout: ACTION_TIMEOUT });
            return this.getLocator();
        } catch (error) {
                console.log(error);
                const elementProbable = await this.getPotentialElementByName(typeElement || (CLICKABLE_ELEMENT + ',' + ENTRY_ELEMENT));
                if (elementProbable) {
                    return elementProbable;
                } else {
                    if (USE_AI) {
                        const suggestion = await this.findElementWithAI();
                        if (suggestion !== null) {
                            return this.page.locator('xpath=' + suggestion);
                        }   
                    }      
                }
        }
        return this.getLocator();
    }

    async findFirstElement(typeElement?: string): Promise<Locator | ElementHandle<Node>> {
        await this.page.waitForLoadState('domcontentloaded');
        const firstElement = await this.findElement(typeElement);
        if ("first" in firstElement) { 
            return firstElement.first();
        } else {
            return firstElement;
        }
    }


    async click() {
        await test.step('click ' + this.name, async () => {
            console.log('click ' + this.name);
            const element = await this.findFirstElement(CLICKABLE_ELEMENT);
            await element.click();
        });
    }

    async clickAndSwitchOnNewPage(): Promise<Page> {
        return await test.step('clickAndSwitchOnNewPage ' + this.name, async () => {
            const [newPage] = await Promise.all([
                this.page.context().waitForEvent('page'), 
                await this.click() 
            ]);
            return newPage;
        });
    }

    async moveOver() {
        await test.step('moveOver ' + this.name, async () => {
            console.log('moveOver ' + this.name);
            const element = await this.findFirstElement();
            await element.hover();
        });
    }

    async setValue(value: string) {
        await test.step('setValue ' + this.name + ' => ' + value, async () => {
            console.log('setValue ' + this.name + ' => ' + value);
            const element = await this.findFirstElement(ENTRY_ELEMENT);
            await element.click({ timeout: ACTION_TIMEOUT });
            await element.fill('');
            await element.fill(value);
        });
    }

    async assertValue(value: string) {
        await test.step('assertValue ' + this.name + ' => ' + value, async () => {
            const element = await this.findFirstElement();
            if ('toHaveValue' in element) { // Vérifie si c’est un Locator
                await expect.soft(element as Locator).toHaveValue(value);
            } else { // ElementHandle
                const handle = element as ElementHandle<Node>;
                const actualValue = await handle.evaluate((el) => (el as HTMLInputElement).value);
                expect.soft(actualValue).toBe(value);
            }
        });
    }
    
    async assertVisible(visible: boolean) {
        await test.step('assertVisible ' + this.name, async () => {
            const element = await this.findFirstElement();
            if (visible) {
                if ('toBeVisible' in element) { // Locator
                    await expect.soft(element as Locator).toBeVisible({ timeout: ASSERT_TIMEOUT });
                } else { // ElementHandle
                    const handle = element as ElementHandle<Node>;
                    const isVisible = await handle.evaluate((el) => {
                        const style = window.getComputedStyle(el as Element);
                        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                    });
                    expect.soft(isVisible).toBe(true);
                }
            } else {
                // Pour le cas "non visible", on utilise le locator par défaut
                await expect.soft(this.getLocator().first()).not.toBeVisible({ timeout: ASSERT_TIMEOUT });
            }
        });
    }
    
    async assertEnabled(enabled: boolean) {
        await test.step('assertEnabled ' + this.name, async () => {
            const element = await this.findFirstElement();
            if (enabled) {
                if ('toBeEnabled' in element) { // Locator
                    await expect.soft(element as Locator).toBeEnabled({ timeout: ASSERT_TIMEOUT });
                } else { // ElementHandle
                    const handle = element as ElementHandle<Node>;
                    const isEnabled = await handle.evaluate((el) => !(el as HTMLInputElement).disabled);
                    expect.soft(isEnabled).toBe(true);
                }
            } else {
                if ('toBeDisabled' in element) { // Locator
                    await expect.soft(element as Locator).toBeDisabled({ timeout: ASSERT_TIMEOUT });
                } else { // ElementHandle
                    const handle = element as ElementHandle<Node>;
                    const isDisabled = await handle.evaluate((el) => (el as HTMLInputElement).disabled);
                    expect.soft(isDisabled).toBe(true);
                }
            }
        });
    }
    
    async assertRequired(required: boolean) {
        await test.step('assertRequired ' + this.name, async () => {
            const element = await this.findFirstElement();
            if ('getAttribute' in element) { // Locator
                if (required) {
                    await expect.soft(element as Locator).toHaveAttribute('required');
                } else {
                    await expect.soft(element as Locator).not.toHaveAttribute('required');
                }
            } else { // ElementHandle
                const handle = element as ElementHandle<Node>;
                const requiredAttr = await handle.evaluate((el) => (el as HTMLElement).getAttribute('required'));
                expect.soft(requiredAttr !== null).toBe(required);
            }
        });
    }


    /**
     * Obtient l'ElementHandle de l'élément
     */
    private async getPotentialElementByName(elementTypes: string): Promise<ElementHandle | null> {
        console.log('L\'élément avec le locator ' + this.locator + ' est introuvable, le test se poursuit avec un élément approchant');

        // Lire le script JS depuis findPotentialElement.js
        const script = fs.readFileSync('src/scripts/findPotentialElement.js', 'utf8');
        const attrsArray = ATTRIBUTE_POTENTIAL_ELEMENT.split(',');
        const attributes = attrsArray.map(attr => `input.getAttribute('${attr}')`).join(',');

        await this.page.addScriptTag({ content: script.
            replace('{ELEMENT_TYPES}', elementTypes).
            replace("{ATTRIBUTES}", attributes) });
 
        // Exécuter le script JS pour trouver l'élément par nom
        const foundElementHandle = await this.page.evaluateHandle((name) => {
            // Appeler directement findElementByName après injection
            return window.findClosestElementByText(name);
        }, this.name);
            

        if (!foundElementHandle || !(await foundElementHandle.asElement())) {
            console.log('Aucun element probable trouvé');
            return null;
        }

        // Retourne l'ElementHandle trouvé
        return foundElementHandle.asElement() as ElementHandle;
    }

    private async findElementWithAI(): Promise<string | null> {
        try {
            const maxChars = 5000;
            let dom = await this.page.evaluate(() => document.body.outerHTML);
            console.log(`L'élément '${this.getName()}' avec le locator '${this.locator}' est introuvable, le test se poursuit en recherchant l'élément avec l'IA`);
            dom = (dom || '').replace(/"/g, "'").replace(/\r?\n/g, "").replace(/>\s+</g, "><");
            dom = dom.length > maxChars ? dom.substring(0, maxChars) : dom;
            const command = `ollama run mistral "Donne moi uniquement un XPATH (Je ne veux que le xpath dans ta réponse, n'écrit rien d'autre.) utilisable dans playwright pour l'élément '${this.getName()}' dans ce DOM : ${dom}."`;
            console.log(command);
            const stdout = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
            console.log("Element trouvé par l'IA : " + stdout.trim());
            return stdout.trim(); 
        } catch (error) {
            console.log("Erreur findElementWithAI :", error);
            return null;
        }
    }
    
    private extractLocatorType(): string {
        const selector = this.locator.toString(); // Obtenir le sélecteur en chaîne de caractères
        if (selector.startsWith('getByRole')) {
            return 'getByRole';
        } else if (selector.startsWith('getByText')) {
            return 'getByText';
        } else if (selector.startsWith('getByLabel')) {
            return 'getByLabel';
        } else if (selector.startsWith('getByPlaceholder')) {
            return 'getByPlaceholder';
        } else if (selector.startsWith('getByAltText')) {
            return 'getByAltText';
        } else if (selector.startsWith('getByTitle')) {
            return 'getByTitle';
        } else if (selector.startsWith('getByTestId')) {
            return 'getByTestId';
        } else if (selector.startsWith('locator')) {
            return 'locator';
        } else {
            return 'Unknown';
        }
    }

    private extractSelector(): string {
        const selector = this.locator.toString();
        const startIndex = this.locatorType.length + 2;
        const endIndex = selector.length - 2;
        return selector.slice(startIndex, endIndex);
    }

    private getLocatorFromSelector(selector: string): Locator {
        switch (this.locatorType) {
            case 'getByText':
                return  this.container.getByText(selector);
            case 'getByLabel':
                return  this.container.getByLabel(selector);
            case 'getByPlaceholder':
                return  this.container.getByPlaceholder(selector);
            case 'getByAltText':
                return  this.container.getByAltText(selector);
            case 'getByTitle':
                return  this.container.getByTitle(selector);
            case 'getByTestId':
                return  this.container.getByTestId(selector);
            case 'locator':
            default:
                return  this.container.locator(selector);
        }
    }

}

