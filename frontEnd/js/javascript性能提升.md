# Javascript 性能提升

## 运行时

- 避免全局变量 ： 会增加作用域链长度，导致访问变慢

- 避免使用`eval()` ： 容易错误使用，不易调试，xss 安全问题
- map，set 替换 object ：哈希表，效率高，。查询时间复杂度 O(1) , 添加删除只是修改了节点指针的方向
- 保持对象字段稳定，有利于 JIT 优化 ：TS 的其中作用之一
- 尽量减少循环中的操作 ： `for (let i = 0; i < len; i++)` 替换 `for (let i = 0; i < array.length; i++)`
- 尽量使用原生 APi
- 循环又换： for > forEach > for of > for in ; 尽量避免 `for in` ，会枚举到原型链

## 函数

- 尽量使用纯函数 ：纯函数是相同的输入，输出也永远相同。纯函数被`memoized`
- 防抖：优化频繁调用；（简单记忆：防止抖动，不抖了，才执行）场景：一直在输入，n 秒内不输入了，才执行

```
function debounce(fn , wait , immediate = false){
    let timeout
    return function(...args){
        const context = this
        if(immediate && !timeout){  //首次调用时立即执行
            fn.apply(context,args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            fn.apply(context,args)
        },wait)
    }
}
```

- 节流：优化频繁调用；（简单记忆：一节一节执行）场景：一直调用，每 n 秒，执行下，输出最新结果

```
function throttle(fn, wait) {
  let timeout = null;
  return function(...args) {
    const context = this;
    if (!timeout) {
      timeout = setTimeout(() => {
        fn.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
}
```

- 柯里化(currying)函数 + 组合（compose）函数:

  - currying : 接受多个参数的函数，转换成一系列接受一个参数的函数。
    - 场景 1: 固定参数，A->B B->C 过程中有些参数是固定的，可以使用，柯里化，减少参数传递； vue 源码中的 `createHook`
    - 场景 2: 频繁反复计算，有部分中间结果是固定的，可以通过闭包缓存，返回简单计算的函数；vue 源码中的 [makeMap](https://github.com/vuejs/core/blob/main/packages/shared/src/makeMap.ts)

  ```
  function curry(fn) {
    // 获取原始函数的参数个数
    const arity = fn.length;

    // 返回一个新的函数，用于接收参数
    function curried(...args) {
        // 如果参数个数足够，直接调用原始函数
        if (args.length >= arity) {
        return fn(...args);
        }

        // 否则，返回一个新的函数，用于接收剩余参数
        return function (...rest) {
        return curried(...args.concat(rest));
        };
    }

    return curried;
  }
  const fnCurry = curry((x,y,z)=>x+y+z)
  fnCurry(1)(2)(3)
  ```

  - compose : 将多个函数组合成一个函数，从左到右执行。 也可以实现从右到左执行，`reduceRight`替换`reduce`即可；场景：实现链式调用

  ```
  function compose(...funcs) {
      if (funcs.length === 0) {
          return arg => arg;
      }

      if (funcs.length === 1) {
          return funcs[0];
      }

      return funcs.reduceRight((a, b) => (...args) => a(b(...args)));
  }
  const composedFunction = compose(func1, func2, func3)
  composedFunction()
  ```

- memoize ： 用于缓存函数的计算结果；所有纯函数都可以 memoize

```
const memoize = (func, cache = new Map()) => {
  const jsonReplacer = (_, value) => {
    if (value instanceof Set) {
      return [...value]
    }
    if (value instanceof Map) {
      return Object.fromEntries(value)
    }
    return value
  }

  return (...args) => {
    // stringify 不能对 map ,set 序列化
    const argsKey = JSON.stringify(args, jsonReplacer)
    if (cache.has(argsKey)) {
      return cache.get(argsKey)
    }
    const result = func(...args) // spread all args
    cache.set(argsKey, result)

    return result
  }
}
```

## DOM

- 事件委托： 减少时间监听数量，在父节点上监听即可。 事件委托是利用了事件冒泡的机制
- 减少 dom 操作： DocumentFragment
- 优化动画 ：requestAnimationFrame

## 异步

- 将耗时的操作异步化
- Web Worker ： 使用 web worker 优化密集型操作
- WebAssembly
