# Utility Types

> Typescript 提供了一些全局的实用工具类型[utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)，可以用来做类型转换

### Partial<Type> : 属性可选

将类型所有属性变成可选，返回一个新类型

### Required<Type> ： 属性必须按

将类型所有属性变成必选，返回一个新类型

### Pick<Type, Keys> ： 提取属性

从一个 interface 中提取部分属性 , 返回一个新 type

```
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

```

### Omit<Type, Keys> ：剔除属性

从一个 interface 中剔除部分属性，返回一个新的 type

```
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;
```

### Record<Keys, Type> ： 生成字典类型

返回一个 map 对象类型

```
type TodoPreview = Record<string, number>;

//* 参考record实现一个简单的递归类型
type Recursive<K extends string | number | symbol, T> = {
    [P in K]: Recursive<K, T> | T
}
```

### Exclude<UnionType, ExcludedMembers> ： 剔除 Union 类型中部分属性

```
type T0 = Exclude<"a" | "b" | "c", "a">;

 // T0 = "b" | "c"
```

### Extract<Type, Union> : 取 Union 中的交集

```
type T0 = Extract<"a" | "b" | "c", "a" | "f">;

  // type  T0 = "a"
```

### NonNullable<Type> : 剔除 undefined , null 类型

```
type T4 = NonNullable<string | number | undefined | null>
//type T4 = string | number
```

### Parameters<Type> : 返回函数的参数列表数组类型

Type 必须是一个函数

```
type T1 = Parameters<(s: string, t: number) => void>;

// type T1 = [s: string, t: number]
```

### ReturnType<Type> : 返回函数的返回值类型

```
type T2 = ReturnType<(s: string, t: number) => void>;

// type T2 = void
```

### ConstructorParameters<Type> : 返回构造函数的参数列表数组类型

```
interface Error {
    name: string;
    message: string;
    stack?: string;
}

interface ErrorConstructor {
    new (message?: string, options?: ErrorOptions): Error;
    (message?: string, options?: ErrorOptions): Error;
}

type T5 = ConstructorParameters<ErrorConstructor>;
// type T5 = [message?: string | undefined, options?: ErrorOptions | undefined]

type T6 = InstanceType<ErrorConstructor>
// type T6 = Error
```

### InstanceType<Type> : 返回构造函数的实例类型

