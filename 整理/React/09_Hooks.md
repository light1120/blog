# React Hooks

React 官方提供了很多Hooks , 用于函数组件中使用React的功能。

## STATE 相关

- useState : 创建一个 state , 用于渲染。
  - 1、分析组件是否需要state
  - 2、state的保留，重置
  - 3、setState 的滞后，更新的值，作用在下一次渲染
  - 4、使用**快照**的思想去理解state
- useReducer :
- useContext : 引用一个创建好的context
  - 1、创建context: const MyContext = createContext()
  - 2、创建provider: const MyProvider = ()=> <MyContext.Provider value={initValue}></MyContext.Provider>
  - 3、置顶provider: const App = ()=> <MyProvider>xxx</MyProvider>
  - 4、引用context: const context = useContext(MyContext)
- useTransition
- useDeferredValue:

## Ref 相关

- useRef:
- useImperativeHandle

## Effect

- useEffect:
- useLayoutEffect:
- useSyncExternalStore:

## 性能优化

- useMemo :
- useCallback :

## 其他

- useId:
- useDebugValue:
- useInsertionEffect
