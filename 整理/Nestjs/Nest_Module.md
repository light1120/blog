> nest module 的内容并不多，就包含4个部分。但是 module 却是 nest 应用的架构组成单元，是最核心的东西。
# Module

### 1、基础

module 需要通过 `@Module()` 装饰器来注解 ，包括 `controllers`,`providers`,`imports`,`exports` 4个部分。

```ts
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
```

module 通常是一个功能模块，用来完成某一类事情。

- `controller` : 服务入口，提供哪些服务
- `providers` : 各种工具，但是用于服务这个模块的工具
- `imports`: 需要从其他 module 引入的工具
- `exports`: 可以对外提供的工具

### 2、特殊 module

- `root module` :  根模块 ，nest 应用的入口，从此处开始构建 module 依赖 graph 。从此处开始实例化，并通过依赖关系来依次实例化其他 module
- `global module` : 全局模块，如果没有 import 模块，却注入这个模块的 provider ， 会报错。 用 `@Global()` 注解的模块的 provider ，其他模块可以任意注入，无需 import
- `dynamic modules` ： 动态模块，由于模块是单例的，而且构造函数都是没有参数，那么无论什么时候实例化，这个module 的 provider 都是一样的； 动态模块，提供了一个方式，可以通过函数的形式，返回一个 自定义module 。 比如 配置模块，我们在 root module 实例化之前需要先异步加载配置模块。 

```ts
@Module({
  providers: [providers1],
  exports: [provider1],
})
export class TestDynamicModule {
  static forRoot(options?): DynamicModule {
    const provider2 = createProviders(options);
    return {
      global: true,
      module: TestDynamicModule,
      providers: [provider2],
      exports: [provider2],
    };
  }
}
```

### 3、module 思想

nest 是一个用于构建高效，可扩展的 nodejs 服务端框架。 随着项目的迭代，增长，会天然的增加复杂度，慢慢变得不可维护。 nestjs 应用了很多软件工程的思想，面向对象编程， 面向切片编程 等。 module 是一个解决问题单元，是构建应用的基础单元。 nestjs 构建了一个 graph 的数据结构用于维护所有的 module , 包括 module 直接的依赖关系。

module 是应用的核心，为了更好的组织应用，解决问题，需要我们在拆解 module 的时候，需要遵循一些原则， 就是软件工程中的 **SOLID** 原则。

- `S` : 单一功能原则 ，一个类只处理一件事情。
- `O` : 开闭原则 ，对外开放扩展，对内关闭修改。修改时，尽量不去修改已有的类，而是去扩展已经的类。
- `L` : 里氏替换原则，如果你使用了一个基类，那么你使用它所有的子类来替换，也能保证业务正常。 就是我们在面向对象设计的时候，在设计子类的时候，不应该违背基类的功能，如果子类的功能与基类功能有冲突，那么子类不能继承基类。 需要重新抽象基类。
- `I` : 接口隔离原则，客户端不应该被强制依赖不使用的接口
- `D` : 依赖倒置原则，依赖于抽象，而不是依赖于实例

在处理小应用，简单应用时，可能随随便便就可以搞定，不用关注什么架构呀，思想。 但是在处理大型应用时，复杂应用时 ，架构 ，思想 变得尤为重要，可以有效的降低应用的复杂度。 另外提到一点，设计模式也是一个有效降低复杂度的方法。

在编码的时候，不仅仅是编码，而且需要多思考。 抽象是否合理，实现是否合理，组织是否合理。

**让应用慢慢变大，而不是慢慢变复杂**