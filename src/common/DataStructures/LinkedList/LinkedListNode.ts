export class LinkedListNode<T> {
  public value: T;
  public next: LinkedListNode<T>;

  constructor(value: T, next?: LinkedListNode<T>) {
    this.value = value;
    this.next = next;
  }
}
