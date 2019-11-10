export interface ParameterisedSqlable {
    getSql: () => string;
    getValues: () => Value[];
}

export type Value = string | number;
