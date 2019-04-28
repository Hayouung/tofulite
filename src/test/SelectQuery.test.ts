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

		it("should get sql with where conditions and parameter values", () => {
			sq.addWheres([
				{ columnName: "COLUMN_ONE", value: [1, 2, 3] },
				{ columnName: "COLUMN_TWO", value: 4 },
				{ columnName: "COLUMN_THREE", value: [5, 6] },
				{ columnName: "COLUMN_FOUR", value: 7, operator: ">" }
			]);
			expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME WHERE COLUMN_ONE IN (?, ?, ?), COLUMN_TWO = ?, COLUMN_THREE IN (?, ?), COLUMN_FOUR > ?");
			expect(sq.getValues()).toEqual([1, 2, 3, 4, 5, 6, 7]);
		});
	});

	describe("with star specified", () => {
		let sq: SelectQuery;

		beforeEach(() => {
			sq = new SelectQuery("TABLE_NAME", true);
		});

		it("should get sql for select statement with * if specified with select columns", () => {
			sq.selectColumn("COLUMN_ONE");
			expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME");
		});
	});
});
