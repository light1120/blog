# Module & Package

## Module

> nodejs 中一个文件就是一个 module。模块导入导出有 2 种规范 CommonJs(默认)，ES module。 ES module 是未来

### 导入导出

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

### CommonJS VS ES Module

- 启用方式
  - CommonJS: 默认方式，或者以 .cjs 后缀
  - ES Module: 以.mjs 后缀，或者在项目目录 package.json 设置 `"type": "module"`
- 加载方式
  - CommonJS 是运行时加载，任意代码处都可以 require 一个模块,
  - ES Module 是编译时加载，需要在文件头部 import
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
