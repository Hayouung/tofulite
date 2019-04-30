import { SelectQuery } from "../lib/SelectQuery";

describe("#SelectQuery", () => {
	describe("without star specified", () => {
		let sq: SelectQuery;

		beforeEach(() => {
			sq = new SelectQuery("TABLE_NAME");
		});

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

	describe("with star specified", () => {
		let sq: SelectQuery;

		beforeEach(() => {
			sq = new SelectQuery("TABLE_NAME", true);
		});

		it("should get sql for select statement with * even if specified with select columns", () => {
			sq.selectColumn("COLUMN_ONE");
			expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME");
		});
	});
});
