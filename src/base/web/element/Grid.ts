import { Page, Locator, test, expect } from '@playwright/test';
import { BaseElement } from './BaseElement';
import { DataUtil } from '../../../utils/DataUtil';

export class Grid extends BaseElement {
    private static readonly TIME_OUT_ASSERTION: number = 5;
    public static readonly HEADER_NUM: string = "{HEADER_NUM}";
    public static readonly COL_NUMBER: string = "{COL_NUMBER}";
    public static readonly HEADER_ROW_NUM: string = "{HEADER_ROW_NUM}";
    public static readonly HEADER_NAME: string = "{HEADER_NAME}";
    public static readonly VALUE_IN_ROW: string = "{VALUE_IN_ROW}";
    public static readonly ROW_NUMBER: string = "{ROW_NUMBER}";
    public static readonly CELLS_VALUES: string = "{CELLS_VALUES}";
    public static readonly ROW_CONTENT: string = "{ROW_CONTENT}";
    public static readonly BUILT_VALUES: string = "{BUILT_VALUES}";
    public static readonly ATTR_ACTION: string = "{ATTR_ACTION}";
    private static readonly OUTERHTML: string = "outerHTML";
    private static readonly INNERTEXT: string = "innerText";
    private static readonly COL_NOT_FOUND: string = "col not found";
    public static readonly SUR_COL: string = " sur col ";
    public static readonly CELLULE: string = "cellule ";
    public static readonly CONTENANT: string = " contenant ";
    public static readonly NON_TROUVEE: string = " non trouvée";
    public static readonly COL: string = " col ";
    public static readonly TBODY_TR_TD: string = "//tbody/tr[td][";

    private tableTheadRows: BaseElement = new BaseElement(this.getPage(), `lignes de header`, this.getLocator().locator(`thead tr`));
    private tableTheadRowN: BaseElement = new BaseElement(this.getPage(), `ligne de header ${Grid.HEADER_ROW_NUM}`, this.getLocator().locator(`thead > tr:nth-of-type(${Grid.HEADER_ROW_NUM}) > th`));
    private tableHeaders: BaseElement = new BaseElement(this.getPage(), `headers`, this.getLocator().locator(`thead tr th`));
    private oneHeaderByName: BaseElement = new BaseElement(this.getPage(), `header '${Grid.HEADER_NAME}'`, this.getLocator().locator(`thead tr th:has-text("${Grid.HEADER_NAME}")`));
    private oneHeaderByNum: BaseElement = new BaseElement(this.getPage(), `header ligne ${Grid.HEADER_NUM}`, this.getLocator().locator(`thead tr th:nth-of-type(${Grid.HEADER_NUM})`));
    private tableRows: BaseElement = new BaseElement(this.getPage(), `lignes de données`, this.getLocator().locator(`tbody tr`));
    private oneRowContainingOneValue = new BaseElement(this.getPage(), `ligne contenant ${Grid.VALUE_IN_ROW}`, this.getLocator().locator(`tbody tr:has-text("${Grid.VALUE_IN_ROW}")`));
    private oneRowByNum = new BaseElement(this.getPage(), `ligne ${Grid.ROW_NUMBER}`, this.getLocator().locator(`tbody tr:nth-of-type(${Grid.ROW_NUMBER})`));
    private oneRowByCellsValues = new BaseElement(this.getPage(), `ligne contenant ${Grid.CELLS_VALUES}`, this.getLocator().locator(`tbody tr${Grid.BUILT_VALUES}`)); //'tr >> td:has-text("val1") >> td:has-text("val2") >> td:has-text("val3")'
    private oneCellByRowNumColNum = new BaseElement(this.getPage(), `${Grid.CELLULE} ${Grid.ROW_NUMBER} ${Grid.COL_NUMBER}`, this.getLocator().locator(`tbody tr:nth-of-type(${Grid.ROW_NUMBER}) td:nth-of-type(${Grid.COL_NUMBER})`));
    private oneCellByCellsValuesColNum = new BaseElement(this.getPage(), `${Grid.CELLULE} de la ligne contenant "${Grid.CELLS_VALUES}", colonne ${Grid.COL_NUMBER}`, this.getLocator().locator(`tbody tr${Grid.BUILT_VALUES} td:nth-of-type(${Grid.COL_NUMBER})`));
    private oneCellContainingOneValueByColNum = new BaseElement(this.getPage(), `${Grid.CELLULE} contenant ${Grid.VALUE_IN_ROW} colonne ${Grid.COL_NUMBER}`, this.getLocator().locator(`tbody tr:has-text("${Grid.VALUE_IN_ROW}") td:nth-of-type(${Grid.COL_NUMBER})`));
    private oneColumnByNum = new BaseElement(this.getPage(), `colonne ${Grid.COL_NUMBER}`, this.getLocator().locator(`tbody tr td:nth-of-type(${Grid.COL_NUMBER})`));
    private actionElementInRow = new BaseElement(this.getPage(), `action ${Grid.ATTR_ACTION} sur la ligne contenant ${Grid.CELLS_VALUES}`, this.getLocator().locator(`tbody tr:${Grid.BUILT_VALUES} [attribute*="${Grid.ATTR_ACTION}"]`));
    private actionElementInRowByNum = new BaseElement(this.getPage(), `action ${Grid.ATTR_ACTION} sur la ligne ${Grid.ROW_NUMBER}`, this.getLocator().locator(`tbody tr:nth-of-type(${Grid.ROW_NUMBER}) [attribute*="${Grid.ATTR_ACTION}"]`));
    private oneFooterByColNum = new BaseElement(this.getPage(), `footer colonne ${Grid.COL_NUMBER}`, this.getLocator().locator(`tfoot tr td:nth-of-type(${Grid.COL_NUMBER})`));


