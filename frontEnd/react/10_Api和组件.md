# React Api 和 内置组件

## Api

- createContext:
- forwardRef:
- lazy:
- memo:
- startTransition:

## 内置的组件

- 1、`<Fragment>` ： 不会额外添加元素的情况下，将子元素组合 ， 等价<>...</>
- 2、`<StrictMode>` : 帮助开发模式下，检查组件
  - 组件 重新渲染 一次
  - 组件 重新运行Effect 一次
  - 检查是否使用了弃用的Api
- 3、`<Suspense>` : 允许显示一个回退方案，直到子组件加载完成

  `<Suspense>` 包裹的所有组件将作为一个整体，只有全部都加载完成，才会整天显示。可以用来优化路由切换过程。

```
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

- 4、`<Profiler>` : 用于测量react树的渲染性能。默认生产环境禁止

```
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>

function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // 对渲染时间进行汇总或记录...
}
```
