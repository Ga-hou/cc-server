import { Heap } from './Heap';

export class MinHeap<T> extends Heap<T> {
  pairIsInCorrectOrder(firstElement, secondElement) {
    return this.compare.lessThanOrEqual(firstElement, secondElement);
  }
}