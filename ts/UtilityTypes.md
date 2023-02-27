# Utility Types

> Typescript 提供了一些全局的实用工具类型[utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)，可以用来做类型转换

### 1、Pick<Type, Keys>

从一个 interface 中提取部分属性 , 返回一个新 type

```
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

```

### 2、Omit<Type, Keys>

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

### 3、Partial<Type>

将类型所有属性变成可选，返回一个新类型

### 4、Required<Type>

将类型所有属性变成必选，返回一个新类型

### 5、Record<Keys, Type>

返回一个 map 对象类型

```
type TodoPreview = Record<string, number>;

//* 参考record实现一个简单的递归类型
type Recursive<K extends string | number | symbol, T> = {
    [P in K]: Recursive<K, T> | T
}
```
