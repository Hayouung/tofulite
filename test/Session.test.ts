import { CreateTableQuery } from "../src/lib/CreateTableQuery";
import { InsertQuery } from "../src/lib/InsertQuery";
import { SelectQuery } from "../src/lib/SelectQuery";
import { Session } from "../src/lib/Session";

describe("#Session", () => {
	let session: Session;

	beforeEach(done => {
		session = setupTestData();
		done();
	});

	it("should select all rows", done => {
		const sq = new SelectQuery("TABLE_NAME");

		session.select(sq).then(a => {
			expect(a.length).toEqual(3);
			expect(a[0]).toEqual({ COLUMN_ONE: "1", COLUMN_TWO: 2 });
			expect(a[1]).toEqual({ COLUMN_ONE: "3", COLUMN_TWO: 4 });
			expect(a[2]).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
			done();
		});
	});

	it("should select all rows with where on integer column", done => {
		const sq = new SelectQuery("TABLE_NAME");
		sq.addWhere({ columnName: "COLUMN_TWO", value: 2, operator: ">", type: "AND" });

		session.select(sq).then(a => {
			expect(a.length).toEqual(2);
			expect(a[0]).toEqual({ COLUMN_ONE: "3", COLUMN_TWO: 4 });
			expect(a[1]).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
			done();
		});
	});

	it("should select all rows with where on text column(s)", done => {
		const sq = new SelectQuery("TABLE_NAME");
		sq.addWheres([
			{ columnName: "COLUMN_ONE", value: "3", type: "AND" },
			{ columnName: "COLUMN_ONE", value: ["3", "5"], type: "OR" }
		]);

		session.select(sq).then(a => {
			expect(a.length).toEqual(2);
			expect(a[0]).toEqual({ COLUMN_ONE: "3", COLUMN_TWO: 4 });
			done();
		});
	});

	it("should order by and select one row", done => {
		const sq = new SelectQuery("TABLE_NAME");
		sq.setOrder("COLUMN_TWO", true);

		session.selectSingle(sq).then(a => {
			expect(a).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
			done();
		});
	});
});

function setupTestData(): Session {
	const session = new Session(":memory:");

	const ctq = new CreateTableQuery("TABLE_NAME", true);
	ctq.addColumns([
		{ name: "COLUMN_ONE", type: "TEXT" },
		{ name: "COLUMN_TWO", type: "INTEGER" }
	]);

	const iq = new InsertQuery("TABLE_NAME");
	iq.setValues([
		{ columnName: "COLUMN_ONE", value: 1 },
		{ columnName: "COLUMN_TWO", value: 2 }
	]);

	const iq2 = new InsertQuery("TABLE_NAME");
	iq2.setValues([
		{ columnName: "COLUMN_ONE", value: 3 },
		{ columnName: "COLUMN_TWO", value: 4 }
	]);

	const iq3 = new InsertQuery("TABLE_NAME");
	iq3.setValues([
		{ columnName: "COLUMN_ONE", value: 5 },
		{ columnName: "COLUMN_TWO", value: 6 }
	]);

	session.createTable(ctq);
	session.insert(iq);
	session.insert(iq2);
	session.insert(iq3);

	return session;
}
