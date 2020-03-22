import { Heap } from './Heap';

export class MaxHeap<T> extends Heap<T> {
  pairIsInCorrectOrder(firstElement, secondElement) {
    return this.compare.greaterThanOrEqual(firstElement, secondElement);
  }
}
