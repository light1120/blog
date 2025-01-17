# Config

我们的系统会在不同的环境下运行，那么不同环境下的差异就需要使用配置来区分，在系统运行过程中，读取不同的环境下配置来实现相同的功能

常见的配置比如 运行端口，DB服务器 ip ，端口 等。

## @nestjs/config

nest 提供了 `@nestjs/config` 包来处理配置文件问题， 其实是对于 [dotenv](https://github.com/motdotla/dotenv) 的二次封装，默认会读取根目录下 `.env` 文件，并去读里面的 `key=value` 键值对作为配置属性。

```ts
// 1、安装 @nestjs/config
pnpm add @nestjs/config
// 2、在根目录创建 .env 与 src 同级 
PORT=3000
// 3、app.module.ts 下 导入 ConfigModule
@Module({
  imports: [ConfigModule.forRoot()],
})
// 4、注入 ConfigService ，并调用 get 方法获取配置
import { ConfigService } from '@nestjs/config';
// ...省略
private configService: ConfigService, // 这里注入时，需要在同级的 x.module.ts 中 import
// ...省略
this.configService.get('PORT');  // 3000
```

## 特性

@nestjs/config 提供了一些特殊可以帮助我们适应不同的应用场景

- `cache` :  提高性能，避免每次导入的时候都去加载文件。

```ts
ConfigModule.forRoot({
  cache: true,
});
```

- `envFilePath` : 指定配置文件，可以是多个，默认是根目录下 `.env` 文件 , 如果多文件出现相同的配置，以先导入的为准

```ts
ConfigModule.forRoot({
  envFilePath: ['.env', '.env.beta'],   // 出现相同字段，以 .env 为准 
});
```

- `isGlobal` : 设置成全局模块，不然就需要在每个模块里 `import`

```ts
ConfigModule.forRoot({
  isGlobal: true,
}),
```

- `load` : 自定义配置， 通过工厂函数返回一个对象

```ts
ConfigModule.forRoot({
  ignoreEnvFile: true,  // 如果根目录存在 `.env` 文件，为了避免冲突 ，可以设置忽略
  load: [
    () => {
      return { PORT: 3004 };
    },
  ],
}),
```

使用 `yaml` 文件来作为配置文件 ， 安装依赖 `pnpm add js-yaml`

```ts
import * as yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 用一个 yaml 文件管理多个环境
export const loadYaml = () => {
  const data = yaml.load(readFileSync(resolve(__dirname, './env.yaml')));
  return data[env];
};
// 一个 yaml 文件对应一个环境
export const loadYaml = () => {
  return yaml.load(readFileSync(resolve(__dirname, `./env.${env}.yaml`)));
};
```

- `expandVariables` : 扩展变量 , 支持 `HOST=127.0.0.1:${PORT}` 写法 。 不支持 `yaml` 文件这样的写法

```ts
// .env
PORT=3002
HOST=127.0.0.1:${PORT}
// app.module.ts
ConfigModule.forRoot({
  expandVariables: true,
}),
// home.controller.ts
this.configService.get('HOST')   // 127.0.0.1:3002
```

## 操作配置项

`configModule` 提供了 `configService` 可以操作配置项 

```ts
// home.controller.ts
constructor(private configService: ConfigService) {}

@Get('/env')
queryEnv() {
  this.configService.set('PORT', '3009'); // 写操作
  return this.configService.get('HOST');  // 读操作， 如果是扩展写法， 这里HOST 会同步更新为 127.0.0.1:3009
}
```

**！！！危险 : 配置写操作是一个非常危险的的操作，程序运行中修改配置可能会带来不可预测的危险，应该禁止**

如果一定要修改，建议通过版本更新。 或者修改配置文件，重启服务的方式

AOP 切片中如何注入 `configService`

```ts
// 在 log.interceptor.ts 中通过构造函数的方式加载
@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getRequest<Response>();
    // 前逻辑，打印入口日志
    const startTime = Date.now();
    return next.handle().pipe(
      tap((data) => {
        // 后逻辑，打印出口日志，包含请求方数据，接口数据，耗时等
        this.logger.log({
          //...
        });
      }),
    );
  }
}
```

- 局部切片

```ts
// 在 home.controller.ts 中 @UseInterceptors(LogInterceptor) 注入
constructor(private configService: ConfigService) {}

@Get('/env')
@UseInterceptors(LogInterceptor)
queryEnv() {
  this.configService.set('PORT', '3009');
  return this.configService.get('HOST');
}
```

由于 `configModule` 是 `global` 的，`constructor` 中注入了 `configService`。 `LogInterceptor` 可以直接通过构造函数的注入。 不能使用 `@UseInterceptors(new LogInterceptor())` 注入，会报错缺失参数

- 全局切片

```ts
// main.ts
app.useGlobalInterceptors(new LogInterceptor(app.get(ConfigService)));
```

可以通过 `app.get(ConfigService)` 的方式直接获取到 `ConfigService` 的实例，作为入参数，传入`LogInterceptor` 构造函数即可。

## 局部配置 && 命名空间

在大型项目中，可能某个 `module` 也会有自己独立的配置，可以在 `xxx.module.ts` 使用 `ConfigModule.forFeature` 创建自己独立的配置。

```ts
// home.module.ts
ConfigModule.forFeature(() => ({
  PORT: 4000,
  database: {
    HOST: 127.0.0.1,
    PORT: 5432,
  },
})),

// home.controller.ts
this.configService.get('database.HOST'); // 127.0.0.1
```

如果 `ConfigModule.forFeature` 和 `ConfigModule.forRoot` 出现相同配置项，以 `ConfigModule.forRoot` 为准。

同样的，在大型项目也可以使用  `命令空间`  来规范配置。

```ts
// main.ts
ConfigModule.forRoot({
  ignoreEnvFile: true,
  load: [
    loadYaml,
    registerAs('database', () => ({
      HOST: '127.0.0.1',
      PORT: 5433,
    })),
  ],
}),
// home.controller.ts
this.configService.get('database.HOST');  // 127.0.0.1
```