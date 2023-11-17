# tsconfig.json 说明

## compileOnSave

- compileOnSave (boolean) ：文件保存自动编译

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

## compilerOptions

```
allowJs (boolean) - 允许编译 JavaScript 文件。
allowSyntheticDefaultImports (boolean) - 允许从没有设置默认导出的模块中导入默认成员。
allowUmdGlobalAccess (boolean) - 允许在模块文件中访问 UMD 全局变量。
allowUnreachableCode (boolean) - 不报告无法访问的代码错误。
allowUnusedLabels (boolean) - 不报告未使用的标签错误。
alwaysStrict (boolean) - 以严格模式解析并为每个源文件生成 "use strict"。
assumeChangesOnlyAffectDirectDependencies (boolean) - 仅重新编译直接依赖的文件。
baseUrl (string) - 解析非相对模块名称的基本目录。
charset (string) - 输入文件的字符集。
checkJs (boolean) - 报告 JavaScript 文件中的错误。
composite (boolean) - 启用项目引用。
declaration (boolean) - 生成相应的 ".d.ts" 文件。
declarationDir (string) - 输出目录的 ".d.ts" 文件。
declarationMap (boolean) - 为 ".d.ts" 文件生成源映射。
diagnostics (boolean) - 输出诊断信息。
disableReferencedProjectLoad (boolean) - 在加载项目引用时禁用文件加载。
disableSizeLimit (boolean) - 删除内存限制。
disableSolutionSearching (boolean) - 禁用解决方案搜索。
disableSourceOfProjectReferenceRedirect (boolean) - 禁用项目引用重定向。
downlevelIteration (boolean) - 为迭代器和生成器提供完全支持。
emitBOM (boolean) - 在输出文件中放置一个字节顺序标记。
emitDeclarationOnly (boolean) - 仅生成声明文件。
emitDecoratorMetadata (boolean) - 为装饰器提供设计类型元数据。
esModuleInterop (boolean) - 通过创建命名空间对象来支持导入 CommonJS 模块。
exactOptionalPropertyTypes (boolean) - 区分可选属性和未定义属性。
experimentalDecorators (boolean) - 启用实验性的装饰器支持。
explainFiles (boolean) - 打印文件被包含在项目中的原因。
extendedDiagnostics (boolean) - 输出扩展诊断信息。
forceConsistentCasingInFileNames (boolean) - 不允许不一致的文件名引用。
generateCpuProfile (string) - 生成 CPU 配置文件。
importHelpers (boolean) - 从 tslib 导入辅助函数。
importsNotUsedAsValues (string) - 指定导入未用作值的错误级别。
incremental (boolean) - 启用增量编译。
inlineSourceMap (boolean) - 将源映射数据嵌入到输出文件中。
inlineSources (boolean) - 将源代码嵌入到源映射中。
isolatedModules (boolean) - 将每个文件视为单独的模块。
jsx (string) - 指定 JSX 代码生成。
jsxFactory (string) - 指定 JSX 工厂函数。
jsxFragmentFactory (string) - 指定 JSX 片段工厂函数。
jsxImportSource (string) - 指定 JSX 运行时库的导入源。
keyofStringsOnly (boolean) - 使 keyof 仅返回字符串。
lib (array) - 指定要包含在编译中的库文件。
listEmittedFiles (boolean) - 打印已发出的文件列表。
listFiles (boolean) - 打印构建输入文件列表。
locale (string) - 设置区域设置。
mapRoot (string) - 指定源映射的位置。
maxNodeModuleJsDepth (number) - 设置最大 Node.js 模块解析深度。
module (string) - 指定模块代码生成。
moduleResolution (string) - 指定模块解析策略。
newLine (string) - 指定换行符。
noEmit (boolean) - 不生成输出文件。
noEmitHelpers (boolean) - 不生成自定义辅助函数。
noEmitOnError (boolean) - 在发现错误时不生成输出文件。
noErrorTruncation (boolean) - 不截断错误消息。
noFallthroughCasesInSwitch (boolean) - 报告 switch 语句的 case 穿透错误。
noImplicitAny (boolean) - 不允许隐式 any 类型。
noImplicitOverride (boolean) - 确保覆盖基类成员时使用 "override" 关键字。
noImplicitReturns (boolean) - 不允许隐式返回。
noImplicitThis (boolean) - 不允许 "this" 的隐式 any 类型。
noImplicitUseStrict (boolean) - 不允
```

## 常用配置

```
{
  "compilerOptions": {
    "allowJs": true, //允许编译器编译JS，JSX文件
    "target": "ES2015", //指定ECMAScript目标版本
    "useDefineForClassFields": true,
    "module": "ESNext", //设置程序的模块系统
    "moduleResolution": "Node", //模块解析策略。默认使用node的模块解析策略
    "strict": true, //启用所有严格类型检查选项
    "jsx": "preserve", //preserve模式,在preserve模式下生成代码中会保留JSX以供后续的转换操作使用
    "sourceMap": true, //生成目标文件的sourceMap文件
    "resolveJsonModule": true, //允许导入扩展名为“.json”的模块
    "esModuleInterop": false, //允许module.exports=xxx 导出，由import from 导入.因为很多老的js库使用了commonjs的导出方式，并且没有导出default属性
    "lib": [ //TS需要引用的库
      "ESNext",
      "DOM"
    ],
    "forceConsistentCasingInFileNames": true, //禁止对同一个文件的不一致的引用
    "allowSyntheticDefaultImports": true, //允许从没有设置默认导出的模块中默认导入
    "skipLibCheck": true, //忽略所有的声明文件（ *.d.ts）的类型检查
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { //模块名到基于 baseUrl的路径映射的列表
      "/@/*": [
        "src/*"
      ],
    },
    "types": [ //要包含的类型声明文件名列表
      "vite/client",
      "element-plus/global",
    ]
  },
  "include": [ //包含的文件
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.js",
    "src/**/*.jsx",
    "src/**/*.vue",
  ]
}
```
