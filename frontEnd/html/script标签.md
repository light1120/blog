# Script 标签

> html 中的 script 标签用于加载并执行一段 js 代码

## 一般情况下 script 标签

`<script src="main.js"></script>`

- 位置：header 或者 body 都行
- 阻塞性：加载和执行都会阻塞整个文档的渲染，如果要操作 dom，一般放到 body 中 dom 后面
- 没有 module 概念 ， 开发过程中的 import 的文件，都需要打包到 js 文件中，

## module ： es module

`<script type="module" src="main.js"></script>`

设置 `type="module"` 可以让浏览器支持 元素 `es module` ，支持 `import` 等语法， 无须打包

## 异步加载 defer async

正常情况下 script 的加载执行是阻塞其他元素，只有加载并执行完了才会渲染其他的元素。 浏览器提供了 2 中异步加载 script 的方式

- async : 不阻塞，异步加载。加载完了，就执行。执行时，会阻塞 Dom 渲染。 module script 的依赖也会并行加载执行。
- defer : 不阻塞，异步加载。加载完了，不执行。等等 DOMContentLoaded 触发执行。 defer 仅支持 src 外接
