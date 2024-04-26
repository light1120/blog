# 自定义 hooks 

> 在编写react组件的过程中，可能会遇到一些相同的UI表现，或者 功能，我们可以把相同的功能抽离成一个独立的函数，作为一个自定义 hooks 供外部调用。


## 自定义 hooks 就是一个函数。

```
// 自定义 hooks
function useMyHook(argv) {
  // 可以接受一些参数 argv

  // 可以定义一些状态  ; useState() ...
  // 可以处理一些副作用 ; useEffect() ...

  // 可以返回一些值 或者 jsx ; return ...
}

function App() {
  // 调用函数，返回值
  const data = useMyHook('argv');
  // 渲染值
  return <div>{data}</div>;
}
```

是不是很熟悉， 自定义 hooks 就是一个普通的函数组件。 

- 接受的参数 就是函数组件 props ；
- 定义的 state 就是 函数组件的 state
- 返回值 就是函数组件返回的 jsx ; 只不过一般 函数组件返回 jsx ，自定义 hooks 返回 值


## 自定义 hooks 的一次调用，就是函数的一次执行， 共享的是函数执行过程的逻辑

虽然经常有时候 调用一个 hooks 返回一个或者多个值。 不要以为如果返回的值没有变化，或者返回的是一个普通的变量，就不会对调用方产生影响。

hooks 的调用，就是一个 hooks 函数的执行，执行完了，如果返回值发生变化了，调用方就会有影响，如果返回值没有变化，调用方就没有影响

```
function useMyHook() {
  const [A, setA] = useState(0);
  const B = 100;

  useEffect(() => {
    setA(A + 1);
  }, []);

  return A >= 1 ? B + A : B;
}

function App() {
  const B = useMyHook();
  // 这里的 B 是一个普通变量, 由于 useEffect 副作用影响，会变成 101 ，那么会触发 App 更新，返回 `<div>{B}</div>`
  return <div>{B}</div>;
}
```

## 自定义 hooks 注意事项

- hooks 就是一个函数组件，拥有函数组件所有特性，能力
- 组件重新渲染，所有的 hooks 都会重新执行一次
- hooks 也应该保持 纯函数 特性，或者具备 memorize 能力
- hooks 命名，约定 `use` 开头，并具有语义性