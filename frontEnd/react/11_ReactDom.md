# React Dom

所有的内置浏览器组件，例如`<div>`，支持一些常用的熟悉和事件

**虽然JSX的语法，有些类似HTML标签语法，但是2者是完全不一样**

## 对比 HTML 标签语法

- 1、支持所有浏览器内置的 HTML 与 SVG 组件
- 2、组件本质不一样，是一个React的对象。在渲染时会渲染成制定的HTML组件
- 3、基本支持所有HTML组件的属性，属性的写法必须是camelCase驼峰
- 4、特定的属性
  - children：
  - dangerouslySetInnerHTML：
  - ref: useRef 或者 ref回调。 在列表循环时hooks不适用，通过监听回调函数，存储node到map或者数组，需要的时候根据nodeId获取node
  - style: 属性名也是驼峰写法

## 合成事件(synthetic event)

事件处理程序将接收到一个 React 事件对象。它有时也被称为“合成事件”。它符合与底层 DOM 事件相同的标准，但修复了一些浏览器不一致性

事件列表:

- `type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;`: 剪贴板
  - `onCopy?: ClipboardEventHandler<T> | undefined;`
  - `onCopyCapture?: ClipboardEventHandler<T> | undefined;`
  - `onCut?: ClipboardEventHandler<T> | undefined;`
  - `onCutCapture?: ClipboardEventHandler<T> | undefined;`
  - `onPaste?: ClipboardEventHandler<T> | undefined;`
  - `onPasteCapture?: ClipboardEventHandler<T> | undefined;`
    每个事件监听函数都有一个对应的`onxxxCapture`监听函数，用来在事件捕获阶段监听的，其他事件也类似
- `type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;`: 输入码：如使用拼音输入法时
- `type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;`：拖拽
- `type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;`：焦点
- `type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;`：提交表单
- `type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;`：输入框change
- `type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;`：键盘
- `type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;`：鼠标
- `type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;`：触摸
- `type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;`：指针
- `type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;`：UI事件，scroll
- `type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;`: 鼠标滚轮
- `type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;`：动画
- `type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;`： 过渡

## API

- createPortal : 将JSX作为children 渲染至DOM不同位置。 portal 只是改变了DOM的渲染位置，在组件中父子关系不变，仍可以访问父组件的context，仍然遵循事件冒泡

```
<div>
  <p>这个子节点被放置在父节点 div 中。</p>
  {createPortal(
    <p>这个子节点被放置在 document body 中。</p>,
    document.body
  )}
</div>
```

- flushSync: 强制 React 在提供的回调函数内同步刷新任何更新，立即更新
- findDOMNode: （已废弃，使用ref替代）获取dom节点
- hydrate: （已废弃，使用`hydrateRoot`替代）， 使用 `react-dom/server` 生成的 HTML 内容作为浏览器 DOM 节点，并在其中显示 React 组件
- render: (已废弃，使用`createRoot`替代)，将JSX渲染到Dom节点
- unmountComponentAtNode: (已经废弃，使用 `root.unmount`替代)
- `createRoot`: 将JSX渲染到Dom节点
  - createRoot(domNode, options?): 创建一个react根节点
  - root.render(reactNode): 将react根节点渲染到HTML DOM节点
  - root.unmount() : 销毁渲染树
- `hydrateRoot`
