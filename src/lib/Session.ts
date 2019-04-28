import * as sqlite3 from "sqlite3";
import { CreateTableQuery } from "./CreateTableQuery";
import { InsertQuery } from "./InsertQuery";
import { ParameterisedSqlable } from "./ParameterisedSqlable";
import { SelectQuery } from "./SelectQuery";

sqlite3.verbose();

export class Session {
	private db: sqlite3.Database;

	constructor(filename: string) {
		this.db = new sqlite3.Database(filename || "", err => {
			if (err) throw err;

			switch (filename) {
				case ":memory:":
					console.log("Connected to in-memory database.");
					break;
				case "":
					console.log("Connected to temp database on disk.");
					break;
				default:
					console.log(`Connected to database ${filename}`);
					break;
			}
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
		return this.allPreparedStatement(selectQuery);
	}

	public selectSingle(selectQuery: SelectQuery): Promise<any> {
		return this.getPreparedStatement(selectQuery);
	}

	private runPreparedStatement(parameterisedSqlable: ParameterisedSqlable): void {
		this.db.serialize(() => {
			const stmt = this.db.prepare(parameterisedSqlable.getSql());

			stmt.run(parameterisedSqlable.getValues());
			stmt.finalize();
		});
	}

	private allPreparedStatement(parameterisedSqlable: ParameterisedSqlable): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				const stmt = this.db.prepare(parameterisedSqlable.getSql());

				stmt.all(parameterisedSqlable.getValues(), (err, rows) => {
					if (err) reject(err);
					resolve(rows);
				});
				stmt.finalize();
			});
		});
	}

	private getPreparedStatement(parameterisedSqlable: ParameterisedSqlable): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				const stmt = this.db.prepare(parameterisedSqlable.getSql());

				stmt.get(parameterisedSqlable.getValues(), (err, row) => {
					if (err) reject(err);
					resolve(row);
				});
				stmt.finalize();
			});
		});
	}
}
