# Form

> Form 是工作中用到最多组件之一 ，由于之前没有系统学习 React，对 antd 设计不是特别了解，走了很多弯路

## 常用组件

- ModalForm: 以弹窗的形式呈现 form
  - formRef: form 表单实例，一般用来获取、设置某个表单项的值
- Form.Item: 单个表单项，这个是最基础了，还封装了很多高级组件，参考下面；组件名称中带有`Form`关键字的，属性基本类似
  - name: 表单项名称，**重要**，是表单数据对象的 key 值，不能重复
  - rules: 针对 name 作为 key 的数据校验
  - disabled:
  - width: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg';
  - label:
- ProFormSelect
- ProFormText

## 遇到的问题

- ProForm 和 Table 不能混用； Form x Table / ProForm x ProTable
- 如何在提交表单的时候校验每个表单项？
  - 需要在表单项组件中，如`ProFormText` 设置 `rules={[{ required: true, message: '参数必须' }]}`
  - 如果是`ProFormxxx`可以直接设置，`Form.Item`需要注意，如下
  - 在 Input 组件设置无效
- `<Form.Item><Input /></Form.Item>`:
  - 如果出现这种，需要注意表单项`Form.Item`数据和组件数据`Input`是不同，Input 有值，依然会提示必须项
  - 需要监听 Input onchange 将数据设置到表单中`formRef.current?.setFieldsValue`
- `PromFormText`: 这种高级组件将 2 个值融合在一起了，所以不需要 setField