    constructor(page: Page, name: string, locator: Locator) {
        super(page, name, locator);
    }


    /**
     * renvoi le numéro de la colonne d'entête headerName
     * @param headerName
     * @return
     */
    async getColNumber(headerName: string): Promise<number> {
        return await test.step(`getColNumber ${headerName}`, async () => {
            const headers = this.tableHeaders.getLocator();
            const headersCount = await headers.count();
            for (let i = 0; i < headersCount; i++) {
                const headerText = await headers.nth(i).innerText();
                if (headerText === headerName) {
                    return i + 1; 
                }
            }
           return 0;
        });
    }


    /**
     * renvoi le premier numéro de ligne contenant le(s) texte(s) subStringsInCells
     * @param subStringsInCells
     * @return
     */
    async getRowNumber(subStringsInCells: string | string[]): Promise<number> {
        return await test.step(`getRowNumber ${subStringsInCells}`, async () => {
            const rows = this.tableRows.getLocator();
            const rowsCount = await rows.count();
            for (let i = 0; i < rowsCount; i++) {
                const rowText = await rows.nth(i).innerText();
                if (subStringsInCells instanceof Array) {
                    let found = true;
                    for (let subString of subStringsInCells) {
                        if (!rowText.includes(subString)) {
                            found = false;
                        }
                    }
                    if (found) return i + 1;
                } else if (rowText.includes(subStringsInCells)) {
                    return i + 1;
                }
            }
            return 0;
        });
    }


     /**
     * renvoi le premier numéro de ligne contenant le texte subStringInCell dans la colonne numéro colNumber
     * @param subStringInCell
     * @param colNumber
     * @return
     */
    async getRowNumberByTextInColumn(subStringInRow: string, colNum: number): Promise<number> {
        return await test.step(`getRowNumberByTextInColumn ${subStringInRow} ${colNum}`, async () => {
            const rows = this.tableRows.getLocator();
            const rowsCount = await rows.count();
            for (let i = 0; i < rowsCount; i++) {
                const rowText = await this.oneColumnByNum.injectValues({ [Grid.COL_NUMBER]: colNum.toString() }).getLocator().innerText();
                if (rowText.includes(subStringInRow)) {
                    return i + 1;
                }
            }
            return 0;
        });
    }

