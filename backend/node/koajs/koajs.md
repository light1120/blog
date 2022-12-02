## Koajs
>koajs: 下一代nodejs web框架

### 特点
* 非常轻量，一共就4个js文件；application 、context、request、response
* 仅仅是对nodejs http模块进行了封装，并创建了 app，ctx，req，res对象
* 支持async , await
* 中间件思想：核心，[将所有的中间件链式调用，依次处理请求，之后交给响应处理](https://github.com/koajs/koa/blob/master/lib/application.js#L135-L161)
```
 callback () {
    const fn = this.compose(this.middleware)
    if (!this.listenerCount('error')) this.on('error', this.onerror)
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
    return handleRequest
  }

  handleRequest (ctx, fnMiddleware) {
    const res = ctx.res
    res.statusCode = 404
    const onerror = err => ctx.onerror(err)
    const handleResponse = () => respond(ctx)
    onFinished(res, onerror)
    return fnMiddleware(ctx).then(handleResponse).catch(onerror)
  }
```

### 用法
* [官方文档](https://koajs.com/): 本身框架很简单，读读文档，看看源码基本就了解了
* [awesome-koa](https://github.com/ellerbrock/awesome-koa): 寻找适合自己需求的中间件，或者自己编写

### 洋葱模型-[koa-compose](https://github.com/koajs/compose/blob/master/index.js#L19)
其实就是将所有的中间件函数链式调用
```
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```
关键代码：`Promise.resolve(fn(context, dispatch.bind(null, i + 1)));`在执行fn1的时候，会把fn2作为fn1的next参数传入。如果执行到最后一个fn时就会直接`Promise.resolve()`, 所以在编写中间件时，需要注意`await next()`的执行位置，执行next就是执行下一个fn，`()=>Promise.resolve(fnx(...))`。
```
app.use(fn1)
app.use(fn2)
app.use(fn3)
//加载3个中间件之后的执行顺序，伪代码
function fn1(){
    do somthing1
    await function fn2(){
        do something2
        await function fn3(){
            do somthing3
            do somthing3 over
        }
        do somthing2 over
    }
    do somthing1 over
}
```
