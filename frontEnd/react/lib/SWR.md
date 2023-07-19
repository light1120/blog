# SWR

## 简介

[SWR](https://swr.vercel.app/zh-CN) 是一个用于数据获取的 react hooks 库 。 由 [next.js](https://nextjs.org/)团队创建。

## 使用

```
import useSWR from 'swr'

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

`useSWR` 的第一个参数是 key ，一般是 url 。第二个参数是一个函数，用于获取数据，可以是原生`fetch`或者`axios`

## 特性

一行代码简化数据请求的逻辑，并用于`缓存`,`去重`等逻辑。[例子](https://github.com/vercel/swr/tree/main/examples)

- 极速，轻量，可重用的数据请求
- 内置缓存，去重
- 实时体验
- 传输和协议不可知
- 支持 SSR / ISR / SSG
- 支持 Typescript
- 支持 React Native

SWR 包含了性能，正确性，稳定性等方面

- 快速页面导航
- 间隔轮询
- 数据依赖
- 聚焦时重新验证
- 网络恢复重新验证
- 本地缓存更新
- 智能错误重试
- 分页，滚动位置恢复
- React suspense 延时加载
