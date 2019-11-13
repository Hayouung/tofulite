import { InsertQuery } from "../src/index";

describe("#DeleteQuery", () => {
  let iq: InsertQuery;

  beforeEach(() => {
    iq = new InsertQuery("TABLE_NAME");
    iq.setValues([
      { columnName: "COLUMN_ONE", value: "TEXT" },
      { columnName: "COLUMN_TWO", value: 5 }
    ]);
  });

  it("should get sql for insert query", () => {
    expect(iq.getSql()).toBe("INSERT INTO TABLE_NAME (COLUMN_ONE, COLUMN_TWO) VALUES (?, ?)");
    expect(iq.getValues()).toEqual(["TEXT", 5]);
  });
});
