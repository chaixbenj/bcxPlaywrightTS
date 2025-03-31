import * as fs from 'fs';
import * as mysql from 'mysql2/promise';
import * as oracledb from 'oracledb';
import * as mssql from 'mssql';

type LinkedHashMap<K, V> = Map<K, V>;
type SqlResult = LinkedHashMap<string, string>[];

export class QueryResult {
    private sqlResult: SqlResult;

    constructor(sqlResult: SqlResult) {
        this.sqlResult = sqlResult;
    }

    getStack(): SqlResult {
        return this.sqlResult;
    }

    getColumn(colName: string): string[] {
        return this.sqlResult.map(hash => hash.get(colName.toUpperCase()) || "");
    }

    getRow(rowNum: number): LinkedHashMap<string, string> | undefined {
        return this.sqlResult[rowNum];
    }

    getFieldOnRow(rowNum: number, colName: string): string | null {
        return this.sqlResult[rowNum]?.get(colName.toUpperCase()) || null;
    }

    size(): number {
        return this.sqlResult.length;
    }


        /**
     * Exécute une requête SQL depuis un fichier pour MySQL, Oracle ou SQL Server.
     * @param dbType Type de la base de données : "mysql", "oracle" ou "mssql".
     * @param filePath Chemin du fichier SQL.
     * @param params Paramètres de la requête SQL.
     * @param dbConfig Configuration de la base de données.
     * @returns Une instance de QueryResult contenant les résultats.
     */
        static async executeQueryFromFile(
            dbType: "mysql" | "oracle" | "mssql",
            filePath: string,
            params: any[],
            dbConfig: any
        ): Promise<QueryResult> {
            // Lire la requête SQL depuis le fichier
            const query = fs.readFileSync(filePath, 'utf-8').trim();
    
            let sqlResult: SqlResult = [];
    
            switch (dbType) {
                case "mysql":
                    sqlResult = await QueryResult.executeMySQLQuery(query, params, dbConfig);
                    break;
                case "oracle":
                    sqlResult = await QueryResult.executeOracleQuery(query, params, dbConfig);
                    break;
                case "mssql":
                    sqlResult = await QueryResult.executeMSSQLQuery(query, params, dbConfig);
                    break;
                default:
                    throw new Error("Type de base de données non supporté.");
            }
    
            return new QueryResult(sqlResult);
        }
    
        private static async executeMySQLQuery(query: string, params: any[], dbConfig: mysql.ConnectionOptions): Promise<SqlResult> {
            const connection = await mysql.createConnection(dbConfig);
            try {
                const [rows] = await connection.execute<any[]>(query, params);
                return QueryResult.convertRowsToMap(rows);
            } finally {
                await connection.end();
            }
        }
    
        private static async executeOracleQuery(query: string, params: any[], dbConfig: oracledb.ConnectionAttributes): Promise<SqlResult> {
            const connection = await oracledb.getConnection(dbConfig);
            try {
                const result = await connection.execute(query, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
                return QueryResult.convertRowsToMap(result.rows);
            } finally {
                await connection.close();
            }
        }
    
        private static async executeMSSQLQuery(query: string, params: any[], dbConfig: mssql.config): Promise<SqlResult> {
            const pool = await mssql.connect(dbConfig);
            try {
                const request = pool.request();
                params.forEach((param, index) => {
                    request.input(`param${index + 1}`, param);
                });
                const result = await request.query(query);
                return QueryResult.convertRowsToMap(result.recordset);
            } finally {
                await pool.close();
            }
        }
    
        private static convertRowsToMap(rows: any[]): SqlResult {
            if (!rows || !Array.isArray(rows) || rows.length === 0) {
                return []; // Retourne un tableau vide si aucun résultat
            }
            
            return rows.map((row) => {
                const map = new Map<string, string>();
                Object.entries(row).forEach(([key, value]) => {
                    map.set(key.toUpperCase(), value?.toString() ?? ""); // Convertir en string
                });
                return map;
            });
        }
}

