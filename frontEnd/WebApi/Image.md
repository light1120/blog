# Image

> Image 函数属于 webapi ，`new Image()` 会创建一个 [HTMLImageElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLImageElement) 实例。等价于 `document.createElement('img')`

## 用法

`Image(width, height)` : 图片的宽度，高度

一般用法，先创建一个图片，然后加到 document 中

```
var myImage = new Image(100, 200);
myImage.src = 'picture.jpg';
document.body.appendChild(myImage);
```

上面代码相当于在 body 中创建一个 `<img width="100" height="200" src="picture.jpg">` 元素。

## 属性

> \* 表示只读

- alt
- complete \* : 图片都是自上而下一块一块渲染，可以判断拿到图片对象的 `complete` 属性来判断图片是否渲染完成。
- crossOrigin
- currentSrc \*
- src
- decoding
- referrerPolicy
- isMap
- useMap : 使用 [<map>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map) 元素。可以实现点击一个图片的不同位置，跳转不同的 URL
- height
- width
- natureHeight \*
- natureWidth \*

## 继承

HTMLImageElement 继承于 HTMLElement。 也拥有了 HTMLElement 的一些事件 如 `load` , `drag` 等
