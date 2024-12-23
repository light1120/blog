# Cache

> 缓存是从开发工程师进阶到高级工程师必备的技能，掌握缓存技能可以提高我们能力的上限。不管在前端还是后台，哪哪都有缓存，可见缓存是工程师追求性能体验的必备技能

## Cache-manager

[cache-manager](https://github.com/jaredwray/cacheable) 提供了一种基于内存的缓存，并使用 `LRU` 算法来管理。 `LRU` 是一个缓存淘汰算法，会将最近最少使用的数据进行淘汰。 类似的还有 `LFU` 算法。


```ts
// 1、安装依赖
pnpm add @nestjs/cache-manager cache-manager
// 2、导入module ， app.module.ts
imports: [
    CacheModule.register({
      ttl: 10,          // 缓存存活时间 10s
      max: 100,         // 最多缓存100个key的数据，如果缓存都存活，才有 LRU 淘汰
      isGlobal: true,   // 全局 module
    }),
]
// 3、注入 provider
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Inject(CACHE_MANAGER)
private readonly cacheManager: Cache,
// 4、获取缓存数据
await this.cacheManager.get('key');
```


### 基本操作

- get : `await this.cacheManager.get('key');`
- set : `await this.cacheManager.set('key', 'value', ttl);` 
  - 没有参数 ttl 参数，会以注册 CacheModule 时的 ttl 参数为准，如果没有默认 5000 毫秒
  - ttl : 3000  指定时间，过期时间以这个为准
  - ttl : 0 数值 0 意味着不过期
- delete : `await this.cacheManager.del('key');`
- clear : `await this.cacheManager.reset();`

## 配置 Cache-manager

在使用 `CacheModule.register` 注册时，需要关注 ttl max 这2个重要的参数

- `ttl` : `time to live` 缓存数据的存活时间
- `max` : 最大缓存数据个数

由于 `cacheManager` 默认才有内存的方式来存储缓存数据的，所以 `ttl` 和 `max` 关系到内存占用量，会跟当前应用程序同享单机内存。 所以需要设置合理的数值。

**如何修改？** 可以借助之前的 `ConfigModule` 从配置项中获取配置的数值。 如果需要修改，只要修改配置文件，然后重启程序即可。但是由于是基于内存的缓存，所以重启会导致缓存数据失效。

```ts
// 设置 yaml 配置文件
CACHE:
  ttl: 10000
  max: 10
// 通过配置项来注册 CacheModule
CacheModule.registerAsync({
  imports: [ConfigModule],  // imports 是 @nestjs/cache-manager 提供的参数
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    return config.get('CACHE');
  },
  isGlobal: true,
}),
```


## 集成到 Interceptor

`controller` 一般是先进行参数校验，然后通过调用 `provider` 来完成业务。 如果这是一个查询业务，且实时性要求没有很高，我们可以通过添加 `Cache` 来提高性能，并减轻后台服务的压力

例如：一个定时的榜单数据，后台会定时每10秒生成新的榜单数据，前端需要查询然后显示在页面上。

```ts
// home.controller.ts
@Get('/cacheQueryListService')
@UseInterceptors(CacheInterceptor)
@CacheTTL(10000)
@CacheKey('cacheQueryListService')
async cacheQueryListService() {
  return await this.homeService.queryList();
}
```

- `@UseInterceptors(CacheInterceptor)` :  缓存返回结果，默认 5000ms
- `@CacheTTL(10000)` : 设置 ttl 时间
- `@CacheKey('cacheQueryListService')` : 设置缓存 key

## 缓存到 redis 服务

`cache-manager` 默认是缓存到当前机器的内存，跟应用程序共享机器的内存；`cache-manager` 也支持配置 redis 服务 或者 redis 集群作为缓存存储

```ts
// 注册 CacheModule 时，配置 redis 服务
CacheModule.register<RedisClientOptions>({
  store: redisStore,
  host: 'localhost',
  port: 6379,
}),
```

后续学习 redis 服务之后，再来补充。