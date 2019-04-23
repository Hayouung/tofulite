import { Column } from "./Column";
import { Sqlable } from "./Sqlable";

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
		let str = "";

		this.columns.forEach((column, index) => {
			str += column.name;
			str += ` ${column.type}`;
			str += column.nullable ? "" : " NOT NULL";

			if (index !== this.columns.length - 1) {
				str += ", ";
			}
		});

		return str;
	}
}
