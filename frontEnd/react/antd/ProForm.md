# ProForm

> Form 是工作中用到最多组件之一 ，由于之前没有系统学习 React，对 antd 设计不是特别了解，走了很多弯路

## ProForm 组件

- ProForm
  - formRef: form 表单实例，一般用来获取、设置某个表单项的值
- ModalForm: 以弹窗的形式呈现 form

## [常用 Form 子组件](https://procomponents.ant.design/components/field-set#%E7%BB%84%E4%BB%B6%E5%88%97%E8%A1%A8)

- ProForm.Item: 单个表单项，这个是最基础了，还封装了很多高级组件，参考下面；组件名称中带有`Form`关键字的，属性基本类似
  - name: 表单项名称，**重要**，是表单数据对象的 key 值，不能重复
  - label: 标签
  - placeholder:
  - disabled: 是否可编辑
  - width: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg';
  - tooltip: 对表单项的说明，帮助创建者输入
  - rules: 针对 name 作为 key 的数据校验 `rules={[{ required: true, message: '该项是必选项' }]}`
  - request: 异步数据，可作为 select 的数据源
  - fieldProps: 会作为 prop 传入具体渲染的组件，通用 style,width 。具体需要传什么值，要看具体的表单项，以`ProFormSelect`为例，就是`SelectProps`定义的属性，如：
    - filterOption：对数据源过滤，也可支持输入，根据输入过滤数据源
    - onChange：监听选择
- ProFormSelect
- ProFormText
- ProFormText.Password
- ProFormTextArea
- ProFormDigit
- ProFormDatePicker
- ProFormCheckbox
- ProFormRadio.Group
- ...

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

## Form 设计

- 1、将 Prop 的数据，定义普通变量，
- 2、组合数据赋值 Form 的 `initialValues` 属性，Form 会根据单项 Form.Item 的 name 属性对应的字段首次渲染
- 3、提交时 `onFinish`中会收到所有 表单项 name 组成的对象。基础的 Form 就完成了
- 4、如果 Prop 数据变化，如何更新 Form ?
- 5、创建`ProFormInstance`赋值 `formRef` 属性
- 6、useEffect 监听 prop 变化，重新组装数据，调用 `formRef.current?.setFieldsValue` 更新表单项
- 7、子 Form 问题？ 或者 Form 中子组件？
- 8、新建普通组件，由多个 FormItem 组件组成，同属于一个 Form，公用一个校验体系
- 9、监听子组件 onChange，在父组件中 setFieldsValue ，或者 把 formRef 传入子组件，在子组件中 setFieldsValue
- 10、提交时`onFinish`也可以得到子组件中的数据
