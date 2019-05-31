import { DropTableQuery } from "../src/lib/queries/DropTableQuery";

describe("#DropTableQuery", () => {
	let dtq: DropTableQuery;

	beforeEach(() => {
		dtq = new DropTableQuery("TABLE_NAME");
	});

	it("should get sql for delete query", () => {
		expect(dtq.getSql()).toBe("DROP TABLE TABLE_NAME");
	});
});
