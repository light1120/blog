# Nestjs Aop 切片

> 除了 middleware ，nestjs 提供了 4 种用于 AOP 机制的切片，帮助我们处理实际中遇到的非常具体的问题。

## Exception Filters ：异常拦截器

> 应用场景： 拦截特定异常，返回友好文案

- exceptions layer 

nest 内置了一个异常捕捉层，用于处理应用中未处理的异常。作用是为了避免异常没有处理导致应用崩溃，同时返回用户友好的文案，默认会返回如下的文案。

```
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

- HttpException : 内置 Http 异常，被 nest 拦截

`HttpException` 是 nest 内置的用于抛出 http 请求相关的异常。 可以直接抛出 `throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);` 。 也可以继承 `HttpException` 自定义异常类。

针对具体的 http 异常，nest 也提供了 `BadRequestException`,`NotFoundException`,`BadGatewayException` 等类。

- Exception filters : 自定义 filter ，通过 `@Catch` 指定拦截异常 , 通过 `@UseFilters`  绑定到 controller

除了内置，可以定义一个  `Exception filter` 来处理某个特定类型的错误。

- 自定义 filter , 实现一个错误码

这里用一个错误码 filter 为例, 创建一个 `Exception filter`
```ts
// 1、先创建 ErrorCodeException  // errorCode.exception.ts
type Lang = 'zh-CN' | 'en-GB';
const ErrorCodeMap: Record<string, Record<Lang, string>> = {
  '90000001': {
    'zh-CN': '系统异常',
    'en-GB': 'System Error',
  },
  '90000002': {
    'zh-CN': '系统异常 2',
    'en-GB': 'System Error 2',
  },
  '90000003': {
    'zh-CN': '系统异常 3',
    'en-GB': 'System Error 3',
  },
  '90000004': {
    'zh-CN': '参数错误 4',
    'en-GB': 'Argument Error 4',
  },
};
export class ErrorCodeException {
  code = '90000001';
  message = 'System Error';

  constructor(code: string) {
    this.code = code;
  }

  async getMessage(lang: Lang = 'zh-CN') {
    // 后续从错误码系统拉取
    return Promise.resolve(ErrorCodeMap[this.code][lang]);
  }
}
//2、创建 ErrorCodeFilter // errorCode.filters.ts
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { ErrorCodeException } from './errorCode.exception';
import { Response, Request } from 'express';

@Catch(ErrorCodeException)
export class ErrorCodeFilter {
  async catch(exception: ErrorCodeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = await exception.getMessage(request.cookies.lang);

    response.status(HttpStatus.OK).json({
      code: Number(exception.code),
      message: message,
    });
  }
}

// 3、在 Controller 中绑定 filter
@Get()
@UseFilters(new ErrorCodeFilter())
findAll() {
    throw new ErrorCodeException('90000003');
}
```

## Pipes ：请求参数管道

> 应用场景： 校验请求参数，拦截异常接口。 或者 在 controller 之前加工请求参数

- Custom pipes : 创建一个类，用 `@Injectable()` 声明，实现 `PipeTransform`， 用 `@UsePipes()`注入 或者 `app.useGlobalPipes()` 全局引用。

- ArgumentMetadata : 参数类型的元数据；这里是**运行时数据** 如果类型是 `ts interface`,  `metatype` 是 `undefined` 。如果是类，就是就是其构造函数

```ts
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}
```

- 使用 zod 创建一个接口参数拦截器

```ts
// 1、使用 zod 定义参数类 , 和 zod schema
import { z } from 'zod';

export class IUser {
  static zodSchema = z.object({
    name: z.string(),
    age: z.number().optional(),
  });

  name: string;
  age?: number;
}
// 2 、给 controller 参数指定类型
@Post()
create(@Body() user: IUser) {
  return this.homeService.create(user);
}
// 3、自定义 pipe
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ErrorCodeException } from 'src/ErrorCode/errorCode.exception';
import { ZodSchema } from 'zod';

