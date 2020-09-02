import { Session } from "../index";
import { createTable } from "./queries/create-table/create-table";
import { insertInto } from "./queries/insert/insert";
import { selectFrom } from "./queries/select/select";

describe("session", () => {
  let session: Session;

  beforeEach(async done => {
    session = await Session.inMemory();
    done();
  });

  describe("using callback query functions", () => {
    beforeEach(() => {
      session.createTable(table => table("TABLE_ONE")
        .ifNotExists()
        .column({ name: "COLUMN_ONE", type: "TEXT" })
        .column({ name: "COLUMN_TWO", type: "INTEGER" })
      );

      session.createTable(table => table("TABLE_TWO")
        .ifNotExists()
        .column({ name: "HELLO", type: "TEXT" })
        .column({ name: "HI", type: "INTEGER" })
      );
    });

    it("should create tables", async done => {
      const tables = await session.getTables();

      expect(tables.length).toBe(2);
      expect(tables[0]).toBe("TABLE_ONE");
      expect(tables[1]).toBe("TABLE_TWO");
      done();
    });

    describe("insert and select rows", () => {
      beforeEach(() => {
        session.insert(into => into("TABLE_ONE")
          .value({ column: "COLUMN_ONE", value: 1 })
          .value({ column: "COLUMN_TWO", value: 2 })
        );

        session.insert(into => into("TABLE_ONE")
          .value({ column: "COLUMN_ONE", value: 3 })
          .value({ column: "COLUMN_TWO", value: 4 })
        );

        session.insert(into => into("TABLE_ONE")
          .value({ column: "COLUMN_ONE", value: 5 })
          .value({ column: "COLUMN_TWO", value: 6 })
        );
      });

      it("should select all rows", async done => {
        const result = await session.select(from => from("TABLE_ONE"));

        expect(result.length).toEqual(3);
        expect(result[0]).toEqual({ COLUMN_ONE: "1", COLUMN_TWO: 2 });
        expect(result[1]).toEqual({ COLUMN_ONE: "3", COLUMN_TWO: 4 });
        expect(result[2]).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
        done();
      });

      it("should select all rows with where on integer column", async done => {
        const result = await session.select(from => from("TABLE_ONE")
          .where({ column: "COLUMN_TWO", value: 2, operator: ">", type: "AND" })
        );

        expect(result.length).toEqual(2);
        expect(result[0]).toEqual({ COLUMN_ONE: "3", COLUMN_TWO: 4 });
        expect(result[1]).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
        done();
      });

      it("should select all rows with where on text column(s)", async done => {
        const result = await session.select(from => from("TABLE_ONE")
          .where({ column: "COLUMN_ONE", value: "3", type: "AND" })
          .where({ column: "COLUMN_ONE", value: ["3", "5"], type: "OR" })
        );

        expect(result.length).toEqual(2);
        expect(result[0]).toEqual({ COLUMN_ONE: "3", COLUMN_TWO: 4 });
        done();
      });

      it("should order by ascending and select one row", async done => {
        const result = await session.selectSingle(from => from("TABLE_ONE")
          .order("COLUMN_TWO", "ASC")
        );

        expect(result).toEqual({ COLUMN_ONE: "1", COLUMN_TWO: 2 });
        done();
      });

      it("should order by descending and select one row", async done => {
        const result = await session.selectSingle(from => from("TABLE_ONE")
          .order("COLUMN_TWO", "DESC")
        );

        expect(result).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
        done();
      });

      it("should limit results", async done => {
        const result = await session.select(from => from("TABLE_ONE")
          .limit(2)
        );

        expect(result.length).toBe(2);
        done();
      });

      describe("delete rows", () => {
        beforeEach(() => {
          session.delete(from => from("TABLE_ONE")
            .where({ column: "COLUMN_ONE", type: "AND", value: "3" })
          );
        });

        it("should have delete row", async done => {
          const result = await session.select(from => from("TABLE_ONE"));

          expect(result.length).toEqual(2);
          expect(result[0]).toEqual({ COLUMN_ONE: "1", COLUMN_TWO: 2 });
          expect(result[1]).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
          done();
        });

        describe("drop table", () => {
          beforeEach(() => {
            session.dropTable(table => table("TABLE_TWO"));
          });

          it("should drop table", async done => {
            const tables = await session.getTables();

            expect(tables.length).toBe(1);
            expect(tables[0]).toBe("TABLE_ONE");
            done();
          });

          describe("attach connection", () => {
            let attached: Session;

            beforeEach(done => {
              attached = new Session(session.db);
              done();
            });

            it("should create new instance of Session with an existing db connection", async done => {
              const tables = await attached.getTables();

              expect(tables.length).toBe(1);
              expect(tables[0]).toBe("TABLE_ONE");
              done();
            });
          });
        });
      });
    });
  });

  describe("directly using query functions", () => {
    beforeEach(() => {
      session.run(createTable("TABLE_ONE")
        .ifNotExists()
        .column({ name: "COLUMN_ONE", type: "TEXT" })
        .column({ name: "COLUMN_TWO", type: "INTEGER" }));
    });

    it("should create a table", async done => {
      const tables = await session.getTables();

      expect(tables.length).toBe(1);
      done();
    });

    describe("insert and select rows", () => {
      beforeEach(() => {
        session.run(insertInto("TABLE_ONE")
          .value({ column: "COLUMN_ONE", value: "hello" }));
      });

      it("should select row", async done => {
        const result = await session.get(selectFrom("TABLE_ONE"));

        expect(result).toEqual({ COLUMN_ONE: "hello", COLUMN_TWO: null })
        done();
      });
    });
  });
});
