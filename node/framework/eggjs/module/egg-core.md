# egg-core 源码阅读
>egg-core是eggjs的核心，所以必须要了解下

## 继承自KoaApplication
`class EggCore extends KoaApplication ` EggCore是在Koa的基础上进行了扩展，`KoaApplication`具体做了哪些？可参考[koajs](../../koajs/koajs.md)

## 构造函数
```
 constructor(options = {}) {
    //省略
    super();
    //省略
    this.BaseContextClass = BaseContextClass;
    const Controller = this.BaseContextClass;
    this.Controller = Controller;
    const Service = this.BaseContextClass;
    this.Service = Service;

    this.lifecycle = new Lifecycle({
      baseDir: options.baseDir,
      app: this,
      logger: this.console,
    });
    this.lifecycle.on('error', err => this.emit('error', err));
    this.lifecycle.on('ready_timeout', id => this.emit('ready_timeout', id));
    this.lifecycle.on('ready_stat', data => this.emit('ready_stat', data));

    this.loader = new Loader({
      baseDir: options.baseDir,
      app: this,
      plugins: options.plugins,
      logger: this.console,
      serverScope: options.serverScope,
      env: options.env,
    });
  }
```
* Controller，Service和我们在编写代码时继承的Controller，Service都是一样的，就是`BaseContextClass`如下。这里的意义是我们在我们编写的Controller和Service代码时，可以通过this访问到 `ctx`,`app`,`config`等
```
class BaseContextClass {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config;
    this.service = ctx.service;
  }
}
```
* Lifecycle

## Todo