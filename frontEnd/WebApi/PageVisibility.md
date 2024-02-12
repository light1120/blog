# Page Visiblility API

## visibility state

[Document.visibilityState](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/visibilityState)反应的当前 document 的可见性，可以是整个文档，也可以是某个元素。

- `prerender` : 渲染中。初始状态，从此状态开始，不能再次转成成此状态。
- `visible`: 可见。至少部分可见
- `hidden`: 不可见。 此时 `document.hidden`的值为`true`

- `diaplay: none` : 不会改变其状态

## visibilitychange

在 `visibilityState` 发生变化时，会出发 `visibilitychange` 事件

```
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    audio.play();
  } else {
    audio.pause();
  }
});
```

## 触发 `visibilityState` 的场景

- **页面，元素首次加载**：会触发
- **窗口切换成背景标签**：会触发
- **浏览器窗口最小化**：会触发
- **待机，锁屏**：会触发

- 如果 css 样式影响到不可见，不会触发
- 页面滑动，导致元素处于可视窗口外，不会触发。

## 扩展： 有些 web 功能会受`visibilityState`的变化而影响

### 受影响

- javascript 的执行，会继续执行完主进程，不会执行任务队列中的任务，`setTimeout , setInterval , requestAnimationFrame` 会受到影响

- 动画 ： 会受到影响，包括 `canvas` , `webgl`

### 不受影响

- 正在播放的音、视频
- 网络请求 : `ajax` , `webSocket` , `webRTC`
- worker : `web worker` , `service worker`
- indexDB
