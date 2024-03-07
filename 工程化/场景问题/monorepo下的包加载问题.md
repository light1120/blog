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

