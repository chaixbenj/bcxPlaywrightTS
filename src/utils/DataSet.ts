import * as fs from 'fs';
import csv from 'csv-parser';
import { DATA_PATH } from '../../config/env';
import { DataUtil } from './DataUtil';

class DataSet {
    private keys: string[];
    private currentKeyIndex: number;
    private allRowsKeyAndValues: Map<string, Map<string, string>>;
    private keyAndValues: Map<string, string>;

    constructor() {
        this.keys = [];
        this.currentKeyIndex = -1;
        this.allRowsKeyAndValues = new Map<string, Map<string, string>>();
        this.keyAndValues = new Map<string, string>();
    }

    public next(): boolean {
        this.currentKeyIndex++;
        if (this.keys && this.keys.length > this.currentKeyIndex && this.allRowsKeyAndValues.size > this.currentKeyIndex) {
            this.keyAndValues = this.allRowsKeyAndValues.get(this.keys[this.currentKeyIndex]) || new Map<string, string>();
            return true;
        } else {
            return false;
        }
    }

    public getTestId(): string {
        return this.keys[this.currentKeyIndex];
    }

    public add(key: string, value: string): void {
        this.keyAndValues.set(key, DataUtil.replaceVariable(value) ?? '');
    }

    public async addFromDataFile(dataFile: string, idTest: string): Promise<void> {
        let fileValues = new Map<string, string>();
        if (dataFile.endsWith('.json')) {
            const data = await this.jsonRecordToHashByIdTest(DATA_PATH + dataFile, idTest);
            if (data) fileValues = data;
        } else {
            const data = await this.csvRecordToHashByIdTest(DATA_PATH + dataFile, idTest);
            if (data) fileValues = data;
        }
        fileValues?.forEach((value, key) => {
            if (value !== 'N/A') {
                this.add(key, value);
            }
        });
    }

    public clear(): void {
        this.keyAndValues.clear();
    }

    public replaceMap(newMap: Map<string, string>): void {
        this.keyAndValues.clear();
        newMap.forEach((value, key) => {
            this.add(key, value);
        });
    }

    public getKeyAndValues(): Map<string, string> {
        return this.keyAndValues;
    }

    public get(key: string): string | undefined {
        return this.keyAndValues.get(key);
    }


    public loadByIdTest(idTest: string): DataSet {
        if (this.allRowsKeyAndValues && this.allRowsKeyAndValues.has(idTest)) {
            this.keyAndValues = this.allRowsKeyAndValues.get(idTest) || new Map<string, string>();
        }
        return this;
    }

    public loadByLineNumber(lineNumber: number): void {
        const key = this.keys[lineNumber-1];
        if (key) {
            const data = this.allRowsKeyAndValues.get(key);
            this.keyAndValues = data || new Map<string, string>();
        }    
    }

    public async loadDataSetFileByLineNumber(dataFile: string, lineNumber: number): Promise<void> {
        dataFile = DATA_PATH + dataFile;
        if (this.keys && this.keys.length>=lineNumber) {
            this.keyAndValues = this.allRowsKeyAndValues.get(this.keys[lineNumber-1]) || new Map<string, string>();
        } else {
            if (dataFile.endsWith('.json')) {
                const data = await this.jsonRecordToHashByLineNumber(dataFile, lineNumber);
                if (data) this.keyAndValues = data;
            } else {
                const data = await this.csvRecordToHashByLineNumber(dataFile, lineNumber);
                if (data) this.keyAndValues = data;
            }
        }
    }

    public async loadDataSetFileByIdTest(dataFile: string, idTest: string): Promise<void> {
        dataFile = DATA_PATH + dataFile;
        if (this.allRowsKeyAndValues && this.allRowsKeyAndValues.has(idTest)) {
            this.keyAndValues = this.allRowsKeyAndValues.get(idTest) || new Map<string, string>();
        } else {
            if (dataFile.endsWith('.json')) {
                const data = await this.jsonRecordToHashByIdTest(dataFile, idTest);
                if (data) this.keyAndValues = data;
            } else {
                const data = await this.csvRecordToHashByIdTest(dataFile, idTest);
                if (data) this.keyAndValues = data;
            }
        }
    }

    public async loadDataSetFile(dataFile: string): Promise<void> {
        dataFile = DATA_PATH + dataFile;
        if (dataFile.endsWith('.json')) {
            const data = await this.jsonAllRecordsToHash(dataFile);
            if (data) this.allRowsKeyAndValues = data;
        } else {
            const data = await this.csvAllRecordsToHash(dataFile);
            if (data) this.allRowsKeyAndValues = data;
        }
        let i = 0;
        this.allRowsKeyAndValues.forEach((value, key) => {
            this.keys.push(key);
        });
        const firstEntry = this.allRowsKeyAndValues.get(this.keys[0]);
        if (firstEntry) this.keyAndValues = firstEntry;
    }


