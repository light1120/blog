## Typescript 使用入门

### 环境搭建

- 1、pnpm init : 生产 package.json
- 2、pnpm add typescript -d ：安装 typscrpt 依赖
- 3、tsc init : 生成 tsconfig.json
- 4、配置 package.json script 命令 `"dev": "tsc -w"`
- 5、执行命令，tsc 会编译 ts 文件，生成在 tsconfig.json 中的 "outDir" 目录中

### 学习 ts 的语法

- 1、类型基本类型
- 2、范型
- 3、工具类型
- 4、装饰器

### 了解tsconfig

- `"declaration": true` : 会生成 .d.ts