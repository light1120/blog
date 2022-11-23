## eggjs

### eggjs简介
- [官方文档](https://www.eggjs.org/zh-CN/basics)
- eggjs是在[koajs](https://koajs.com/#introduction)的基础上进行了功能增强
- 微内核+插件机制，每个单一功能都由单一插件来完成，达到模块解藕的效果
- 奉行**约定由于配置** ，就是固定的目录，文件做固定的事情，减少团队沟通成本
- [渐进式开发](https://www.eggjs.org/zh-CN/intro/progressive)，系统演进过程中，抽离通用部分形成插件，多个插件组成framework。业务系统只需引入framework，然后专注业务即可

### 基础功能
框架规范约定：
```
egg-project
├── package.json
├── app.js (可选)
├── agent.js (可选)
├── app
|   ├── router.js
│   ├── controller
│   |   └── home.js
│   ├── service (可选)
│   |   └── user.js
│   ├── middleware (可选)
│   |   └── response_time.js
│   ├── schedule (可选)
│   |   └── my_task.js
│   ├── public (可选)
│   |   └── reset.css
│   ├── view (可选)
│   |   └── home.tpl
│   └── extend (可选)
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config
|   ├── plugin.js
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```
- `app/router.js` 用于配置 URL 路由规则，具体参见 [Router](./router.md)。
- `app/controller/**` 用于解析用户的输入，处理后返回相应的结果，具体参见 [Controller](./controller.md)。
- `app/service/**` 用于编写业务逻辑层，可选，建议使用，具体参见 [Service](./service.md)。
- `app/middleware/**` 用于编写中间件，可选，具体参见 [Middleware](./middleware.md)。
- `app/public/**` 用于放置静态资源，可选，具体参见内置插件 [egg-static](https://github.com/eggjs/egg-static)。
- `app/extend/**` 用于框架的扩展，可选，具体参见[框架扩展](./extend.md)。
- `config/config.{env}.js` 用于编写配置文件，具体参见[配置](./config.md)。
- `config/plugin.js` 用于配置需要加载的插件，具体参见[插件](./plugin.md)。
- `test/**` 用于单元测试，具体参见[单元测试](../core/unittest.md)。
- `app.js` 和 `agent.js` 用于自定义启动时的初始化工作，可选，具体参见[启动自定义](./app-start.md)。关于`agent.js`的作用参见[Agent 机制](../core/cluster-and-ipc.md#agent-机制)。

由内置插件约定的目录：

- `app/public/**` 用于放置静态资源，可选，具体参见内置插件 [egg-static](https://github.com/eggjs/egg-static)。
- `app/schedule/**` 用于定时任务，可选，具体参见[定时任务](./schedule.md)。

**若需自定义自己的目录规范，参见 [Loader API](https://eggjs.org/zh-cn/advanced/loader.html)**

- `app/view/**` 用于放置模板文件，可选，由模板插件约定，具体参见[模板渲染](../core/view.md)。
- `app/model/**` 用于放置领域模型，可选，由领域类相关插件约定，如 [egg-sequelize](https://github.com/eggjs/egg-sequelize)。


### 如何上手？
[官方如何教程](https://www.eggjs.org/zh-CN/intro/quickstart)

可以从一次http请求开始`http://127.0.0.1:7001/user`，这里先去头去尾（去掉页面渲染部分，去掉数据持久层）
    
- 1，定义路由 `app/router.js`
    - 分别定义每个请求方法、路径、接受请求方法；
        `router.get('/user', controller.user.info);`
    - 定义所有http请求方法路由；
        `router.verb('path', app.controller.action);`
    - 定义一套restfulApi，快速生成curd结构
        `app.router.resources('routerName', 'pathMatch', controller)`
- 2，定义controller `app/controller/xx.js`  
    - 获取用户通过 HTTP 传递过来的请求参数。
        - ctx.query : 获取url中search部分
        - ctx.params : 获取路由上的参数 ctx.params.id 取 '/user/:id'
        - ctx.request.body : 请求中的body数据
        - ctx.headers : 请求header
        - ctx.get : 同上，获取header数据
        - ctx.cookies:  .get .set 获取设置cookie数据
        - ctx.session: 直接对ctx.session.key读取或者设置
    - 校验、组装参数。
        - 使用[validate](https://github.com/eggjs/egg-validate)插件
        - `ctx.validate(rule, [body])`
    - 调用 Service 进行业务处理，必要时处理转换 Service 的返回结果，让它适应用户的需求。
        - 在service中定义方法 `ctx.service.fn(xx)`
    - 通过 HTTP 将结果响应给用户。
        - ctx.status : 设置状态码
        - ctx.body : 设置返回body，这里是ctx.response.body不是ctx.requset.body
        - ctx.render : 渲染模版 `ctx.render(template)`
        - ctx.set : 设置header`ctx.set(key, value)` 
        - ctx.cookies.set : 设置cookie
        - ctx.redirect(url) : 重定向
- 3，定义service `app/service/xx.js`
    - service关注具体业务逻辑
    - 独立性，可重复被单个，多个controller调用
    - 举例：
        - 对数据库进行curd操作
        - 做某些计算
        - 发送http请求其他服务，返回结果

### 丰富业务
- 创建配置项
    ```
    config
    |- config.default.js
    |- config.prod.js
    |- config.unittest.js
    `- config.local.js
    ```
    ```
    export default (appInfo)=>{
        const config = {}
        //config.xxx = {}
        //config.yyy = {}
        return config 
    }
    ```
    - 在固定文件中配置各个环境的配置项
    - 写法：`exports.key = value`
    - 读取：`app.config.key`
    - 内置appInfo：字段如下

    |appInfo属性|说明|
    |-----|-----|
    |pkg|package.json|
    |name|package.json name|
    |baseDir|应用代码目录|
    |HOME|/home/xxx|
    |root|应用根目录，只有在 local 和 unittest 环境下为 baseDir，其他都为 HOME。|

- 使用插件  
    ```
    // 安装插件
    $ npm i egg-mysql --save

    // 注入插件
    // config/plugin.js
    exports.mysql = {
        enable: true,
        package: 'egg-mysql',
    }

    // 配置插件
    // config/config.env.js
    exports.mysql = {
        // 单数据库信息配置
        client: {
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: '123456',
            database: 'light_test',
        },
        app: true,
        agent: false,
    };

    // 调用插件方法
    app.mysql.query(sql, values);
    ```
- 框架扩展
    - 提取util函数
        ```
        // app/extend/helper.js
        module.exports = {
            foo() {
                //do something
            },
        };
        ```
        在任意地方可以使用 `ctx.helper.foo`
    - 扩展内置对象  `app/extend/{application,context,agent,request,response}.js` 同理，可以在这些内置对象中创建foo函数
- 打印日志
    - ctx.logger.info
    - ctx.logger.error
    - ctx.logger.warn
    - ctx.logger.debug
- 定时任务 `app/schedule/xxx.js`
    - 创建定时任务
        ```
        module.exports = {
            schedule: {
                interval: '1m', // 1 分钟间隔
                type: 'all', // 指定所有的 worker 都需要执行
            },
            async task(ctx) {
                const res = await ctx.curl('http://www.api.com/cache', {
                dataType: 'json',
                });
                ctx.app.cache = res.data;
            },
            };
        ```
    - 定时方式
        - schedule.interval: 每个一定时间只想任务5000或者'5m'
        - schedule.cron: 按照[cron-parser](https://github.com/harrisiirak/cron-parser)格式来，支持 秒，分，时，天，月，星期
    - 手动执行定时任务 `app.runSchedule('xxx')`

