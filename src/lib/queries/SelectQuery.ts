import { OrderBy } from "../interfaces/OrderBy";
import { ParameterisedSqlable } from "../interfaces/ParameterisedSqlable";
import { SelectWhere } from "../interfaces/SelectWhere";

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
		query += this.getSqlWheres();
		query += this.getSqlOrderBy();
		query += this.getSqlLimit();
		return query;
	}

	public getValues(): string[] {
		const values = this.wheres.map(where => where.value);
		return values.reduce((acc: any[], curr) => acc.concat(curr), []);
	}

	private getSqlColumnsNames(): string {
		if (this.star || this.columnNames.length === 0) {
			return "*";
		}

		return this.columnNames.join(", ");
	}

	private getSqlWheres(): string {
		if (this.wheres.length === 0) {
			return "";
		}

		this.wheres.sort((a, b) => a.type === "AND" && b.type === "OR" ? -1 : 1);

		let str = " WHERE ";

		this.wheres.forEach((where, index) => {
			str += index === 0 ? "" : ` ${where.type} `;

			if (where.value instanceof Array) {
				str += `${where.columnName} IN (${this.getQuestionMarks(where.value)})`;
			} else {
				str += `${where.columnName} ${where.operator || "="} ?`;
			}
		});

		return str;
	}

	private getSqlOrderBy(): string {
		if (!this.orderBy) {
			return "";
		}

		let str = ` ORDER BY ${this.orderBy.columnName}`;
		str += this.orderBy.desc ? " DESC" : " ASC";
		return str;
	}

	private getQuestionMarks(value: any[]): string {
		return value.map(v => "?").join(", ");
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
