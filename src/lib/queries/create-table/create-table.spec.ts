import { createTable } from "./create-table";

describe("create table query", () => {
  it("should get sql for create table query", () => {
    const sql = createTable("TABLE_NAME")
      .column({ name: "COLUMN_ONE", type: "TEXT", notNull: true })
      .column({ name: "COLUMN_TWO", type: "INTEGER" })
      .column({ name: "COLUMN_THREE", type: "TEXT" })
      .sql();

    expect(sql)
      .toBe("CREATE TABLE TABLE_NAME (COLUMN_ONE TEXT NOT NULL, COLUMN_TWO INTEGER, COLUMN_THREE TEXT)");
  });

  it("should get sql for create table query with 'IF NOT EXISTS' flag", () => {
    const sql = createTable("TABLE_NAME")
      .ifNotExists()
      .column({ name: "COLUMN_NAME", type: "TEXT", notNull: true })
      .sql();
    
    expect(sql)
      .toBe("CREATE TABLE IF NOT EXISTS TABLE_NAME (COLUMN_NAME TEXT NOT NULL)");
  });
});
