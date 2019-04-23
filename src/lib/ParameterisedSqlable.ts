export interface ParameterisedSqlable {
	getSql: () => string;
	getValues: () => ParameterValue[];
}

export type ParameterValue = string | number;
