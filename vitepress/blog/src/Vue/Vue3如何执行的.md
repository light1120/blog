# Vue3 是如何执行的？

### 1、新建项目

- `pnpm create vite` 创建一个 `vue3`,`ts` 的膜拜项目
- 修改 `app.vue` , `HelloWorld` 文件
```js
// App.vue
<template>
  <div id="index">
    <div>{{ num }} </div>
    <button @click="num =1 "> num + 1</button>
    <HelloWorld msg="Vite + Vue" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
const num = ref(0)
</script>

// HelloWorld.vue
<template>
  <h1>{{ msg }}</h1>
</template>
<script setup lang="ts">
defineProps<{ msg: string }>()
</script>
```
- 设置 `vite.config.js` 的 `build.minify = false` : 不压缩，方便阅读
- 构建项目 `pnpm install` , `pnpm run build` 
- 启动项目 `pnpm run preview`

### 2、源码结构

`dist` 目录下面生产一个 `index.xxxx.js` 被 `index.html` 加载, 所有的源码都在这个 `index.xxx.js` 文件。打开文件可以看到文件自上而下分了5个模块

- `@vue/shared` : vue 的一些公共工具库
- `@vue/reactivity` : vue 响应式的源码
    - `createReactiveObject` 创建响应式对象
    - `ReactiveEffect` 响应式副作用
- `@vue/runtime-core` : vue 渲染源码
    - `baseCreateRenderer` : 核心函数：渲染逻辑
    - `patch`: `baseCreateRenderer` 函数中核心函数
    - `createAppAPI`: vue app 实例
    - `_createVNode`: 创建 vnode 函数
- `@vue/runtime-dom` : vue dom 操作源码
    - `nodeOps`: 具体操作 dom 方法，一切的一切都是通过这里来操作dom的，作为 `options` 参数传入 `baseCreateRenderer`
- `开发者编码` 
    - `.vue`: vue文件编译之后都是返回了一个 `defineComponent` 之后的对象。 注意此时 `setup` 并未执行
    - `template`: 模板编译之后，就是变成了很多个 VNode 函数组成的类似树形结构。
    ```js
    const _sfc_main$1 = /* @__PURE__ */ defineComponent({
        __name: "HelloWorld",
        props: {
            msg: {}
        },
        setup(__props) {
            return (_ctx, _cache) => {
                return openBlock(), createElementBlock("h1", null, toDisplayString(_ctx.msg), 1);
                };
            }
        }
    );
    const _hoisted_1 = { id: "index" };
    const _sfc_main = /* @__PURE__ */ defineComponent({
        __name: "App",
        setup(__props) {
            const num = ref(0);
            return (_ctx, _cache) => {
                return openBlock(), createElementBlock("div", _hoisted_1, [
                    createBaseVNode("div", null, toDisplayString(num.value), 1),
                    createBaseVNode("button", {
                    onClick: _cache[0] || (_cache[0] = ($event) => num.value++)
                    }, " num + 1"),
                    createVNode(_sfc_main$1, { msg: "Vite + Vue" })
                ]);
            };
        }
    });
    createApp(_sfc_main).mount("#app");
    ```


初步看代码，就是引入了vue的4个模块 , 再引入用户定义 vue 文件编译之后的函数，最后执行 `createApp(_sfc_main)` 创建实例，再 `mount("#app")` 挂载到 `#app` 节点上。

### 3、首次执行过程

#### 3.1、createApp

```js
createApp(){
    const app = ensureRenderer().createApp(...args);
    const { mount } = app;
    app.mount = (containerOrSelector) => {
        mount()
    }
    return app
}
```

`createApp` 函数注意做了2件事， 创建`app`, 定义 `app.mount` 方法 . 

#### 3.2、ensureRenderer().createApp(...args) 过程

```js
ensureRenderer(){
    baseCreateRenderer(){
        const patch(){}
        const processElement(){}
        const mountElement(){}
        const processComponent(){}
        const mountComponent(){}
        ....
        const render(){
            patch() 
        }
        return {
            render,
            hydrate,
            createApp: createAppAPI(render, hydrate)
        };
    }
}.createApp(...args){
    createApp2(){
        const app = context.app = {
            _uid: uid$1++,
            _component: rootComponent,
            _props: rootProps,
            _container: null,
            _context: context,
            ....
        }
        return app
    }
}
```

这个过程很简单，就是调用 `createApp2` 返回了一个对象

#### 3.3、mount("#app") 过程

