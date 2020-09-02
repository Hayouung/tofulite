import { deleteFrom } from "./delete";

describe("delete query", () => {
  it("should get sql for delete query", () => {
    const dq = deleteFrom("TABLE_NAME");

    expect(dq.sql()).toBe("DELETE FROM TABLE_NAME");
    expect(dq.parameters()).toEqual([]);
  });

  it("should get sql and values for delete query with wheres", () => {
    const dq = deleteFrom("TABLE_NAME")
      .where({ column: "COLUMN_NAME", type: "AND", value: "TEXT" });
    
    expect(dq.sql()).toBe("DELETE FROM TABLE_NAME WHERE COLUMN_NAME = ?");
    expect(dq.parameters()).toEqual(["TEXT"]);
  });
});
