/**
 * 反转队列
 * 利用递归先出队列，再入队列
 */

const QueueReverse = function (queue) {
  if (queue.isEmpty) {
    return queue;
  }
  const item = queue.dequeue();
  QueueReverse(queue);
  queue.enqueue(item);
  return queue;
};
