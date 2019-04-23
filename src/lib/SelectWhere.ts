export interface SelectWhere {
	columnName: string;
	value: string | number | string[] | number[];
	operator?: "=" | "<" | ">" | ">=" | "<=";
}
