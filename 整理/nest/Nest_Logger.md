# Logger

> 日志在后台开发体系中是非常重要的一环，良好的日志可以帮助我们更快的定位问题，追踪请求，查看系统运行情况等。

### 1、Log 特点

- 量大：后台程序一般是 `deamon` 进程， 会产生大量的日志，主要包括 系统数据，业务数据
- 复杂：日志有很多等级，每一条日志需要记录很多数据，比如，当前系统信息，时间戳，上下文，日志详细描述 等
- 安全：日志需要记录很多数据，但是有些数据，如用户敏感信息，需要过滤，或者打码。

### 2、Winston & Pino

nest 内置的logger 是 `ConsoleLogger` , 用于打印信息在控制台，不适应于生产环境。生产环境一般使用 `.log` 文件来存储，再通过 elk 技术栈将日志内容加载 , 查询

**`Winston`** 和 **`Pino`** 都是 nodejs 下非常流行的日志库，他们的周下载量都在千万级别，生产环境中可以任选其一，需要安装 `nest-winston` 或者 `nestjs-pino`。

这里以 **`Winston`** 为例：

```ts
// 1、安装依赖
pnpm add winston
// 2、创建 winston.logger.ts
import * as winston from 'winston';
export const logger = winston.createLogger({
  //
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  // 添加 transports 用于输出日志
  // 文件接收日志 winston.transports.File
  // 控制台接收日志 winston.transports.Console
  transports: [
    new winston.transports.Console ({
      filename: `./logs/master-stdout.log`,
      level: 'info',
    }),
    new winston.transports.File({
      filename: `./logs/master-stderr.log`,
      level: 'error',
    }),
  ],
});
// 3、打印日志
logger.info()
logger.error()
```

- `logger.profile` : 可以在创建一个 `ProfileInterceptor` 用于判断接口耗时
```ts
@Injectable()
export class ProfileInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        logger.profile(request.url);
        return next.handle().pipe(
            tap((data) => {
                logger.profile(request.url);
            }),
        );
    }
}
```


### 3、集成到 Nest

上面方法只能搜集到手动 `log` 的日志，无法收集到 `nest` 框架的日志。 Nest 在 `NestFactory.create` 创建时的 options 选项中提供了 `logger` 参数，同来覆盖内置的 `logger`.

```ts
// main.ts
const app = await NestFactory.create(AppModule, {
  logger: WinstonModule.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.File({
        filename: `./logs/master-stdout.log`,
        level: 'info',
      }),
      new winston.transports.File({
        filename: `./logs/master-stderr.log`,
        level: 'error',
      }),
    ],
  }),
});
```

这样我们就可以任意地方使用 `@nestjs/common` 内置的 `logger` 实现了 `LoggerService`; 提供了 `log,error,warn,debug` 等方法

```ts
// 直接实例化
private readonly logger = new Logger(LogInterceptor.name);
// 打印日志
this.logger.log()
``` 

##### 日志分割

winston 提供了 `winston-daily-rotate-file` 来处理日志分割问题。 这里需要对前面的 `transports` 进行修改下

```ts
transports: [
  new winston.transports.Console(),
  new winston.transports.DailyRotateFile({
    level: 'info',
    filename: './logs/master-stdout.%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
  }),
  new winston.transports.DailyRotateFile({
    level: 'error',
    filename: './logs/master-stderr.%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '3M',
  }),
],
```

这里设置按日分割，每天会创建一个新的日志文件

### 4、日志需要包含哪些信息

- 业务接口日志

我们创建一个 `log.interceptor.ts` 并全局使用 `app.useGlobalInterceptors(new LogInterceptor());`。 并在其他的 `useGlobalInterceptors` 之前，保证 `LogInterceptor` 的前置逻辑最先执行，后置逻辑最后执行.

```ts
// log.interceptor.ts
@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    // 前逻辑，打印入口日志
    const startTime = Date.now();
    return next.handle().pipe(
      tap((data) => {
        // 后逻辑，打印出口日志，包含请求方数据，接口数据，耗时等
        this.logger.log({
          index: 'business_nest_log',           // 日志索引，每个 nest 项目唯一
          type: 'business',                     // 日志类型，业务数据
          handle: context.getHandler().name,    // 处理 url 路由的函数名
          class: context.getClass().name,       // 处理 url 路由的controller名
          device_id: request.cookies.device_id, // 客户端唯一标识
          client_ip: request.ip,                // 客户端ip
          referer: request.headers.referer,     // referer
          user_agent: request.headers['user-agent'],    // user-agent
          url: request.url,                     // 接口 url
          host: request.headers.host,           // 接口 host
          query: request.query,                 // 接口 query
          status_code: 200,                     // http 状态码
          code: data.code,                      // 接口返回 code
          info: data.data,                      // 接口返回 data
          duration: Date.now() - startTime,     // 接口耗时
        });
      }),
    );
  }
}
```

- http请求异常日志
- nest框架运行时异常日志

我们可以创建一个 `exception.filter.ts`. 用于拦截异常并上报日志，并全局使用 `app.useGlobalFilters(new ExceptionFilter());` 。我们在 `@Catch()` 时不添加参数，就可以捕获所有的异常信息，包括 http 请求异常，和 框架运行异常

```ts
// exception.filter.ts
@Catch()  // Catch 不添加参数
export class ExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name);

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const commonLog = {
      index: 'business_nest_log',
      device_id: request.cookies.device_id,
      client_ip: request.ip,
      referer: request.headers.referer,
      user_agent: request.headers['user-agent'],
      url: request.url,
      host: request.headers.host,
      query: request.query,
    };
    if (exception instanceof HttpException) {
      this.logger.error({
        ...commonLog,
        type: 'httpException',
        status_code: exception.getStatus(),   // 返回状态码
      });
      return response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
      });
    } else {
      this.logger.error({
        ...commonLog,
        type: 'runtimeException',
        info: exception.stack,                 // 返回堆栈信息
      });
      return response.status(500).json({       // 统一返回 500 状态码
        statusCode: 500,
        message: 'system error',
      });
    }
  }
}
```

