import { dropTable } from "./drop-table";

describe("drop table", () => {
  it("should get sql for delete query", () => {
    const sql = dropTable("TABLE_NAME").sql();
    
    expect(sql).toBe("DROP TABLE TABLE_NAME");
  });
});
