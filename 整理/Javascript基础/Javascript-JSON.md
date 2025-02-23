# JSON 

> JSON 对象和其他对象不一样，不能使用 new 关键字来构造。 JSON 和 Math 对象一样提供了一些方法用于处理一些实际场景， javascript 对象 和 字符串直接的转换。

## 静态方法

- `parse` : 将字符串转换成对象
- `stringify` : 将对象转换成字符串


## 序列化 与 反序列化

### 1、什么是序列化，反序列化？为什么需要序列化，反序列化？

- 开发语言大都是以对象的方式理解世界的，而真实计算机和网络传输中却是以字节方式进行的。那么对象在不同语言直接转换，网络传输、不同平台存储时，就需要一种机制。将对象转成字节数组，并把自己数组还原成对象，这就是序列化和反序列化
- 序列化: 就是将对象转换成字节数组的过程
- 反序列化: 就是反向过程

### 2、JSON 序列化 & 反序列化

- `JSON.stringify` : 序列化 `JSON.stringify(value[, replacer [, space]])`

  ```
  const me = {
    name: 'zhangsan',
    gender: 'male'
  }
  JSON.stringify(me);
  // '{"name":"zhangsan","gender":"male"}'
  ```

  - 格式化:

  ```
  console.log(JSON.stringify(me,null,'\t'))
  //{
  //  "name": "zhangsan",
  //  "gender": "male"
  //}
  ```

  - 处理特殊对象，如 **Map**、**Set**

    如果直接执行 JSON.stringify 会返回'{}'，需要添加第二个参数，

    - 数组：过滤掉其他原属，只保留数组内的元素
    - 函数：将所有值经过函数处理后返回：下面是将 map 转换成对象，set 转换成数组
      ```
      const jsonReplacer = (_, value) => {
        if (value instanceof Set) {
          return [...value]
        }
        if (value instanceof Map) {
          return Object.fromEntries(value)
        }
        return value
      }
      ```

- `JSON.parse` : 反序列化
  ```
  JSON.parse('{"name":"zhangsan","gender":"male"}')
  // {name: 'zhangsan', gender: 'male'}
  ```

### 3、应用

- web storage

  ```
  localStorage.setItem('me',{
    name: 'zhangsan',
    gender: 'male'
  })
  localStorage.getItem('test')
  // '[object Object]'
  ```

  在存储在 localStorage、sessionStorage 时，无法直接将对象存储的，需要将对象序列化以后存储，取出后再反序列化，就可以得到原对象

- 前后端交互
  axios 发送请求时，需要将 data 对象数据序列化之后向后台传输。收到请求之后，需要将数据反序列化返回

  ```
  //https://github.com/axios/axios/blob/v1.x/dist/browser/axios.cjs#L1415
  transformRequest: [function transformRequest(data, headers) {
    //...省略
    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    //...省略
      try {
        return JSON.parse(data);
      } catch (e) {
        //...省略
      }
    }
    //...省略
  }],
  ```

- 后台返回数据到前端
  koa 接收请求的数据，和返回请求数据，同样也会反序列化和序列化
  ```
  //https://github.com/koajs/koa/blob/master/lib/application.js#L261
  function respond (ctx) {
    //...省略
    // body: json
    body = JSON.stringify(body)
    if (!res.headersSent) {
        ctx.length = Buffer.byteLength(body)
    }
    res.end(body)
  }
  //https://github.com/koajs/body-parsers/blob/master/index.js#L32
  request._parse_json = function (text) {
    //...省略
    try {
        return JSON.parse(text)
    } catch (err) {
        this.ctx.throw(400, 'invalid json received')
    }
  }
  ```

### 4、`toJSON`

> 如果需要定制好序列化一个对象，需要在对象内部实现 `toJSON` 方法

从 MDN 中的`JSON.stringify`的[`polyfill`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)中看到，在序列化时，如果是对象，会优先调用 `toJSON` 方法

```
stringify: (function () {
    //...忽略
    return function stringify(value) {
        if (value == null) {
            return 'null';
        } else if (typeof value === 'number') {
            return isFinite(value) ? value.toString() : 'null';
        } else if (typeof value === 'boolean') {
            return value.toString();
        } else if (typeof value === 'object') {
            if (typeof value.toJSON === 'function') {
                return stringify(value.toJSON());
            } else if (isArray(value)) {
                var res = '[';
                for (var i = 0; i < value.length; i++)
                    res += (i ? ', ' : '') + stringify(value[i]);
                return res + ']';
            } else if (toString.call(value) === '[object Object]') {
                var tmp = [];
                for (var k in value) {
                    if (value.hasOwnProperty(k))
                    tmp.push(stringify(k) + ': ' + stringify(value[k]));
                }
                return '{' + tmp.join(', ') + '}';
            }
        }
    return '"' + value.toString().replace(escRE, escFunc) + '"';
    };
})()
```

尝试下：

```
const me = {
  name: 'zhangsan',
  gender: 'male',
  toJSON: function(){
    return `my name is ${this.name}`
  }
}
JSON.stringify(me);
// '"my name is zhangsan"'
```

**特殊注意**：

node 接入层从服务端拿到数据之后， 如果需要给对象添加属性时，要确认对象的 `toJSON` 方法，如果添加属性之后,再传输到前端时，会序列化调用 `JSON.stringify` 方法，间接调用了对象的 `toJSON` 进而把新增的属性过滤掉了。 这里需要创建一个新对象，再传输到前端。

```
// 下面是伪代码， rpc 拿到 res 对象，添加属性，返回前端。因为 res 对象有定义 toJSON 方法，前端接受不到 new newProperty 属性
const res = await ctx.server.service(req)
res.newProperty = 'new Property'

return {
  code: 0,
  data: res,
  message: 'success'
}
```