# Vue 项目中的 typescript 知识点

## defineProps type

在使用`defineProps`定义时，需要指定字段的类型，在遇到复杂类型时，需要借助 [`PropType`](https://cn.vuejs.org/guide/typescript/options-api.html#typing-component-props)

- 定义联合类型: `String as PropType<'light' | 'dark'>`,
- 定义接口类型: `Object as PropType<InterfaceA>`,
- 定义接口数组类型: `Array as PropType<InterfaceA[]>`,
- 定义函数类型: `Function as PropType<(id: number) => void>`

```
const props = defineProps({
  // 定义联合类型
  theme: {
    type: String as PropType<'light' | 'dark'>,
  },
  // 定义接口类型
  interface: {
    type: Object as PropType<InterfaceA>
  },
  // 定义接口数组类型
  interfaceArray: {
    type: Array as PropType<InterfaceA[]>
  }
  // 定义函数类型
  click: {
    // 点击事件
    type: Function as PropType<(payload: MouseEvent) => void>
  }
})
```
