## 实际工作中 tsconfig 使用

- monorepo 中 包 A 引入了 包 B , 即使 包 B 中存在 ts 报错， 包 A 中执行 `tsc` , 也会成功。 如何解决？

有尝试设置 `skipLibCheck`,`isolatedModules` 为 false ，强行检查文件和`.d.ts` ，依然不行，如果取消了`skipLibCheck` , 反而报错了 `ant-design`里面的错。

```ts
"skipLibCheck": false,
"isolatedModules": false,
```

后面了解到 `references` 后，适合当前场景，也生效了，在包 A 中编译时，会校验包 B 。需要在包 A 中编译加上 build 参数 `tsc  --build`

```ts
// 包A
"references": [
    { "path": "../xx/packagesB/tsconfig.json" }
]
// 包B 启动项目引用
"compilerOptions": {
    "composite": true,  // 启用项目引用
}
```
