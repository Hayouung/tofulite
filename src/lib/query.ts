export interface Query {
  sql: () => string;
}

export interface ParameterisedQuery {
  sql: () => string;
  parameters: () => Parameter[];
}

export type Parameter = string | number;
