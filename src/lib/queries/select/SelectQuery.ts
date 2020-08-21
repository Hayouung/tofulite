import { OrderBy } from "../../interfaces/OrderBy";
import { ParameterisedSqlable, Value } from "../../interfaces/ParameterisedSqlable";
import { SelectWhere } from "../../interfaces/SelectWhere";
import { getWheres } from "../../QueryUtils";

export class SelectQuery implements ParameterisedSqlable {
  public columnNames: string[];
  public wheres: SelectWhere[];
  public orderBy?: OrderBy;
  public limit?: number;

  constructor(public tableName: string, public star?: boolean) {
    this.columnNames = [];
    this.wheres = [];
  }

  public selectColumn(columnName: string): SelectQuery {
    this.columnNames.push(columnName);
    return this;
  }

  public selectColumns(columnNames: string[]): SelectQuery {
    columnNames.forEach(columnName => this.selectColumn(columnName));
    return this;
  }

  public addWhere(where: SelectWhere): SelectQuery {
    this.wheres.push(where);
    return this;
  }

  public addWheres(wheres: SelectWhere[]): SelectQuery {
    wheres.forEach(where => this.addWhere(where));
    return this;
  }

  public setOrder(columnName: string, desc?: boolean): SelectQuery {
    this.orderBy = { columnName, desc };
    return this;
  }

  public setLimit(limit: number): SelectQuery {
    this.limit = limit;
    return this;
  }

  public getSql(): string {
    let query = `SELECT ${this.getSqlColumnsNames()} FROM ${this.tableName}`;
    query += getWheres(this.wheres);
    query += this.getSqlOrderBy();
    query += this.getSqlLimit();
    return query;
  }

  public getValues(): Value[] {
    return this.wheres.map(where => where.value).reduce((acc: any[], curr) => acc.concat(curr), []);
  }

  private getSqlColumnsNames(): string {
    if (this.star || this.columnNames.length === 0) {
      return "*";
    }

    return this.columnNames.join(", ");
  }

  private getSqlOrderBy(): string {
    if (!this.orderBy) {
      return "";
    }

    let str = ` ORDER BY ${this.orderBy.columnName}`;
    str += this.orderBy.desc ? " DESC" : " ASC";
    return str;
  }

  private getSqlLimit(): string {
    if (!this.limit) {
      return "";
    }

    if (this.limit < 0) {
      throw new Error("Cannot have limit less than 0");
    }

    return ` LIMIT ${this.limit}`;
  }
}
