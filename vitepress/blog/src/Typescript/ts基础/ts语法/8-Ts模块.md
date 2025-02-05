# Ts 模块

### 简介

包含 `import`,`export` 的文件就是一个模块，没有的就是全局文件。

模块是局部作用域，定义的变量只对内部可见。 如果需要外部使用，先需要 模块内部 export ，外部文件 import 才能使用。

与 ES 模块的区分在于，多了导出导入 类型

### import type

为了区分导入变量，TS 引入了 `import type` 语句用来导入 类型

```ts
// 导入
import type { TypeA } from './a';
// 或者
import { type TypeA, a } from './a';
// 或者
import type DefaultType from './a';

```

### importsNotUsedAsValues

因为类型只是编译阶段有用，执行时会被删除代码

- remove ： 默认。自动删除引入的类型
- preserve ： 保留。编译后 `import './a';` 可能会引发空执行的副作用

### CommonJS 模块

CommonJs 是 nodejs 的模块系统，与 ES 模块不兼容。

- `import =`

```ts
import fs = require('fs');
// 两者等价
import * as fs from 'fs';
```

- `export =` : `export = ` 导出的变量只能 `import = ` 导入

```ts
let obj = { foo: 123 };
export = obj;
```

### 模块定位

模块定位就是在 import 一个模块时，如何找到这个模块的真实文件位置。

- 相对模块， 如：`import { TypeA } from './a';` 会根据当前文件位置计算相对位置。
- 非相对模块，如：`import * as $ from "jquery";` 就需要根据 TS 的模块定位策略来查找真实文件位置

模块定位方法策略 `tsconfig moduleResolution`

- Classic : 早期策略 1.6 之后应该弃用。
- Node : 模仿 nodejs 的模块加载机制，支持 commonjs esm ，会查询 node_modules 和 package.json

相关 config.json 配置

- module : 编译之后的 js 模块类型
- baseUrl : 模块加载的基准目录 '.' 表示 tsconfig.json 同级目录
- paths: 明确指明模块对于的真实位置，可以用通配符指明一系列模块的地址，如下

```ts
"paths": {  // 以 '@/' 打头的模块会指向 'src/' 目录下
    "@/*": ["src/*"]
},
```

- tsc --traceResolution

编译的时候显示每个模块的解析定位

### namespaces : 命令空间

namespaces 是 ts 早期的模块的处理方式。 有了 ESM 之后， 不再推荐。

namesapces 里的变量，函数 都必须在内部使用，只有 `export` 标记的才能被外部使用

namespaces 不是纯类型模块，可能编译成对象
