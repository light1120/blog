# Module & Package

## Module

> nodejs 中一个文件就是一个 module。模块导入导出有 2 种规范 CommonJs(默认)，ES module (未来)

### 1、导入导出

#### CommonJs

- 导出：

  ```
  module.exports = {}
  exports.xxx = xxx
  // module是一个对象，exports是modules的属性，也是一个对象，导出就给这个对象赋值或者新增属性
  ```

- 导入：
  ```
  const modulex = require('./moduleX')
  const { xxx } require('./moduleX')
  // 导入就是拿到导出对象的一个引用
  ```

#### ES Module

- 导出
  ```
  export default = {}
  export const xxx = 'xxx'
  // export 可以看作一个动词，这里分别向外导出了 default 属性和 xxx 属性
  ```
- 导入
  ```
  import * as module from './modulex'
  import modulex from './modulex'
  import { xxx } from './modulex'
  // 导入所有：module包含了default 和 xxx 2个属性，导入default：modulex 就是 default对象 ，导入指定属性: xxx
  // 如果导出定义default和指定属性，导入时会报错
  ```

### 2、CommonJS VS ES Module

- 启用方式
  - CommonJS: 默认方式，或者以 .cjs 后缀
  - ES Module: 以.mjs 后缀，或者在项目目录 package.json 设置 `"type": "module"`
- 加载方式
  - CommonJS 是运行时加载，任意代码处都可以 require 一个模块，同步加载
  - ES Module 是编译时加载，需要在文件头部 import，异步加载
- 文件内置对象
  - CommonJS 文件内有全局变量 `module` 、`__filename`、`__dirname`
  - ES Module 没有内置对象，可以使用 `import.meta.url` 查看当前文件文件的 dirname 和 filename
- 导入模式
  - CommonJS 导出的 exports 的引用，每次导入的值都是一样的，
    - `exports.num = 1` 调用内部方法修改 num 之后下次导入 num 值仍是 1
    - `exports.obj= {num: 1}` 修改 `obj.num = 2`，下次导入 obj.num 值会发生变化
    - 导出的值都是 constant 不能直接修改`num = 2`
  - ES Module 导出的值，每次导入都是当前具体的值
    - `export let num = 1` 调用内部方法修改 num 之后下次导入 num 值会发生变化
    - `export const obj= {num: 1}` 修改 `obj.num = 2`，下次导入 obj.num 值会发生变化
    - 导出的值都是 constant 不能直接修改`num = 2`
- 动态导入
  - CommonJS: 在需要的时候调用`require('module')`
  - ES Module: 在需要的时候调用 `import()` 方法
    ```
    import('modulex').then((modulex)=>{
        console.log(modulex.xxx)
        console.log(module.default)
    })
    ```

## Package

> 由 package.json 文件描述的文件夹，主要看 package.json 具体描述内容

### 1、确定模块系统

- ES Module : .mjs 后缀文件 或者设置 package.json { "type": "module" } 后的 .js 文件
- CommonJS : .cjs 后缀文件 、 package.json { "type": "commonjs" }后的 .js 文件

### 2、包入口

- main : 所有版本支持， 只能指定单一入口
  ```
  {
    "main": "./index.js",
  }
  ```
- exports : 低版本不支持，支持多入口
  ```
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
  }
  ```

### 3、package.json 其他字段

- `scripts`: 定义了相关指令，可以通过 `npm run xxx`、`yarn run xxx` 方式调用
  ```
  "scripts": {
    "dev": "xxx",
    "build": "xxx",
  },
  ```
- `dependencies`: 运行需要依赖的 package。 `npm install xxx --save` 会将安装的包添加到 dependencies。 类似 koa 基础框架
- `devDependencies`: 辅助需要依赖的 package。`npm install xxx --save-dev` 会将安装的包添加到 devDependencies。 类似 typescript 编译
- `peerDependencies`: 宿主环境需要依赖的 package。 在引入本 package 时，需要提前安装的依赖。 一般用于工具 package，库 package 等

### 4、package 版本

> 引入其他 package 时一般会有包版本号。 版本号 一般是 x.y.z (主版本号.future 版本.bugfix 版本)

- 版本号

  | 控制符 | 语义                              | 举例                                                             |
  | ------ | --------------------------------- | ---------------------------------------------------------------- |
  | ^      | 执行不更改最左边非 0 版本号的更新 | koa:^0.1.2(必须小于 0.2.0)<br>koa:^2.0.1(必须小于 3.0.0)         |
  | ~      | 锁定主版本号，或者 future 版本号  | koa: ~2(2.0.0 到 3.0.0 之间)<br>koa: ~2.1.1(2.1.1 到 2.2.0 之间) |
  | latest | 使用可用最新版本                  | koa: latest                                                      |
  | 无     | 使用指定版本                      | koa:2.0.1                                                        |

### 5、npm 安装

| npm install                    | 安装所有的包                       |
| ------------------------------ | ---------------------------------- |
| npm install package            | 安装指定包                         |
| npm install package @x.y.z     | 安装指定包指定版本                 |
| npm install package -g         | 全局安装指定包                     |
| npm install package --save     | 安装指定包并加入到 dependencies    |
| npm install package --save-dev | 安装指定包并加入到 devDependencies |
| npm install --production       | 只安装 dependencies 包含的包       |

> 如果设置了 NODE_ENV=production npm install 也只会安装 dependencies 包含的包

### 6、package-lock.json

由于 dependencies 里不是固定的版本号，包依赖的子包也不是固定的版本号，这样每次执行 npm install 安装的包的版本不是固定的，所以存在很大风险因为其他子包更新导致项目运行不了，进而引入了 package-lock.json 用来将当前依赖的包的版本固定下来，下次执行 npm install 就会安装 package-lock.json 固定下来的版本号来安装。

下面例子中打开 package-lock.json 可以看到依赖的 parser 是 7.20.15 版本

```
  "packages": {
    "": {
      "name": "my-package",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "vue": "^3.2.47"
      },
      "devDependencies": {
        "webpack": "^5.75.0"
      }
    },
      "node_modules/@babel/parser": {
        "version": "7.20.15",
        "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.20.15.tgz",
        "integrity": "sha512-DI4a1oZuf8wC+oAJA9RW6ga3Zbe8RZFt7kD9i4qAspz3I/yHet1VvC3DiSy/fsUvv5pvJuNPh0LPOdCcqinDPg==",
        "bin": {
          "parser": "bin/babel-parser.js"
        },
        "engines": {
          "node": ">=6.0.0"
        }
      },
    "node_modules/@jridgewell/gen-mapping": {...},
    "node_modules/@jridgewell/resolve-uri": {...},
    "node_modules/@jridgewell/set-array": {...},
```
