import { selectFrom } from "./select";

describe("select query", () => {
  it("should get sql for select statement with * if no columns", () => {
    const sql = selectFrom("TABLE_NAME").sql();

    expect(sql).toBe("SELECT * FROM TABLE_NAME");
  });

  it("should get sql for select statement with a column", () => {
    const sql = selectFrom("TABLE_NAME")
      .column("COLUMN_ONE")
      .sql();
    
    expect(sql).toBe("SELECT COLUMN_ONE FROM TABLE_NAME");
  });

  it("should get sql for select statement with multiple columns", () => {
    const sql = selectFrom("TABLE_NAME")
      .column("COLUMN_ONE")
      .column("COLUMN_TWO")
      .column("COLUMN_THREE")
      .sql();
    
    expect(sql).toBe("SELECT COLUMN_ONE, COLUMN_TWO, COLUMN_THREE FROM TABLE_NAME");
  });

  describe("select query with where", () => {
    it("should get sql with where conditions and parameter values and put ANDs and ORs correctly", () => {
      const sq = selectFrom("TABLE_NAME")
        .where({ column: "COLUMN_ONE", value: [1, 2, 3], type: "AND" })
        .where({ column: "COLUMN_TWO", value: 4, type: "AND" })
        .where({ column: "COLUMN_THREE", value: [5, 6], type: "OR" })
        .where({ column: "COLUMN_FOUR", value: 7, type: "AND", operator: ">" });
      
      expect(sq.sql())
        .toBe("SELECT * FROM TABLE_NAME WHERE COLUMN_ONE IN (?, ?, ?) AND COLUMN_TWO = ? AND COLUMN_FOUR > ? OR COLUMN_THREE IN (?, ?)");
      expect(sq.parameters()).toEqual([1, 2, 3, 4, 7, 5, 6]);
    });
  });

  describe("select query with order by", () => {
    it("should order by column ascending", () => {
      const sql = selectFrom("TABLE_NAME")
        .order("COLUMN_ONE", "ASC")
        .sql();
      
      expect(sql).toBe("SELECT * FROM TABLE_NAME ORDER BY COLUMN_ONE ASC");
    });

    it("should order by column descending", () => {
      const sql = selectFrom("TABLE_NAME")
        .order("COLUMN_ONE", "DESC")
        .sql();
      
      expect(sql).toBe("SELECT * FROM TABLE_NAME ORDER BY COLUMN_ONE DESC");
    });
  });

  describe("select query with limit", () => {
    it("should limit by value", () => {
      const sql = selectFrom("TABLE_NAME")
        .limit(5)
        .sql();
      
      expect(sql).toBe("SELECT * FROM TABLE_NAME LIMIT 5");
    });
  });
});
