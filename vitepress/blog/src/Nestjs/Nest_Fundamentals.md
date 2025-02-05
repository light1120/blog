# Fundamentals

> 了解了 Module 、Controller 、Provider 、4个 Aop 切片 ，基本上就清楚了一个 Nest 应用的基本面貌了，但是实际生产环境中会有更多复杂的场景。围绕这 4 个方面，我需要了解一些辅助功能来解决复杂问题。

## 1、Custom Decorators : 自定义装饰器

> nest 提供了很多很多装饰器，基本满足了日常功能。具体特殊场景，我们可以创建自定义装饰器来解决一些问题。

- 组合装饰器 ：代码复用

```ts
export const Business1 = (...argv: any[]) => {
  return applyDecorators(
    doSomething1(),
    doSomething2(),
    doSomething3(),
  );
};
```

- 参数装饰器 ：获取指定的参数

> nest 没有提供 `@Cookies` 这个装饰器，我们可以写一个，因为我们经常可能需要 cookie 中的用户信息

```ts
// 需要使用 app.use(CookieParser()) 中间件，不然 request.cookies 是 undefined
export const Cookies = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return !!key ? request.cookies[key] : request.cookies;
  },
);
// home.controller.ts
@Get('/testCookies')
async testCookies(@Cookies() cookies: Record<string, string>) {
  // 或者取其中的一个值， @Cookies('uid') uid: string) {
  return cookies;
}
```

- 自定义装饰器 ：可以通过注入 `Reflector` 来获取使用 `Reflector.createDecorator` 创建的装饰器的内容

> nest 10.2.0 以上版本新增了一个 `Reflector.createDecorator` 方法可以快速创建一个装饰器

```ts
// 创建了一个装饰器
const Roles = Reflector.createDecorator<string[]>();
// 创建一个 Guard 来获取 Roles 装饰器的内容
@Injectable()
class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // context.getHandler() 是 async customDecorator(){} 方法
    // context.getClass() 是 class HomeController{} 类
    const roles = this.reflector.get(Roles, context.getHandler());
    // 如果我们的 @Roles(['admin']) 装饰在 class HomeController{} 
    // 那么获取 roles 需要 reflector.get(Roles, context.getClass());
    return roles.includes('admin');
  }
}
// home.controller.ts
export class HomeController {
  @Get('/customDecorator')
  @Roles(['admin'])
  @UseGuards(RoleGuard)
  async customDecorator() {
    return 'success';
  }
}
```

**应用场景：** 我们可以通过 `ExecutionContext` 来获取当前上下文的执行函数和 `controller` 类 。 进而配置 `Reflector.createDecorator` 创建自定义装饰，并在其他 `provider` 中注入 `Reflector` , 通过 `reflector.get` 的方式获取装饰器中内容。

## 2、Injection scope : 注入范围

> 所有的 provider 默认都是以全局单例的模式注入的 ，在特殊场景可以修改 scope 来实现非单例的模式满足功能

- `DEFAULT` : 默认，所有的 provider 都是单例。性能最佳，推进
- `REQUEST` : 一次请求过程中 provider 是单例，每次请求过程中 provider 实例不同。消耗性能，不推荐
- `TRANSIENT` : 每次注入时的实例都不同。性能最差，不推荐

`Provider` 和 `Controller` 都适用 `scope` ； `Controller` 通常只注入了一次，只有上面2中场景

