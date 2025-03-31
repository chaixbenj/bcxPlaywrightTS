import { Page, test, Browser } from '@playwright/test';
import { MobBaseElement} from './element/MobBaseElement';
import DataSet from '../../utils/DataSet';

export class MobBasePage {
    readonly driver: WebdriverIO.Browser;
    private elements: Map<string, MobBaseElement> = new Map();

    constructor(driver: WebdriverIO.Browser) {
        this.driver = driver;
    }

    /**
     * Ajoute un élément à la page
     * @param name - Nom de l'élément
     * @param locator - Sélecteur initial de l'élément
     */
    addElement<T extends MobBaseElement>(element: T): void {
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
            const element = this.getElement<MobBaseElement>(elementName);
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
        private getElement<T extends MobBaseElement>(name: string): MobBaseElement {
            const element = this.elements.get(name);
            if (!element) {
                throw new Error(`Element with name "${name}" not declared.`);
            }
            return element as T;
        }

}
