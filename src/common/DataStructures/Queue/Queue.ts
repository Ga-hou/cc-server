import { Injectable } from '@nestjs/common';
import { LinkedList } from '../LinkedList/LinkedList';

@Injectable()
export class Queue<T> {
  private linkedList: LinkedList<T>;
  constructor() {
    this.linkedList = new LinkedList();
  }

  isEmpty(): boolean {
    return !this.linkedList.head;
  }

  peek(): T {
    if (!this.linkedList.head) {
      return null;
    }

    return this.linkedList.head.value;
  }

  enqueue(value: T): void {
    this.linkedList.append(value);
  }

  dequeue(): T {
    const removedHead = this.linkedList.deleteHead();
    return removedHead ? removedHead.value : null;
  }

  toString(callback: Function): string {
    return this.linkedList.toString(callback);
  }
}
