# 事件循环

## 为什么需要事件循环？

- javascript 是单线程，阻塞执行代码；nodejs 有并发要求，新增非阻塞调用机制
- 高耗时的操作异步化，快速清空调用栈，快速处理请求
- 异步操作是无序的，事件循环将异步操作顺序化

## 异步操作类型

- Timer
  - setTimeout
  - setInterval
- I/O
  - 文件
  - 网络
  - ...
- setImmediate
- promise
- process.nextTick

## 事件循环队列

[事件循环](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#event-loop-explained)概述

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

#### 1、循环队列 timer\poll\check

基本分为三个队列，然后自上而下循环，如果队列有事件需要执行，就会 push 到调用栈执行。

- timer 队列
  - setInterval
  - setTimeout
- poll 队列
  - I/O
- check 队列
  - setImmediate

如果队列均为空，会**停留在 poll 队列**，为了方便如果有事件 push 到 poll 列队可以快速立即执行。

#### 2、setImmediate vs setTimeout

- setImmediate 是设计在当前事件循环过程中 poll 队列完成后立即执行的。在 I/O 循环中 setImmediate 是永远优先 setTimeout 的
- setTimeout 是有 Timer 触发调度

#### 3、特殊队列 - nextTick 队列

- process.nextTick() 严格来讲，不属于事件循环。
- process.nextTick 方法会把回调函数 push 到 nextTick 队列
- nextTick 队列在循环队列之前，每次循环之前都会去清空 nextTick 队列。
- 简单理解：同步代码执行完了之后就会去 pop nextTick 队列所有函数到调用栈执行。

#### 4、特殊队列 - microtask 队列

- Promise.resolve().then() 严格来讲，也不属于事件循环
- Promise 相关异步操作会加入到 microtask 队列
- microtask 队列在循环队列之前，nextTick 队列之后，清空 nextTick 队列之后就清空 microtask 队列，然后开始事件循环
- 简单理解：执行完 nextTick 之后就会 pop microtask 队列所有函数到调用栈执行

## 总结

- 1、调用栈按顺序执行同步代码，如果需要异步操作，根据异步操作类型将异步回调函数 push 到循环队列和特色队列
- 2、同步代码执行完毕，会先清空 nextTick 队列并执行，再清空 microtask 队列并执行
- 3、然后开始循环队列，依次清空 timer\poll\check 队列，并执行队列中的回调函数。如果三个队列均为空，停留在 poll 队列等待
- 4、每次执行完队列中的一个回调函数之后，都会再次校验 nextTick 队列和 microtask 队列，如果有就清空并执行，如果没有就执行当前队列中的下一个回调函数。如果队列为空，则开始下一个队列，并循环