@Injectable()
export class ParamsValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const metatype: any = metadata.metatype;
      if (metatype.zodSchema instanceof ZodSchema) {
        // 获取 schema 并校验
        const parsedValue = metatype.zodSchema.parse(value);
        return parsedValue;
      }
      return value;
    } catch (error) {
      // 会被 ErrorCodeFilter 拦截，并返回翻译后的文案
      throw new ErrorCodeException('90000004');
    }
  }
}
// 4、全局使用
app.useGlobalPipes(new ParamsValidationPipe());
```

- 使用内置 `ValidationPipe` 校验参数类型格式

```ts
// 1、安装依赖 pnpm add class-validator class-transformer
// 2、使用装饰器描述类的属性
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class IUser {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}
// 3、全局引用 Pipe
app.useGlobalPipes(new ValidationPipe());
// 4、校验不过返回 BadRequestException
{
    "message": [
        "name must be a string"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
// 5、自定义返回内容 // ValidationPipe 构造函数添加 exceptionFactory 方法
app.useGlobalPipes(
  new ValidationPipe({
    exceptionFactory: (errors) => {
      return new BadRequestException({
        code: HttpStatus.BAD_REQUEST,
        message: `argument ${errors[0].property} is wrong `,
      });
    },
  }),
);
// 返回内容
{
    "code": 400,
    "message": "argument name is wrong "
}
```

## Guards ： 请求守卫

> 应用场景：拦截异常请求，一般是校验 cookie  header 参数 等

- Guards : 就是一个用`@Injectable()` 声明的类，并实现了 `CanActivate` 接口 。 使用 `@UseGuards()` 或者 `app.useGlobalGuards()` 绑定 或者 全局绑定 . 拦截之后会抛出 `ForbiddenException` 异常

- Execution context： 

执行上下文，从 `ArgumentsHost` 继承，可以从上下文中获取 `request`,`response` 等数据。

- 创建一个 Guard 来校验 cookie 中 sessionId 判断是否有登陆

```ts
// 1、安装 cookie-parser ： pnpm add cookie-parser
// 2、使用 cookie-parser middleware
app.use(CookieParser());
// 3、创建 guard : nest g -g --no-spec
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const checkLogin = async (sessionId: string) => {
  // 校验接口判断
  throw new ForbiddenException('login Expired');
};

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // context.getType 'http' | 'ws' | 'rpc'
    const req = context.switchToHttp().getRequest();
    const { sessionId } = req.cookies;
    if (!/^[0-9a-z]{10}/g.test(sessionId)) {
      throw new ForbiddenException('unlogin');
      // return false; // 抛出 ForbiddenException 异常
    }
    return checkLogin(sessionId);
  }
}
```

## Interceptors : 拦截器

> 应用场景： 在 controller 执行过程 前、后 添加逻辑。 类似 middleware 的逻辑 ，遵循洋葱模型，也分 `前逻辑`，`后逻辑`

- 对比 `middleware` : 多了 `Execution context`, 可以获取更多的信息， 能做的事情更多，更能体现 `AOP` 的概率。

- 用法：创建类，用 `@Injectable()` 声明并实现 `NestInterceptor` 接口 ， 使用 `@UseInterceptors()` 和 `app.useGlobalInterceptors()` 绑定。 绑定多个拦截器，注意顺序。

- 创建三个拦截器，包括返回数据加工 ，加入 traceId 追踪， 并打印日志
```ts
// 1、创建数据加工拦截器 transform.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 加工返回数据，只有 `后逻辑`
    return next.handle().pipe(
      map((data) => {
        return {
          code: 0,
          data,
          message: 'success',
        };
      }),
    );
  }
}
// 2、创建追踪拦截器 trace.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 前逻辑，创建 traceId ，后续使用 zipkin
    const traceId = Math.random().toString(16).slice(2);
    return next.handle().pipe(
      map((data) => {
        // 后逻辑：把 traceId 加入到返回结果
        return {
          ...data,
          tid: traceId,
        };
      }),
    );
  }
}
// 3、创建日志拦截器 log.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    // 前逻辑，打印入口日志
    const startTime = Date.now();
    console.log({
      url: request.url,
      cookie: request.cookies,
      date: startTime,
    });
    return next.handle().pipe(
      tap((data) => {
        // 后逻辑，打印出口日志，包括接口耗时，这里第一个绑定拦截器，保证 后逻辑 是最后的执行逻辑
        console.log({
          url: request.url,
          data,
          time: Date.now() - startTime,
        });
      }),
    );
  }
}
// 4、绑定这3个拦截，注意顺序
app.useGlobalInterceptors(new LogInterceptor());
app.useGlobalInterceptors(new TraceInterceptor());
app.useGlobalInterceptors(new TransformInterceptor());
// 5、controller 
@Post()
create(@Body() user: IUser) {
  return user;
}
// 6、测试接口 ， body 设置为 json ，
{
    "name": "light",
    "age": 18,
    "sex": "male"
}
// 6、接口返回数据
{
    "code": 0,
    "data": {
        "name": "light",
        "age": 18,
        "sex": "male"
    },
    "message": "success",
    "tid": "252f4d9067279"
}
```

## 总结 

一个完整的 nest web 应用除了处理业务逻辑，还需要应对许多其他的场景。上面用 nest 提供的 4 中 AOP 切片，分别处理相对具体的场景。

- `Exception Filters` : 创建了一个错误码解析器，同时还具备多语言的功能。 用于业务异常的抛出，前端直接提示给用户即可
- `Pipes` : 创建了一个提交接口的参数类型校验器，用于拦截非法数据提交。
- `Guards` : 创建了一个回话态校验逻辑，用户每次的提交都需要校验，后台在校验的时候，如果未过期，要注意续期
- `Interceptors` : 创建了3个拦截器，分别用于数据加工，traceId , 日志。 用于统一返回数据格式，和业务链路上报。

