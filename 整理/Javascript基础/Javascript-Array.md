# Array 

> 数组类型，是 javascript 中很常见的对象，工作中经常用到，所以它有很多个Api，详细见[MDN Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)。 有不少 API 可以达到部份相同效果，因此有不少开发同学会混淆，比如查找元素时，使用遍历API。 很有必要详细了解下他的API ，合理使用API ，减少不必要的性能问题。


Array 提供了很多 Api ，大概可以分为4类： 创建Api，访问Api，修改Api，遍历Api

### 创建Api：

> 创建Api : 通过其他值，创建一个新的数组

- `[]` : 通过字面量创建数组。 
    -  `Object.create(Array.prototype)` : 创建的是类数组对象，并不是数组，不能通过 `isArray` 方法
- `Array` : 构造器方法 ，`new Array`, `Array` : 效果一样
    - 一个参数 , 且是数字 n : 返回一个长度是 n 的，全是空元素的数组
    - 其他 ：将参数转换成数组， 跟 `of` 功能一样
- `of` : 将可变参数，转换成数组，返回一个新数组
    ```
    Array.of('a', 'b', 'c')  // ['a','b','c']
    ```
- `from` : 从可迭代对象，或者类数组对象拷贝，返回一个新数组
    ```
    Array.from([1, 2, 3], (x) => x + x) // [2,4,6]
    Array.from('hello') // ['h','e','l','l','0']
    Array.from({length: 100},(_,j)=>j) // 快速创建一个0-100的数组
    ```
- `isArray` : 判断一个值是否是数组。 `arr.constructor.name === 'Array'` 判断是否数组不谨慎。

### 访问Api：

> 访问Api : 访问数组的元素，进行操作，**原数组不发生变化**

#### 返回新数组

- `concat` : 把数组元素 和 其他数组元素合并，返回新数组
- `slice` : 获取数组 start 到 end 一段元素，包含 start 不包含 end ,返回新数组
    - 参数 `start` : 起始位置， 如果负数，就是倒数位置，等价 `len + start` 
    - 参数 `end` : 结束为止，不传，就是最后, 如果起始位置大于结束为止，返回空数组
    ```
    const arr = [1,2,3,4,5]
    arr.slice(-2)    // [4,5]
    arr.slice(-2,2)  // []
    ```
- `flat` : 将数组元素中的数组压平，降维度， 返回新数组
    - 参数 `depth` : 深度，压平的深度
    ```
    // 可以用 toString 的特性，将数组转换成 字符串，在 split 成数组
    [0, 1, 2, [3, 4,[5,6,7,[8,[9]]]]].toString().split(',')
    //  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    ```
- `flatMap` : 调用 map() 方法之后在 调用 flat(1) , `arr.map(...args).flat()`

#### 返回迭代器

- `keys` : 返回数组元素索引的 迭代器 对象
- `values` : 返回数组元素值的 迭代器 对象
- `Symbol.iterator` : 返回数组数组元素值 迭代器对象 ，`arr.[Symbol.iterator]()` 与 `value` 返回对象相同
- `entries` : 返回数组键值对 `[key,value]` 的 迭代器 对象

#### 判断数组元素

- `include` : 判断数组是否包含一个元素， 返回 boolean
- `indexOf` : 从头开始判断元素在数组中的第一个出现位置，返回索引，没有返回 -1， 查询方向 -->
    - 参数 `fromIndex` : 查询的起始位置, 如果负数，就是倒数位置，等价 `len + start` 
- `lastIndexOf` : 从尾开始判断元素在数组中的第一个出现位置，返回索引，没有返回 -1 , 查询方向 <--
    - 参数 `fromIndex` : 查询的起始位置, 如果负数，就是倒数位置，等价 `len + start` 

#### 返回字符串

- `join` : 将数组元素用分隔符链接，返回字符串
- `toString` : 返回用来表示数组的字符串， 其实是调用 `join` 方法，如果 `join` 不可用， 返回 `[object Array]`
- `toLocaleString` : 返回用来表示数组的字符串，数组的每个元素，都需要调用其本身的 `toLocaleString` 转化

### 修改Api：

> 修改Api : 对原数组进行修改，包括修改数组元素，修改数组结构，**原数组会发生变化**

#### 修改数组元素

- `sort` : 默认：对数组元素转换为字符串 ，按照 UTF-16 码元值升序排序。 返回原数组
    - 参数 compareFn : 定义排序的函数， 返回一个数字， 负数->升序 正数->降序 0->保持原样 NaN->位置不稳定
    ```
    const arr = [1, 30, 4, 21, 100];
    arr.sort((a,b)=>a-b)  // 升序
    // a[1] = 4
    ```
- `reverse` : 反转数组，返回原数组
    ```
    const arr = [1, 30, 4, 21, 100];
    arr.reverse()
    // a[2] = 21
    // 实现一个数组反转
    Array.prototype.reverseArr = function () {
      const len = this.length;
      for (let i = 0; i <= len / 2; i++) {
        [this[i], this[len - 1 - i]] = [this[len - 1 - i], this[i]];
      }
      return this;
    }
    arr.reverse()
    // a[2] = 30
    ```
- `copyWithin` : 用数组的一部分，拷贝值原数组的位置， 返回原数组。
    ```
    const arr = [1, 2, 3, 4, 5]
    arr.copyWithin(1,2,4)  // 把索引 2-4 的数据，拷贝至索引 1 的位置 。 是拷贝，不是移动
    // arr = [1, 3, 4, 4, 5]
    ```

