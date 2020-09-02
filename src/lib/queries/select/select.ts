import { ParameterisedQuery, Parameter } from "../../query";
import { Where } from "../../where";
import { getWheres } from "../../utils";

export class SelectQuery implements ParameterisedQuery {
  #table: string;
  #columns: string[] = [];
  #wheres: Where[] = [];
  #orderBy?: OrderBy;
  #limit?: number;

  constructor(table: string) {
    this.#table = table;
  }

  column(column: string): SelectQuery {
    this.#columns.push(column);
    return this;
  }

  where(where: Where): SelectQuery {
    this.#wheres.push(where);
    return this;
  }

  order(column: string, order: Order): SelectQuery {
    this.#orderBy = { column, order };
    return this;
  }

  limit(amount: number): SelectQuery {
    this.#limit = amount;
    return this;
  }

  sql(): string {
    let query = `SELECT ${this._getSqlColumns} FROM ${this.#table}`;
    query += getWheres(this.#wheres);
    query += this._getSqlOrderBy;
    query += this._getSqlLimit;
    return query;
  }

  parameters(): Parameter[] {
    return this.#wheres.map(where => where.value).reduce((acc: any[], curr) => acc.concat(curr), []);
  }

  private get _getSqlColumns(): string {
    if (this.#columns.length === 0) {
      return "*";
    }

    return this.#columns.join(", ");
  }

  private get _getSqlOrderBy(): string {
    if (!this.#orderBy) {
      return "";
    }

    return ` ORDER BY ${this.#orderBy.column} ${this.#orderBy.order}`;
  }

  private get _getSqlLimit(): string {
    if (!this.#limit) {
      return "";
    }

    return ` LIMIT ${this.#limit}`;
  }
}

export function selectFrom(table: string) {
  return new SelectQuery(table);
}

export interface OrderBy {
  column: string;
  order: Order;
}

export type Order = "ASC" | "DESC";
