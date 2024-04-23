# useEffect  && useLayoutEffect

> useEffect 和 useLayoutEffect 是2个用于副作用的 hooks , 作用都是监听依赖，依赖发生变化之后，然后执行回掉函数。

### useEffect

详细见[useEffect](../07_Effect.md)

### useLayoutEffect

用法与 useEffect 一样，功能一样，只是执行的机制不一样。

- **1、useLayoutEffect在浏览器重新绘制屏幕之前触发，出阻塞浏览器绘制，执行完了，浏览器再绘制最新数据**

- **2、同步执行，阻塞浏览器绘制，非必要不建议用，很容易出现性能问题，卡死页面**

```
import React, { useEffect, useLayoutEffect, useState } from 'react';

function App() {
  const [state, setState] = useState('hello');

  // useEffect(() => {
  //   let i = 0;
  //   while (i <= 100000000) {
  //     i++;
  //   }
  //   setState('world');
  // }, []);

  useLayoutEffect(() => {
    let i = 0;
    while (i <= 1000000000) {
      i++;
    }
    setState('world');
  }, []);

  return (
    <>
      <div id="test">{state}</div>
    </>
  );
}

export default App;
```

上面代码中，使用 `useEffect` 时，页面会先看到 `hello` 再 看到 `world` 。 使用 `useLayoutEffect` 时，页面只会显示 `world`

原因： 函数组件执行完了，会立即执行 `useLayoutEffect`,  此时 dom 已经创建，但是被 `useLayoutEffect` 阻塞，没有绘制到浏览器页面上， 执行完 `useLayoutEffect` 后 ，dom 发生变化，浏览器将最新 dom 绘制到页面上。所以这里会白屏直到 `useLayoutEffect` 执行完。

```
// useLayoutEffect 渲染伪代码
function ReactRender() {
  // 1. 执行 App()，此时 state 的值为 'hello'

  // 2. 执行 useLayoutEffect 中的代码，此时阻塞浏览器的绘制过程

  // 3. useLayoutEffect 中的代码执行完毕，更新 state 的值为 'world'

  // 4. 再次执行 App() state 的值为 'world'

  // 5. 浏览器开始绘制，将 'world' 渲染到屏幕上
}

// useEffect 伪代码
function ReactRender() {
  // 1. 执行 App()，此时 state 的值为 'hello'

  // 2. 浏览器开始绘制，将 'hello' 渲染到屏幕上

  // 3. 浏览器完成绘制后，执行 useEffect 中的代码

  // 4. useEffect 中的代码执行完毕，更新 state 的值为 'world'

  // 5. 再次执行 App()，此时 state 的值为 'world'

  // 6. 浏览器开始绘制，将 'world' 渲染到屏幕上
}
```

- **3、什么场景用**

使用场景：需要计算 dom 在于浏览器页面中精确位置, 然后又对 state 更新。

由于需要获取 dom 相关数据，所以需要放到副作用 effect 中， 如果在 useEffect 中 获取 dom 相关数据，然后对 state 更新 ，由于 state 更新，又会触发 dom 更新并渲染，那么在 useEffect 中获取的相关数据就有可能不对了。 浏览器渲染2次。

`uesLayoutEffect` 就是为了解决这个场景，它帮助我们可以在下个浏览器渲染之前，获取 dom 数据数据，更新 dom ，把最新的 dom 渲染在页面上，只渲染一次。

[官网 useLayoutEffect 使用举例](https://zh-hans.react.dev/reference/react/useLayoutEffect#measuring-layout-before-the-browser-repaints-the-screen).

- **4、跟浏览器渲染相关，不可用于服务端**