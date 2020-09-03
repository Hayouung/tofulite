import { Query } from "../../query";

export class DropTableQuery implements Query {
  #table: string;

  constructor(table: string) {
    this.#table = table;
  }

  public sql(): string {
    return `DROP TABLE ${this.#table}`;
  }
}

export function dropTable(table: string): DropTableQuery {
  return new DropTableQuery(table);
}
