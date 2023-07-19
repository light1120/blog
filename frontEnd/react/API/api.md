
## React

## React.memo()

- [文档](https://reactjs.org/docs/react-api.html#reactmemo)
- React.memo 是一个 HOC, 适用于 Function Component
- React.memo 通过缓存渲染结果，来提高性能
- React.memo 只校验 prop 来判断是否要重新渲染
- React.memo 组件中如果有 useState,useReducer,useContext，如果他们发生变化，仍然会重新渲染
- 这个方法只能作为优化手段
