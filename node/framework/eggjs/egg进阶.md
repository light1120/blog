## eggjs 进阶

## middleware

[通用配置](https://www.eggjs.org/zh-CN/basics/middleware#%E9%80%9A%E7%94%A8%E9%85%8D%E7%BD%AE)，每个中间价都支持的配置， 更多参考[match 和 ignore](https://github.com/eggjs/egg-path-matching)

- enable：控制中间件是否开启。
- match：设置只有符合某些规则的请求才会经过这个中间件。
- ignore：设置符合某些规则的请求不经过这个中间件。
