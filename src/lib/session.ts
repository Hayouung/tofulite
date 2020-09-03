import type { Database } from "sqlite3";
import { ParameterisedQuery, Query, QueryFn } from "./query";
import { SelectQuery, selectFrom } from "./queries/select/select";
import { InsertQuery, insertInto } from "./queries/insert/insert";
import { CreateTableQuery, createTable } from "./queries/create-table/create-table";
import { DeleteQuery, deleteFrom } from "./queries/delete/delete";
import { DropTableQuery, dropTable } from "./queries/drop-table/drop-table";

export class Session {
  readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  static inMemory(): Promise<Session> {
    return Session.fromFile(":memory:");
  }

  static anonymous(): Promise<Session> {
    return Session.fromFile("");
  }

  static async fromFile(filename: string): Promise<Session> {
    const sqlite3 = await import("sqlite3");
    return new Session(
      new sqlite3.Database(filename || "", err => {
        if (err) throw err;
      })
    );
  }

  run(query: Query | ParameterisedQuery): void {
    if ("parameters" in query) {
      this.db.serialize(() => {
        this.db
          .prepare(query.sql())
          .run(query.parameters())
          .finalize();
      });
    } else {
      this.db.serialize(() => {
        this.db.run(query.sql());
      });
    }
  }

  all<T = any>(query: ParameterisedQuery): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .prepare(query.sql())
          .all(query.parameters(), (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          })
          .finalize();
      });
    });
  }

  get<T = any>(query: ParameterisedQuery): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .prepare(query.sql())
          .get(query.parameters(), (err, row) => {
            if (err) reject(err);
            resolve(row);
          })
          .finalize();
      });
    });
  }

  createTable(fn: QueryFn<CreateTableQuery>) {
    this.run(fn(createTable));
  }

  insert(fn: QueryFn<InsertQuery>) {
    this.run(fn(insertInto));
  }

  delete(fn: QueryFn<DeleteQuery>) {
    this.run(fn(deleteFrom));
  }

  dropTable(fn: QueryFn<DropTableQuery>) {
    this.run(fn(dropTable));
  }

  select<T = any>(fn: QueryFn<SelectQuery>): Promise<T[]> {
    return this.all<T>(fn(selectFrom));
  }

  selectSingle<T = any>(fn: QueryFn<SelectQuery>): Promise<T> {
    return this.get<T>(fn(selectFrom));
  }

  getTables(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all(`SELECT * FROM sqlite_master WHERE type = "table"`, [], (err, tables) => {
          if (err) reject(err);
          resolve(tables.map(table => table.name));
        });
      });
    });
  }

  closeConnection(): void {
    this.db.close();
  }
}
