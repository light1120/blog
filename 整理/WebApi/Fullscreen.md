# WebApi - Fullscreen 全屏API

### 属性

- `document.fullscreen` : `boolean` 当前是否是全屏模式
- `document.fullscreenElement` : `Element` 当前全屏的元素，`fullscreen` 是 `false` 时返回  `null`

### 方法

- `document.getElementById('body').requestFullscreen()` : 将调用方法的元素，置为全屏，调用这是 `Element`
- `document.exitFullscreen()`: 取消全屏, 调用者是 `document`

### 事件

- `fullscreenchange` : `requestFullscreen` 和 `exitFullscreen` 调用时触发
- `fullscreenerror` : 不能全屏时触发事件

`Document` 和 `Element` 都支持这2个事件

```
document.addEventListener("fullscreenchange", (e)=>{
    console.log(e)
});
document.getElementById('body').addEventListener("fullscreenchange", (res)=>{
    console.log('Ele:',res)
});
```