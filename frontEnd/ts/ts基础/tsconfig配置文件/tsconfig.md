# tsconfig.json 说明

## compileOnSave

- strictPropertyInitialization (boolean) : ts2564 定义类的时候是属性否需要实例化
- target （'ES2015'） : 指定 ECMAScript 目标版本, 如果出现有些属性或者方法不存在，有可能设置低了
- lib (["ESNEXT","DOM"]) : ts 引入的库，默认包含 esnext dom 。如果去掉 dom , `HTMLElement` 等类型就报错
- noImplicitAny (true) : 不允许 ts 类型推断出 any。 可以主动设置其他类型，或者 any 类型

## extends

- extends (string)：扩展另一个`tsconfig.json`配置

## files

- files (array) ： 包含一个文件列表。 仅编译指定文件

## include

- include (array) ： 包含一个文件名模式列表。配置通配符指定文件列表。仅编译包含文件

## exclude

- exclude (array) ： include 的反义

## references

- references (array) : 项目引用 ，`"references": [{ "path": "./tsconfig.node.json" }]`

```
// tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

`tsconfig.node.json`配置内容 用于 vite 使用，因为环境不一样，需要单独一份独立的配置文件
