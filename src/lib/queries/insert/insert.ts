import { ParameterisedQuery, Parameter } from "../../query";
import { getQuestionMarks } from "../../utils";

export class InsertQuery implements ParameterisedQuery {
  #values: InsertValue[] = [];
  #table: string;

  constructor(table: string) {
    this.#table = table;
  }

  value(value: InsertValue): InsertQuery {
    this.#values.push(value);
    return this;
  }

  sql(): string {
    return `INSERT INTO ${this.#table} (${this._getSqlColumns}) VALUES (${getQuestionMarks(this.#values)})`;
  }

  parameters(): Parameter[] {
    return this.#values.map(v => v.value);
  }

  private get _getSqlColumns(): string {
    return this.#values.map(v => v.column).join(", ");
  }
}

export function insertInto(table: string): InsertQuery {
  return new InsertQuery(table);
}

export interface InsertValue {
  column: string;
  value: string | number;
}
