import { Database } from "sqlite3";
import { ParameterisedSqlable } from "./interfaces/ParameterisedSqlable";
import { CreateTableQuery } from "./queries/CreateTableQuery";
import { DeleteQuery } from "./queries/DeleteQuery";
import { DropTableQuery } from "./queries/DropTableQuery";
import { InsertQuery } from "./queries/InsertQuery";
import { SelectQuery } from "./queries/SelectQuery";

export class Session {
	public readonly db: Database;

	private constructor(filename: string | Database, verbose?: boolean) {
		if (filename instanceof Database) {
			this.db = filename;
			if (verbose) console.log("Attached existing sqlite db connection");
		} else {
			this.db = new Database(filename || "", err => {
				if (err) throw err;
				if (verbose) {
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
				}
			});
		}
	}

	public static attachConnection(connection: Database, verbose?: boolean): Session {
		return new this(connection, verbose);
	}

	public static inMemory(verbose?: boolean): Session {
		return new this(":memory:", verbose);
	}

	public static anonymous(verbose?: boolean): Session {
		return new this("", verbose);
	}

	public static fromFile(fileName: string, verbose?: boolean): Session {
		return new this(fileName, verbose);
	}

	public getTables(): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				this.db.all(`SELECT * FROM sqlite_master WHERE type = "table"`, [], (err, tables) => {
					if (err) reject(err);
					resolve(tables.map(table => table.name));
				});
			});
		});
	}

	public createTable(createTableQuery: CreateTableQuery): void {
		this.db.serialize(() => {
			this.db.run(createTableQuery.getSql());
		});
	}

	public dropTable(dropTableQuery: DropTableQuery): void {
		this.db.serialize(() => {
			this.db.run(dropTableQuery.getSql());
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

	public delete(deleteQuery: DeleteQuery): void {
		return this.runPreparedStatement(deleteQuery);
	}

	public closeConnection(): void {
		this.db.close();
	}

	private runPreparedStatement(parameterisedSqlable: ParameterisedSqlable): void {
		this.db.serialize(() => {
			this.db.prepare(parameterisedSqlable.getSql())
				.run(parameterisedSqlable.getValues())
				.finalize();
		});
	}

	private allPreparedStatement(parameterisedSqlable: ParameterisedSqlable): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				this.db.prepare(parameterisedSqlable.getSql())
					.all(parameterisedSqlable.getValues(), (err, rows) => {
						if (err) reject(err);
						resolve(rows);
					})
					.finalize();
			});
		});
	}

	private getPreparedStatement(parameterisedSqlable: ParameterisedSqlable): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.serialize(() => {
				this.db.prepare(parameterisedSqlable.getSql())
					.get(parameterisedSqlable.getValues(), (err, row) => {
						if (err) reject(err);
						resolve(row);
					})
					.finalize();
			});
		});
	}
}