#### 修改数组结构

- `push` : 数组最后添加一个元素，返回数组长度
- `pop` : 删除数组最后一个元素，返回该元素
- `unshift` : 数组最前添加一个元素，返回数组长度
- `shift` : 删除数组最前一个元素，返回元素
- `splice` : 从某个位置删除指定长度元素，或者用其他元素替换
    - 参数 `start` : 开始位置
    - 参数 `count` : 长度， 不传参数，就是到数组末尾
    - 参数 `...item` : 多个参数，用来替换的元素列表
    ```
    const arr = [1,2,3,4,5]
    arr.splice(1,2,3,4,5) // 从 index:1 开始，删除 2 个元素，用 3，4，5 来填充
    // arr : [1, 3, 4, 5, 4, 5]
    ```
- `fill` :  从 start 到 end 填充 元素
    - 参数 `start` : 不传就是 0， 开始
    - 参数 `end` : 不传就是len-1，结尾

#### 修改Api的非修改版本

- `toReversed`: 反转数组，返回新数组，原数组不变
- `toSorted`: 数组排序，返回新数组，原数组不变
- `toSpliced`: 数组删除或者替换部份元素，返回新数组，原数组不变



### 遍历Api

> 遍历Api : 遍历原数组，对其中的元素进行 修改，查询，判断 等操作。 **原数组不发生变化**

- `forEach` : 对数组的元素依次执行给定的函数。 函数接受三个参数，元素，索引，数组对象。 
    ```
    arr.forEach((element, index, array) => { xxx })
    ``` 
- `map` : 对数组的元素依次执行给定的函数， 将返回值创建一个新数组。 函数接受三个参数，元素，索引，数组对象。
    ```
    const newArr = arr.map((element, index, array) => { return xxx })
    ```
- `every` : 对数组的元素依次执行给定的函数，所有的值执行函数的结果都返回 `true` , 则返回 `true` , 否则返回 `false`。 空数组不管函数结果返回如何，结果都是 `true`
    ```
    const newBoolean = arr.every((element, index, array) => { return xxx })
    ```
- `some` : 对数组的元素依次执行给定的函数，所有的值执行函数的结果都返回 `false` , 则返回 `false` , 否则返回 `true`。 空数组不管函数结果返回如何，结果都是 `false`
    ```
    const newBoolean = arr.some((element, index, array) => { return xxx })
    ```
- `filter` : 对数组的元素依次执行给定的函数，将返回值为 `true` 的元素，组成一个新数组
    ```
    const newArr = arr.filter((element, index, array) => { return xxx })
    ```
- `find` : 对数组的元素依次执行给定的函数，返回第一个结果为 `true` 的元素， 没有就返回 `undefined`
    ```
    const element = arr.find((element, index, array) => { return xxx })
    ```
- `findIndex` : 对数组的元素依次执行给定的函数，返回第一个结果为 `true` 的元素索引， 没有就返回 `-1`
    ```
    const elementIndex = arr.find((element, index, array) => { return xxx })
    ```
- `findLast` : 与 `find` 类似，依次执行函数顺序相反
- `findLastIndex` : 与 `findIndex` 类似，依次执行函数顺序相反
- `reduce` : 给定初始值，将初始值 和 数组元素 执行函数 返回结果，作为下一次的初始值，循环执行函数， 返回最终执行函数结果
    ```
    const result = arr.reduce(
        (lastResult, element, index , array ) => { return newResult }
        initialValue,
    )
    ```
    - 参数 `initialValue` ： 如果没传，就是数组第一个元素。
- `reduceRight` : 与 `reduce` 类似，执行函数的方向不同， 从数组末尾开始执行。
    ```
    const result = arr.reduceRight(
        (lastResult, element, index , array ) => { return newResult }
        initialValue,
    )
    ```
    - 参数 `initialValue` ： 如果没传，就是数组最后一个元素。
    - 链式调用：细心的人已经发现了，`reduce`,`reduceRight` 是一个链式调用 。我们可以利用 `reduce`,`reduceRight` 来实现一个 `compose` 函数。 
        ```
        const compose = function (...fns) {
            return fns.reduceRight((a, b) => {
                return (...argvs) => {
                    a(b(...argvs));
                };
            });
        };
        const fun1 = ()=> console.log(1)
        const fun2 = ()=> console.log(2)
        const fun3 = ()=> console.log(3)
        const composedFunction = compose(fun1, fun2, fun3)
        // composedFunction() 依次执行 fun1，fun2 fun3
        // 也可以用 reduce 实现一个反向执行的 compose
        ```

### 总结

Array 的 Api 是真的多，也是因为日常用到数组的地方实在太多，进行需要对数组进行各种各样的操作。 在使用之前一定要清楚 Api 的作用，有几个点要时刻明确 

- 是否对原数组进行修改， 还是产生新的数组
- 是否需要遍历原数组，还是仅仅过滤一些值，`forEach` , `map`  or `filter` ?
- `['1','2','3'].map(parseInt)` : 杜绝跟其他 api 连用，务必使用一个自定义函数作为参数
- `every` 和 `some` 很好用 ，判断整个数组是否符合一些条件
- `slice` 和 `splice` 别搞混， `slice` 传入2个索引返回新数组 ，`splice` 传入索引+ 长度 对原数组进行修改
- 链式调用记住 `reduce`
- `push` + `pop` 是 栈
- `push` + `shift` 是 队列