import * as sqlite3 from "sqlite3";
import { CreateTableQuery } from "./CreateTableQuery";
import { InsertQuery } from "./InsertQuery";
import { ParameterisedSqlable } from "./ParameterisedSqlable";
import { SelectQuery } from "./SelectQuery";

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

	public insert(insertQuery: InsertQuery): void {
		this.runPreparedStatement(insertQuery);
	}

	public select(selectQuery: SelectQuery): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				const stmt = this.db.prepare(selectQuery.getSql());

				stmt.all(selectQuery.getValues(), (err, rows) => {
					if (err) reject(err);
					resolve(rows);
				});
				stmt.finalize();
			});
		});
	}

	private runPreparedStatement(parameterisedSqlable: ParameterisedSqlable): void {
		return this.db.serialize(() => {
			const stmt = this.db.prepare(parameterisedSqlable.getSql());

			stmt.run(parameterisedSqlable.getValues());
			stmt.finalize();
		});
	}
}
