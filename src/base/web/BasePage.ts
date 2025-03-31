import { Page, test, Browser } from '@playwright/test';
import { BaseElement} from './element/BaseElement';
import DataSet from '../../utils/DataSet';

export class BasePage {
    readonly page: Page;
    protected url: string | null = null;
    private elements: Map<string, BaseElement> = new Map();

    constructor(page: Page, url: string | null = null) {
        this.url = url;
        this.page = page;
    }

    /**
     * browse vers une URL
     * @param url 
     */
    async navigateTo(url?: string): Promise<void> {
        const target = (url && url !== null) ? url : this.url;
        await test.step('navigate to ' + target, async () => {
            if (target && target !== null) {
                await this.page.goto(target);
                await this.page.waitForLoadState('load');
            } 
        });
    }

    /**
     * Crée une nouvelle page dans un nouveau contexte
     * pour paratger une page entre les tests, p.ex : test.beforeAll(async ({ browser }) => {this.page = await BasePage.newPage(browser);});
     * @param browser 
     * @returns 
     */
    static async newPage(browser: Browser): Promise<Page> {
        return (await browser.newContext()).newPage();
     }

    /**
     * Ferme proprement la nouvelle page ouverte avec newPage
     * p.ex : test.afterAll(async () => {await BasePage.tearDown(this.page);});
     * @param browser 
     * @returns 
     */
    static async tearDown(page: Page) {
        await page.context().close();
    }

    /**
     * ouvre une nouvel onglet dans le même contexte ou une nouvelle page dans un nouveau contexte
     * @param newContext 
     * @returns 
     */
    async newTab(newContext: boolean): Promise<Page> {
        if (newContext) {
            const browser = this.page.context().browser();
            if (!browser) {
                throw new Error('Browser is undefined');
            }
            return await (await browser.newContext()).newPage();
        } else {
            return await this.page.context().newPage();
        }
    }

    /**
     * Ajoute un élément à la page
     * @param name - Nom de l'élément
     * @param locator - Sélecteur initial de l'élément
     */
    addElement<T extends BaseElement>(element: T): void {
        this.elements.set(element.getName(), element);
    }


    /**
    * Lit un fichier CSV/JSON ou objet dataSet et remplit les champs de la page à partir des données d'un test-id donné.
    * @param filePathOrDataSet - Le chemin du fichier CSV/JSON ou objet DataSet.
    * @param testId - L'identifiant du test pour lequel récupérer les données.
    */
    async setValue(filePathOrDataSet: string | DataSet, testIdOrLineNumber: string | number | null): Promise<DataSet> {
        return await this.runDataSet(filePathOrDataSet, testIdOrLineNumber, 'setValue');
    }

    /**
    * Lit un fichier CSV/JSON ou objet dataSet et vérifie les valeurs des champs de la page à partir des données d'un test-id donné.
    * @param filePathOrDataSet - Le chemin du fichier CSV/JSON ou objet DataSet.
    * @param testId - L'identifiant du test pour lequel récupérer les données.
    */
    async assertValue(filePathOrDataSet: string | DataSet, testIdOrLineNumber: string | number | null): Promise<DataSet> {
        return await this.runDataSet(filePathOrDataSet, testIdOrLineNumber, 'assertValue');
    }

    /**
    * Lit un fichier CSV/JSON ou objet dataSet et vérifie la visibilité des champs de la page à partir des données d'un test-id donné.
    * @param filePathOrDataSet - Le chemin du fichier CSV/JSON ou objet DataSet.
    * @param testId - L'identifiant du test pour lequel récupérer les données.
    */
    async assertVisible(filePathOrDataSet: string | DataSet, testIdOrLineNumber: string | number | null): Promise<DataSet> {
        return await this.runDataSet(filePathOrDataSet, testIdOrLineNumber, 'assertVisible');
    }

