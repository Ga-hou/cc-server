export class QElement<T> {
  public element: T;
  public priority: number;
  constructor(element: T, priority: number) {
    this.element = element;
    this.priority = priority;
  }
}
