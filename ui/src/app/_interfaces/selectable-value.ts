export interface SelectableValue<T> {
  value: T;
  name: string;
  isSelected: boolean;
  title?: string;
  disabled?: boolean;
}

export function toSelectableValue<T>(value: T, name: string, isSelected: boolean, title?: string, disabled?: boolean): SelectableValue<T> {
  return {value, name, isSelected, title, disabled};
}
