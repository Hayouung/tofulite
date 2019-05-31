import { SelectWhere } from "./interfaces/SelectWhere";

export class QueryUtils {
	public static getWheres(wheres: SelectWhere[]): string {
		if (wheres.length === 0) {
			return "";
		}

		wheres.sort((a, b) => a.type === "AND" && b.type === "OR" ? -1 : 1);

		let str = " WHERE ";

		wheres.forEach((where, index) => {
			str += index === 0 ? "" : ` ${where.type} `;

			if (where.value instanceof Array) {
				str += `${where.columnName} IN (${this.getQuestionMarks(where.value)})`;
			} else {
				str += `${where.columnName} ${where.operator || "="} ?`;
			}
		});

		return str;
	}

	public static getQuestionMarks(values: any[]): string {
		return values.map(v => "?").join(", ");
	}
}
