## JSON-Schema

### 1，定义
- JSON : `Javascript Object Notation`
- Schema : 它只是  一种用于“描述其他数据结构”的声明性格式
- [JSON-Schema](https://json-schema.org/) : 是用JSON编写的用来描述JSON的，通过JSON-Schema可以准备的知道JSON的的数据结构

### 2，例子
```
{
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "birthday": { "type": "string", "format": "date" },
    "address": {
      "type": "object",
      "properties": {
        "street_address": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "country": { "type" : "string" }
      }
    }
  }
}
// 这里描述的是一个对象有first_name,last_name,birthday,address四个熟悉，first_name,last_name是字符串类型的值，birthday是日期格式的字符串，address是一个有四个字符串属性的对象
```

### 3，规范
#### 3.1，基本类型（type的值）
- string
  - minLength
  - maxLength
  - pattern
  - format:"date"、"date-time"、"email"
  - **contentMediaType**: MIME 类型（如：text/html）
  - **contentEncoding**: 编码（如：base64,binary）
- number\integer
  - multipleOf: 倍数
  - minimum，maximum：范围
  - exclusiveMinimum，exclusiveMaximum：排它范围
- object
  - properties： 属性
  - patternProperties： 模式属性，属性名通配符
  - additionalProperties： 额外属性，false / {}
  - required: 必需，属性名字符串数组
  - minProperties，maxProperties： 属性数量
- array
  - items: 
    - 列表验证：items为所有元素都满足条件的对象
    - 元组验证：items为描述每个元素的对象数组
  - additionalItems： 附加元素
  - minItems，maxItems： 数组长度校验
  - uniqueItems：每个元素不相同，唯一
- boolean
  - 值只能为true、false，不能是0、1等
- null
  - 只能是null

#### 3.2，通用关键字
- title,description: 描述
- default: 默认值，不用于校验，用于提示
- example: 例子，不用于校验，用于提示
- readOnly,writeOnly： 只可读性，只可写性
- enum：元素数组，唯一性，可以是不能类型元素

#### 3.3，高级
- 组合：值为描述对象数组
  - allOf: 逻辑AND操作，满足所有描述对象条件
  - anyOf: 逻辑OR操作，满足其中一个即可
  - oneOf: 逻辑XOR操作，只能满足其中一个
  - ont: 逻辑NOT操作，不能满足所有条件
- 条件
  - dependentRequired： 如果存在A属性，必需存在B属性。这里依赖不是双向的，如果需要双向依赖，需要再加一条
    ```
    "dependentRequired": {
      "A": ["B"]
    }
    ```
  - dependenciesSchemas： 模式依赖，逻辑同上
  - if then else: 
- 方言
  - $schema: 使用哪个方言schema编写
  ```
  "$schema": "https://json-schema.org/draft/2019-09/schema"
  ```
- 复杂模式
  - $id : 基本URL,用来检索改模式，最好是绝对地址URL
  - $ref: 另一个模式的引用
  - $def: 在当前模式下定义一个子模式，其他地方可以重复引用
  ```
  name: { "$ref": "#/$defs/name" }
  ```
  - 递归： 用$ref引用一个包含自己的模式，构成递归；禁止：双向递归会造成无限循环


### 4，应用
#### 4.1，校验
>对大量数据进行校验：如 复杂表单数据结构校验
- [ajv.js](https://ajv.js.org/): Security and reliability for JavaScript applications
- 使用
```
const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
  ...
}

const validate = ajv.compile(schema)

const data = {
  ...
}

const valid = validate(data)
if (!valid) console.log(validate.errors)
```

#### 4.2生成表单
>根据JSON Schema自动生成表单，表单验证通过之后得到符合schema的数据
- React
  - [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/)
  - [XRender 可视化JSON Schema生成工具](https://x-render.gitee.io/schema-generator/playground)
- Vue
  - [vue-json-schema-form](https://github.com/lljj-x/vue-json-schema-form)
  - [可视化JSON Schema生成工具](https://form.lljj.me/schema-generator.html#/index)
- React & Vue 都支持
  - [Formily](https://v2.formilyjs.org/zh-CN)
  - [生成工具](https://designable-antd.formilyjs.org/)

