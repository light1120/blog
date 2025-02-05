# Http

> nest 最场景的就是作为一个 `web` 服务器，接收 `http` 请求，并返回相应的结果。 我们已经学习了 `module`,`controller`,`provider`,`AOP` 基本可以处理简单的业务了。但是具体到生产环境，还有很多细节需要注意，下面以 `express` 为例来探索下。

## Cookie 

- `cookie-parser` : 安装并使用中间件 , 默认 `request.cookies` 是 `undefined`
- `request.cookies('key')` : 访问 cookie
- `response.cookie('key', 'value')` : 设置 cookie
- `@Cookies` : 自定义装饰器获取 cookie 值

```ts
export const Cookies = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return !!key ? request.cookies[key] : request.cookies;
  },
);
@Get('/testCookies')
async testCookies(@Cookies() cookies: Record<string, string>) {
  // 或者取其中的一个值， @Cookies('uid') uid: string) {
  return cookies;
}
```

## Compression

压缩 response 可以带来传输效率的提升，但是也会增加 cpu 的消耗， 这是一个权衡的过程

```ts
// 安装依赖
pnpm add compression 
// 使用中间件
import * as compression from 'compression';
app.use(compression());
```

**建议**: 用 nginx 来转发下，在 nginx 开启压缩效率会更好. nodejs 并不擅长 cpu 密集任务

## Middleware

- `nest` 中间件是等价于 `express` 的中间件。 
- 线性执行，不是 koa 的洋葱模型，
- `nest` 中在 `guard` 之前调用`middleware`，所以是拿不到 `response` 对象的中的 `controller` 返回的数据。
- 建议用 `interceptor` 替换

```ts
// 创建 middleware
@Injectable()
export class HomeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('homeMiddleware log ...');
    next();
  }
}
// 给指定 path 添加 middleware
export class HomeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HomeMiddleware)
      .forRoutes({ path: 'home/testMiddleware', method: RequestMethod.GET });
  }
}

// 全局使用一个middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('global middleware log...');
  next();
});
```

## HttpModule

nest 基于 `axios` 内置了一个 `HttpModule` ，提供了一个 `HttpService` 类用来发送 http 请求.  这里是一个 `Module` 使用之前需要使用 `import` 导入， 然后再注入 `HttpService` 来使用

```ts
// home.module.ts
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
})
export class HomeModule {}

// home.controller.ts
constructor(private httpService: HttpService){}

@Get('/testHttpService')
async testHttpService() {
  // httpService.get 方法返回的是一个 rxjs 的 Observer 对象， 这里使用 httpService.axiosRef.get 跟直接使用 axios 保持一致。
  const res = await this.httpService.axiosRef.get('https://www.xxx.com/xx/xxx');
  // 先判断 http 请求状态
  if (res.status !== 200) {
    throw new HttpException('接口异常', res.status);
  }
  // 再判断 接口 返回结果， 这里返回我们前面创建的 ErrorCodeException
  if (res.data.code !== '0') {
    throw new ErrorCodeException(res.data.code);
  }
  return res.data;
}
```