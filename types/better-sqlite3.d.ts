declare module "better-sqlite3" {
  class Database {
    constructor(path: string, options?: { readonly?: boolean; fileMustExist?: boolean });
    prepare(sql: string): Statement;
    pragma(source: string, options?: { simple?: boolean }): any;
    close(): void;
  }
  class Statement {
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }
  interface RunResult {
    lastInsertRowid: number | bigint;
    changes: number;
  }
  export default Database;
}
