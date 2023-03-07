# 函数式组件渲染

> React 单向数据流。

## 1、Props

- 通过 props 可以将数据从上至下流入 parents -> props -> child

## 2、render: 组件什么时候会渲染

- 首次加载；加载完了之后，**修改 props 并不会触发 render**
- 父组件主动调用子组件 render()： 父组件条件渲染子组件
- 引用了 state，state 发生变化时

## 3、[添加反向数据流](https://zh-hans.reactjs.org/docs/thinking-in-react.html#step-5-add-inverse-data-flow)

如果给 input , textarea 等组件的 value 设置成了 state 值，再次输入 input，不会发生任何变化。因为数据是单向的，只能由 state -> input ，所以需要添加反向数据流，手动添加一条导管，将 input 的值赋值给 state

- `<input value={state} />` : react 框架完成了，数据从 state -> input
- `onChange={()=>{setState}}`: 额外手动添加导管，数据从 input -> input

## 4、组件设计

- **组件高度内聚**: 尽量全部使用 state，让组件的 render 自控自理
- **数据回流**: 在必要的时候调用 props 中的函数参数，将值向上传导
- **父组件不干预**: 不要对自组件局部做出修改，通过条件整体渲染
