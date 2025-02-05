# Typscript Type Manipulation

> ts 提供了强大的类型系统，还可以操作一些类型得到一个新的类型。

主要包括：

- 范型 Generics
- `keyof` , `typeof` 关键字
- 索引访问一个类型的子集
- 条件类型 (Conditional type)
- 映射类型 ( mapped type )
- 模版字面类型

### 范型 Generics

范型就是不固定类型， 给予了操作多种类型能力，让类型作为参数。 在使用的时候传入不同类型获得不同能力。

```ts
function identity<T>(arg: T): T {
    return arg;
}
```

上面就是一个范型函数，T 是一个类型参数，可以是任意值。 在使用的时候需要明确 T 的类型，例如：`identity<string>('1')`。
在日常工作中可能已经用到了 `Array<number>` , `Array<T>` 就是一个数组的范型构造函数。

- 范型接口

```ts
interface GenericIdentityFn<T> {
    (arg: T): T;
}
function myIdentity<T>(arg: T): T {
    return arg;
}
let myIdentity1: GenericIdentityFn<number> = myIdentity
let myIdentity2: GenericIdentityFn<string> = myIdentity
myIdentity1(1)
myIdentity2('1')
```

`这里有点奇怪，把一个函数赋值给一个接口类型的变量。`
1、如果接口类型还有其他类型，那么必须把一个实现了接口所有定义的对象赋值给一个接口类型变量。
2、如果接口类型中全部是函数，那么可以把一个实现了其中一个定义的函数赋值给一个接口类型变量。

第 2 点为什么成立，其一函数是第一类对象，可以赋值给接口类型变量。 其二函数是可以重载的，所以只实现了一个定义的函数可以赋值

- 范型类

```ts
class GenericNumber<NumType> {
    zeroValue: NumType;
    add: (x: NumType, y: NumType) => NumType;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
    return x + y;
};
```

- 范型约束

```ts
function identityNumber<T extends number>(arg: T): T {
    return arg;
}
identityNumber<number>(1)
// identityNumber<string>('1') 报错
```

通过 `extends` 关键字 对 类型参数 `T` 进行约束

### Keyof

返回一个对象的 key 组合成的 union 类型

```ts
type Point = { x: number; y: number };
type P = keyof Point;
// type P = 'x' | 'y'

type Mapish = { [k: string]: unknown };
type M = keyof Mapish;
// type M = string | number
// 因为对象有一个 number索引属性
```

实现一个 MyKeyof ??

```ts
type MyKeyof<T> = T extends Record<(infer TypeKeyOf), any> ? TypeKeyOf : never
type MyKeyof2<T> = T extends { [K in infer TypeKeyOf]: any } ? TypeKeyOf : never
type mykeyof = MyKeyof<Point>
// type mykeyof = keyof Point
type mykeyof2 = MyKeyof2<Mapish>
// type mykeyof2 = string | number
```

### typeof

跟 javascript 内置的 typeof 一样，返回一个值的类型。 后面接受的是“值”，不是“类型”

```ts
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
// type P = {
//    x: number;
//    y: number;
// }
```

### 索引访问类型 Object[type]

只能用类型索引。 `Person["age"]` 中的 `"age"` 是 类型，不是 值 。

```
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
// type Age = number

type I1 = Person["age" | "name"];
// type I1 = string | number

type I2 = Person[keyof Person]
// type I2 = string | number | boolean

```

`number` 关键字可以获取数组的元素的类型，是所有元素的类型的 union

```ts
const MyArray = [
    { name: "Alice", age: 15 },
    { name: "Bob", age: 23 },
];
type Person = typeof MyArray[number];
// type Person = {
//    name: string;
//    age: number;
// }

const MyArray2 = [
    { name: "Alice", age: 15 },
    { name: "Bob", sex: 'male' },
];
type Person2 = typeof MyArray2[number];
// type Person2 = {
//     name: string;
//     age: number;
//     sex?: undefined;
// } | {
//     name: string;
//     sex: string;
//     age?: undefined;
// }
```

### 条件类型 Conditional Types

