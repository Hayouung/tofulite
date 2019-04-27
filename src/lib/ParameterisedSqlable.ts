export interface ParameterisedSqlable {
	getSql: () => string;
	getValues: () => string;
}