    /**
    * Lit un fichier CSV/JSON ou objet dataSet et vérifie l'accessibilité des champs de la page à partir des données d'un test-id donné.
    * @param filePathOrDataSet - Le chemin du fichier CSV/JSON ou objet DataSet.
    * @param testId - L'identifiant du test pour lequel récupérer les données.
    */
    async assertEnabled(filePathOrDataSet: string | DataSet, testIdOrLineNumber: string | number | null): Promise<DataSet> {
        return await this.runDataSet(filePathOrDataSet, testIdOrLineNumber, 'assertEnabled');
    }

    /**
    * Lit un fichier CSV/JSON ou objet dataSet et vérifie l'obligation des champs de la page à partir des données d'un test-id donné.
    * @param filePathOrDataSet - Le chemin du fichier CSV/JSON ou objet DataSet.
    * @param testId - L'identifiant du test pour lequel récupérer les données.
    */
    async assertRequired(filePathOrDataSet: string | DataSet, testIdOrLineNumber: string | number | null): Promise<DataSet> {
        return await this.runDataSet(filePathOrDataSet, testIdOrLineNumber, 'assertRequired');
    }


    async runDataSet(filePathOrDataSet: string | DataSet, testIdOrLineNumber: string | number | null, action: string): Promise<DataSet> {
        let dataSet;
        await test.step(action + ' sur le formulaire ' + filePathOrDataSet + ', test id ' + testIdOrLineNumber, async () => {
            dataSet = await this.getDataSet(filePathOrDataSet, testIdOrLineNumber);
            
            const row = dataSet.getKeyAndValues();

            if (!row) {
                throw new Error(`Aucune donnée trouvée pour le test-id : ${testIdOrLineNumber}`);
            }

            for (const [key, value] of row) {
                if (key !== 'test-id' && value !== 'N/A') {
                    await this.performActionOnElement(key, action, value);
                }
            }
        });
        return dataSet;
    }


    private async getDataSet(filePathOrDataSet: string | DataSet, testIdOrLineNumber: string | number | null): Promise<DataSet> {
        let dataSet = new DataSet();
        if (filePathOrDataSet instanceof DataSet) {
            dataSet = filePathOrDataSet;
        } else {
            if (typeof testIdOrLineNumber === 'number') {
                dataSet.loadDataSetFileByLineNumber(filePathOrDataSet, testIdOrLineNumber);
            } else {
                if (testIdOrLineNumber !== null) {
                    await dataSet.loadDataSetFileByIdTest(filePathOrDataSet, testIdOrLineNumber as string);
                } else {
                    throw new Error('testIdOrLineNumber cannot be null when loading by test ID');
                }
            }
        }
        return dataSet;
    }


    private async performActionOnElement(elementName: string, action: string, value: string | null): Promise<void> {
        await test.step(action + ' ' + elementName + ' => ' + value, async () => {
            const element = this.getElement<BaseElement>(elementName);
            if (element) {
                switch (action) {
                    case 'setValue':
                        if (value === 'click') {
                            await element.click();
                        } else {
                            await element.setValue(value as string);
                        }
                        break;
                    case 'assertValue':
                        await element.assertValue(value as string);
                        break;
                    case 'assertVisible':
                        await element.assertVisible(value?.toLowerCase() === 'true' || false);
                        break;
                    case 'assertEnabled':
                        await element.assertEnabled(value?.toLowerCase() === 'true' || false);
                        break;
                    case 'assertRequired':
                        await element.assertRequired(value?.toLowerCase() === 'true' || false);
                        break;
                    default:
                        console.warn(`Action non reconnue : ${action}`);
                        break;
                }
                
            } else {
                console.warn(`Aucun élément trouvé pour le nom : ${elementName}`);
            }
        });
    }

     /**
     * Obtient un élément par son nom
     * @param name - Nom de l'élément
     * @returns L'instance de l'élément
     */
        private getElement<T extends BaseElement>(name: string): BaseElement {
            const element = this.elements.get(name);
            if (!element) {
                throw new Error(`Element with name "${name}" not declared.`);
            }
            return element as T;
        }

}
