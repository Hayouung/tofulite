import { InsertValue } from "../interfaces/InsertValue";
import { ParameterisedSqlable } from "../interfaces/ParameterisedSqlable";

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
		return `INSERT INTO ${this.tableName} (${this.getSqlColumns()}) VALUES (${this.getQuestionMarks()})`;
	}

	public getValues(): string[] {
		return this.insertValues.map(v => v.value) as string[];
	}

	private getSqlColumns(): string {
		return this.insertValues.map(v => v.columnName).join(", ");
	}

	private getQuestionMarks(): string {
		return this.insertValues.map(v => "?").join(", ");
	}
}
