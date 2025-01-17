# vite

> [vite](https://cn.vitejs.dev/) 自称是下一代前端工具链，为开发提供极速响应。[vite](https://www.npmjs.com/package/vite) 周下载已经破千万，最近一年已经翻倍。当下非常流行

### vite 是什么？

- 开发服务器 -> 基于 esbuild ，用于开发环境
- 一套构建指令 —> 使用 roolup 打包 ，用于生产环境

### vite 为什么用2个不同的工具？

esbuild 用 go 编写处理资源时非常快。 rollup 插件生态更完善，在处理 ESM 上表现更优秀，包体积更小。选择 2 个不同的工具旨在开发和生产环境都提供更好的开发体验。

### vite 如何保障开发，生产环境表现一致？

- 1、配置管理：使用统一的配置`vite.config.js`给 esbuild , rollup 下发同样的配置参数。 
- 2、代码处理：ES、TS 、JSX 、CSS 资源处都交给了 esbuild 处理。 开发生产都调用的是内部插件`vite:esbuild`，作用是调用esbuild来处理。  

即使如此， 毕竟 esbuild 、rollup 是 2 个不同的工具，在开发、生产环境表现不可能完全一致。 Vite 提供了[构建选项](https://cn.vitejs.dev/config/build-options.html) 专门作用于 rollup 的生产构建。 vite还提了个最终解决方案： 使用单一构建工具[rolldown](https://rolldown.rs/) 用来替代 esbuild ， rollup。 目前还未融入到 vite , 未来可期。

### vite 中 esbuild 和 rollup 到底是如何分工的

- esbuild: 
    - js : 用于 es ts jsx tsx 代码编译
    - css : 用于 less sass 等转换成 css 代码
    - 依赖预构建: 使用 esbuild 遍历 ast ，找到所有的依赖项， 并转换 ESM 格式
- rollup
    - 代码打包，chunk 拆分
    - treeshaking
    - 处理静态资源
    - 插件系统

rollup: 搞设计，搭系统 

esbuild: 专门处理脏活，累活，干的贼快

### vite 开发服务器为什么快？

> Vite 将应用中的模块区分为 依赖 和 源码 两类

- 1、依赖：项目依赖的包，使用 esbuild 构建 ，速度快
- 2、缓存：文件缓存在`node_modules/.vite/deps`目录，并使用 max-age 强缓存在浏览器
- 3、源码：开发者编写的代码，不打包，使用原生 ESM 的方式加载。

总结： 用 esbuild 构建项目依赖，并缓存，不打包，用 ESM 的方式加载

### vite 依赖预构

> 虽然 Vite 采用不打包，直接加载ESM的方式来提升开发效率。但是随着项目引入的包增多，复杂，开发服务器的效率越来越低，一个简单的项目背后可能有成百上千的包，依赖预构建就是为了优化这里。

执行`pnpm run dev -d`关注`vite:deps`日志，可以看到依赖预构建的相关日志。可以添加`--force`重置依赖预构建

依赖预构建做了什么？ 
- CommonJs 、UMD 兼容 ： 由于vite开发服务将所有的代码视为 ESM 模块，因此为了兼容，需要将其他模块转换成 ESM。
- 内部模块合并：有些包内部有很多子模块，如`lodash-es`，导致在加载时会有很多的请求，需要将内部模块合并成一个文件。
- 文件缓存: 构建的时候缓存在`.vite/deps_temp` , 页面访问时，会将文件缓存到 `.vite/deps`
- 浏览器缓存: 通过http头`max-age=31536000, immutable`强缓存到浏览器

monorepo : 在monorepo下，如果引入的是 monorepo 下的另一个包 `pkg2`，并不会对这个包依赖预构建， 而是对 `pkg2` 的依赖进行依赖预构建。 即使用添加到 `optimizeDeps.include` 中，仅仅会在`.vite/deps`生成文件，代码中的引入仍不会变。

```
// 开发服务器下的源码
// 可以看到 vue.js 被预构建了，从 /node_modules/.vite/deps 目录加载
// func1 是从 monorepo 另一个 package 加载的， 并没有预构建
import {createApp} from "/node_modules/.vite/deps/vue.js?v=ad5a200b";
import "/src/style.css";
import App from "/src/App.vue";
import {func1} from "/@fs/.../packages/vite-test1/src/index.ts?t=1712565738928";
createApp(App).mount("#app");
```

### vite 中的指令

指令：
- `vite` : 启动开发服务器
- `vite build` : 构建生产版本
- `vite preview` : 本地预览生产版本，不可用于生产服务器

参数： 字符前面是1个短横，单词前面是2个短横
- `-h` : 显示帮助
- `-d` : 输出vite各个模块debug信息
- `-c` : 指定配置文件
- `--force` : 忽略缓存，强制构建

### vite 中的 执行 vite 命令做了什么

执行 vite 命令的作用是启动开发服务器，具体做了什么呢？源码在 [_createServer](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/index.ts)这里，归纳下就是 httpServer , WsServer , PluginContainer , HMR

```
// 下面是伪代码
export async function _createServer(){

resolveConfig()             // 全局配置
resolveHttpsConfig()        // http配置
resolveChokidarOptions()    // 文件监听配置

resolveHttpServer()         // 创建httpServer
createWebSocketServer()     // 创建WsServer

const watcher = chokidar.watch([],resolvedWatchOptions)     // 监听文件
new ModuleGraph()                                           // 创建 模块依赖图 数据结构 ，用于处理 HMR  
createPluginContainer()                                     // 插件容器
devHtmlTransformFn = createDevHtmlTransformFn(config)       // 处理HTML文件

let server: ViteDevServer = {}                  // ViteDevServer 对象

const onHMRUpdate = async (){}                  // HMR 会调函数
watcher.on('change', async (file) => {})        // 监听文件修改
watcher.on('add', (file) => {})                 // 监听文件添加
watcher.on('unlink', (file) => {})              // 监听文件删除

middlewares.use(transformMiddleware(server))    // 添加中间件， 304处理，添加强缓存头 在这里

return server                                   // 返回对象实例，在 cli.ts 中调用 app.listen 监听端口
```

### vite 插件系统

vite 开箱自带了很多插件，基本只需要 `@vitejs/plugin-vue`, `@vitejs/plugin-react` 来处理 vue 或者 react 即可。但是日常工作中可能还有需要些特殊场景，需要用到其他的插件，或者自己实现一个插件。 [官方推荐插件](https://github.com/vitejs/awesome-vite#plugins)

开发插件其实很简单，就是一个返回 Plugin 类型对象的函数，`import type { Plugin } from 'vite'` 。 工作中要利用 `Plugin` 提供的钩子函数或者配置来实现具体的业务需求，就需要了解 `Plugin` 中钩子函数的作用。

- `enforce?: 'pre' | 'post'` : 插件执行顺序。 Plugin 类型定义 注释了插件执行顺序。源码在 `src/node/plugin/index.ts  resolvePlugins 函数`
```
* Plugin invocation order:
* - alias resolution            // alias 插件
* - `enforce: 'pre'` plugins    // enforce:pre 插件
* - vite core plugins           // vite 核心插件
* - normal plugins              // normal 插件，没有enforce值
* - vite build plugins          // 构建插件
* - `enforce: 'post'` plugins   // enforce:post 插件
* - vite build post plugins     // 构建特有插件
```
- `apply?: 'serve' | 'build'`:  插件使用环境。
- 通用钩子
    - options
    - buildStart
    - resolveId
    - load ：自定义加载器
    - transform : 用来转换单个模块， 很重要
    - [官网-其他钩子](https://rollupjs.org/plugin-development/)
- vite 独有钩子
    - config  ： 解析 Vite 配置前调用
    - configResolved ：解析 Vite 配置后调用， 返回最终配置
    - configureServer ：配置开发服务器，比如添加中间件等
    - configurePreviewServer ：配置预览服务器
    - transformIndexHtml ：专门用于 index.html 
    - handleHotUpdate ： 用于 HMR

```
// 可以定义一个插件，打印钩子函数的参数信息，用户调试，并详细了解钩子函数的作用
const MyPlugin = ()=>{
  return {
    name: 'My-plugin',
    options: (info)=>{
      console.log('options:',info)
    },
    buildStart: (info)=>{
      console.log('buildStart:',info)
    },
    resolveId: (source,importer,options)=>{
      console.log('resolveId:',source,importer,options)
    },
    load: (id,options)=>{
      console.log('load:',id,options)
    },
    transform: (src,id)=>{
      console.log('transform:',id)
    },
    config: (config,env)=>{
      console.log('config:',config,env)
    },
    configResolved(resolvedConfig) {
      console.log('resolvedConfig:',resolvedConfig.plugins)
    },
    configureServer(server) {
      console.log('configureServer:',server.middlewares)
    },
    transformIndexHtml(html) {
      console.log('html:',html)
      return html
    },
    handleHotUpdate({ server, modules, timestamp }) {
      for (const mod of modules) {
        console.log('handleHotUpdate',mod.id)
      }
      console.log(server.hot.channels)
    }
  } as Plugin
}
```

### vite esbuild 不支持 typescript emitDecoratorMetadata

核心就是使用 `swc.transform` 或者 `typescript.transpileModule` 来替代 esbuild 来编译 包含 装饰器的 ts 文件。 例如 `electron-vite` 的 `swcPlugin`.

```
// 下面是使用 swc 和 typescript 来编译的伪代码
const decoratorsPlugin = ()=>{
  return {
    name: 'vite-plugin-decorators',
    transform(src, id) {
      if (xxx) { // 校验需要编译的 ts 文件
        const typescript = require('typescript');
        const program = typescript.transpileModule(src, {
          fileName: id,
          compilerOptions: options,
        });
        return {
          code: program.outputText,
          map: null,
        };
      }
      // 或者使用 swc 来编译
      if (xxx) { // 校验需要编译的 ts 文件
        swc = require('@swc/core')
        const result = await swc.transform(code, options)
        return {
          code: result.code,
          map: result.map
        }
      }
    },
  };
}
```