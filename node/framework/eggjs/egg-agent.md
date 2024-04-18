## agent 是做什么用的？
### 1，agent 模式
```
+--------+          +-------+
                  | Master |<-------->| Agent |
                  +--------+          +-------+
                  ^   ^    ^
                 /    |     \
               /      |       \
             /        |         \
           v          v          v
  +----------+   +----------+   +----------+
  | Worker 1 |   | Worker 2 |   | Worker 3 |
  +----------+   +----------+   +----------+
```
* agent设计思想是用来给worker减负的，做一些非业务类型的脏活累活

### 2，agent能做什么？
* 既然是非业务的脏活，累活，所以最好是封装成某个插件
* agent 例子
    * [egg-schedule](https://github.com/eggjs/egg-schedule/blob/master/agent.js):做 job 调度
        ```
        agent.schedule.use('worker', WorkerStrategy);
        agent.schedule.use('all', AllStrategy);

        // wait for other plugin to register custom strategy
        agent.beforeStart(() => {
            agent.schedule.init();
        });

        // dispatch job finish event to strategy
        agent.messenger.on('egg-schedule', (...args) => {
            agent.schedule.onJobFinish(...args);
        });

        agent.messenger.once('egg-ready', () => {
            // start schedule after worker ready
            agent.schedule.start();
        });
        ```
    * agent定时读取服务端的配置，并同步给 workers