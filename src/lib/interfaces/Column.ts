export interface Column {
  name: string;
  type: "TEXT" | "INTEGER";
  notNull?: boolean;
}
