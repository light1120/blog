# React Hooks

> [hooks api](https://reactjs.org/docs/hooks-reference.html)

## useState

返回一个状态值 和更新状态值的方法

```
const [state, setState] = useState(initialState);
```

## useEffect

接收一个函数，默认在每次 render 时调用。第二个参数可选，是一个变量数组，当数组中的任意变量值发送变化，也会调用函数

```
useEffect(() => {
  //do something
});

useEffect(() => {
  //do something
}, [ varA , varB ,,,]);
```
