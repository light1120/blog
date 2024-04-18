# egg-cluster 源码阅读
> 我们从前面了解到 egg-script在启动程序时，最终就是启动了framework中的startCluster方法，默认情况下就是执行自带的插件egg-cluster

## 1，egg-cluster 模型
[参考官网](https://www.eggjs.org/zh-CN/core/cluster-and-ipc#%E6%A1%86%E6%9E%B6%E7%9A%84%E5%A4%9A%E8%BF%9B%E7%A8%8B%E6%A8%A1%E5%9E%8B)，主要由master 、agent 、worker 组成，还有他们之间的通讯 messenger
* 启动方式： 先创建master 再fork agent 再 fork worker

## 2，[入口函数](https://github.com/eggjs/egg-cluster/blob/master/index.js)
```
exports.startCluster = function(options, callback) {
  new Master(options).ready(callback);
};
```
就是创建了master实例，agent worker 都交给master处理

## 3，从[Master类](https://github.com/eggjs/egg-cluster/blob/master/lib/master.js#L27)开始执行
```
class Master extends EventEmitter {
  constructor(options) {
    super();
    //初始化（省略，详细可以看源码）
    //初始化workerManager用来存储fork完成的agent和worker进程对象
    this.workerManager = new Manager();
    // set app & agent worker impl
    if (this.options.startMode === 'worker_threads') {
      this.startByWorkerThreads();
    } else {
      this.startByProcess();
    }
    //打印日志（省略）
    const startTime = Date.now();
    this.ready(() => {
      // 通过messager发送消息
      this.messenger.send({...});
    });
    //监听了一些事件，通过事件触发app,agent相关的操作
    this.on('agent-exit', this.onAgentExit.bind(this));
    this.on('agent-start', this.onAgentStart.bind(this));
    this.on('app-exit', this.onAppExit.bind(this));
    this.on('app-start', this.onAppStart.bind(this));
    this.on('reload-worker', this.onReload.bind(this));
    this.once('agent-start', this.forkAppWorkers.bind(this));
    this.on('realport', ({ port, protocol }) => {
      if (port) this[REAL_PORT] = port;
      if (protocol) this[PROTOCOL] = protocol;
    });

    //监听了进程相关的事件，如关掉，退出等    
    process.once('SIGINT', this.onSignal.bind(this, 'SIGINT'));
    process.once('SIGQUIT', this.onSignal.bind(this, 'SIGQUIT'));
    process.once('SIGTERM', this.onSignal.bind(this, 'SIGTERM'));
    process.once('exit', this.onExit.bind(this));

    this.detectPorts()
      .then(() => {
        this.forkAgentWorker();
      });

    //监听异常
    this.workerManager.on('exception',()=>{});
  }
}
```
大概流程入下
* 1、startByProcess（默认是进程方式，也可以选择线程worker_threads） 就是通过[AppUtils](https://github.com/eggjs/egg-cluster/blob/master/lib/utils/mode/impl/process/app.js#L58)，[AgentUtils](https://github.com/eggjs/egg-cluster/blob/master/lib/utils/mode/impl/process/agent.js#L34) 这2个工具类来fork worker进程跟agent进程。
* 2、监听了一系列事件来完成整个链路
* 3、detectPorts之后就开始forkAgent。就是执行第一步创建好的[agentWorker](https://github.com/eggjs/egg-cluster/blob/master/lib/master.js#L271)的`fork`方法。
    ```
    const worker = this.#worker = childprocess.fork(this.getAgentWorkerFile(), args, opt);
    const agentWorker = this.instance = new AgentWorker(worker);
    this.emit('agent_forked', agentWorker);
    ```
    * `getAgentWorkerFile`在基类定义就是[agent_worker.js](https://github.com/eggjs/egg-cluster/blob/master/lib/agent_worker.js)
    * 通过`agent_worker.js`创建了agent进行，并把agent进程对象赋值给agentWorker，触发`agent_forked`事件，把agentWorker [setAgent](https://github.com/eggjs/egg-cluster/blob/master/lib/master.js#L272)到workerManager
    * AgentWork创建其实就是实例化了framework的agent对象，然后通知master `agent-start`事件
    ```
    const Agent = require(options.framework).Agent;
    let agent;
    try {
        agent = new Agent(options);
    } catch (err) {}

    agent.ready(err => {
        AgentWorker.send({ action: 'agent-start', to: 'master' });
    });
    ```
* 4、收到`agent-start`之后就开始[forkAppWorkers](https://github.com/eggjs/egg-cluster/blob/master/lib/master.js#L132)
    * AppUtils的fork方法中使用了[cfork](https://github.com/node-modules/cfork)来创建多个进程，同时借助cluster模块来进行跟messenger通讯。在fork之后，把worker进程对象赋值给appWorker，触发`worker_forked`事件，把 appWoker [setWorker](https://github.com/eggjs/egg-cluster/blob/master/lib/master.js#L277)到workerManager对象
    ```
    cfork({
      exec: this.getAppWorkerFile(),
      args,
      silent: false,
      count: this.options.workers,
      // don't refork in local env
      refork: this.isProduction,
      windowsHide: process.platform === 'win32',
    });

    let debugPort = process.debugPort;
    cluster.on('fork', worker => {
      const appWorker = new AppWorker(worker);
      this.emit('worker_forked', appWorker);
      appWorker.disableRefork = true;
      worker.on('message', msg => {
        if (typeof msg === 'string') {
          msg = {
            action: msg,
            data: msg,
          };
        }
        msg.from = 'app';
        this.messenger.send(msg);
      });
    });
    cluster.on('disconnect', worker => {});
    cluster.on('exit', (worker, code, signal) => {});
    cluster.on('listening', (worker, address) => {});
    
    ```
    * AppUtils中的`getAppWorkerFile`就是[app_worker.js](https://github.com/eggjs/egg-cluster/blob/master/lib/app_worker.js) **这里很重要**
    ```
    const Application = require(options.framework).Application;
    debug('new Application with options %j', options);
    let app;
    try {
        app = new Application(options);
    } catch (err) {
        consoleLogger.error(err);
        throw err;
    }

    app.ready(startServer);

    function startServer(err) {
    // https config
    if (httpsOptions.key && httpsOptions.cert) {
        httpsOptions.key = fs.readFileSync(httpsOptions.key);
        httpsOptions.cert = fs.readFileSync(httpsOptions.cert);
        httpsOptions.ca = httpsOptions.ca && fs.readFileSync(httpsOptions.ca);
        server = require('https').createServer(httpsOptions, app.callback());
    } else {
        server = require('http').createServer(app.callback());
    }

    // emit `server` event in app
    app.emit('server', server);

    AppWorker.send({
        to: 'master',
        action: 'listening',
        data: server.address(),
    });
    }
    ```
    * 先实例化app对象
    * 把`startServer`函数加入到ready队列中，eggjs中有很多app.ready(()=>{})这样的，其实对所有的回调函数加入到一个数组中，当执行`app.ready(true)`时，会把这些回调函数拉出来全部执行一边。所以这里在等待`ready(true)`
    * `startServer`中每个进程都创建了一个http服务，但是没有监听端口，而是send到master，执行`listening`
    * master 收到`listening` ，会触发[app-start](https://github.com/eggjs/egg-cluster/blob/master/lib/utils/mode/impl/process/app.js#L125)事件，执行函数 [onAppStart](https://github.com/eggjs/egg-cluster/blob/master/lib/master.js#L438)
    * 执行`startMasterSocketServer`函数，让master监听对外端口，提供服务。
    ```
    startMasterSocketServer(cb) {
        // Create the outside facing server listening on our port.
        require('net').createServer({
            pauseOnConnect: true,
        }, connection => {
        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.

        /* istanbul ignore next */
        if (!connection.remoteAddress) {
            // This will happen when a client sends an RST(which is set to 1) right
            // after the three-way handshake to the server.
            // Read https://en.wikipedia.org/wiki/TCP_reset_attack for more details.
            connection.destroy();
        } else {
            const worker = this.stickyWorker(connection.remoteAddress);
            worker.instance.send('sticky-session:connection', connection);
        }
        }).listen(this[REAL_PORT], cb);
    }
    ```
    * app_worker收到事件[sticky-session:connection](https://github.com/eggjs/egg-cluster/blob/master/lib/app_worker.js#L97)时就会接管链接处理请求
* 5 启动worker之后，等待`ready(true)`执行回调`app.ready(startServer)`创建`startMasterSocketServer`对外监听端口，服务启动成功

## 4，备注：
* ready(true)什么时候执行的？[参考:eggjs中app_worker.js 怎么触发ready标记的?](https://www.zhihu.com/question/272186175)
* 框架的启动时序如下：
    ```

    +---------+           +---------+          +---------+
        |  Master |           |  Agent  |          |  Worker |
        +---------+           +----+----+          +----+----+
            |      fork agent     |                    |
            +-------------------->|                    |
            |      agent ready    |                    |
            |<--------------------+                    |
            |                     |     fork worker    |
            +----------------------------------------->|
            |     worker ready    |                    |
            |<-----------------------------------------+
            |      Egg ready      |                    |
            +-------------------->|                    |
            |      Egg ready      |                    |
            +----------------------------------------->|
    ```
    * Master 启动后先 fork Agent 进程
    * Agent 初始化成功后，通过 IPC 通道通知 Master
    * Master 再 fork 多个 App Worker
    * App Worker 初始化成功，通知 Master
    * 所有的进程初始化成功后，Master 通知 Agent 和 Worker 应用启动成功