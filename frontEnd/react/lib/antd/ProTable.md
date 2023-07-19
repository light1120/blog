# ProTable

## ProTable

- tableLayout: `tableLayout={'fixed'}` 可以解决因为字段太长而导致 column 的 fixed 设置失效；[feat: 💥 support tableLayout and column.ellipsis](https://github.com/ant-design/ant-design/pull/17284)

## ProColumns

- valueType:

[valueType](https://procomponents.ant.design/components/schema#valuetype-%E5%88%97%E8%A1%A8) 是 ProComponents 的灵魂，ProComponents 会根据 valueType 来映射成不同的表单项; 如常用的：`select`,`dateTime`,`avatar`,`image`等

- search:

是否配置位搜索列，默认 true； 但是如果后台需要的参数格式与表单默认格式不一样，一般做法就是在`request`传入的函数中针对字段转换。这里有另外的做法，设置`search.transform`函数，会对对应的值进行转换，如下

```
{
   title: '开始时间',
   key: 'start_time',
   valueType: 'dateTime',
   hideInTable: true,
   search: {
       transform: (value: any) => ({ start_time: new Date(value).getTime() }),
   },
},
```

- request:
    异步数据，