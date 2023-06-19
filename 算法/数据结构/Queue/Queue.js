/**
 * 队列
 * 特点： 先入先出 ，入队列出队列
 */

class MyQueue {
  // 私有属性
  #size;
  head = null;
  tail = null;

  constructor() {
    this.#size = 0;
    // 固定对象，只能访问值，修改值
    return Object.seal(this);
  }

  get length() {
    return this.#size;
  }

  get isEmpty() {
    return this.#size === 0;
  }

  enqueue(data) {
    const node = {
      data,
      next: null,
    };
    if (!this.head && !this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    return ++this.#size;
  }

  dequeue() {
    if (this.isEmpty) {
      throw new Error("Queue is Empty");
    }
    const data = this.head.data;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    this.#size--;

    return data;
  }
}

const myQueue = new MyQueue();
myQueue.enqueue({
  value: 1,
});
myQueue.enqueue({
  value: 2,
});
myQueue.enqueue({
  value: 3,
});
myQueue.enqueue({
  value: 4,
});
