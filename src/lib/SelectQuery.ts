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
		let query = `SELECT ${this.getSqlColumnsNames()} FROM ${this.tableName}`;
		query += this.wheres.length > 0 ? this.getSqlWheres() : "";
		return query;
	}

	public getValues(): string {
		const values = this.wheres.map(where => where.value);
		return values.reduce((acc: any[], curr) => acc.concat(curr), []).join(", ");
	}

	private getSqlColumnsNames(): string {
		if (this.star || this.columnNames.length === 0) {
			return "*";
		}

		return this.columnNames.join(", ");
	}

	private getSqlWheres(): string {
		return " WHERE " + this.wheres.map(where => {
			if (where.value instanceof Array) {
				return `${where.columnName} IN (${this.getQuestionMarks(where.value)})`;
			} else {
				return `${where.columnName} ${where.operator || "="} ?`;
			}
		}).join(", ");
	}

	private getQuestionMarks(value: any[]): string {
		return value.map(v => "?").join(", ");
	}
}
