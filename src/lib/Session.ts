import type { Database } from "sqlite3";
import { ParameterisedSqlable } from "./interfaces/ParameterisedSqlable";
import { CreateTableQuery } from "./queries/create-table/CreateTableQuery";
import { DeleteQuery } from "./queries/delete/DeleteQuery";
import { DropTableQuery } from "./queries/drop-table/DropTableQuery";
import { InsertQuery } from "./queries/insert/InsertQuery";
import { SelectQuery } from "./queries/select/SelectQuery";

export class Session {
  public readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  public static inMemory(): Promise<Session> {
    return Session.fromFile(":memory:");
  }

  public static anonymous(): Promise<Session> {
    return Session.fromFile("");
  }

  public static async fromFile(filename: string): Promise<Session> {
    const sqlite3 = await import("sqlite3");
    return new this(
      new sqlite3.Database(filename || "", err => {
        if (err) throw err;
      })
    );
  }

  public getTables(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all(`SELECT * FROM sqlite_master WHERE type = "table"`, [], (err, tables) => {
          if (err) reject(err);
          resolve(tables.map(table => table.name));
        });
      });
    });
  }

  public createTable(createTableQuery: CreateTableQuery): void {
    this.db.serialize(() => {
      this.db.run(createTableQuery.getSql());
    });
  }

  public dropTable(dropTableQuery: DropTableQuery): void {
    this.db.serialize(() => {
      this.db.run(dropTableQuery.getSql());
    });
  }

  public insert(insertQuery: InsertQuery): void {
    this.runPreparedStatement(insertQuery);
  }

  public select(selectQuery: SelectQuery): Promise<any[]> {
    return this.allPreparedStatement(selectQuery);
  }

  public selectSingle(selectQuery: SelectQuery): Promise<any> {
    return this.getPreparedStatement(selectQuery);
  }

  public delete(deleteQuery: DeleteQuery): void {
    return this.runPreparedStatement(deleteQuery);
  }

  public closeConnection(): void {
    this.db.close();
  }

  private runPreparedStatement(parameterisedSqlable: ParameterisedSqlable): void {
    this.db.serialize(() => {
      this.db
        .prepare(parameterisedSqlable.getSql())
        .run(parameterisedSqlable.getValues())
        .finalize();
    });
  }

  private allPreparedStatement(parameterisedSqlable: ParameterisedSqlable): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .prepare(parameterisedSqlable.getSql())
          .all(parameterisedSqlable.getValues(), (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          })
          .finalize();
      });
    });
  }

  private getPreparedStatement(parameterisedSqlable: ParameterisedSqlable): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .prepare(parameterisedSqlable.getSql())
          .get(parameterisedSqlable.getValues(), (err, row) => {
            if (err) reject(err);
            resolve(row);
          })
          .finalize();
      });
    });
  }
}
