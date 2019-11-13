import { ParameterisedSqlable } from "../interfaces/ParameterisedSqlable";
import { SelectWhere } from "../interfaces/SelectWhere";
import { getWheres } from "../QueryUtils";

export class DeleteQuery implements ParameterisedSqlable {
  public wheres: SelectWhere[];

  constructor(public tableName: string) {
    this.wheres = [];
  }

  public addWhere(where: SelectWhere): this {
    this.wheres.push(where);
    return this;
  }

  public addWheres(wheres: SelectWhere[]): this {
    wheres.forEach(where => this.addWhere(where));
    return this;
  }

  public getSql(): string {
    let str = `DELETE FROM ${this.tableName}`;
    str += getWheres(this.wheres);
    return str;
  }

  public getValues(): string[] {
    return this.wheres.map(v => v.value) as string[];
  }
}
