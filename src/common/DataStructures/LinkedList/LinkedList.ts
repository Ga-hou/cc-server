import { Injectable } from '@nestjs/common';
import { LinkedListNode } from './LinkedListNode';
import { Comparator, ICompareFunction } from '../Comparator';

@Injectable()
export class LinkedList<T> {
  public head: LinkedListNode<T>;
  public tail: LinkedListNode<T>;
  public compare;
  constructor(comparatorFunction?: ICompareFunction<T>) {
    this.head = null;
    this.tail = null;
    this.compare = new Comparator(comparatorFunction);
  }

  prepend(value: T): LinkedList<T> {
    const newNode: LinkedListNode<T> = new LinkedListNode<T>(value, this.head);
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }
    return this;
  }

  append(value: T): LinkedList<T> {
    const newNode: LinkedListNode<T> = new LinkedListNode<T>(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    }
    return this;
  }

  delete(value: T): LinkedListNode<T> {
    if (!this.head) {
      return null;
    }

    let deletedNode = null;

    while (this.head && this.compare.equal(this.head.value, value)) {
      deletedNode = this.head;
      this.head = this.head.next;
    }

    let currentNode = this.head;

    if (currentNode !== null) {
      while (currentNode.next) {
        if (this.compare.equal(currentNode.next.value, value)) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    if (this.compare.equal(this.tail.value, value)) {
      this.tail = currentNode;
    }

    return deletedNode;
  }

  find(props: { value: T; callback?: (value: T) => any }): LinkedListNode<T> {
    if (!this.head) {
      return null;
    }

    let currentNode = this.head;

    while (currentNode) {
      if (props.callback && props.callback(currentNode.value)) {
        return currentNode;
      }

      if (props.value !== undefined && this.compare.equal(currentNode.value, props.value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  deleteTail(): LinkedListNode<T> {
    const deletedTail = this.tail;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;

      return deletedTail;
    }

    let currentNode = this.head;
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.tail = currentNode;

    return deletedTail;
  }

  deleteHead(): LinkedListNode<T> {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    return deletedHead;
  }

  fromArray(values: T[]): LinkedList<T> {
    values.forEach(value => this.append(value));

    return this;
  }

  toArray(): LinkedList<T>[] {
    const nodes = [];

    let currentNode = this.head;
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  toString(callback: Function): string {
    return this.toArray().map(node => node.toString(callback)).toString();
  }

  reverse(): LinkedList<T> {
    let currNode = this.head;
    let prevNode = null;
    let nextNode = null;

    while (currNode) {
      nextNode = currNode.next;
      currNode.next = prevNode;
      prevNode = currNode;
      currNode = nextNode;
    }

    this.tail = this.head;
    this.head = prevNode;

    return this;
  }
}
