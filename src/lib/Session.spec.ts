import {
  CreateTableQuery,
  DeleteQuery,
  DropTableQuery,
  InsertQuery,
  SelectQuery,
  Session
} from "../index";

describe("#Session", () => {
  let session: Session;

  beforeEach(done => {
    session = Session.inMemory();
    done();
  });

  describe("create tables", () => {
    beforeEach(() => {
      session.createTable(
        new CreateTableQuery("TABLE_ONE", true).addColumns([
          { name: "COLUMN_ONE", type: "TEXT" },
          { name: "COLUMN_TWO", type: "INTEGER" }
        ])
      );

      session.createTable(
        new CreateTableQuery("TABLE_TWO", true).addColumns([
          { name: "HELLO", type: "TEXT" },
          { name: "HI", type: "INTEGER" }
        ])
      );
    });

    it("should create tables", done => {
      session.getTables().then(tables => {
        expect(tables.length).toBe(2);
        expect(tables[0]).toBe("TABLE_ONE");
        expect(tables[1]).toBe("TABLE_TWO");
        done();
      });
    });

    describe("insert and select rows", () => {
      beforeEach(() => {
        session.insert(
          new InsertQuery("TABLE_ONE").setValues([
            { columnName: "COLUMN_ONE", value: 1 },
            { columnName: "COLUMN_TWO", value: 2 }
          ])
        );

        session.insert(
          new InsertQuery("TABLE_ONE").setValues([
            { columnName: "COLUMN_ONE", value: 3 },
            { columnName: "COLUMN_TWO", value: 4 }
          ])
        );

        session.insert(
          new InsertQuery("TABLE_ONE").setValues([
            { columnName: "COLUMN_ONE", value: 5 },
            { columnName: "COLUMN_TWO", value: 6 }
          ])
        );
      });

      it("should select all rows", done => {
        const sq = new SelectQuery("TABLE_ONE");

        session.select(sq).then(a => {
          expect(a.length).toEqual(3);
          expect(a[0]).toEqual({ COLUMN_ONE: "1", COLUMN_TWO: 2 });
          expect(a[1]).toEqual({ COLUMN_ONE: "3", COLUMN_TWO: 4 });
          expect(a[2]).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
          done();
        });
      });

      it("should select all rows with where on integer column", done => {
        const sq = new SelectQuery("TABLE_ONE");
        sq.addWhere({ columnName: "COLUMN_TWO", value: 2, operator: ">", type: "AND" });

        session.select(sq).then(a => {
          expect(a.length).toEqual(2);
          expect(a[0]).toEqual({ COLUMN_ONE: "3", COLUMN_TWO: 4 });
          expect(a[1]).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
          done();
        });
      });

      it("should select all rows with where on text column(s)", done => {
        const sq = new SelectQuery("TABLE_ONE");
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

      it("should order by ascending by default and select one row", done => {
        const sq = new SelectQuery("TABLE_ONE");
        sq.setOrder("COLUMN_TWO");

        session.selectSingle(sq).then(a => {
          expect(a).toEqual({ COLUMN_ONE: "1", COLUMN_TWO: 2 });
          done();
        });
      });

      it("should order by descending and select one row", done => {
        const sq = new SelectQuery("TABLE_ONE");
        sq.setOrder("COLUMN_TWO", true);

        session.selectSingle(sq).then(a => {
          expect(a).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
          done();
        });
      });

      it("should limit results", done => {
        session.select(new SelectQuery("TABLE_ONE").setLimit(2)).then(a => {
          expect(a.length).toBe(2);
          done();
        });
      });

      describe("delete rows", () => {
        beforeEach(() => {
          session.delete(
            new DeleteQuery("TABLE_ONE").addWheres([
              { columnName: "COLUMN_ONE", type: "AND", value: "3" }
            ])
          );
        });

        it("should have delete row", done => {
          const sq = new SelectQuery("TABLE_ONE");

          session.select(sq).then(a => {
            expect(a.length).toEqual(2);
            expect(a[0]).toEqual({ COLUMN_ONE: "1", COLUMN_TWO: 2 });
            expect(a[1]).toEqual({ COLUMN_ONE: "5", COLUMN_TWO: 6 });
            done();
          });
        });

        describe("drop table", () => {
          beforeEach(() => {
            session.dropTable(new DropTableQuery("TABLE_TWO"));
          });

          it("should drop table", done => {
            session.getTables().then(tables => {
              expect(tables.length).toBe(1);
              expect(tables[0]).toBe("TABLE_ONE");
              done();
            });
          });

          describe("attach connection", () => {
            let attached: Session;

            beforeEach(done => {
              attached = new Session(session.db);
              done();
            });

            it("should create new instance of Session with an existing db connection", done => {
              attached.getTables().then(tables => {
                expect(tables.length).toBe(1);
                expect(tables[0]).toBe("TABLE_ONE");
                done();
              });
            });
          });
        });
      });
    });
  });
});
