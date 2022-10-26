## React.memo()  &&  useMemo()

### memo 是 memory 的缩写
* React.memo() 跟 useMemo() 都跟记忆有关，是有缓存的

### React.memo()
* [文档](https://reactjs.org/docs/react-api.html#reactmemo)
* React.memo是一个HOC, 适用于Function Component
* React.memo通过缓存渲染结果，来提高性能
* React.memo只校验prop来判断是否要重新渲染
* React.memo组件中如果有useState,useReducer,useContext，如果他们发生变化，仍然会重新渲染
* 这个方法只能作为优化手段


### useMemo
* [文案](https://reactjs.org/docs/hooks-reference.html#usememo)
* 使用 `const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`
* useMemo 返回一个缓存值，只有依赖的值发生变化，才会重新计算
