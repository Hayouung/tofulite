import { DeleteQuery } from "../src/index";

describe("#DeleteQuery", () => {
  let dq: DeleteQuery;

  beforeEach(() => {
    dq = new DeleteQuery("TABLE_NAME");
  });

  it("should get sql for delete query", () => {
    expect(dq.getSql()).toBe("DELETE FROM TABLE_NAME");
    expect(dq.getValues()).toEqual([]);
  });

  it("should get sql for delete query with wheres", () => {
    dq.addWhere({ columnName: "COLUMN_NAME", type: "AND", value: "TEXT" });
    expect(dq.getSql()).toBe("DELETE FROM TABLE_NAME WHERE COLUMN_NAME = ?");
    expect(dq.getValues()).toEqual(["TEXT"]);
  });
});
