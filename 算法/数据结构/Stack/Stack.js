/**
 * 栈(Stack):
 */
class MyStack {
  constructor() {
    this.stack = [];
    this.top = 0;
  }

  get lengh() {
    return this.pop;
  }
  get isEmpty() {
    return this.top === 0;
  }

  push(data) {
    this.stack.push(data);
    this.top += 1;
    return this.top;
  }

  pop() {
    if (this.isEmpty) {
      throw Error("Stack is empty");
    }
    this.top -= 1;
    return this.stack.pop();
  }
}

const myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.push(3);
myStack.push(4);
