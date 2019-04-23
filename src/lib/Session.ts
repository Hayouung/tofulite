import * as sqlite3 from "sqlite3";
import { Column } from "./Column";
import { CreateTableQuery } from "./CreateTableQuery";

sqlite3.verbose();

export class Session {
	private db: sqlite3.Database;

	constructor(filename: string) {
		this.db = new sqlite3.Database(filename, err => {
			if (err) console.error(err.message);
			console.log("Database connected.");
		});
	}

	public createTable(createTableQuery: CreateTableQuery): void {
		this.db.serialize(() => {
			this.db.run(createTableQuery.getSql());
		});
	}

	private prepareStatement(): string {
		return "";
	}
}
