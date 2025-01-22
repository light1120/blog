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

安装 workspace 其他的包 `pnpm add pkg2@workspace:^` 。package.json 文件中会多出一行 ` "pkg2": "workspace:^",`

- .npmrc : pnpm 的配置
  - registry : 设置包注册源
  - [其他](https://pnpm.io/npmrc)


# monorepo下的包加载问题

在 yarn , pnpm 的 monorepo 模式， 不同的子项目的 package.json , 还有 根目录 package.json 中，可能都存在某个包不同版本。不论使用 webpack 或者 vite 都可能存在打包的过程**包含了不同版本的包**。导致在执行的过程中出现意外bug。

### 可能的场景

- 升级了某个包的版本，然后就运行报错。
- 某个包的一些方法执行了多次，或者实例化了多次。

### 解决方案

可以从包管理器 ， 或者打包工具 2个方面来解决。

（如果别的项目没有引用，只需把所有的版本统一即可解决）

- yarn , pnpm  : 指定某个版本
```
// yarn 根 package.json 添加 resolutions
{
  "resolutions": {
    "packageA": "1.0.0"
  }
}
// pnpm 的 .pnpmfile.js 添加 readPackage hooks
module.exports = {
  hooks: {
    readPackage(packageJson) {
      if (packageJson.dependencies) {
        if (packageJson.dependencies['packageA']) {
          packageJson.dependencies['packageA'] = '1.0.0';
        }
      }
      return packageJson;
    },
  },
};
```
- webpack ，vite  : 设置 alias , 指定加载包的详细目录

```
// webapck alias

module.exports = {
  resolve: {
    alias: {
      'packageA': path.resolve(__dirname, './node_modules/packageA')
    }
  }
}

// vite alias : vite.config.js
export default defineConfig({
  resolve: {
    alias: {
      'packageA': path.resolve(__dirname, './node_modules/packageA')
    }
  }
})
```


# Npm

## 发布包

```
alias tnpm="npm --registry https://mirrors.xxxxx.com/npm/"

tnpm login

tnpm publish
```

- monorepo 项目 ： cd 到子包目录 , 然后 publish 即可。 注意子包中是否有引入其他的子包 'workspace\*' ，如果有需要改成版本号
- private ： 如果 package.json 中 设置了 `private : "true"` 。 依然会提示发布成功，但是实际没有发布成功。控制台会有下面提示，因为 `private` 跳过了发布

```
npm WARN publish Skipping workspace @xxx/xxx, marked as private
```
