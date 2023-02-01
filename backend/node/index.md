# Nodejs 是什么？

## 1，简介
- [官网](https://nodejs.org/)
- **Nodejs是一个开源，跨平台的javascript运行时环境**

## 2，Nodejs 组成
- Node Api：（js代码实现）有很多，就是经常用到的 fs、process、http 等，[文档](https://nodejs.org/api/)
- C++ Bindings：（c++代码实现）基本所有Node Api涉及到I/O的操作都是调用对应的bindings模块，例如源码中`internalBinding('fs')`就是调用[node_file.cc](https://github.com/nodejs/node/blob/main/src/node_file.cc)
#### Nodejs依赖模块
- V8：chrome V8 引擎，用来执行js代码
- libuv：C编写的事件驱动的非阻塞异步I/O，提供了fs, DNS, Network, Child process, Piple, Stream等操作。 是 Event Loop 的重要组成部分。主要包含 事件循环，队列，线程池等
<div align="center"><img src='./images/libuv.png' width=600 alt=''> </img></div>

- llhttp: TS+C编写的轻量http解析库
- c-ares: 处理异步DNS
- OpenSSL: 提供了TSL和Crypto模块
- Zlib: 快速压缩，解压


## 3，Nodejs 是怎么运行的？（Event Loop）

<div align="center"><img src='./images/nodejs-EventLoop.png' width=600 alt=''> </img></div>

- 1、V8 解析js代码，并执行
- 2、调用Node Api执行具体操作
- 3、由 C++ Bindings 调用 libuv 来执行具体操作。执行过程中把Event queue中任务交给不同的线程去执行，以事件驱动的方式在执行后把结果返回给C++ Bindings。如果用新的任务会继续加到Event queue 形成Event Loop
- 4、V8收到Node Api返回结果，继续向上返回。

总结：V8  <--->  Libuv （libuv 中有 queue, thread pool ） V8向Queue中丢任务，thread从Queue中取任务，结果给V8

