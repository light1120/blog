# React 工具集

> 干活离不开工具，好的工具可以有效提升研发效率，基于某个技术栈，需要了解业界比较受欢迎的配套工具，这样在遇到问题时，不至于去找解决方案

### 1、构建工具、 脚手架 、包管理工具

推荐 vite 、 create-vite 、 pnpm 、typescript 非常快速构建一个基础web应用模板。 也可以在官方模板的基础上构建包含自己业务的应用模板，使用 cli 的方式快速创建。

```
pnpm create vite myApp --template react-ts
```

### 2、UI 组件库

有很多，大厂一般都有自身的UI组件库。如果没有要求，就任选个大厂 star 比较高的 UI 组件库。这里推荐 antd

- [ant-design](https://ant-design.antgroup.com/index-cn) : 个人用了比较久，比较舒心，推荐 5+ 版本
- [icon](https://ant-design.antgroup.com/components/icon-cn) : icon 也是经常需要用到的
- [ant-pro](https://procomponents.ant.design/components) : 推荐优先使用 ant-pro , 不满足再使用 ant-d

### 3、web 组件

- 1、[react-monaco-editor](https://github.com/suren-atoyan/monaco-react): web 代码编辑器
```
export const CodeEdit: React.FC<{ onChange: (value: string, event: any) => void; language?: string }> = memo(function ({
  onChange,
  language = 'json',
}) {
  return (
    <MonacoEditor
      {...{
        width: '100%',
        height: 600,
        theme: 'vs',
        language: language,
        className: 'editor-container',
        options: {
          selectOnLineNumbers: true, // 是否在单击行号时选择整行
          automaticLayout: true, //是否启用自动布局。
          wordWrap: 'wordWrapColumn', //设置单词换行方式。可以设置为off、on或wordWrapColumn。
          wrappingStrategy: 'simple', //设置单词换行策略。可以设置为simple或advanced
          wordWrapBreakBeforeCharacters: ',', //在这些字符之前换行
          wordWrapBreakAfterCharacters: ',', //在这些字符之后换行。
          disableLayerHinting: true, //是否禁用层次提示
        },
        editorDidMount: (editor) => {
          editor.focus();
        },
        onChange,
      }}
    ></MonacoEditor>
  );
});
```
- 2、[react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/): 将 jsonschema 渲染成表单。 

还配套集成了些UI组件库[@rjsf/antd](https://www.npmjs.com/package/@rjsf/antd)

- 3、[draft-js](https://draftjs.org/) 官方推荐的富文本编辑器
```
import React from 'react';
import {Editor, EditorState} from 'draft-js';
 
function MyEditor() {
  const [editorState, setEditorState] = React.useState( EditorState.createEmpty());
  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={editorState => setEditorState(editorState)}
      />
    </div>
  );
}
```
- 4、[quill](https://github.com/quilljs/quill) 也是值得推荐的富文本编辑器

### 4、状态管理

- Redux : [redux-toolkit](https://cn.redux-toolkit.js.org/) 官方
- zustand : [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) 更为简洁些状态管理 
- immer: [immer](https://immerjs.github.io/immer/) 用于处理 不可变状态（immutable state）, 当 react 的 state 的数据结构比较复杂时，我们在执行`setState`时需要传入一个新的对象，由于对象是基于引用存储的，所以可能会出现bug，所以需要一个工具，创建一个全新的对象传入`setState`。由于深拷贝的性能问题，所以诞生了 immer 
```
const nextState = produce(baseState, draft => {
    draft[1].done = true
    draft.push({title: "Tweet about it"})
})
setState(nextState)  // 这里保证了 nextState 是一个全新的对象
```
(纯个人想法: React 挖了个坑，自己不填，告诉开发者这里有个坑，你们需要个锹，大家就开始造锹，然后有了个特别锋利的锹叫 immer )

### 5、hooks

值得每一个hooks都去了解，在有类似需求时，可以拿来即用，非常方便。

- 1、[react-use](https://github.com/streamich/react-use) 
- 2、[usehooks-ts](https://usehooks-ts.com/introduction)
- 3、[ahooks](https://ahooks.js.org/zh-CN) : `useRequest` 功能强大，支持 [SWR](https://swr.vercel.app/zh-CN)
