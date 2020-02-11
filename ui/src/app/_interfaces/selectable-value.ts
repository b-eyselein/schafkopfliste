export interface SelectableValue<T> {
  value: T;
  name: string;
  isSelected: boolean;
  title?: string;
}

export function toSelectableValue<T>(value: T, name: string, isSelected: boolean, title?: string): SelectableValue<T> {
  return {value, name, isSelected, title};
}
