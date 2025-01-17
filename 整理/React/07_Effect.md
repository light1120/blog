# Effect

## React 组件逻辑类型

react 函数组件就是一个js函数，在执行函数的过程，react 做了2个逻辑。

- 1、接收`props`和`state`，执行 jsx 编译后的函数，返回DOM，加入文档流
- 2、添加事件交互程序，用于监听用户的交互，更新状态或者与发起Http请求

还可能有第三者，在渲染完成之后，没有事件交互时，需要做一些事情，例如：与浏览器Api交互，第三方组件，开启动画，上报日志等，这些操作就称为`Effect`

## Effect 场景

- Effect 通常用于跳出react系统，跟外部系统交互。
- 如果是由于交互产生的，不适应这里，应该由事件交互程序来处理。
- Effect 在React渲染之后触发。

## 如何编写 Effect

- 1、声明 Effect 。由于每次渲染之后都会执行函数组件，同样默认也会再执行一次Effect

```
import { useEffect } from 'react';
function MyComponent() {
  useEffect(() => {
    // 每次渲染后都会执行此处的代码
  });
  return <div />;
}
```

- 2、指定依赖。大多数时候，并不是每次都要执行effect，就可以给他指定依赖

```
useEffect(() => {
  // 这里的代码只会在组件挂载后执行
}, []);
useEffect(() => {
  //这里的代码只会在每次渲染后，并且 a 或 b 的值与上次渲染不一致时执行
}, [a, b]);
```

- 3、按需添加清理（cleanup）函数 ，返回一个函数用于“清理”副作用

```
useEffect(() => {
    function handleScroll(e) {
        console.log(window.scrollX, window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Effect 用于处理副作用，一般来将，在下次处理复作用之前应该需要"清理"，才能保持一个正常的逻辑。另外组件被卸载的时候也会执行"清理"。 例:“删除时间绑定”，“清理timeoutId”等

## Effect 用于获取数据。

很多人使用 Effect 来获取后台提供的数据，再渲染。但是有很多缺点，不建议

- 1、Effect不能在服务端执行
- 2、父子组件都存在获取数据，会导致串性。会比并行获取数据慢很多
- 3、无法预加载，缓存。随着组件挂载，卸载，就必须再次获取

建议使用开源框架`react-query`,`useSWR`

## Effect 的生命周期

- 组件生命周期：挂载，更新，卸载
- Effect 是一个独立的过程，描述的是与外部系统同步的过程，可以开始、停止
- 编写Effect时要考虑的是，什么时候开始、停止，而不是，什么时候挂载，卸载
- 通过思考，指明Effect的依赖项
- 要考虑到开发环境的2次执行

## 不必要的 Effect

- 1、只是对 props ， state 相关的计算。 直接计算即可，不必使用 Effect
- 2、监听 props 变化，来重置所有或者部分 state 。重置所有：可以利用组件的key特性，重置部分：可以利用state的记忆性
- 3、处理用户交互产生的副作用，直接交给事件处理程序即可，不必使用 Effect
- 4、不要使用 Effect 链式更新 state , 监听某个state变化来更新其他state
- 5、传递数据给父组件，不建议向上传播，保持数据流由上而下。
- 6、订阅外部store，使用 useSyncExternalStore 替换 Effect
