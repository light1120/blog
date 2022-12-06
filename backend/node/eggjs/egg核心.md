# eggjs 核心

## 本地开发
主要用到[egg-bin](https://github.com/eggjs/egg-bin)
* dev：`npm run dev` 执行的 `egg-bin dev`，一般会加上`--node-options--max-old-space-size=4096`来扩展nodejs运行时内存限制
* [调试](https://www.eggjs.org/zh-CN/core/development#%E4%BD%BF%E7%94%A8-egg-bin-%E8%B0%83%E8%AF%95)
    * 开启DEBUG模块：`DEBUG=* npm run dev`开启所有的模块 `DEBUG=egg* npm run dev`开启egg打头的模块。很多模块在开发中会使用[debug](https://www.npmjs.com/package/debug)打印一些调试信息。例如egg-bin中`const debug = require('debug')('egg-bin'); `。开启了DEBUG选项，在运行中就会打印模块中`debug(xxx)`中的信息
    * debug： `npm run debug`执行的`egg-bin debug` 。配合chrome DevTools 的chrome://inspect进行断点调试。

## 应用部署
* 构建：一般需要 设置环境变量、设置nodejs编译时内存、执行tsc(ts项目需要)、`npm install --production`、拷贝项目到实际目录
* 启动：
主要用到[egg-scripts](https://github.com/eggjs/egg-scripts)，
    * egg-scripts 支持的参数：
        * `--port=7001`：指定端口，读取`process.env.PORT`环境变量，框架默认端口7001
        * `--daemon`: 是否启动守护进程
        * `--env=prod`: 框架运行环境，读取`process.env.EGG_SERVER_ENV`，框架默认prod
        * `--workers=2`: 启动线程数量，默认跟cpu数量保持一致
        * `--title=xxxx`: 方便grep查询，stop
        * `--framework=xxx`: 指定框架，可以在package.json配置`egg.framework`参数
        * `--ignore-stderr`: 忽略启动时报错
        * `--stdout=/data/xxx`: 日志文件路径，默认`$HOME/logs/master-stdout.log`
        * `--stderr=/data/xxx`: 日志文件路径，默认`$HOME/logs/master-stderr.log`
        * `--https.key`: https 密文绝对路径
        * `--https.cert`: https 证书绝对路径
    * 配置文件中指定启动项，在对应环境配置文件中`config.{env}.js`指定配置项
    ```
    // config.default.js
    exports.cluster = {
        listen: {
            port: 7001,
            hostname: '127.0.0.1', 
        },
    };
    ```
    * start : `"start": "egg-scripts start --daemon --title=my-nodejs-proj",`
    * stop : `"stop": "egg-scripts stop --title=my-nodejs-proj",`
    
## 日志 [egg-logger](https://github.com/eggjs/egg-logger)
* 日志路径
    * 默认 : 放在`${appInfo.root}/logs/${appInfo.name}`
    * 配置 : 修改配置文件logger.dir
* 日志分类
    * appLogger : 默认`${appInfo.name}-web.log`，应用相关日志，绝大多数使用这个日子文件
    * coreLogger : 默认`egg-web.log`，框架内核，插件日志
    * errorLogger : 默认`common-error.log` `logger.error()`输出的日志
    * agentLogger : 默认`egg-agent.log`agent 进程日志
    * 配置 : 修改配置文件的logger.xxxLogger = "xxx.log"
* 打印日志
    * ctx.logger.info() : info、debug、error、warn
    * ctx.coreLogger.info : 框架或者插件使用
    * app.logger.info()
    * agent.logger.info()
* 其他配置项
    * logger.encoding='gbk' : 编码，默认 `utf-8`
    * logger.outputJSON=true : 输出格式，默认json
    * logger.level='INFO' : NONE、DEBUG、INFO、WARN、ERROR 默认INFO，会打印INFO以上级别，包括WARN,ERROR；设置DEBUG，打印所有；设置NONE, 关闭日志
    * logger.allowDebugAtProd=true : 生成环境禁止打印DEBUG，如果设置了DEBUG，还需要设置`allowDebugAtProd=true`，生产环境才会打印DEBUG日志
    * logger.consoleLevel='DEBUG': 终端默认只打印INFO以上日志，也可以设置consoleLevel为'DEBUG'，'NONE'
    * logger.disableConsoleAfterReady='false': 生产环境开启console日志，不建议

## [HttpClient](https://github.com/eggjs/egg/blob/master/lib/core/httpclient.js)
* 使用 : `ctx.httpclient.request(url, options)`和`ctx.curl(url, options)`等价的。 app下也有同样的方法
* 配置 : 默认如下
```
// config/config.default.js
exports.httpclient = {
  enableDNSCache: false,
  dnsCacheLookupInterval: 10000,
  dnsCacheMaxLength: 1000,

  request: {
    timeout: 3000,
  },

  httpAgent: {
    keepAlive: true,
    freeSocketTimeout: 4000,
    timeout: 30000,
    maxSockets: Number.MAX_SAFE_INTEGER,
    maxFreeSockets: 256,
  },

  httpsAgent: {
    keepAlive: true,
    freeSocketTimeout: 4000,
    timeout: 30000,
    maxSockets: Number.MAX_SAFE_INTEGER,
    maxFreeSockets: 256,
  },
};
```
* options
    * 基础
        * `data: Object`
        * `method: String`
        * `contentType: String` ： 请求格式
        * `dataType: String` ：响应格式
        * `headers: Object`
        * `timeout: Number|Array`
        * `gzip: Boolean`
    * 高级
        * `files: String | ReadStream | Buffer | Array | Object` ：文件上传
        * `content: String|Buffer` ： 忽略data
        * `stream: ReadStream`： 可读流，忽略data content
        * `writeStream: WriteStream`：可写流，返回数据写入writeStream
        * `streaming: Boolean`：只返回流，只有header result ，没有data
        * `agent: HttpAgent`： 覆盖配置项httpAgent
        * `httpsAgent: HttpsAgent`：覆盖配置项httpsAgent
        * `beforeRequest: Function(options)`：发送前钩子
        * `timing: Boolean`：开启之后，result.res.timing 拿到这次 HTTP 请求各阶段的时间测量值，如waiting dns queuing等

## Cookie & Session
* Cookie
    * 用法：`ctx.cookies.get(key, options)`，`ctx.cookies.set(key, value, options)`
    * 存储：http协议头cookie，页面可以通过`document.cookie`访问
    * options:
        * maxAge: number
        * expires: date
        * path: string
        * domain: string
        * httpOnly: boolean 是否支持js访问
        * secure: boolean 是否仅在https上传输
        * overwrite: boolean 是否覆盖
        * signed: boolean 是否签名 默认true
        * encrypt: boolean 是否加密 默认false
* Session
    * 用法：`ctx.session` 支持读写
    * 配置： 
        ```
        exports.session = {
            key: 'EGG_SESS',
            maxAge: 24 * 3600 * 1000, // 1 天
            httpOnly: true,
            encrypt: true,
        };
        ```
    * 存储：默认同cookie一致，可以在app.js通过`app.sessionStore`将session存储在制度位置，一般是database,redis
    * [egg-session-redis](https://github.com/eggjs/egg-session-redis): 就是扩展了[app.js](https://github.com/eggjs/egg-session-redis/blob/master/app.js)将session存储在redis

## 多进程 & IPC
* 多进程
    * 底层： [cluster模块](https://nodejs.org/api/cluster.html)，可参考[node cluster模块](../module/cluster.md)
    * agent机制：由master fork，以“worker秘书”的身份，不处理业务，专门处理一些公共事务，减少worker资源消耗，让worker专注业务。时序图：
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
    * 用法： 根目录`agent.js`
    ```
        // agent.js
        module.exports = agent => {
            // 在这里写你的初始化逻辑

            // 也可以通过 messenger 对象发送消息给 App Worker
            // 但需要等待 App Worker 启动成功后才能发送，不然很可能丢失
            agent.messenger.on('egg-ready', () => {
                const data = { ... };
                agent.messenger.sendToApp('xxx_action', data);
            });
        };
    ```
* IPC： agent worker 通讯需要依靠master来转发，封装了messenger对象来转发消息
    * `app.messenger.broadcast(action, data)`: 发给所有的agent/app (包括自己)
    * `app.messenger.sendToApp(action, data)`: 发给所有的app，如果自己是app，也会发给自己
    * `app.messenger.sendToAgent(action, data)`: 发送给agent，如果自己是agetn，也会发给自己
    * `agent.messenger.sendRandom(action, data)`: agent随机发给app，app不能调用
    * `app.messenger.sendTo(pid, action, data)`: 发给指定进程

## 异常处理
* [onerror](https://github.com/eggjs/egg-onerror/blob/master/app.js): 主要是监听了app的error事件`app.on('error',...)`，如果有配置，会覆盖默认处理
    * errorPageUrl: String / Function 页面路径，html类型重定向这里
    * accepts: Function 识别用户请求，接受json或者html
    * all: Function 所有的，会覆盖其他的
    * html: Function 覆盖errorPageUrl
    * text: Function 
    * json: Function 
    * jsonp: Function 不需处理，会调用json

## 安全
    * XSS：主要是针对用户输入，输出进行转义
        * `helper.escape()`：字符串转义
        * `helper.sjs()`：js变量中字符转义
        * `helper.sjson()`：json的key中字符转义
        * `helper.shtml()`：html标签转义
    * 设置CSP防范xss
    * CSRF：主要是提交请求时加入Token校验

