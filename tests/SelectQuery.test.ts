import { SelectQuery } from "../src/lib/queries/SelectQuery";

describe("#SelectQuery", () => {
	let sq: SelectQuery;

	beforeEach(() => {
		sq = new SelectQuery("TABLE_NAME");
	});

	it("should get sql for select statement with * if specified even with select columns", () => {
		sq.star = true;
		sq.selectColumn("COLUMN_ONE");
		expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME");
	});

	describe("basic select query", () => {
		it("should get sql for select statement with * by default", () => {
			expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME");
		});

		it("should get sql for select statement with a column", () => {
			sq.selectColumn("COLUMN_ONE");
			expect(sq.getSql()).toBe("SELECT COLUMN_ONE FROM TABLE_NAME");
		});

		it("should get sql for select statement with multiple columns", () => {
			sq.selectColumns(["COLUMN_ONE", "COLUMN_TWO", "COLUMN_THREE"]);
			expect(sq.getSql()).toBe("SELECT COLUMN_ONE, COLUMN_TWO, COLUMN_THREE FROM TABLE_NAME");
		});
	});

	describe("select query with where", () => {
		it("should get sql with where conditions and parameter values and put ANDs and ORs correctly", () => {
			sq.addWheres([
				{ columnName: "COLUMN_ONE", value: [1, 2, 3], type: "AND" },
				{ columnName: "COLUMN_TWO",  value: 4, type: "AND" },
				{ columnName: "COLUMN_THREE", value: [5, 6], type: "OR" },
				{ columnName: "COLUMN_FOUR", value: 7, type: "AND", operator: ">" }
			]);
			expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME WHERE COLUMN_ONE IN (?, ?, ?) AND COLUMN_TWO = ? AND COLUMN_FOUR > ? OR COLUMN_THREE IN (?, ?)");
			expect(sq.getValues()).toEqual([1, 2, 3, 4, 7, 5, 6]);
		});
	});

	describe("select query with order by", () => {
		it("should order by column ascending if not specified", () => {
			sq.setOrder("COLUMN_ONE");
			expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME ORDER BY COLUMN_ONE ASC");
		});

		it("should order by column descending", () => {
			sq.setOrder("COLUMN_ONE", true);
			expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME ORDER BY COLUMN_ONE DESC");
		});
	});

	describe("select query with limit", () => {
		it("should limit by value", () => {
			sq.setLimit(5);
			expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME LIMIT 5");
		});

		it("should not allow limit less than 0", () => {
			sq.setLimit(-1);
			expect(() => sq.getSql()).toThrow();
		});
	});
});
