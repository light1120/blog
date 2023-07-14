# Protocol Buffer

## 字段

> 字段后面的数字，是用于字段的标识，防止序列化，反序列化中串了。

- optional : 可选
- required : 必须
- repeated : 重复，表示有多个值，可以理解为数组
- reserved : 保留字段

```
// 预留了 2 ，4，5，6 四个序列号，防止被后续的版本占用
reserved 2, 4 to 6;
reserved "middle_name", "address.*";
```
