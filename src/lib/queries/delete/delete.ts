import { ParameterisedQuery } from "../../query";
import { Where } from "../../where";
import { getWheres } from "../../utils";

export class DeleteQuery implements ParameterisedQuery {
  #wheres: Where[] = [];
  #table: string;

  constructor(table: string) {
    this.#table = table;
  }

  where(where: Where): this {
    this.#wheres.push(where);
    return this;
  }

  sql(): string {
    let str = `DELETE FROM ${this.#table}`;
    str += getWheres(this.#wheres);
    return str;
  }

  parameters(): string[] {
    return this.#wheres.map(v => v.value) as string[];
  }
}

export function deleteFrom(table: string) {
  return new DeleteQuery(table);
}
