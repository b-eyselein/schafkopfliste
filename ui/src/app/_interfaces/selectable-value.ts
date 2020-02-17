export interface SelectableValue<T> {
  value: T;
  name: string;
  title?: string;
}

export function toSelectableValue<T>(value: T, name: string, title?: string): SelectableValue<T> {
  return {value, name, title};
}
