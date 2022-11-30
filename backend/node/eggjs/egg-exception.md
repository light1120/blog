## eggjs 是如何处理异常的？

### 1、unhandledRejection
* unhandledRejection是promise产生的异常，没办法通过`try catch`来捕获，只能通过`.catch()`或者`try cacth + await`来捕获
* 在nodejs会触发[`unhandledRejection`](https://nodejs.org/api/process.html#event-unhandledrejection)事件
* 具体捕获方式
```
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});
```
* **注意**：这里只能捕获系统promise产生的异常，第三方库的promise产生的异常无法通过`process.on('unhandledRejection'`捕获
* eggjs 在 [`EggApplication`](https://github.com/eggjs/egg/blob/master/lib/egg.js#L87)构造方法是对这个异常进行了监听

### 2、uncaughtException
* uncaughtException：未捕获的异常，可以通过`process.on('uncaughtException'`捕获
```
process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`,
  );
});
```
* **注意**：如果出现uncaughtException，nodejs进程会进入一个不确定状态，并打印堆栈，以code 1退出
* [正确的处理方式](https://nodejs.org/api/process.html#warning-using-uncaughtexception-correctly)：用独立的进程来监听进程异常，再根据具体情况来判断是否要重启进程
* eggjs 通过 [graceful](https://github.com/node-modules/graceful)和[egg-cluster](https://github.com/eggjs/egg-cluster)来处理进程优雅退出，重启等。
  * [worker退出](https://github.com/eggjs/egg-cluster/blob/master/lib/utils/mode/impl/process/app.js#L112)
    ``` 
    cluster.on('exit', (worker, code, signal) => {
      const appWorker = new AppWorker(worker);
      this.messenger.send({
        action: 'app-exit',
        data: {
          workerId: appWorker.workerId,
          code,
          signal,
        },
        to: 'master',
        from: 'app',
      });
    });
    ```
  * [agent退出](https://github.com/eggjs/egg-cluster/blob/master/lib/utils/mode/impl/process/agent.js#L88)
    ```
    worker.once('exit', (code, signal) => {
      this.messenger.send({
        action: 'agent-exit',
        data: {
          code,
          signal,
        },
        to: 'master',
        from: 'agent',
      });
    });
    ```

### 3、onerror
[egg-onerror](https://github.com/eggjs/egg-onerror)提供了框架统一的异常处理方式，通过配置自定义处理异常
```
// config/config.default.js
module.exports = {
  onerror: {
    all(err, ctx) {...},
    html(err, ctx) {...},
    json(err, ctx) {...},
    jsonp(err, ctx) {...},
  },
};
```
egg-onerror主要是在[koa-onerror](https://github.com/koajs/onerror/blob/master/index.js)的基础上做了一些扩展。koa-onerror主要是重写了`app.context.onerror`方法。那么框架在调用`ctx.onerror`就时调用koa-onerror的方法。eggjs是基于koajs的，主要是koajs在调用`ctx.onerror`，主要是2个地方
* [application的handleRequest方法](https://github.com/koajs/koa/blob/master/lib/application.js#L154)
```
 handleRequest (ctx, fnMiddleware) {
    const res = ctx.res
    res.statusCode = 404
    const onerror = err => ctx.onerror(err)
    const handleResponse = () => respond(ctx)
    onFinished(res, onerror)
    return fnMiddleware(ctx).then(handleResponse).catch(onerror)
  }
```
* [response的set body方法](https://github.com/koajs/koa/blob/master/lib/response.js#L175)
```
// stream
if (val instanceof Stream) {
  onFinish(this.res, destroy.bind(null, val))
  if (original !== val) {
    val.once('error', err => this.ctx.onerror(err))
    // overwriting
    if (original != null) this.remove('Content-Length')
  }

  if (setType) this.type = 'bin'
  return
}
```