    /**
    * Renvoi le nombre de ligne.
    * @return nombre de ligne
    */
    async getRowCount(): Promise<number> {
        return await test.step(`getRowCount`, async () => {
            const rows = this.tableRows.getLocator();
            return await rows.count();
        });
    }

    /**
     * Indique si la table contient une valeur dans un délai de GlobalVariable.getAssertTimeOut().
     * @return true si la table est oui, false sinon
     */
    async contains(valueInRow: string): Promise<boolean> {
        return await test.step(`contains ${valueInRow}`, async () => {
            return await this.oneRowContainingOneValue.injectValues({ [Grid.VALUE_IN_ROW]: valueInRow }).getLocator().isVisible();
        });
    }

    /**
     * Indique si une ligne de la table contient une valeur dans une colonne.
     * @param colNumOrHeader numero ou nom de la colonne où on recherche la valeur
     * @param subStringInCell valeur que l'on cherche dans la colonne columnNumber
     * @return true si la ligne existe sinon false
     */
    async columnContains(colNumOrHeader: string|number, valueInRow: string): Promise<boolean> {
        return await test.step(`columnContains ${valueInRow}`, async () => {
            let colNum = 0;
            if (typeof colNumOrHeader === 'string') {
                colNum = await this.getColNumber(colNumOrHeader);
            } else {
                colNum = colNumOrHeader;
            }
            return await this.oneCellContainingOneValueByColNum.injectValues({ [Grid.VALUE_IN_ROW]: valueInRow, [Grid.COL_NUMBER]: colNum.toString() }).getLocator().isVisible();
        });
    }

    /**
     * renvoi l'élément TR de la ligne contenant les valeurs cellsValues
     * @param cellsValues
     * @return
     */
    async getRow(...cellsValues: string[]): Promise<BaseElement> {
        return await test.step(`getRow ${cellsValues}`, async () => {
            const [sCellsValues, builtValuesXpath] = this.buildCssFindRowOrCell(cellsValues);
            return this.oneRowByCellsValues.injectValues({ [Grid.CELLS_VALUES]: sCellsValues, [Grid.BUILT_VALUES]: builtValuesXpath });
        });
    }

     /**
     * recupère la valeur d'une cellule de la colonne headerNameOrColNum de la ligne de la table contenant la chaine valuesOrRowNum.
     * @param valuesOrRowNum listes de chaines pour identifier la ligne ou numéro de ligne
     * @param headerNameOrColNum colonne ou header de la cellule dont on veut la valeur
     * @return la valeur de la cellule
     */
    async getCellValue(valuesOrRowNum: number | string | string[], headerNameOrColNum: number | string): Promise<string> {
        return await test.step(`getCellValue ${valuesOrRowNum} ${headerNameOrColNum}`, async () => {
            let colNum = 0;
            let rowNum = 0;
            if (typeof headerNameOrColNum === 'string') {
                colNum = await this.getColNumber(headerNameOrColNum);
            } else {
                colNum = headerNameOrColNum;
            }
            if (typeof valuesOrRowNum === 'number') {
                rowNum = valuesOrRowNum;
            } else {
                rowNum = await this.getRowNumber(valuesOrRowNum);
            }
            const cellule = this.oneCellByRowNumColNum.injectValues({ [Grid.ROW_NUMBER]: rowNum.toString(), [Grid.COL_NUMBER]: colNum.toString() }).getLocator();
            if (cellule) {
                const celluleText = await cellule.innerText();
                return DataUtil.normalizeText(celluleText);
            } else {
                return Grid.NON_TROUVEE;
            }
        });
    }

