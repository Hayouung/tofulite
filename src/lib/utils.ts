import { Where } from "./where";

export function getWheres(wheres: Where[]): string {
  if (wheres.length === 0) {
    return "";
  }

  wheres.sort((a, b) => {
    if (a.type === "OR" && b.type === "AND") {
      return 1;
    }

    if (a.type === "AND" && b.type === "OR") {
      return -1;
    }

    return 0;
  });

  let str = " WHERE ";

  wheres.forEach((where, index) => {
    str += index === 0 ? "" : ` ${where.type} `;

    if (where.value instanceof Array) {
      str += `${where.column} IN (${getQuestionMarks(where.value)})`;
    } else {
      str += `${where.column} ${where.operator || "="} ?`;
    }
  });

  return str;
}

export function getQuestionMarks(values: any[]): string {
  return values.map(() => "?").join(", ");
}