用法： `type NewType = SomeType extends OtherType ? TrueType : FalseType;`

```ts
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>;
// type Str = string

type Num = Flatten<number>;
//type Num = number
```

`infer`关键字: 从一个类型中推断一个新类型。

用法： `type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;` 这里用`infer Item` 推断出数组的元素类型，`Item` 是新类型的的别名，可以任意非关键字

```ts
// 上面的 keyof 的实现也是用了 infer 关键字
type MyKeyof<T> = T extends Record<(infer TypeKeyOf), any> ? TypeKeyOf : never

// ReturnType 的实现

type GetReturnType<Type> = Type extends (...args: never[]) => infer ReturnType
  ? ReturnType
  : never;

// 如果遇到函数重载，返回最后一个

declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
declare function stringOrNum(x: string): number;

type T11 = ReturnType<typeof stringOrNum>;
// type T11 = number
```

`Distributive Conditional Types` 分布条件类型

如果传入的是一个 union 类型，结果就是 union 的每个类型分布进行条件类型后的组成一个新 union。

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr = ToArray<string | number>;
// type StrArrOrNumArr = number[] | string[]

type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
type ArrOfStrOrNum = ToArrayNonDist<string | number>;
// 分布条件是默认行为，如果期望避免分布条件，可以用 [] 包裹下，[Type] extends [any]
// type ArrOfStrOrNum = (string | number)[]
```

### 映射类型 Mapped Types

Mapped Type 就是一个范型类型，利用 PropertyKey 的 union 通过 遍历 key 创建一个新类型。

```ts
// 实现一个 Partial
type Person = { age: number; name: string; alive: boolean };
type MyPatrial<Type> = {
    [Key in keyof Type]?: Type[Key]
}
type PatrailPerson = MyPatrial<Person>
// type PatrailPerson = {
//     age?: number | undefined;
//     name?: string | undefined;
//     alive?: boolean | undefined;
// }


// 实现一个 Required
type MyRequired<Type> = {
    [Key in keyof Type]-?: Type[Key]
}
type RequiredPerson = MyRequired<PatrailPerson>
// type RequiredPerson = {
//     age: number;
//     name: string;
//     alive: boolean;
// }
```

映射类型修改： 可以通过 添加 `readonly`,`?` 给类型附加条件。 也可以 `-readonly`,`-?` 去掉这些条件。

通过 `as` 关键字再次映射

```ts
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
type LazyPerson = Getters<Person>;
// type LazyPerson = {
//     getAge: () => number;
//     getName: () => string;
//     getAlive: () => boolean;
// }
```

### 模版字面类型 Template Literal Types

可以通过字符串模块的方式组合成新类型

```ts
type An = 'A1'|'A2'
type Bn = 'B1'|'B2'
type Cn = `${An|Bn}_C`
// type Cn = "A1_C" | "A2_C" | "B1_C" | "B2_C"
type Dn = 'D1'|'D2'
type En = `${Cn}_${Dn}`
// type En = "A1_C_D1" | "A1_C_D2" | "A2_C_D1" | "A2_C_D2" | "B1_C_D1" | "B1_C_D2" | "B2_C_D1" | "B2_C_D2"
```

内置了一些字符串操作类型

- `Uppercase<StringType>` : 全部转换成大写

```ts
type Greeting = "Hello, world"
type upperGreeting = Uppercase<Greeting>
// type upperGreeting = "HELLO, WORLD"
```

- `Lowercase<StringType>` : 全部转换成小写

```ts
type Greeting2 = "HELLO, WORLD"
type lowerGreeting = Lowercase<Greeting2>
// type lowerGreeting = "hello, world"

```

- `Capitalize<StringType>` : 首字母大写

```
type Greeting3 = "hello, world"
type capGreeting = Capitalize<Greeting3>
// type capGreeting = "Hello, world"
```

- `Uncapitalize<StringType>` : 首字母小写

```ts
type Greeting4 = "HELLO, WORLD"
type unCapGreeting = Uncapitalize<Greeting4>
// type unCapGreeting = "hELLO, WORLD"
```
