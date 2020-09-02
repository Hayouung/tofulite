import { insertInto } from "./insert";

describe("insert query", () => {
  it("should get sql for insert query", () => {
    const iq = insertInto("TABLE_NAME")
      .value({ column: "COLUMN_ONE", value: "TEXT" })
      .value({ column: "COLUMN_TWO", value: 5 });

    expect(iq.sql()).toBe("INSERT INTO TABLE_NAME (COLUMN_ONE, COLUMN_TWO) VALUES (?, ?)");
    expect(iq.parameters()).toEqual(["TEXT", 5]);
  });
});
