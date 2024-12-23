## Controller

> Controller 作为 nest 应用服务的入口， 起到一个承接服务的作用。主要关注，路由，输入，输出 这3个方面。 nest 提供了很多个装饰器使得我们可以很简单的完成这3个方面

### 1、路由：

- 全局路由 ：`@Controller('home')` . **如果跟其他的 controller 设置的全局路由一样时，以 AppModule 先导入为主，后导入会失效**
```ts
// app.module.ts ，如果 Home2Module 中也设置了 @Controller('home') 会失效
@Module({
  imports: [HomeModule, Home2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
```
- 方法路由 ：`@Get('path1')` , `@Post('path2')` . 建议不管什么`method`都使用不同的 `path` ，不建议使用相同的 path ，通过 `method` 来处理不同的事情。 方便在网关层拦截处理场景。

### 2、输入：

- request 对象 ： `@Req() request: Request` , 大而全的对象，包含了所有信息
- param 对象 ： `@Param() param: any` , 路由中设置的所有参数组成的对象。 `@Param('id') id: string` 获取参数中id
```ts
// 请求path为 /home/id/123/type/456
@Get('/id/:id/type/:type')
find(@Param('id') param: any) {
  return param;
}
```
- query 对象 ：`@Query() query: any` , 路由url的 search 部份组成的对象。`@Query('id') id: string` 获取中id值
```ts
// 请求path为 /home/find?id=123&type=456
@Get('find')
find(@Query() query: any) {
  return query;
}
```
- body 对象 : `@Body() user: IUser` , 用于 post 请求的请求 payloads。 需要注意请求头 `content-type` 如果是 `application/x-www-form-urlencoded`, 所有字段的类型都是字符串。如果是 `application/json`，会保留字段类型。
```ts
@Post()
create(@Body() user: IUser) {
  return user;
}
```

### 3、输出:

- res 对象 : `@Res() res: Response` ， 响应对象，可以操作 res 来定制信息，不要直接返回。 
  - **注意**：1、可以通过 `res.status(xx).json(xx)` , res.end() , res.send() 等直接返回数据，但是不建议这样做，会丢到 interceptor 或者 middleware 的 “后置逻辑”。 如果没有使用 res 来完成请求，接口就会一直处于 pendding 状态。
  - **注意**：2、**`@Res({ passthrough: true })`**, 可以实现即时注入了 `@Res` 也可以通过 controller 函数体来 return 数据
```ts
@Get('/find')
findOne(@Query() query: any, @Res() res: Response) {
  res.status(HttpStatus.OK).json(query);
}
```
- 返回数据 ： 直接在添加了方法路由的函数中 `return` 即可 , 普通函数 和 `async` 函数一样 `return` 的数据就是返回数据 
- 重定向 : `@Redirect('/home/find', 301)` , 添加 `@Redirect()` 重定向到新url 
- 设置状态码 ：`@HttpCode(204)`
- 设置header : `@Header('content-type', 'image/png')` , 返回一个图片

总结： 其实这些都是对 `Response` 对象的操作， `@Redirect`,`@HttpCode`,`@Header` 等装饰器，其实就是调用了 `Response` 的 api , 对应的 api 就是 `res.redirect` ,`res.status`,`res.set 或者 res.header (等价)` 。

### 4、总结

`controller` 中一般需要关注 2 个 Request 对象， Response 对象 ，使用这2个对象的 api 来处理业务逻辑，在配上一些 AOP 切片来处理非业务部份逻辑。

`Request`，`Response` 这2个对象， 底层时 可读流和可写流 ，再底层都是继承了事件。 在复杂的逻辑可以利用流，事件的一些特性来实现一些逻辑， 比如 `pipe` 逻辑，监听`close`,`finish`等事件。

- `Request` 继承 `IncomingMessage`  ，继承  `ReadableStream` ， 继承 `EventEmitter`
- `Response` 继承 `OutgoingMessage`  ，继承  `WritableStream` ， 继承 `EventEmitter`