```js
mount(container, false, resolveRootNamespace(container));{
    const vnode = createVNode(rootComponent, rootProps);
    // 渲染 app
    render(vnode, rootContainer, namespace);{
        patch(container._vnode || null, vnode, container,...);{
            // 处理根部组件，就是 App.vue
            processComponent(n1,n2,container,anchor,parentComponent,...);{
                mountComponent( n2,container,anchor,...);{
                    // 主要2个过程，调用 setupComponent , setupRenderEffect
                    setupComponent(instance);{
                        // 为了返回组件实例的 render 方法
                        setupStatefulComponent(instance, isSSR){
                            handleSetupResult(instance, setupResult, isSSR);{
                                instance.render = setupResult
                            }
                        }
                    }
                    setupRenderEffect( instance,initialVNode,container,.....);{
                        // 渲染组件
                        const componentUpdateFn = ()=>{
                            // 组件的更新方法，用于初始创建和响应式更新
                            const subTree = instance.subTree = renderComponentRoot(instance);
                            // 从根部开始 patch ，判断类型，分别来处理
                            patch(null,subTree, container, anchor,instance,...);{
                                switch(type){
                                    // 如果是元素
                                    case elment:
                                        processElement(){
                                            mountElement(){
                                                // 创建 dom 实例，其实就是 document.createElement
                                                el = vnode.el = hostCreateElement(vnode.type,namespace,props && props.is,props);
                                                // 优先处理子节点
                                                mountChildren(vnode.children,el,null, parentComponent,...);{
                                                    // 循环处理所有的节点
                                                    for (let i = start; i < children.length; i++) {
                                                        patch(null,child,container,anchor,parentComponent,...);
                                                        // 回到外层，递归调用 patch
                                                    }
                                                }
                                                // 把渲染的 el 插入到父节点
                                                hostInsert(el, container, anchor);{
                                                    parent.insertBefore(child, anchor || null);
                                                    // 最后一次的 el 的 #app
                                                }
                                            }
                                        }
                                    // 如果是组件
                                    case component:
                                        processComponent() // 回到外层，递归调用 processComponent 处理引入组件，就是 HelloWord.vue
                                }
                            }
                            instance.isMounted = true;
                            // patch 过程结束，页面 dom 已经创建，插入文档流
                        }
                        // ReactiveEffect 响应式副作用
                        const effect2 = instance.effect = new ReactiveEffect(
                            componentUpdateFn,
                            NOOP,
                            () => queueJob(update),
                            instance.scope
                        );
                        const update = instance.update = () => {
                            if (effect2.dirty) {
                                effect2.run();
                            }
                        };
                        update();
                    }
                }
            }
        }
        container._vnode = vnode;
    }
}
```

这里过程比较复杂，

- 1、入口是`App.vue`根组件开始，执行组件的 `render` 方法，其实就是 `setup`，创建 `VNode`
- 2、开始渲染，就是执行 `patch` , 渲染的核心方法，会通过不同类型来处理不同的场景
- 3、`patch` 的过程中，注意分2种，元素和组件 对应 `processElement`,`processComponent`
- 4、`processElement` 注意就是将 `VNode` 创建成 `dom` 最后插入到父节点
- 5、`processElement` 过程中，如果有 `children` 属性，优先处理，如果 `children` 还有 `children` ，就递归处理
- 6、`children` 过程，就是一个循环 `patch` 的过程，当然每次 `patch` 也有可能出现不同的场景
- 7、`processComponent` 的过程和处理`App.vue`的一样，通过 `ReactiveEffect` 来触发 `componentUpdateFn`
- 8、`componentUpdateFn` 中主要是创建 `subTree`，然后 `patch(subTree)`

### 4、响应式更新过程

这里以 `const num = ref(0)` 为例，`ref` Api 就是创建了一个 `RefImpl` 实例。

```js
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  //...
  get value() {
    trackRefValue(this){
        trackEffect(activeEffect,this.dep){
            this.dep.set(activeEffect, activeEffect._trackId);
            // 添加依赖
        }
        // activeEffect 是全局变量，是 ReactiveEffect 的实例 ，在 setupRenderEffect 中创建
        // const effect2 = instance.effect = new ReactiveEffect(
        //   componentUpdateFn,
        //   NOOP,
        //   () => queueJob(update),
        //   instance.scope
        //   // track it in component's effect scope
        // );
    }
    return this._value;
  }
  set value(newVal) {
    //...
    triggerRefValue(this, 4){
        dep = this.dep;
        triggerEffects(dep,dirtyLevel){
            pauseScheduling();
            // 收集到的依赖入队
            for (const effect2 of dep.keys()) {
                queueEffectSchedulers.push(effect2.scheduler);
            }
            resetScheduling(){
                pauseScheduleStack--;
                while (!pauseScheduleStack && queueEffectSchedulers.length) {
                    // 出对列，并执行，这里执行的就是 effect2.scheduler 
                    // 就是 activeEffect 的 scheduler
                    // 就是 () => queueJob(update)
                    // 就是 执行 effect2.run();
                    // 就是 执行 componentUpdateFn
                    // 然后开始 patch
                    queueEffectSchedulers.shift()();
                }
            }
        }
    }
  }
  //...
}
```

- `RefImpl`实例中的 `dep` 用来做依赖追踪收集 ，收集的是 `ReactiveEffect` 实例
- `set` 钩子出触发追踪 调用 `triggerEffects(dep)`
- `triggerEffects` 的过程就是将 `ReactiveEffect` 实例中的 `scheduler` 入队
- 然后清空队列，一次执行所有收集到的 `scheduler` 调度器
- 首次渲染时，`setupRenderEffect` 函数中，创建 `ReactiveEffect` 实例时传入调度器 `()=>queueJob(update)`
- `queueJob(update)` 的思想时维护一个全局的队列，然后通过异步不阻塞的方式调用，并执行 `update`
- `update` 就是 `effect2.run()` 就是执行 `componentUpdateFn` , 然后就是组件的更新渲染过程。

### 5、总结

总结下大概有几点

- 1、`createApp` 创建 app 对象
- 2、`patch` 递归渲染所有的组件和节点
- 3、`mountComponent` 过程中创建 `ReactiveEffect` 响应式副作用对象
- 4、修改响应式对象，`triggerEffects`, 执行组件的渲染方法`componentUpdateFn`

以上只是大概的过程，中间有很多细节需要认真阅读。