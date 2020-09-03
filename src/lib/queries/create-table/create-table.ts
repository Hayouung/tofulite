import { Query } from "../../query";

export class CreateTableQuery implements Query {
  #table: string;
  #columns: CreateTableColumn[] = [];
  #ifNotExists?: boolean;

  constructor(table: string) {
    this.#table = table;
  }

  column(column: CreateTableColumn): this {
    this.#columns.push(column);
    return this;
  }

  ifNotExists(): this {
    this.#ifNotExists = true;
    return this;
  }

  sql(): string {
    let query = "CREATE TABLE";
    query += this.#ifNotExists ? " IF NOT EXISTS" : "";
    query += ` ${this.#table}`;
    query += ` (${this._getSqlColumns})`;
    return query;
  }

  private get _getSqlColumns(): string {
    return this.#columns
      .map(column => {
        let str = `${column.name} ${column.type}`;
        str += column.notNull ? " NOT NULL" : "";
        return str;
      })
      .join(", ");
  }
}

export function createTable(table: string): CreateTableQuery {
  return new CreateTableQuery(table);
}

export interface CreateTableColumn {
  name: string;
  type: CreateTableColumnType;
  notNull?: boolean;
}

export type CreateTableColumnType = "TEXT" | "INTEGER";
