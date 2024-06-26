# handlebars

## 1、简介
[handlebars](https://handlebarsjs.com/zh/)是一个轻量的语义化模版库

## 2、用法
```
import Handlebars from 'handlebars';
const tpl = `I am {{name}} , I am {{age}} years old`
const template = Handlebars.compile(tpl);
const result = template({ name: 'zhangsan', age: 20 });
```

## 3、助手代码

代码助手就是，某个特殊功能的语法，可以理解为一个函数，通过某个函数处理，返回特定的内容。
如何使用？ 以 `#xxx` 开头，以 `/xxx` 结束
```
{{#myhelper}}
.....
{{/myhelper}}
```


### 3.1 内置助手代码

- if : 条件渲染。 判断条件是否为 true
```
{{#if name}}
<h1>{{firstName}} {{lastName}}</h1>
{{/if}}
```
- unless : 反向条件渲染。 判断条件是否为 false 。 跟 if 判断相反
- each : 迭代渲染，遍历数组，将内容依次
```
{{#each people}}
    <li>{{this.name}}  {{age}}</li>
{{/each}}
```
- with : 修改上下文，用于嵌套渲染
```
{{#with person}}
    {{firstname}} {{this.lastname}}
{{/with}}
```

### 3.2 自定义助手代码
```
Handlebars.registerHelper('upper', function (str) {
    return str.toUpperCase();
});

<h1>{{upper firstName}} {{upper lastName}}</h1>
```

## 4 进阶
- 嵌套助手代码: 内置+自定义
```
{{#each (filterNames names)}}
  {{#if this.select}}
    {{this.name}},
  {{/if}}
{{/each}}
```
以上是自定了助手代码 `filterNames` 对 names 逐个进行判断，过滤部分，设置select为true，并渲染 

- 多个自定义嵌套
```
{{helper2 (helper1 name)}}
```
将name先进行 helper1 转换，在进行 helper2 转换

- 多参数自定义助手代码
```
Handlebars.registerHelper('helper1', function (str, prefix) {
    return prefix + str;
});

{{helper1 (helper1 name 'first') 'last'}}
```

## 5 特殊用法

- HTML转义，`{{}}` 渲染后，会将HTML字符进行转义，如果不需要转义，使用`{{{}}}`
- 字面量：支持的字面量：数字、字符串、true, false, null 及 undefined
- 转义: `\{{  }}` 会直接渲染`{{  }}`。 如果里面还有完整的`{{ }}`，依旧会渲染
```
\{{ 
    this is a {{ dog }}
}}
```
- 转义整块：  `{{{{ raw-helper }}}}`
```
Handlebars.registerHelper('raw-xxx', function(options) {
    return options.fn()
});
{{{{raw-xxx}}}}
  {{bar}}
{{{{/raw-xxx}}}}

// 会渲染成 {{bar}}
```

## 6 [代码片段](https://handlebarsjs.com/zh/guide/partials.html#%E5%9F%BA%E6%9C%AC%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5)

代码片段，就是一段 模版代码。 注册代码片段 `Handlebars.registerPartial` 

Todo: 目前没用到，以后再看