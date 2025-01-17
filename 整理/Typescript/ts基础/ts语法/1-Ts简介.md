## Typescript 简介

> Typescript 就是在 javascript 的基础上，把动态类型 转换成 静态类型。

## 静态类型

优点：

- 1、有利代码静态分析
- 2、有利于错误发现
- 3、IDE 支持
- 4、有利于文档生成
- 5、有利于代码重构
  缺点：
- 1、丧失灵活性
- 2、增加代码量
- 3、学习成本
- 4、新增编译的步骤
- 5、历史代码兼容问题

## 简介

- 1、类型声明 ： 给变量定义类型
- 2、类型推断 ： 如果没有定义类型，ts 会自行推断变量的类型
- 3、类型 ，值 ： 类型就是类型，值就是值。 不能混合，比如: 将类型赋予给值。类型在编译过程中会被删掉。

## 环境搭建

- 1、pnpm init : 生产 package.json
- 2、pnpm add typescript -d ：安装 typscrpt 依赖
- 3、tsc init : 生成 tsconfig.json
- 4、配置 package.json script 命令 `"dev": "tsc -w"`
- 5、执行命令，tsc 会编译 ts 文件，生成在 tsconfig.json 中的 "outDir" 目录中

## 学习 typescript

- 1、类型基本类型
- 2、范型 ，装饰器
- 3、工具类型
- 4、学习 tsc 、 tsconfig
- 5、tsnode 可以直接运行 ts 代码
