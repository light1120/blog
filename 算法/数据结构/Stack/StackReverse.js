/**
 * 反转栈， 借助工具栈tmp
 * @param {*} stack
 * @returns
 */
const StackReverse = function (stack) {
  if (stack.isEmpty) {
    return stack;
  }
  const tmpStack = new stack.constructor();
  while (!stack.isEmpty) {
    tmpStack.push(stack.pop());
  }
  return tmpStack;
};
