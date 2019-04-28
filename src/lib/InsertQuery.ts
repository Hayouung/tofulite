import { ParameterisedSqlable } from "./ParameterisedSqlable";

export class InsertQuery implements ParameterisedSqlable {
	public getSql(): string {
		return "INSERT INTO TABLE_NAME (COLUMN_ONE, COLUMN_TWO) VALUES (?, ?)";
	}

	public getValues(): string[] {
		return ["1", "2"];
	}
}
