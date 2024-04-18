## Cluster
>- 进程：系统进行资源分配的基本单位；可以理解为进行中的程序，`node app.js`即启动了一个进程
>- 线程：cpu可以调度的最小单位，隶属于进程。一个进程可以启动多个线程
### 简介:
- Cluster可以创建多个nodejs实例来分配应用的负载
- 就是可以启动多个进程来充分利用多核cpu来提高应用的处理能力
- 调度进程：primary/master(16.0.0之前)主进程
- 工作进程：worker子进程

### 例子：
```
import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import process from 'node:process';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
- 这里会创建一个primary进程，primary进程会根据cpu的数量fork相同数量的子进程
- 他们共享一个端口8000。（理论上多个进程监听一个端口会报错，后文有解释）

### 原理:
通过`child_process.fork()`的方式创建子行程，所有进程共享一个端口
```
fork() creates a new process by duplicating the calling process. The new process is referred to as the child process. The calling process is referred to as the parent process.

The child process and the parent process run in separate memory spaces. At the time of fork() both memory spaces have the same content. Memory writes, file mappings (mmap(2)), and unmappings (munmap(2)) performed by one of the processes do not affect the other
```
fork 出的子进程拥有和父进程一致的数据空间、堆、栈等资源（fork 当时），但是是独立的，也就是说二者不能共享这些存储空间

### 负载均衡策略:
- [round-robin](https://en.wikipedia.org/wiki/Round-robin_scheduling)：非windows默认策略；简单点说，就是全部链接由primary来接受，采用轮训的方式交给子进程处理。
- [IOCP](https://learn.microsoft.com/zh-cn/windows/win32/fileio/i-o-completion-ports?redirectedfrom=MSDN): windows默认策略

- 修改策略： 可以修改`cluster.schedulingPolicy`来改变cluster的调度策略
    - cluster.SCHED_RR ： round-robin
    - cluster.SCHED_NONE ： 由操作系统决定
        ```
        const cluster = require('cluster');

        // 策略一：一种轮询的策略，默认值
        cluster.schedulingPolicy = cluster.SCHED_RR;

        // 策略二：由操作系统调度的策略
        cluster.schedulingPolicy = cluster.SCHED_NONE;

        cluster.fork();
        ```
    - 也可以修改环境变量`NODE_CLUSTER_SCHED_POLICY`来修改调度策略，只能是` "rr" / "none"  `
        ```
        $ export NODE_CLUSTER_SCHED_POLICY="rr"
        $ node app.js
        //或者启动时指定
        $ env NODE_CLUSTER_SCHED_POLICY="none" node app.js
        ```


### 进程通讯：
- IPC : (Inter-process communication)进程间通信
- cluster primary 与 master 之间的通信是通过pipe实现的
- 例子
```
import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import process from 'node:process';

const CPUs = cpus();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for  ${CPUs.length} cpus`);
  // Fork workers.
  const workers = []
  for (let i = 0; i < CPUs.length; i++) {
    const worker = cluster.fork();
    workers.push(worker)
  }

  for (const id in workers) {
    workers[id].on('message', (data) => {
      console.log(data.message)
      workers[id].send(`i am primary, hello worker ${data.pid}`)
    });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`hello world\nWorker ${process.pid}`);
  }).listen(8000);
  console.log(`Worker ${process.pid} started`);
  process.send({ pid: process.pid, message: `i am worker ${process.pid} , hello primariy` });
  process.on('message', (res) => {
    console.log(res)
  })
}
```

在primary中 `worker.on('message')` 监听子进程worker发送来的消息，`worker.send()` 向子进程worker发送消息。在worker中 `process.on('mesage')`监听primary发送来的消息，`process.send()`向primary发送消息


### 疑问
- clsuter fork了多个进程，怎样共享一个端口
```
lsof -i:8000 

COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node    92385 xxxxx   39u  IPv6  0xe060a0fa77cf8833      0t0  TCP *:irdmi (LISTEN)
```
通过lsof命令可以清楚的看到监听8000端口的是primary进程。也就是说fork处理的子进程没有监听端口。primary在收到端口的请求时，会用调度算法，将请求分发给worker来处理

```
ps -ef | grep 92385

501 92385 92284   0  6:53下午 ttys001    0:00.10 node cluster1.js
501 92386 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92387 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92388 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92389 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92390 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92391 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92392 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92393 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92394 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
501 92395 92385   0  6:53下午 ttys001    0:00.06 /usr/local/bin/node /Users/
```
可以很清楚的看到primary进程（92385）fork了10个worker进程。 那么进程92284是谁？ 就是我启动的终端zsh
```
ps -ef | grep 92284
501 92284 97561   0  6:53下午 ttys001    0:00.03 /bin/zsh -il
501 92385 92284   0  6:53下午 ttys001    0:00.10 node cluster1.js
501  3579 81399   0  7:36下午 ttys004    0:00.00 grep 92284
```

- [listen 源码](https://github.com/nodejs/node/blob/15164cebcebfcad9822d3f065234a8c1511776a4/lib/net.js)
```
function listenInCluster(server, address, port, addressType,
                         backlog, fd, exclusive, flags) {
  .....

  if (cluster.isPrimary || exclusive) {
    // Will create a new handle
    // _listen2 sets up the listened handle, it is still named like this
    // to avoid breaking code that wraps this method
    server._listen2(address, port, addressType, backlog, fd, flags);
    return;
  }
  .....

  // Get the primary's server handle, and listen on it
  cluster._getServer(server, serverQuery, listenOnPrimaryHandle);

  ....
}
```
可以从源码中看到只有primary进程监听了端口，worker进程并没有监听端口，所以不会造成端口抢占的问题。 worker进程会调用_getServer方法，绑定net的listening消息
```
// `obj` is a net#Server or a dgram#Socket object.
cluster._getServer = function(obj, options, cb) {
  ....

  obj.once('listening', () => {
    cluster.worker.state = 'listening';
    const address = obj.address();
    message.act = 'listening';
    message.port = (address && address.port) || options.port;
    send(message);
  });
};
```
primary 收到listening消息会向worker出发listening消息
```
function listening(worker, message) {
  const info = {
    addressType: message.addressType,
    address: message.address,
    port: message.port,
    fd: message.fd
  };

  worker.state = 'listening';
  worker.emit('listening', info);
  cluster.emit('listening', worker, info);
}
```
