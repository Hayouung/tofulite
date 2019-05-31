import { Sqlable } from "../interfaces/Sqlable";

export class DropTableQuery implements Sqlable {
	constructor(public tableName: string) {
	}

	public getSql(): string {
		return `DROP TABLE ${this.tableName}`;
	}
}
