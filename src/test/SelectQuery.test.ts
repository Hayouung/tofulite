import { SelectQuery } from "../lib/SelectQuery";

describe("#SelectQuery", () => {
	let sq: SelectQuery;

	beforeEach(() => {
		sq = new SelectQuery("TABLE_NAME");
	});

	it("should do wheres", () => {
		sq.addWheres([
			{ columnName: "COLUMN_ONE", value: [1, 2, 3] },
			{ columnName: "COLUMN_TWO", value: 1 },
			{ columnName: "COLUMN_THREE", value: [4, 5] },
			{ columnName: "COLUMN_FOUR", value: 6, operator: ">" }
		]);
		expect(sq.getSql()).toBe("SELECT * FROM TABLE_NAME WHERE COLUMN_ONE IN (?, ?, ?), COLUMN_TWO = ?, COLUMN_THREE IN (?, ?), COLUMN_FOUR > ?");
		expect(sq.getValues()).toBe("1, 2, 3, 1, 4, 5, 6");
	});
});
