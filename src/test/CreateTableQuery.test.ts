import { CreateTableQuery } from "../lib/CreateTableQuery";

describe("#CreateTableQuery", () => {
	describe("without if not exists flag", () => {
		let ctq: CreateTableQuery;

		beforeEach(() => {
			ctq = new CreateTableQuery("TABLE_NAME");
		});

		it("should get sql for create table query", () => {
			ctq.addColumn({ name: "COLUMN_NAME", type: "TEXT", nullable: false });
			expect(ctq.getSql()).toBe("CREATE TABLE TABLE_NAME (COLUMN_NAME TEXT NOT NULL)");
		});

		it("should get sql for create table query with multiple columns", () => {
			ctq
				.addColumn({ name: "COLUMN_ONE", type: "TEXT", nullable: false })
				.addColumn({ name: "COLUMN_TWO", type: "INTEGER", nullable: true })
				.addColumn({ name: "COLUMN_THREE", type: "TEXT", nullable: true });

			expect(ctq.getSql()).toBe("CREATE TABLE TABLE_NAME (COLUMN_ONE TEXT NOT NULL, COLUMN_TWO INTEGER, COLUMN_THREE TEXT)");
		});
	});

	describe("with if not exists flag", () => {
		let ctqIfExists: CreateTableQuery;

		beforeEach(() => {
			ctqIfExists = new CreateTableQuery("TABLE_NAME", true);
		});

		it("should get sql for create table query with if not exists flag as true", () => {
			ctqIfExists.addColumn({ name: "COLUMN_NAME", type: "TEXT", nullable: false });
			expect(ctqIfExists.getSql()).toBe("CREATE TABLE IF NOT EXISTS TABLE_NAME (COLUMN_NAME TEXT NOT NULL)");
		});
	});
});
