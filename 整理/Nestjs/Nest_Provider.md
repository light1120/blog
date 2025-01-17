# Provider

> Provider 作为 nest 中的工具，是用来干活的。包括很多， 比如 nest 提供的 `services, repositories, factories, helpers` 都属于 provider ，也可以自定义，只要 `@Injectable()` 都可以作为 provider。

### 1、Standard Provider : 标准 provider 

```ts
// module
@Module({
  controllers: [HomeController],
  providers: [HomeService],  // HomeService 需要使用 @Injectable() 标注
})
// controller
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
}
```

**过程解析**

- 1、被 `@Injectable()` 装饰器声明的会被 Nest IOC 容器收集管理
- 2、解析 controller 发现有注入 provider
- 3、从 app.module 开始实例化，发现有依赖 provider , IOC 会实例化，并注入 controller

### 2、Custom Provider :  创建自定义 provider

主要分为四种 `ClassProvider` , `ValueProvider` , `FactoryProvider` ，`ExistingProvider`

- `ClassProvider` : 通过实例化类的方式创建，最常见的就是 `service`
```ts
@Module({
  controllers: [HomeController],
  providers: [
    {
      provide: 'HomeService',
      useClass: HomeService,
    },
  ],
})
```

- `ValueProvider` : 通过字面量的方式创建，通常是一个对象
```ts
@Module({
  controllers: [HomeController],
  providers: [
    {
      provide: 'HomeValue',
      useValue: {
        name: 'zhangsan',
        age: '18',
      },
    },
  ],
})
```
- `FactoryProvider` : 通过执行函数的方式，返回一个对象 或者 promise . `useFactory: (...args: any[]) => T | Promise<T>;` ; `FactoryProvider` 有个额外的 inject 的属性可以作为参数数组传给 `useFactory` 工厂方法。
```ts
@Module({
  controllers: [HomeController],
  providers: [
    {
      provide: 'HomeFactory',
      useFactory(
        homeValue: { name: string; age: number },
        homeService: HomeService,
      ) {
        return {
          name: homeValue.name,
          age: homeValue.age,
          info: homeService.findOne(homeValue.age),
        };
      },
      inject: ['HomeValue', 'HomeService'],
    },
  ]
})
```
- `ExistingProvider` : 别名的方式创建，注入时会创建相同的实例。 这里的别名是指 `token` 的别名
```ts
@Module({
  controllers: [HomeController],
  providers: [
    {
      provide: HomeService,
      useClass: HomeService,
    },
    {
      provide: 'HomeService',
      useClass: HomeService,
    },
    {
      provide: 'HomeService4',
      useExisting: HomeService, // 是 provide: HomeService 的别名
    },
    {
      provide: 'HomeService5',
      useExisting: 'HomeService', // 是 provide: 'HomeService' 的别名
    },
  ],
})
```

### 3、Custom Provider :  注入 自定义

需要使用 `@Inject( token )` 装饰器来注入， 这里的 token 就是 `provide` 属性值。 

- 在构造器中注入

```ts
@Controller('home3')
export class HomeController {
  constructor(
    @Inject('HomeService')
    private readonly homeService: HomeService,
    @Inject('HomeValue')
    private readonly homeValue: { name: string; age: number },
    @Inject('HomeFactory')
    private readonly homeFactory: { name: string; age: number; info: string },
  ) {}
}
```
- 直接在类属性中注入
```ts
@Controller('home3')
export class HomeController {
  private readonly homeService2: HomeService, //如果 token 是 HomeService 类，会自动注入，不需要手动 @Inject()

  @Inject('HomeService')
  private readonly homeService: HomeService,
  @Inject('HomeValue')
  private readonly homeValue: { name: string; age: number },
  @Inject('HomeFactory')
  private readonly homeFactory: { name: string; age: number; info: string },
}
```

### 4、Provider Token

`token` 可以作为 provider 的一个标识。他的类型是 `type InjectionToken<T = any> = string | symbol | Type<T> | Abstract<T> | Function;`

```ts
providers: [ HomeService ]
// 等价
providers: [ {
  {
    provide: HomeService,
    useClass: HomeService,
  },
} ]
// 不等价下面
providers: [ {
  {
    provide: 'HomeService',
    useClass: HomeService,
  },
} ]
```

上面 2 种 useClass 创建 provider 的方式，不等价，其中一个 `token` 是 `Function` , 另一个 `token` 是 字符串 `HomeService`

provider 是单例的，如果 `useClass` 相同，注入相同 `token` 的实例是一样的，注入不同的 `token` 的实例不一样。

如果是 `ExistingProvider` 别名 provider , 会创建相同的对象，是单例。

```ts
// module
providers: [
  {
    provide: HomeService,
    useClass: HomeService,
  },
  {
    provide: 'HomeService',
    useClass: HomeService,
  },
  {
    provide: 'HomeService5',
    useExisting: 'HomeService', // 是 provide: 'HomeService' 的别名
  },
]
// controller
private readonly homeService: HomeService,
@Inject(HomeService)
private readonly homeService2: HomeService,
@Inject('HomeService')
private readonly homeService3: HomeService,
@Inject('HomeService5') // HomeService5 是 HomeService 的别名
private readonly homeService5: HomeService,

@Get('/queryProvider')
queryProvider() {
  return {
    classToken: this.homeService2 === this.homeService,
    stringToken: this.homeService2 === this.homeService3,
    aliasToken: this.homeService5 === this.homeService3,
  };
}

// 返回结果
// "classToken": true,
// "stringToken": false,
// "aliasToken": true
```

### 5、特殊场景分析

- 1、因为 provider 是单例， 那么在并发的过程，不同的流程，操作相同的数据可能会发生混乱。 如何处理？ 

> 可以将数据存储外部持久层 , 比如 mysql redis

设置 `scope` 为 `REQUEST` , 每个请求都会实例化一个新的对象 , 就不会有数据竞态。 但是会有一些性能损耗

```ts
{
  provide: 'HomeService',
  useClass: HomeService,
  scope: Scope.REQUEST,
}
```
