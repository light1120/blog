# Plugin

> Vue 项目中常用的插件

### 1、unplugin-auto-import

通过配置 vite，webpack，rollup 自动引入 Api , Component。代码中无需在 import

```
// import 语句可以省略
// import { computed, ref } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
```
