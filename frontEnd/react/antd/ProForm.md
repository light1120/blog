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

1-初始化：

- 0、创建 `ProFormInstance` 赋值 `Form` `formRef` 属性
- 1、将 `prop` 中的数据，按照 `Form` 的格式，初始化对象 `formData`
- 2、注意 `formData` 中包含所有的 `formItem` 的数据，属性名对应 `Form.Item` 的 `name` 属性
- 3、将 `formData` 赋值给 `Form` 的 `initialValues` 属性，完成初始化。

2-更新属性：

- 4、输入，选择等操作。不用任何处理，按照 `Form` 内部运行
- 5、由于用户选择，导致表单项发生变化。也不用任何处理
- 6、由于 `prop` 变化，被动更新表单。 执行初始化流程，将 `prop` 数据，生成 `formData` 。然后 `formRef.current?.setFieldsValue` 更新表单项。
  ```
  useMemo(() => {
    if (props.info) formRef.current?.setFieldsValue(formDataFormat(props.info));
  }, [props.info]);
  ```

3-获取表单数据：

- 7、提交表单：`onFinish` 会返回所有表单项数据组成的表单对象，需要将对象转换成前后台交互数据格式
- 8、非提交获取表单：`formRef.current?.getFieldsValue()` ，获取单个或者全部
- 9、表单联动：修改某个表单项，导致整个表单项发生变化。比如：选择了某个值，出现了其他的必选表单项

  ```
  <ProForm.Item shouldUpdate noStyle>
    {(form) =>
      form.getFieldValue(`xxxType`) === 1 && (
        <ProFormSelect ...></ProFormSelect>
      )
    }
  </ProForm.Item>
  ```

4-动态表单： 输入表单过程中，新增/删除表单项

- 10、初始化中构建数组，通过数组渲染多个表单项
  ```
  itemArray?.map((itemId) => (
    <ProFormSelect
      name={`type_${itemId}`}
      ....
    ></ProFormSelect>
  ))}
  ```
- 11、提交表单时，需要将所有的动态表单组合成
  ```
  itemArray((itemId) => {
      return {
          itemId,
          type: formData[`type_${itemId}`],
      }
  }))
  ```
- 12、新增和删除，就是对数组 `itemArray` 操作

5-子组件表单：

- 13、子组件表单，就是多个 `Form.Item` 的集合，不要 `Form` 嵌套 `Form` , 只有父组件一个 `Form`
- 14、在 `submit` 可以连着 子组件一起校验
- 15、初始化时，可以包括自组件的表单项，也可以在 渲染时 `formRef.current?.getFieldsValue()`，初始化表单项
- 16、提交表单时，`onFinish` 也包含了自组件的表单项
