export interface Where {
  column: string;
  value: string | number | string[] | number[];
  type: WhereType;
  operator?: WhereOperator;
}

export type WhereType = "AND" | "OR";

export type WhereOperator = "=" | "<" | ">" | ">=" | "<=";
