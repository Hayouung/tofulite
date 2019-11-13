import { InsertValue } from "../interfaces/InsertValue";
import { ParameterisedSqlable, Value } from "../interfaces/ParameterisedSqlable";
import { getQuestionMarks } from "../QueryUtils";

export class InsertQuery implements ParameterisedSqlable {
  public insertValues: InsertValue[];

  constructor(public tableName: string) {
    this.insertValues = [];
  }

  public setValues(insertValues: InsertValue[]): InsertQuery {
    insertValues.forEach(insertValue => this.insertValues.push(insertValue));
    return this;
  }

  public getSql(): string {
    return `INSERT INTO ${this.tableName} (${this.getSqlColumns()}) VALUES (${getQuestionMarks(
      this.insertValues
    )})`;
  }

  public getValues(): Value[] {
    return this.insertValues.map(v => v.value) as Value[];
  }

  private getSqlColumns(): string {
    return this.insertValues.map(v => v.columnName).join(", ");
  }
}
