# Nodejs 是什么？

## 1，简介

- [官网](https://nodejs.org/)
- **Nodejs 是一个开源，跨平台的 javascript 运行时环境**

## 2，Nodejs 组成

- Node Api：（js 代码实现）有很多，就是经常用到的 fs、process、http 等，[文档](https://nodejs.org/api/)
- C++ Bindings：（c++代码实现）基本所有 Node Api 涉及到 I/O 的操作都是调用对应的 bindings 模块，例如源码中`internalBinding('fs')`就是调用[node_file.cc](https://github.com/nodejs/node/blob/main/src/node_file.cc)

#### Nodejs 依赖模块

- V8：chrome V8 引擎，用来执行 js 代码
- libuv：C 编写的事件驱动的非阻塞异步 I/O，提供了 fs, DNS, Network, Child process, Piple, Stream 等操作。 是 Event Loop 的重要组成部分。主要包含 事件循环，队列，线程池等
<div align="center"><img src='./images/libuv.png' width=600 alt=''> </img></div>

- llhttp: TS+C 编写的轻量 http 解析库
- c-ares: 处理异步 DNS
- OpenSSL: 提供了 TSL 和 Crypto 模块
- Zlib: 快速压缩，解压

## 3，Nodejs 是怎么运行的？（Event Loop）

<div align="center"><img src='./images/nodejs-EventLoop.png' width=600 alt=''> </img></div>

- 1、V8 解析 js 代码，并执行
- 2、调用 Node Api 执行具体操作
- 3、由 C++ Bindings 调用 libuv 来执行具体操作。执行过程中把 Event queue 中任务交给不同的线程去执行，以事件驱动的方式在执行后把结果返回给 C++ Bindings。如果用新的任务会继续加到 Event queue 形成 Event Loop
- 4、V8 收到 Node Api 返回结果，继续向上返回。

总结：V8 <---> Libuv （libuv 中有 queue, thread pool ） V8 向 Queue 中丢任务，thread 从 Queue 中取任务，结果给 V8

## 4, 总结

- [官网](https://nodejs.org)，[中文网](http://nodejs.cn)
- nodejs 是一个 javascript 运行时环境
- nodejs 运行在一个单个进程中
- nodejs 是单线程的，所有请求都由一个线程来处理
- nodejs 使用的非阻塞机制，来处理大量请求。
- nodejs 并不是全部单线程，只是单个线程处理 javascript， I/O 部分是多线程的，libuv 默认 4 进程
- nodejs 为什么是单线程，因为 javascript 是单线程，再因为 javascript 设计初是运行在浏览器，操作 DOM 的，只能是单线程
- nodejs 单线程如何处理高并发的？
  - 非阻塞机制，异步调用
  - 单线程依次处理每个请求，nodejs 耗时高的操作、I/O 操作全部异步化。
  - V8 可以快速处理一个请求，清空调用栈，开始处理下一个请求
