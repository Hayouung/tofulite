import { ParameterisedSqlable } from "./ParameterisedSqlable";
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

	public addWheres(wheres: SelectWhere[]): SelectQuery {
		wheres.forEach(where => this.wheres.push(where));
		return this;
	}

	public getSql(): string {
		let query = "SELECT";
		query += ` ${this.getSqlColumnsNames()} FROM ${this.tableName}`;
		query += this.wheres.length > 0 ? this.getSqlWheres() : "";
		return query;
	}

	public getValues(): string {
		const values = this.wheres.map(where => where.value);
		return values.reduce((acc: any[], curr) => acc.concat(curr), []).join(", ");
		// const values: ParameterValue[] = [];
		// this.wheres.forEach(where => {
		// 	if (where.value instanceof Array) {
		// 		where.value.forEach((w: string | number) => values.push(w));
		// 	} else {
		// 		values.push(where.value);
		// 	}
		// });
		// return values;
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
		let str = " WHERE";

		this.wheres.forEach((column, index) => {
			str += ` ${column.columnName}`;

			if (column.value instanceof Array) {
				str += ` IN (${this.getQuestionMarks(column.value)})`;
			} else {
				str += ` ${column.operator || "="} ?`;
			}

			if (index !== this.wheres.length - 1) {
				str += ",";
			}
		});

		return str;
	}

	private getQuestionMarks(value: any[]): string {
		return value.map(v => "?").join(", ");
	}
}