```ts
@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

**应用场景：**一般绝大多数场景使用默认，性能最优； 当 provider 中包含会话态数据需要隔离时，使用 `REQUEST` ; 当 provider 中包含内部不共享状态时，使用 `TRANSIENT`; 后面两种都是牺牲了性能换来了功能，谨慎使用

## 3、Dynamic modules : 动态模块

> 通过函数调用的方式，根据参数不同返回不同的 `provider` 的 `module` 。

约定了3个静态方法，用于不同的场景。包括对于的 `async` 方法用于异步场景。 当然你也可以使用任意方法

- `register` & `registerAsync` :  仅仅在调用的 `module` 中，通过参数形式配置一个动态 module ，例如 httpModule
- `forRoot` & `forRootAsync` : 需要在不同的 `module` 中使用，例如 OrmModule
- `forFeature` & `forFeatureAsync` : 需要在不同的 `module` 中使用，但是需要修改部分特性

```ts
@Module({})
export class ConfigModule {
  static register(option): DynamicModule {
    const ConfigService = !!option ? ConfigService1 : ConfigService2
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}

@Module({
  imports: [ConfigModule.register({ folder: './config' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**应用场景：** 外部依赖 module 通常需要我们预设一些值来完成特定功能，一般使用动态模块的方式供使用者加载。 比较常见的如， `OrmModule` , `ConfigModule` , `HttpModule`

## 4、Circular dependency ： 循环依赖

> 如果有循环依赖时，依赖双方需要使用 `forwardRef` 来规避，不然会报错 。 原理就是创建了一个临时引用，来避免同步依赖加载

```ts 
@Injectable()
export class FetureService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService,
  ) {}
}

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => FetureService))
    private fetureService: FetureService,
  ) {}
}
```

**应用场景：** 应该尽量避免循环依赖，`forwardRef` 只是一个临时方案来规避报错。 腾出时间后，应该消除循环依赖。

## 5、Module reference : module 引用

> nest 提供了一个特殊的 class `ModuleRef` , 可以通过注入的方式获取 `ModuleRef` 的实例，这里其实是当前 module 的引用，进而获取任意 `provider`，这里也仅仅限于当前 `module context` 下的 `provider`，不能获取其他的，也不能获取类似 `Reflector` 全局的 `provider`

```ts
// 任意 provider , 注入 ModuleRef
constructor(private moduleRef: ModuleRef) {}
async onModuleInit() {
  // 获取 默认 scope 的 provider 
  const provider = this.moduleRef.get('Provider-Token');
  const provider2 = this.moduleRef.resolve('Provider-Token');
  // provider === provider2   // true , 单例模式
  // 获取 scope REQUEST 、 TRANSIENT 的 provider 。
  const transientProvider = await this.moduleRef.resolve('Transient-Provider-Token')
  const transientProvider2 = await this.moduleRef.resolve('Transient-Provider-Token')
  // transientProvider === transientProvider2   // false ，每次注入实例都不一样
  // moduleRef.resolve 这个操作会创建一个新的实例， 即使 scope REQUEST ，因为此时一个全新的实例， 并不是那个会话态单例。
}
```

每次 quest 请求会创建一个会话Id `contextId` 。可以通过  `ContextIdFactory.getByRequest` 的方式获取。再把 `contextId` 传入 `moduleRef.resolve` 就可以得到会话态的 单例 实例。

```ts
// home.provider.ts
@Injectable({ scope: Scope.REQUEST })
export class CustomProvider {}
// home.module.ts
@Module({
  controllers: [HomeController],
  providers: [CustomProvider],
})
export class HomeModule {}
//home.controller.ts
constructor(
  private scopeProvider: CustomProvider,
  private homeService: HomeService,
) {}

@Get('/scopeProvider')
async queryScopeProvider() {
  return await this.homeService.scopeProvider(this.scopeProvider);
}
// home.service.ts
@Injectable()
export class HomeService {
  constructor(private moduleRef: ModuleRef) {}

  // 谨慎使用，会导致注入了 HomeService 的 HomeController 处于 Scope.REQUEST 意味着每次请求都会实例化 HomeController
  // 建议通过参数的方式，将 request 作为参数传入
  @Inject(REQUEST)  
  private request: Request;

  async scopeProvider(requestProvider2: CustomProvider) {
    const contextId = ContextIdFactory.getByRequest(this.request);
    const requestProvider = await this.moduleRef.resolve(
      CustomProvider,
      contextId,
    );
    return requestProvider === requestProvider2; // true . moduleRef.resolve 获取的 provider 实例 跟注入在controller 的 provider 实例是同一个
  }
}
```

**应用场景：**  正常情况下 provider 都是全局单例的，在任意地方都可以使用 `ModuleRef.get` 方法获取实例来处理业务。 `REQUEST` 和 `TRANSIENT` 需要通过 `ModuleRef.resolve` 来创建一个全新实例。 特殊场景可以通过 `contextId` 来获取 `REQUEST` 级别的 单例 provider。 

**总结：**`ModuleRef` 提供另一个获取 provider 实例的途径

## 6、Lazy-loading modules :  懒加载模块

> 懒加载模块的场景不多见，正常业务都需要所有模块都加载完成了，再接收请求，处理业务。 

```ts
// home.service.ts
constructor(private lazyModuleLoader: LazyModuleLoader) {}

async specialBusiness() {
  // const lazyModuleLoader = this.moduleRef.get(LazyModuleLoader);
  // 上面学到了 moduleRef , 是不是想通过 moduleRef.get 来获取呢？？
  const { LazyModule } = await import('../lazy/lazy.module');
  const lazyModule = await this.lazyModuleLoader.load(() => LazyModule);
  const { LazyService } = await import('../lazy/lazy.service');
  const lazyService = lazyModule.get(LazyService);
  lazyService.runtask();
}
```

**应用场景：**  正常情况，都不需要懒加载模块，虽然会减少一些启动时间。只有在特殊场景，比如用户操作了某个特定任务，才需要做的操作，可以通过懒加载模块来加载。

## 7、Excution context : 执行上下文

> 执行上下文主要包括 `ArgumentsHost` 和它的子类 `ExecutionContext` 。 可以通过这个对象来判断，执行到当前函数时，发生了什么？ 已经执行它的调用方和类

nest 可以用于 http , ws , rpc 服务，每个服务的执行上下文，输入输出对象不同，于是有了 `ArgumentsHost` ，用于在类型上抹平这些差异。 源码很简单，就是对一个数组的操作，根据当前执行上下文类型的不同，返回指定索引的值，表示不同的对象类型。源码如下

```ts
class ExecutionContextHost {
    constructor(args, constructorRef = null, handler = null) {
        this.args = args;
        this.constructorRef = constructorRef;
        this.handler = handler;
        this.contextType = 'http';
    }
    setType(type) {
        type && (this.contextType = type);
    }
    getType() {
        return this.contextType;
    }
    getClass() {
        return this.constructorRef;
    }
    getHandler() {
        return this.handler;
    }
    getArgs() {
        return this.args;
    }
    getArgByIndex(index) {
        return this.args[index];
    }
    switchToRpc() {
        return Object.assign(this, {
            getData: () => this.getArgByIndex(0),
            getContext: () => this.getArgByIndex(1),
        });
    }
    switchToHttp() {
        return Object.assign(this, {
            getRequest: () => this.getArgByIndex(0),
            getResponse: () => this.getArgByIndex(1),
            getNext: () => this.getArgByIndex(2),
        });
    }
    switchToWs() {
        return Object.assign(this, {
            getClient: () => this.getArgByIndex(0),
            getData: () => this.getArgByIndex(1),
            getPattern: () => this.getArgByIndex(this.getArgs().length - 1),
        });
    }
}
```

**应用场景：** 我们定义的 `guard`、`interceptor`、`filter` 切片，可以通过  `ArgumentsHost` 获取当前执行上下文的类型再进行具体的操作。

## 8、Lifecycle event : 生命周期事件

> 随着异步加载，动态模块，相互依赖，Reques Scope 等特殊的功能出现，nest 应用在实例化过程变得复杂，我们可以依赖生命周期 hooks 来判断 `module` 是否完成实例化，`app` 是否启动，进而执行特殊的需求

- 1、nest 开始启动 ，扫描所有的 `provider`  由 IOC 容器来管理
- 2、根据 module 依赖关系，按照引入顺序开始实例化
- 3、实例化 module 依赖的 `controller`、`provider` , 如果有异步，等待完成
- 4、执行 依赖的 `controller`、`provider` 内的 `onModuleInit` 方法, 支持异步
- 5、执行 module 内的 `onModuleInit` 方法, 支持异步
- 6、执行 依赖的 `controller`、`provider` 内的 `onApplicationBootstrap` 方法, 支持异步
- 7、执行 module 内的 `onApplicationBootstrap` 方法, 支持异步
- 8、module 实例化完成 ，如果没有依赖关系，module 实例化过程是并行进行的，所有 module 实例化完成 ,app 实例化完成
- 9、创建 httpserver ，监听端口
- 10、nest 启动完成

以上是 nest 大概的启动过程，和生命周期 hooks 的执行时间点。


## 9、总结

- 1、自定义装饰器 ：可以帮助解决一些非常规需求，提高能力上限，重点
- 2、module 引用 ： 可以帮助我们从 IOC 容器中获取所需要的 `provider` ，提高能力上限，重点
- 3、注入 scope ：可能有性能损耗，谨慎使用，尽量不用
- 4、执行上下文 ：可以帮助获取 `provider` 当前执行环境，更准确处理业务。 