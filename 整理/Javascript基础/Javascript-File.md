# File

> 在 web 应用中对文件的处理是非常常见的功能，比如上传，下载，传输等。

## Input file 标签

```html
<input type="file" id="file" placeholder="please upload file" />
```
```js
const fileEl = document.getElementById('file');
const file = fileEl.files[0] // 返回一个 File 对象
```

## File 属性

- name : 名称
- size : 大小 （字节数）
- type : mime 类型
- lastModified : 时间戳，最近修改时间

> 其实只有 name ，lastModified 是只属于 File ，其他的属性和方法都是继承 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

## 上传文件

```js
const formData = new FormData();
const file = fileInput.files[0]
formData.append('name', file.name);
formData.append('file', file);
// 设置 Content-Type : 'multipart/form-data'
axios.post(`xxxx`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})
```

在上传文件到服务器时，需要通过借助 `FormData` 对象，来传输二进制对象。 同时需要设置 `Content-Type : 'multipart/form-data'`

那后台接收到 `Content-Type : 'multipart/form-data'` 类型的请求是如何处理的？ 如何区分一般属性 `name` 和 文件对象 `file`

我们可以通过 `chrome network` 找到这个请求数据， 如下

```js
// request header : content-type
 "content-type": "multipart/form-data; boundary=----WebKitFormBoundarytmx9WCwEKpK3dqOd",

// request payload
------WebKitFormBoundarytmx9WCwEKpK3dqOd
Content-Disposition: form-data; name="name"

browser-EventLoop.png
------WebKitFormBoundarytmx9WCwEKpK3dqOd
Content-Disposition: form-data; name="file"; filename="xxx.png"
Content-Type: image/png


------WebKitFormBoundarytmx9WCwEKpK3dqOd--
```

后台在收到请求的请求体数据时，（ nodejs 可以通过 `data` 事件来接收数据 ） 收到的是二进制数据流，然后反序列化，在根据 `content-type` 进一步分析。然后再根据请求体中的 `Content-Disposition` 字段分析每个字段的类型。得到 `name` 是一个普通字符串，`file` 是一个文件对象。


## File -> Blob

`Blob` 对象表示一个不可变、原始数据的类文件对象。 通常一般使用 `Blob` 对象来处理文件对象

- `new Blob(blobParts, options)`构造函数
    - `blobParts` : `ArrayBuffer、TypedArray、DataView、Blob、字符串` 任意组合
    -  `options-type` : mime 类型，默认是空
    ```js
    const bb = new Blob(['hello world'],{ 'type': 'text/plain' })
    bb.size // 11 
    ```
- 属性：
    - size: 大小 （字节数）
    - type：mime 类型
- 方法：
    - `arrayBuffer()` : 返回 `Promise<ArrarBuffer>`
    - `bytes()` : 返回 `Promise<Uint8Array>`
    - `text()` : 返回 `Promise<String>`
    - `stream()` : 返回 `ReadableStream`
    - `slice()` : 类似数组切割，返回一个 `blob`

`Blob` 是 `Binary Large Object` 的简称，是用于存储超大的二进制对象，是对 `ArrayBuffer` 对象的一个补充。

我们知道 V8 在执行 javascript 代码时，对在堆内存中实例化对象，并存储，执行相应逻辑。 但是在遇到 `Blob, ArrayBuffer` 这种大量二进制数据，一般会借助外部内存，比如浏览器内存， 将 `Blob` 存储在浏览器内存中，不占用 V8 的堆内存。

chrome 提供了 `chrome://blob-internals/` 来查看当前应用的 `Blob` 对象


```js
// 在 chrome 控制台执行 new Blob 操作
const bb = new Blob(['hello world'],{ 'type': 'text/plain' })
// 可以在 chrome://blob-internals/ 看到新增了一个 length 11 的 blob 数据
fa5c6af4-7f5e-48bc-843c-4995822a818b
    Refcount: 1
    Status: BlobStatus::DONE: Blob built with no errors.
    Content Type: text/plain
    Type: data
    Length: 11

// 通过 input 标签选择一个文件时
<input type="file" id="file" placeholder="please upload file" />
// 可以看到新增一个 图片的 Blob 数据，这里 Path 对应的磁盘上的一个文件
5c087d92-9c88-4924-b7bd-d036f8cb36d7
    Refcount: 1
    Status: BlobStatus::DONE: Blob built with no errors.
    Content Type: image/png
    Type: file
    Path: /Users/xxxxx/Desktop/project/imgs/xxxx.png
    Modification Time: 19:03:40
```

其他相关转换成 blob 的 api

- `canvas.toBlob` : 将 canvas 画布数据转换成 `blob` 对象数据用于传输。
- `response.blob()` : fetch api 中可以返回 `blob` 数据
```js
fetch('xxx')
  .then(response => response.blob())
  .then(blob => {
    
  });
```

