export type CompareResult = -1 | 0 | 1;
export type ICompareFunction<T> = (a: T, b: T) => CompareResult;

export class Comparator<T> {
  public compare: ICompareFunction<T>;

  constructor(compareFunction: ICompareFunction<T>) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }
  static defaultCompareFunction<T>(a: T, b: T): CompareResult {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }

  equal(a: T, b: T): boolean {
    return this.compare(a, b) === 0;
  }

  lessThan(a: T, b: T): boolean {
    return this.compare(a, b) < 0;
  }
  greaterThan(a: T, b: T): boolean {
    return this.compare(a, b) > 0;
  }

  lessThanOrEqual(a: T, b: T): boolean {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  greaterThanOrEqual(a: T, b: T): boolean {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  reverse() {
    const compareOriginal = this.compare;
    this.compare = (a, b) => compareOriginal(b, a);
  }
}
