import { CreateTableQuery } from "../lib/CreateTableQuery";
import { InsertQuery } from "../lib/InsertQuery";
import { SelectQuery } from "../lib/SelectQuery";
import { Session } from "../lib/Session";

describe("#Session", () => {
	let session: Session;

	beforeEach(done => {
		session = new Session("./test.db");
		done();
	});

	it("should work", done => {
		const ctq = new CreateTableQuery("TABLE_NAME", true);
		ctq.addColumns([
			{ name: "COLUMN_ONE", type: "TEXT", nullable: false },
			{ name: "COLUMN_TWO", type: "TEXT", nullable: false }
		]);

		session.createTable(ctq);

		const iq = new InsertQuery();

		session.insert(iq);

		const sq = new SelectQuery("TABLE_NAME");

		const result = session.select(sq);

		result.then(a => {
			expect(a[0]).toEqual({ COLUMN_ONE: "1", COLUMN_TWO: "2" });
			done();
		});
	});
});
