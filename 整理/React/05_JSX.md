# JSX 与 React

JSX 是 javascript 的一种扩展。并不是一种语言，浏览器不认识，需要通过编译器`babel`编译成目标代码。这里是React相关代码，也可以是Vue相关代码。 这里不介绍JSX的语法，只是分析下，JSX最终生成了什么。

## 例子：

还是从一个简单的React代码开始，页面渲染一个button，每次都加1。

```
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
const App = function Counter() {
  const [number, setNumber] = useState(0);
  const counterJsx =  (
    <button onClick={() => {  setNumber(number + 1);  }} >
      {number}
    </button>
  );
  console.log(counterJsx);
  return counterJsx;
};
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

```

看看编译之后的代码（我这里采用的vite，下面是dev环境代码）, 下面就是能够运行在浏览器的代码。

```
const App = function Counter() {
  _s();
  const [number, setNumber] = useState(0);
  const counterJsx = /* @__PURE__ */ jsxDEV("button", { onClick: () => {
    setNumber(number + 1);
  }, children: number }, void 0, false, {
    fileName: "/Users/xxx/xxx/App.tsx",
    lineNumber: 14,
    columnNumber: 22
  }, this);
  console.log(counterJsx);
  return counterJsx;
};
```

在控制台可以看到，就是一个`jsxDEV`函数体，执行完了返回了一个对象。

```
{$$typeof: Symbol(react.element), type: 'button', key: null, ref: null, props: {…}, …}
    $$typeof: Symbol(react.element)
    key: null
    props: {children: 0, onClick: ƒ}
    ref: null
    type: "button"
    _owner: FiberNode {tag: 0, key: null, stateNode: null, elementType: ƒ, type: ƒ, …}
    _store: {validated: false}
    _self: undefined
    _source: {fileName: '/Users/xxx/xxx/App.tsx', lineNumber: 14, columnNumber: 22}
```

## 从jsxDev开始分析

[源码入口](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSX.js)

```
import {REACT_FRAGMENT_TYPE} from 'shared/ReactSymbols';
import {
  jsxWithValidationStatic,
  jsxWithValidationDynamic,
  jsxWithValidation,
} from './ReactJSXElementValidator';
import {jsx as jsxProd} from './ReactJSXElement';
const jsx: any = __DEV__ ? jsxWithValidationDynamic : jsxProd;
// we may want to special case jsxs internally to take advantage of static children.
// for now we can ship identical prod functions
const jsxs: any = __DEV__ ? jsxWithValidationStatic : jsxProd;
const jsxDEV: any = __DEV__ ? jsxWithValidation : undefined;
export {REACT_FRAGMENT_TYPE as Fragment, jsx, jsxs, jsxDEV};
```

`jsxDEV` 就是`ReactJSXElementValidator`里面的[jsxWithValidation](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElementValidator.js#L305) 方法

```
export function jsxWithValidation(
  type,
  props,
  key,
  isStaticChildren,
  source,
  self,
) {
  if (__DEV__) {
    //...省略
    const element = jsxDEV(type, props, key, source, self);
    //...省略
    return element;
  }
}
```

`jsxWithValidation`核心就是调用了`ReactJSXElement`里面定义的[jsxDEV](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L280)

```
export function jsxDEV(type, config, maybeKey, source, self) {
  if (__DEV__) {
    //...省略
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
    //...省略
    return ReactElement(
      type,
      key,
      ref,
      self,
      source,
      ReactCurrentOwner.current,
      props,
    );
  }
}
```

`jsxDEV`的核心就是调用[ReactElement](https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L148)方法。

```
function ReactElement(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type,
    key,
    ref,
    props,
    // Record the component responsible for creating this element.
    _owner: owner,
  };
  //...省略
  return element;
}
```

最终得到的`element`对象，跟我们控制台（开发环境会多一些调试数据）输出的是一致的。

**结论**：

- 我们编写的JSX代码不能直接运行，需要`babel`编译成React提供的`jsxDev`方法构成的函数体。（生成环境是`jsx`）
- `jsxDev`方法，会对我们编写的代码做一些校验，提升我们编写更优的代码。大多数是开发环境下的校验
- 最后调用`ReactElement`返回了一个`element`对象。就是俗称的虚拟Dom。
- 剩下的就交给`react-dom`的`render`方法，最终生成真实Dom，并更新文档流，显示下浏览器上
- 如果有嵌套组件，编译时，会加入到`children`属性下，每个组件就是一个`jsxDev`过程，最终生成一个`element`。

## 扩展问题

Q：在React中，{Comp} {Comp()} <Comp />的区别？

```
const Comp1 = <div>Comp1</div>;
function Comp2() {
  return <div>Comp2</div>;
}
function Comp3() {
  return <div>Comp3</div>;
}
export default function Test() {
  return (
    <div>
      {Comp1}
      {Comp2()}
      <Comp3 />
    </div>
  );
}
```

编译之后就很清楚，简单了，下面是编译之后的代码简写。前俩者都不会交给 jsx 函数进行处理，所以会导致 react 感知不到这里的渲染，从而导致 hook 的状态丢失等问题。正常下使用第三种写法即可。

```
export default function Test() {
  return jsx('div', {
    children: [Comp1, Comp2(), jsx(Comp3, {})]
  });
}
```
