import { ParameterisedSqlable, ParameterValue } from "./ParameterisedSqlable";
import { SelectWhere } from "./SelectWhere";

export class SelectQuery implements ParameterisedSqlable {
	public columnNames: string[];
	public wheres: SelectWhere[];

	constructor(public tableName: string, public star?: boolean) {
		this.columnNames = [];
		this.wheres = [];
	}

	public selectColumn(columnName: string): SelectQuery {
		this.columnNames.push(columnName);
		return this;
	}

	public selectColumns(columnNames: string[]): SelectQuery {
		columnNames.forEach(columnName => this.columnNames.push(columnName));
		return this;
	}

	public addWhere(where: SelectWhere): SelectQuery {
		this.wheres.push(where);
		return this;
	}

	public getSql(): string {
		let query = "SELECT";
		query += ` ${this.getSqlColumnsNames()}`;
		query += this.wheres.length > 0 ? this.getSqlWheres() : "";
		return query;
	}

	public getValues(): ParameterValue[] {
		return this.wheres.map(w => {
			if (w.value instanceof Array) {
				return w.value.flat
			}
			return w.value;
		});
	}

	private getSqlColumnsNames(): string {
		if (this.star || this.columnNames.length === 0) {
			return "*";
		}

		let str = "";

		this.columnNames.forEach((column, index) => {
			str += column;

			if (index !== this.columnNames.length - 1) {
				str += ", ";
			}
		});

		return str;
	}

	private getSqlWheres(): string {
		let str = "";

		this.wheres.forEach((column, index) => {
			str += column;

			if (index !== this.columnNames.length - 1) {
				str += ", ";
			}
		});

		return str;
	}
}
