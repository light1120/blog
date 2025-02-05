# Typescript 类型

## 类型

#### 基础类型

基础类型，包含 `string`,`number`,`boolean`

#### 数组类型

数组类型就是在类型后面添加`[]`， 例如： `number[]` , `string[]`

也可以定义为 `Array<number>` 跟 `number[]` 是等价的 。这里用到 `T<U>` 范型

#### 元组类型（Tuple）

元组类型是一个数组，明确表明了一个数组里面有多少元素，以及元素的类型。 类型顺序也不可变改， 可以用 `?` 标记 可选

```ts
type TupleA = [string,number]
let tupleA:TupleA = ['1',0]

type TupleB = [string, number, boolean?]
let tupleB: TupleB = ['1', 0]
```

#### Union 类型

union 类型就是多个类型组合的类型，union 类型的变量只要满足其中一个就行 . 多个类型用关键符 `|` 连接

`let id: number | string ;`

#### Enums 枚举

Enums 枚举就是一些常量的集合。本质上是一个对象值，不是类型

**枚举运行时**

不像其他类型，在编译阶段会被删除，Enums 不会被删除，而是实例化一个对象 。等价一个 const 类型对象

- 数字枚举：默认 0 开始，依次自增 ，如果中间出现初始化值，后面的值参照它自增。 枚举中的值是可以相同的

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
// Up = 0 , Down = 1 ,
```

- 字符串枚举： 就是一些字符串常量

```ts
enum YesOrNo {
    Yes = "yes",
    No = "no",
}

```

- 混合枚举： 可以 数字 字符串混合。 字符串后面的数字都需要初始化，没有默认值。

```ts
enum YesOrNo {
    Yes = 1,
    No = "no",
}
```

#### 字面量 类型

一个具体的 字符串 数字 或者对象 也可以作为类型。变量的值 只能跟是类型一样的值。

字面量类型也可以跟非字面量类型组成 union 类型

```ts
let numberA : 1 = 1
// numberA=2 报错
```

#### 特殊类型

- any : 任意类型。 可以是任意值
  - noImplicitAny : true , 如果设置了 false，一个变量没有设置类型，且 ts 推断出类型为 `any`, 就报错
- unknow : 不知道的类型。跟 any 类似，unknow 类型变量，可以赋值任何类型数据，但是不能进行执行操作，如：取值，计算，执行等
- never : 不存在的类型。 一个抛出异常的函数的返回值类型就是 never , 不是 void 。因为不存在返回值
- null : null 类型，只有一个值 null
- undefined : undefined 类型，只有一个值 undefined
- void : void 类型 没有值 一般用于函数没有返回值
- bigInt : bigInt 类型， 字面量 `100n` 或者 `BigInt(100)` 的值
- symbol : symbol 类型， `Symbol()` 生成的值

## 使用类型

#### 类型声明

类型声明就是在定义变量 或者 函数参数，返回值 声明类型

```ts
let person: string = 'zhangsan'
let age: number = 18
function greeting(person: string): string {
    return `hello , ${person}`
}
```

#### 类型断言

可以用 `as` 关键字用作类型断言，指定一个类型 成为 另一个更明确的类型

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;

// document.getElementById 返回的是 HTMLElement 类型，用 as 指定为另一个更明确的类型。
// 前后类型需要是扩展关系，后面的类型更准确
```

#### type interface

- type ： 类型别名，可以理解为一个类型的别名。

```
// 给 对象类型 重新赋予了一个别名 Animal
type Animal = {
  name: string;
}
// 对 Animal 类型进行了扩展， 扩展之后的类型，赋予了一个别名 Bear
type Bear = Animal & {
  honey: boolean;
}
// 别名不可以重复，
```

- interface : 类型接口，定义一个对象类型

```ts
// 定义了一个名称为 Animal 的接口类型
interface Animal {
  name: string;
}
// 接口类型 Bear 集成了 Animal 接口类型
interface Bear extends Animal {
  honey: boolean;
}

// 接口名可以重复,  重名的接口会扩展
```