    private async jsonRecordToHashByIdTest(dataFile: string, idTest: string): Promise<Map<string, string> | null> {
        return new Promise((resolve, reject) => {
            fs.readFile(dataFile, 'utf-8', (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                try {
                    const jsonArray = JSON.parse(data); // Parse le fichier JSON en tableau
                    const result = jsonArray.find((item: any) => item['test-id'] === idTest); // Trouve l'objet correspondant
    
                    if (result) {
                        const resultMap = new Map<string, string>();
                        Object.keys(result).forEach(key => {
                            resultMap.set(key, DataUtil.replaceVariable(result[key]) ?? ''); // Remplit la Map avec les paires clé/valeur
                        });
                        resolve(resultMap);
                    } else {
                        resolve(null); // Renvoie null si aucun objet correspondant n'est trouvé
                    }
                } catch (parseError) {
                    reject(parseError); // Gère les erreurs de parsing JSON
                }
            });
        });
    }

    private async jsonRecordToHashByLineNumber(dataFile: string, lineNumber: number): Promise<Map<string, string> | null> {
        return new Promise((resolve, reject) => {
            fs.readFile(dataFile, 'utf-8', (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                try {
                    const jsonArray = JSON.parse(data); // Parse le fichier JSON en tableau
    
                    if (lineNumber >= 0 && lineNumber < jsonArray.length) {
                        const result = jsonArray[lineNumber]; // Récupère l'objet à l'index spécifié
                        const resultMap = new Map<string, string>();
                        Object.keys(result).forEach(key => {
                            resultMap.set(key, DataUtil.replaceVariable(result[key]) ?? ''); // Remplit la Map avec les paires clé/valeur
                        });
                        resolve(resultMap);
                    } else {
                        resolve(null); // Renvoie null si l'index est invalide
                    }
                } catch (parseError) {
                    reject(parseError); // Gère les erreurs de parsing JSON
                }
            });
        });
    }

    private async jsonAllRecordsToHash(dataFile: string): Promise<Map<string, Map<string, string>>> {
        return new Promise((resolve, reject) => {
            fs.readFile(dataFile, 'utf-8', (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                try {
                    const jsonArray = JSON.parse(data); // Parse le fichier JSON en tableau
                    const results: Map<string, Map<string, string>> = new Map();
    
                    jsonArray.forEach((item: any) => {
                        const testId = item['test-id']; // Récupère la valeur du champ test-id
                        if (testId) {
                            const rowMap = new Map<string, string>();
                            Object.keys(item).forEach(key => {
                                rowMap.set(key, DataUtil.replaceVariable(item[key]) ?? ''); // Remplit la Map pour cet objet
                            });
                            results.set(testId, rowMap); // Associe le test-id à la Map de l'objet
                        }
                    });
    
                    resolve(results); // Renvoie la Map complète
                } catch (parseError) {
                    reject(parseError); // Gère les erreurs de parsing JSON
                }
            });
        });
    }

    private async csvRecordToHashByIdTest(dataFile: string, idTest: string): Promise<Map<string, string> | null> {
        return new Promise((resolve, reject) => {
            const results: Map<string, string> = new Map();
    
            fs.createReadStream(dataFile)
                .pipe(csv({ separator: ';' }))
                .on('data', (data: any) => {
                    if (data['test-id'] === idTest) {
                        Object.keys(data).forEach(key => {
                            results.set(key, DataUtil.replaceVariable(data[key]) ?? '');
                        });
                    }
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error: any) => {
                    reject(error);
                });
        });
    }

    private async csvRecordToHashByLineNumber(dataFile: string, lineNumber: number): Promise<Map<string, string> | null> {
        return new Promise((resolve, reject) => {
            const results: Map<string, string> = new Map();
            let currentLine = 0;
    
            fs.createReadStream(dataFile)
                .pipe(csv({ separator: ';' }))
                .on('data', (data: any) => {
                    currentLine++;
                    if (currentLine === lineNumber) {
                        Object.keys(data).forEach(key => {
                            results.set(key, DataUtil.replaceVariable(data[key]) ?? '');
                        });
                    }
                })
                .on('end', () => {
                    if (results.size > 0) {
                        resolve(results); // Renvoie la Map si la ligne a été trouvée
                    } else {
                        resolve(null); // Renvoie null si la ligne n'existe pas
                    }
                })
                .on('error', (error: any) => {
                    reject(error); // Gère les erreurs liées à la lecture du fichier
                });
        });
    }

    private async csvAllRecordsToHash(dataFile: string): Promise<Map<string, Map<string, string>>> {
            return new Promise((resolve, reject) => {
                const results: Map<string, Map<string, string>> = new Map();
        
                fs.createReadStream(dataFile)
                    .pipe(csv({ separator: ';' }))
                    .on('headers', (headers: string[]) => {
                        // Vous pouvez utiliser les headers si nécessaire
                    })
                    .on('data', (data: any) => {
                        const testId = data['test-id']; // Récupère la valeur du champ test-id
                        if (testId) {
                            const rowMap = new Map<string, string>();
                            Object.keys(data).forEach(key => {
                                rowMap.set(key, DataUtil.replaceVariable(data[key]) ?? ''); // Remplit la Map pour cette ligne
                            });
                            results.set(testId, rowMap); // Associe le test-id à la Map de la ligne
                        }
                    })
                    .on('end', () => {
                        resolve(results); // Renvoie la Map complète
                    })
                    .on('error', (error: any) => {
                        reject(error); // Gère les erreurs liées à la lecture du fichier
                    });
            });
        }
}

export default DataSet;