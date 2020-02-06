export function zipArray<T, U>(first: T[], second: U[]): [T, U][] {
  return first.map((a, i) => [a, second[i]]);
}