和 `arrayBuffer` 相互转换

- `blob.arrayBuffer` : blob -> arrayBuffer
- `new Blob()` : arrayBuffer -> blob , 需要借助 TypedArray
```js
var ar = new ArrayBuffer(1);
var uar = new Uint8Array(ar);
uar[0] = 65;
var bb = new Blob([uar], {type: 'text/plain'});
bb.text().then((r) => console.log(r));  // 'A'
```


## File -> FileReader

`FileReader` 是一个读取文件的api , 但是只能仅仅读取 `input` 和 拖拽的文件，不能通过制定路径来读取文件。

用法：
```js
<input type="file" id="file" onchange="previewFile()" />

const previewFile = () => {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (res) => {
        console.log(reader.result);
        // 如果选择的是纯文本文件，就会直接输出其内容
    };
    reader.readAsText(file);
};
```

- `readAsArrayBuffer(blob)` : `reader.result` 是一个 `ArrayBuffer`
- `readAsDataURL(blob)` : `reader.result` 是一个base64编码的`data: URL`，类似 `data:image/jpeg;base64,/xxxx`
- `readAsText(blob)` : `reader.result` 是一个文本字符串

上面的 `Blob` 的也有类似的api `arrayBuffer(), text()` , 返回的是一个 `Promise` 。 `FileReader` 则是采用事件驱动的形式， 通过不同的 api 读取 `Blob`或者`File` 对象，其 `result` 返回不同的类型数据。

事件类型
- `load` : 成功读取文件
- `error` : 读取失败
- `loadend` : 读取完成文件，不论成功失败
- `loadstart` : 读取开始
- `progress` : 读取过程中触发，可以计算百分比，（不是固定字节数，固定百分比触发）

**使用场景：**  一般用于读取大文件显示进度。 或者事件驱动类型读取文件内容。 其他场景，可以直接使用 `Blob` 的 api 转换成 字符串或者 `ArrayBuffer`。  还有一个同步Api接口 `FileReaderSync`

## File -> createObjectURL

`createObjectURL` 可以将 `blob` 对象转成一个 `Blob Url` , 格式  `blob:<origin>/<uuid>` 。 有些类似 `DATA URL`

```js
// 预览图片
const previewFile = () => {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const img = document.createElement('img');
    img.id = 'img1';
    img.src = URL.createObjectURL(file);
    // 这里返回的是一个 blob url
    // blob:http://localhost:3000/d3a200c5-0ce9-4593-9185-60f8a1af1083
    img.onload = () => {
        URL.revokeObjectURL(img.src);
    };
    const files = document.getElementById('files');
    files.append(img);
};
```

上面例子，实现了一个预览图片的功能，为什么防止内存泄露，这里使用 `revokeObjectURL` 释放了 `Blob Url`。 如果不释放可以在浏览器直接输入这个 `Url` ，返回的就是图片内容。

如何获取图片资源，比如 图片的 blob 数据，或者 arraybuffer 数据，或者 纯文本字符串内容 ???

```js
// 没有 URL.revokeObjectURL 释放 blob url
const img1 = document.getElementById('img1')
fetch(img1.src).then(res=>res.arrayBuffer()).then(console.log)  // 输出 arrayBuffer
fetch(img1.src).then(res=>res.blob()).then(console.log) // 输出 blob
fetch(text.src).then(res=>res.text()).then(console.log) // 如果是纯文本，如.txt .md 输出文本字符串

// 使用 URL.revokeObjectURL 释放 blob url
const canvas = document.createElement('canvas')
canvas.width = img.width;
canvas.height = img.height;
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, img.width, img.height);
 canvas.toBlob(console.log)  // 输出 blob
canvas.toDataURL(console.log) // 输出 data url , base64 编码
``` 

## 代码片段

```js
<input type="file" id="file" onchange="previewFile()" />
<div id="files"></div>

const previewFile = () => {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    // showPdf(file);
    // showText(file);
    showImg(file);
};

const showImg = (file) => {
    const img = document.createElement('img');
    img.id = 'img1';
    img.src = URL.createObjectURL(file);
    img.onload = () => {
    URL.revokeObjectURL(img.src);
    };
    const files = document.getElementById('files');
    files.append(img);
};

const showText = (file) => {
    const reader = new FileReader();
    reader.onload = (res) => {
    const files = document.getElementById('files');
    files.innerText = reader.result;
    };
    reader.readAsText(file);
};

const showPdf = (blob) => {
    const blobUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', blobUrl);
    const files = document.getElementById('files');
    files.append(iframe);
    URL.revokeObjectURL(blobUrl);
};
```