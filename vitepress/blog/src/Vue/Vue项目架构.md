# 前端Vue项目架构

> vue3 已经非常广泛的使用了，每个团队都需要基于业务特性构建符合自身前端项目架构，一个好的项目架构往往可以代理不少的研发效率的提升，还能解决大部分问题。一个好的 vue3 前端项目架构应该包含如下内容

## 1、脚手架

在 vite 官方模板的基础加上一些符合业务特性通用代码，项目初期可以快速搭建一个项目框架，不必从零开始，大幅提升效率

一个脚手架需要包含哪些内容？

- 1、基础业务模板代码
- 2、团队统一的目录结构，代码规范，工程规范，CI/CD配置
- 3、必要的 readme , 注释，帮助新人快速入手 

如何开发一款自己的脚手架？

- [inquirer](https://github.com/SBoudrias/Inquirer.js) : 通过交互的方式获取配置项
- [ejs](https://github.com/mde/ejs): 使用 ejs 模版的方式生成代码，再使用 `Prettier` 格式化代码之后写入目录文件

## 2、UI 组件库

- [TDesign Vue](https://tdesign.tencent.com/vue/overview) : 腾讯出品
- [Ant Design Vue](https://antdv.com/components/overview) : 蚂蚁出品
- [Element Plus](https://element-plus.org/zh-CN/): 饿了么出品
- [Arco Design Vue](https://arco.design/vue)

## 3、Vite 构建工具

vite 在开发效率上比 webpack 快速很多，而且 vite 生态也成熟起来，推荐使用 vite 作为构建工具。

[awesome-vite](https://github.com/vitejs/awesome-vite):  官方推荐的 vite 生态。

vite 小技巧
- 目录自动生成路由：指定目录下所有`.vue`文件自动生成路由，无须配置 。 且是按需加载
```
// main.ts
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = import.meta.glob('/src/pages/*.vue')
const router = createRouter({
  history: createWebHashHistory(),
  routes: Object.entries(routes).map(([path, page]) => {
    const routePath = path.replace(/^\/src\/pages\//, '/').replace(/\.vue$/, '').toLowerCase()
    return {
      path: routePath,
      component: page
    }
  })
})
createApp(App).use(router).mount('#app')
```


## 4、编码规范

- ESlint : 代码规范，1、保障了团队的代码规范，减少沟通成本，2、很多规范具有性能优化作用，可以提高代码执行效率
- StyleLint : 样式规范，如果没有使用 tailwindcss , 需要收到编码css 的时候，需要 styleLint 来保障编码规范
- Prettier : 代码格式， 代码格式化
- commitlint : git提交规范, 提交的时候，明确 feature ， bugfix 必要的 commit message 可以帮助其他同事更好理解业务，以及后续的 merge , 回滚，cheery-pick 等操作。 

## 5、Typescript

vue3 和 vite 对 Typescript 的支持非常友好，推荐使用 ts 增强类型。

`/// <reference types="vite/client" />` 引入了 Vite 客户端提供的类型系统，包括 `import.meta` 等。

## 6、Tailwindcss

原子化css可以减少很多重复的样式，从而压缩样式代码体积。 非常推荐 [tailwindcss + postcss](https://www.tailwindcss.cn/docs/installation/using-postcss) 合并使用

更重要的： 可以快速实现复杂功能

- 响应式 ：`<img class="w-16 md:w-32 lg:w-48" src="...">`
- 深色模式 : `<div class="bg-white dark:bg-slate-800 >`
- 国际化：`<div class="text-sm EN:text-sm >` 创建一个[英文模式`EN`](https://www.tailwindcss.cn/docs/plugins#adding-variants), 如果顶部有 `EN` 类名 `EN:text-sm`将显示自定义大小

## 7、Pinia

[Pinia](https://pinia.vuejs.org/zh/) 官方推荐状态管理工具，用于替代 Vuex 。

更简洁，更TS友好。

## 8、Router

- 创建路由
```
const router = createRouter({
  history: createWebHashHistory(),
  routes: allRoutes,
});
```
- 进度条： [nprogress](https://github.com/rstacruz/nprogress)
```
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // ... do something
});

router.afterEach((to) => {
  NProgress.done();
});

```
- 权限相关： 如果路由的访问需要鉴权，需要创建一个 `permission.ts`
```
router.beforeEach((to, from) => {
  NProgress.start();
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
})
```
- Meta 数据： 在进入路由，切换路由时需要传输数据，次数可以将数据放到路由 meta 中 ， 一般传输以下数据
  - title : 页面标题
  - icon : 菜单 icon
  - order : 菜单排序
  - auth : 是否需要某个权限
  - roles : 允许访问的角色列表
  - keepAlive : 需要缓存的路由

## 9、请求封装

[axios](https://github.com/axios/axios) 是首选的http客户端。

通过构建一个 httpClient 对象，包含一个 axios instance 实例， 执行请求时用 instance 来发起请求。

- 构建实例
  - 创建对象时：暂存通用配置
  - 发起请求时：合并参数配置，通用配置 传递给 `instance.request`
  - transformRequest: 构建参数格式，增加时间戳参数，增加签名参数
  - transformResponse: 通用参数返回格式，处理接口网络异常时的返回格式
  - request interceptors : `instance.interceptors.request.use` 一般处理参数格式异常，或者 登录异常
  - response interceptors : `instance.interceptors.response.use` 一般处理特定错误码，或者 401 403 等http code
- request hooks
  - 基于相同的ui 组件，创建 useRequest `const { isFetching, error, data } = useRequest({...})`。 参考 [useFetch](https://vueuse.org/core/useFetch/)


## 10、Hooks

[vueuse](https://vueuse.org/functions.html#category=Browser) 包含了大量的hooks，可以解决很多日常问题，提高研发效率

## 11、事件总线

vue2 经常会用到 通过 `new Vue()` 构造一个事件总线实例。 在这个实例上 添加事件，以及事件响应函数。

推荐使用 [mitt](https://github.com/developit/mitt) 替代之前的事件总线。更纯粹，精巧。更适合事件总线

## 12、文档 vitepress

[vitepress](https://vitepress.dev/zh/) : SSG 构建团队文档管理

## 13、插件

vscode 插件

- Vue - Official : vue3 官方插件
- Tailwind CSS IntelliSense : tailwindcss 官方插件
- Prettier
- ESLint

chrome 插件

- Vue.js devtools