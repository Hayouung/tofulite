import { Column } from "./Column";
import { Sqlable } from "./Sqlable";

export class CreateTableQuery implements Sqlable {
	public columns: Column[];

	constructor(public name: string) {
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
		return `CREATE TABLE ${this.name} (${this.getSqlColumns()})`;
	}

	private getSqlColumns(): string {
		let str = "";

		this.columns.forEach((column, index) => {
			str += `${column.name} ${column.type} ${column.nullable ? "NOT NULL" : null}`;

			if (index !== this.columns.length - 1) {
				str += ", ";
			}
		});

		return str;
	}
}
