# Pinia

## 简介

[pinia](https://pinia.vuejs.org/zh/introduction.html): Vue 的专属状态管理库，用来管理状态，vuex 的替代

## 入门

- 1、引入 pinia

```
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

- 2、定义 store

```
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

以上是使用 options 对象的方式创建；是可以传入 函数 的方式创建；

```

- 3、使用

  - **defineStore** 本质上返回的也是一个函数，需要通过 `useCounterStore()` 方式，返回一个 store reactive 对象。 并且做了单例，多次执行函数，返回的是同一个 store 对象.
  - `useCounterStore()`的调用，一直要在 `app.use(pinia)` 之后；如：在 router 导航守卫中使用，需要在 beforeEach 的函数参数内使用。 在任意地方都行，只要在 `app.use(pinia)` 之后

```
<script setup>
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
console.log(store.count)
</script>
```

## Store 内

### state

就是一个返回对象的函数，可以通过 `this.count` 来访问 ，修改

```
state: () => {
    return {
      count: 0,
    }
},
```

### getter

state 的计算值

```
getters: {
    doubleCount: (state) => state.count * 2,
}
```

getter 传参数

```
getters: {
    getUserById: (state) => {
        return (userId) => state.users.find((user) => user.id === userId)
    },
},
```

### action

就是函数

```
actions: {
    increment() {
      this.count++
    },
},
```

## Store 外

### state

在内部也可以使用 this.$reset(), this.$path()

- store.$reset() : 重置 state
- store.$patch() : 一次性修改多个值，如果遇到对象，是以扩展的形式

订阅 state

```
store.$subscribe((mutation, state) => {
  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('cart', JSON.stringify(state))
})
```

### action

订阅 action

```
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```

## [插件](https://pinia.vuejs.org/zh/core-concepts/plugins.html#plugins)

插件就是一个函数，对相关的属性做修改。插件只会作用`pinia.use(myPiniaPlugin)`只会创建的 store

```
export function myPiniaPlugin(context) {
  context.pinia // 用 `createPinia()` 创建的 pinia。
  context.app // 用 `createApp()` 创建的当前应用(仅 Vue 3)。
  context.store // 该插件想扩展的 store
  context.options // 定义传给 `defineStore()` 的 store 的可选对象。
  // ...
}
```

- 扩展 store

```
// 上文示例
pinia.use(({ store }) => {
  // 添加state
  store.hello = 'world'

  // devtools 中使用，
  store.$state.hello = 'world'
  // 确保你的构建工具能处理这个问题，webpack 和 vite 在默认情况下应该能处理。
  if (process.env.NODE_ENV === 'development') {
    // 添加你在 store 中设置的键值
    store._customProperties.add('hello')
  }

  store.$subscribe(() => {
    // 响应 store 变化
  })
  store.$onAction(() => {
    // 响应 store actions
  })
})
```

在一个插件中， state 变更或添加(包括调用 store.$patch())都是发生在 store 被激活之前，因此不会触发任何订阅函数。

- Typescript

[标注插件类型](https://pinia.vuejs.org/zh/core-concepts/plugins.html#typescript)
