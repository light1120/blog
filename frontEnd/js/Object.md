# Object 对象

## 1、Object.create()

将一个对象创建一个新的对象，并将参数对象作为新对象的 prototype 。简单点： 就是继承了一个对象

```
const person = {
  name: "a person",
  hello: function() {
    console.log(`i am ${this.name}`);
  }
};

const me = Object.create(person);
me.hello()
me.name = 'Light';
me.hello()
```

- `me.name = 'Light'` 会在 me 对象创建一个新属性`name`，并不会直接修改 perseon 的 name 属性
- `Object.create(null)` 为什么要这样创建对象？ 而不是直接用 `{}`
  - `{}`对象，其实是`Object.create(Object.prototype)`返回的结果，`{}`的原型链上有有方法或者属性，例如：`hasOwnProperty`，`toString`
  - `Object.create(null)` 返回的一个空对象，什么都没有。如果需要使用 Object 原型链上的方法，可以使用 call apply 或者自己实现
  - 一般使用场景：创建非常简洁高度定制的对象，如：数据结构、基类。 也可以避免`for in`检查原型链

## 2、Object.seal() vs Object.freeze()

- seal: 将一个对象固定，不可新增属性，不可删除属性，可以访问和修改属性
- freeze: 将一个对象禁锢，只能访问属性，不可修改属性，不可新增，删除属性

## 3、Object.entries

将对象键值对转换成数组

```
Object.entries({
  a: 1,
  b: 2,
})
//[['a',1],['b',2]]
```

## 4、Object.fromEntries

与 Object.entries 相反，将数组转换成对象

```
Object.fromEntries([['a',1],['b',2]])
//{a: 1, b: 2}
```
