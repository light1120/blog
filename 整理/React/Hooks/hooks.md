# React Hooks

React 官方提供了很多Hooks , 用于函数组件中使用React的功能。

## STATE 相关

> `state` 就是动态更新的数据，属于组件的`状态`；`state` 的更新来的的函数组件重新执行，组件重新渲染。

- useState 
- useReducer
- useContext 
- useTransition
- useDeferredValue:

## Ref 相关

> `ref` 也属于组件的数据，是**不会触发渲染的`state`**

- useRef:
- useImperativeHandle

## Effect

> `effect` 副作用，用于 react 跟外部系统交互， 在组件渲染之后执行。 例如 ：数据交互

- useEffect:
- useLayoutEffect:
- useSyncExternalStore:

## 性能优化

>  `state` 的变化带来函数组件的重新执行， 函数组件里的变量，函数会重新定义，或执行。 `useMemo` 和 `useCallback` 分别用于变量和函数，避免重复定义和执行

- useMemo :
- useCallback :

## 其他

- useId:
- useDebugValue:
- useInsertionEffect
