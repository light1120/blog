# PNPM

> 在 pnpm 之前一个简单的项目的 node_module 目录下有很多文件占据了很大的空间，很多的项目就给磁盘带来了压力。而且每次安装都是从远程拉取，也影响了安装速度。还有幽灵依赖（可以引入未在 package.json 中定义的包）的问题

## 简介

pnpm 是快速的，节省磁盘空间的包管理工具

## 原理

极大优化了上述的 磁盘空间，安装速度，幽灵依赖的问题。

- node_module 中 使用软链保持平级。避免重复依赖
- 下载的时候会优先从 缓存 store 中拉取，没有再网络下载

## 基本用法

**依赖管理**

- pnpm add ：安装指定包 （ -D / -g ）
- pnpm install : 安装所有依赖
- pnpm update ： 更新 （别名 up upgrade ）
- pnpm remove : 移除 （别名 rm un uninstall）
- pnpm link : 链接 （别名 ln）。 一般用于包的开发调试阶段。
- pnpm unlink : 取消链接
- pnpm import ：从其他（package-lock.json ， yarn.lock）导入
- pnpm prune ： 移除不需要的包
- pnpm fetch ：用于 docker 镜像加速

**运行脚本**

- pnpm run ：运行脚本
- pnpm exec ：项目范围内执行脚本，可以执行某个已经安装的依赖
- pnpm dlx ： 热加载，并不安装。 例如 执行 `create-react-app` 创建 react 项目

## 配置

- pnpm-workspace.yaml ：创建工作空间，用于 monorepo

```
packages:
  # all packages in direct subdirs of packages/
  - 'packages/*'
```

- .npmrc : pnpm 的配置
  - registry : 设置包注册源
  - [其他](https://pnpm.io/npmrc)
