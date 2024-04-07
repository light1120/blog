# Object 

> 在 javascript 中几乎所有的对象都是 Object 的实例， Object 看似很简单，也有很多小技巧可以帮助我们编写更高质量的代码。

### 1、Object.create()

> 一个现有对象作为原型创建一个新对象。 

读过一些开源框架、库源码的同学经常会看到 `Object.create(null)` 的代码用来创建一个新对象，那么为什么不直接用 `{}`字面量，而是传入 `null` 来创建一个空对象。 原因是 `{}` 实际是 `Object.create(Object.prototype)` 的结果，带有原型链的。`Object.create(null)` 更纯净，什么都没有。

### 2、Object.keys() 、 Object.values()

- keys : 返回可枚举的属性key值
- values : 返回可枚举的属性value值

不可枚举： 原型链上，key值是对象类型，enumerable 设置 false

### 3、Object.toString()

返回用于表示对象的字符串， 并非 `JSON.stringify` 进行 `序列化` 时调用的方法。 序列化时调用的方法是 [toJSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_%E6%96%B9%E6%B3%95) 

### 4、Object.defineProperty()

在对象上定义一个新属性， `Vue2` 的响应式核心方法，在创建响应式对象时，在调用 get 时进行依赖收集，在 set 调用时执行依赖回调函数

```
Object.defineProperty(obj, "key", {
  get() {
    return bValue;
  },
  set(newValue) {
    bValue = newValue;
  },
  enumerable: true,
  configurable: true,
});
```

### 5、Object.freeze() 、Object.seal() 、Object.preventExtensions()

> 都仅作用本身，原型链上依旧可以修改

- freeze : 冻结 ，无法修改值，无法扩展、删除属性 ，最严格
- seal : 固定，可以修改值，无法扩展、删除属性
- preventExtensions: 不能扩展新属性，可以修改，删除属性 ，最宽松

场景：一般用于基础库，工具中，为了防止外界修改内部属性，进而导致功能异常，需要把对象固定。

### 6、Object.entries() 、Object.fromEntries()

- entries : 对象 => 键值对数组
- fromEntries : 键值对数组 => 对象

场景1: 对象 => map 
```
const map = new Map(Object.entries(obj));
```
场景2: 过滤对象中指定的key, 处理对象中指定的key的值
```
const filterProperty = (obj,filter) => {
    return Object.fromEntries(Object.entries(obj).filter(([key,value]) => filter(key)))
}
const handleProperty = (obj,handle) => {
    return Object.fromEntries(Object.entries(obj).map(([key,value]) => [key,handle(key,value)]))
}
```