    /**
     * indique si la valeur d'une cellule de la colonne headerNameOrColNum de la ligne de la table contenant la chaine valuesOrRowNum est égale à la valeur en paramètre.
     * @param valuesOrRowNum listes de chaines pour identifier la ligne ou numéro de ligne
     * @param headerNameOrColNum colonne ou header de la cellule dont on veut la valeur
     * @param expectedValue valeur attendue
     * @return boolean égalité ou pas
     */
    async cellValueEquals(valuesOrRowNum: number | string | string[], headerNameOrColNum: number | string, expectedValue: string): Promise<boolean> {
        return await test.step(`cellValueEquals ${valuesOrRowNum} ${headerNameOrColNum} ${expectedValue}`, async () => {
            const cellValue = await this.getCellValue(valuesOrRowNum, headerNameOrColNum);
            return (cellValue === expectedValue);
        });
    }

    /**
     * recupère la valeur d'un attribut attr d'une cellule de la colonne headerNameOrColNum de la ligne de la table contenant la chaine valuesOrRowNum.
     * @param valuesOrRowNum listes de chaines pour identifier la ligne ou numéro de ligne
     * @param headerNameOrColNum colonne ou header de la cellule dont on veut la valeur
     * @param attr attribut de la cellule
     * @return la valeur de la cellule
     */
    async getCellAttributeValue(valuesOrRowNum: number | string | string[], headerNameOrColNum: number | string, attr: string): Promise<string> {
        return await test.step(`getCellAttributeValue ${valuesOrRowNum} ${headerNameOrColNum} ${attr}`, async () => {
            let colNum = 0;
            let rowNum = 0;
            if (typeof headerNameOrColNum === 'string') {
                colNum = await this.getColNumber(headerNameOrColNum);
            } else {
                colNum = headerNameOrColNum;
            }
            if (typeof valuesOrRowNum === 'number') {
                rowNum = valuesOrRowNum;
            } else {
                rowNum = await this.getRowNumber(valuesOrRowNum);
            }
            const cellule = this.oneCellByRowNumColNum.injectValues({ [Grid.ROW_NUMBER]: rowNum.toString(), [Grid.COL_NUMBER]: colNum.toString() }).getLocator();
            if (cellule) {
                const celluleAttr = await cellule.getAttribute(attr);
                if (celluleAttr) {
                    return celluleAttr;
                } else {    
                    return Grid.NON_TROUVEE;
                }   
            } else {
                return Grid.NON_TROUVEE;
            }
        });
    }


    //-----------actions----------------

    /**
     * clique sur la cellule de la colonne headerNameOrColNum de la ligne de la table contenant la chaine valuesOrRowNum.
     * @param valuesOrRowNum listes de chaines pour identifier la ligne ou numéro de ligne
     * @param headerNameOrColNum colonne ou header de la cellule dont on veut la valeur
     */
    async clickCell(valuesOrRowNum: number | string | string[], headerNameOrColNum: number | string) {
        return await test.step(`clickCell ${valuesOrRowNum} ${headerNameOrColNum}`, async () => {
            let colNum = 0;
            let rowNum = 0;
            if (typeof headerNameOrColNum === 'string') {
                colNum = await this.getColNumber(headerNameOrColNum);
            } else {
                colNum = headerNameOrColNum;
            }
            if (typeof valuesOrRowNum === 'number') {
                rowNum = valuesOrRowNum;
            } else {
                rowNum = await this.getRowNumber(valuesOrRowNum);
            }
            await this.oneCellByRowNumColNum.injectValues({ [Grid.ROW_NUMBER]: rowNum.toString(), [Grid.COL_NUMBER]: colNum.toString() }).click();
        });
    }

