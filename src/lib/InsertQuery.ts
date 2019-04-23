import { Sqlable } from "./Sqlable";

export class InsertQuery implements Sqlable {
	public getSql(): string {
		return "";
	}

}
