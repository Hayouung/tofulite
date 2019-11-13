import { Column } from "../interfaces/Column";
import { Sqlable } from "../interfaces/Sqlable";

export class CreateTableQuery implements Sqlable {
  public columns: Column[];

  constructor(public name: string, public ifNotExists?: boolean) {
    this.columns = [];
  }

  public addColumn(column: Column): CreateTableQuery {
    this.columns.push(column);
    return this;
  }

  public addColumns(columns: Column[]): CreateTableQuery {
    columns.forEach(column => this.columns.push(column));
    return this;
  }

  public getSql(): string {
    let query = "CREATE TABLE";
    query += this.ifNotExists ? " IF NOT EXISTS" : "";
    query += ` ${this.name}`;
    query += ` (${this.getSqlColumns()})`;
    return query;
  }

  private getSqlColumns(): string {
    return this.columns
      .map(column => {
        let str = `${column.name} ${column.type}`;
        str += column.notNull ? " NOT NULL" : "";
        return str;
      })
      .join(", ");
  }
}