 /**
     * Réalise une action sur une ligne de la table contenant une chaine de données subStringInRow. L'action est identifiée par tout ou partie de la valeur d'un attribut de son élément html.
     * @param valuesOrRowNum listes de chaines pour identifier la ligne ou numéro de ligne
     * @param action tout ou partie de la valeur d'un attribut de l'élément de l'action (par exemple "common-pencil", "editer")
     */
    async actionOnRow(valuesOrRowNum: number | string | string[], action: string) {
        return await test.step(`actionOnRow ${valuesOrRowNum} ${action}`, async () => {
            let rowNum = 0;
            if (typeof valuesOrRowNum === 'number') {
                rowNum = valuesOrRowNum;
            } else {
                rowNum = await this.getRowNumber(valuesOrRowNum);
            }
            await this.actionElementInRowByNum.injectValues({ [Grid.ROW_NUMBER]: rowNum.toString(), [Grid.ATTR_ACTION]: action }).click();
        });
    }




    //-----------assertions----------------

    /**
     * vérifie qu'une ligne au moins de la table contient les valeurs en paramètre.
     * Le résultat est tracé dans le rapport.
     * @param values valeur que l'on cherche dans la colonne subStringHeaderName
     */
    async assertOneRowContains(values: string | string[]) {
        return await test.step(`assertOneRowContains ${values}`, async () => {
            const rowNum = await this.getRowNumber(values);
            expect(rowNum).toBeGreaterThan(0);
        });
    }

    /**
     * vérifie qu'aucune ligne de la table ne contient les valeurs en paramètre.
     * Le résultat est tracé dans le rapport.
     * @param values valeur que l'on cherche dans la colonne subStringHeaderName
     */
    async assertNoRowContains(values: string | string[]) {
        return await test.step(`assertNoRowContains ${values}`, async () => {
            const rowNum = await this.getRowNumber(values);
            expect(rowNum).toBe(0);
        });
    }

    /**
     * vérifie si la valeur d'une cellule de la colonne headerNameOrColNum de la ligne de la table contenant la chaine valuesOrRowNum est égale à la valeur en paramètre.
     * @param valuesOrRowNum listes de chaines pour identifier la ligne ou numéro de ligne
     * @param headerNameOrColNum colonne ou header de la cellule dont on veut la valeur
     * @param expectedValue valeur attendue
     */
    async assertCellValueEquals(valuesOrRowNum: number | string | string[], headerNameOrColNum: number | string, expectedValue: string) {
        return await test.step(`assertCellValueEquals ${valuesOrRowNum} ${headerNameOrColNum} ${expectedValue}`, async () => {
            const cellValue = await this.getCellValue(valuesOrRowNum, headerNameOrColNum);
            expect(cellValue).toBe(DataUtil.normalizeText(expectedValue));
        });
    }

    /**
     * vérifie si la valeur d'une cellule de la colonne headerNameOrColNum de la ligne de la table contenant la chaine valuesOrRowNum n'est pas égale à la valeur en paramètre.
     * @param valuesOrRowNum listes de chaines pour identifier la ligne ou numéro de ligne
     * @param headerNameOrColNum colonne ou header de la cellule dont on veut la valeur
     * @param expectedValue valeur attendue
     **/ 
    async assertCellValueNotEquals(valuesOrRowNum: number | string | string[], headerNameOrColNum: number | string, expectedValue: string) {
        return await test.step(`assertCellValueNotEquals ${valuesOrRowNum} ${headerNameOrColNum} ${expectedValue}`, async () => {
            const cellValue = await this.getCellValue(valuesOrRowNum, headerNameOrColNum);
            expect(cellValue).not.toBe(DataUtil.normalizeText(expectedValue));
        });
    }


    private buildCssFindRowOrCell(cellsValues: string[]): string[] {
        let sCellsValues = '';
        let builtValuesXpath = '';
        for (let cellValue of cellsValues) {
            if (cellValue && cellValue !== 'null') {
                sCellsValues += cellValue + ' ';
                builtValuesXpath += ' >> td:has-text("' + cellValue + '")';
            }
        }
        return [sCellsValues.trim(), builtValuesXpath];
    }
}