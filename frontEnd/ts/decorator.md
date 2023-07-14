# Decorator

## 装饰器简介

装饰器是一种特殊类型的声明，本质上是一个函数。可以作用于类声明，方法，属性，或者参数上。使用`@expression`这样的形式，必须是一个函数。有 5 种 类装饰器，属性装饰器，方法装饰器，访问器装饰器，参数装饰器

## 启用装饰器

在`tsconfig.json`中配置`experimentalDecorators`

```
"compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
}
```
##