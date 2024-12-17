# ArrayBuffer

> ArrayBuffer 是一个字节数组buffer，表示的一块固定大小的内存区域。 这是一个偏低层的对象，所以在性能上表现是比较出色的。

## 类数组性

简单点看，`ArrayBuffer` 就是一个数组，里面的元素都是一个字节。  但是没有提供数组完整的 api ，仅支持了部分 api

- `ArrayBuffer` : `new ArrayBuffer(10)` 构造函数创建一个固定大小buffer. 只能通过 api 调整buffer大小
- `resize` : 调整 buffer 大小
- `slice` : 分割 buffer 

## TypedArray & DataView

`ArrayBuffer` 是一个底层对象，不能直接操作其内容。需要借助一个上层对象来操作。

- TypedArray ： 是一组对象的统称，每个对象的数据都是指定的数据类型，不存在`TypedArray`对象
    - `Int8Array` : 8位有符号数据  -128 到 127
    - `Uint8Array` : 8位无符号数据  0 到 255
    - `Int16Array` :  -32768 到 32767
    - `Uint16Array` : 0 到 65535
    - 32位 64位
- DataView : 是一个提供对 `ArrayBuffer` 读写的对象。 可以通过 `DataView` 的 api 读取，写入 指定位置， 指定类型数据
    - `getInt8()` & `setInt8()` 读取，写入 一个有符号的8位数据
    - `getUint8()` & `setUint8()` 读取，写入 一个无符号的8位数据
    - `setInt16` , `setUint16` , `setInt32` , `setUint32` 操作 18 位 ， 32 位
```js
const buffer = new ArrayBuffer(3);
const view = new DataView(buffer);
view.setInt8(0, 1); // 在索引0，写入1   00000001
view.setInt8(1, 128); // 在索引1，写入128 10000000
// （ 这里有个陷阱， view.setInt8(1, 128) 实际上写入的 view.setInt8(1, -128) ，你知道为什么吗？）
view.getInt16(0); // 从索引0 ，取16位 00000001 10000000  返回 384
view.getInt16(1); // 从索引1 ，取16位 10000000 00000000 , 最高是1，负数，需要去反 01111111 11111111 + 1  = 10000000 00000000  是 32768 ，返回 - 32768
view.getUint16(1); // 从索引1 ，取16位 10000000 00000000 ，返回 32768
view.getInt8(1); // 返回 -128 
```
    

## Transferable 对象

可转移对象（Transferable Object）：就是对象的资源可以一个上下文转移到另一个上下文。 它不是复制，而是直接将对象的资源所有权转移到另一个对象。

`worker.postMessage()` 在传送 `ArrayBuffer` 时属于 0 拷贝，速度非常快。 因此在向 worker 传输大量数据时，使用 `ArrayBuffer` 会是的性能有较大提升。

其他 可转移对象 ： `ArrayBuffer`,`MessagePort`,`ReadableStream`,`WritableStream` 等。

- `ArrayBuffer` 在 `work` 中性能测试

```js
//index.js
let arr1 = Array.from({ length: 10000000 }, () => '我'); // 约 30M 数据
let u8a = new TextEncoder().encode(arr1.join(''));

const work = new Worker('index2.js');
console.time('work');
work.postMessage(arr1);
// work.postMessage(u8a, [u8a.buffer]);
work.onmessage = function (event) {
  console.timeEnd('work');
};
// index2.js
onmessage = function (event) {
  self.postMessage(event.data);
  //   self.postMessage(event.data, [event.data.buffer]);
};
```

- `postMessage(arr1)` : 直接传输数组，约 1400ms
- `postMessage(u8a, [u8a.buffer])` : 传输 ArrayBuffer , 约 30ms 。 提升40多倍

## 使用场景

- 作为底层存储对象 ： `TypedArray` & `DataView`
- 跨线程传输： `postMessage`
- Blob 对象转换 ： `Blob.arrayBuffer()`
- FileReader : `FileReader.readAsArrayBuffer()` ，其 `result` 属性是 `arrayBuffer`
- Fetch : `Response.arrayBuffer()` , 通过 fetch api 获取数据，可以将结果转成 `arrayBuffer`