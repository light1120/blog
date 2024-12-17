# Base64

> base64 是一种二进制到文本的编码规则算法

## 为什么需要 base64 算法

base64算法 是为了将二进制数据转换成使用 ASCII码 表示出来，以便在一些只能处理 ASCII 码的媒介上传输和使用。

- 简单理解：

为了补充 ASCII 码的使用场景。 因为 ASCII 只定义了 128 个字符，而且有33个不能显示，只能显示95个，太局限了（ 因为是美国很早起发明的一种编码）。

- base64 缺点

因为 ASCII 只定义了 128 个字符，最多只能用 6个bit . 而一个字节是 8个 bit , 进而在转换时会膨胀大小。

## atob & btoa

- atob : 将 base64 编码解码成 字符串 （ ascii -> binary ）
- btoa : 将 字符串 进行 base64 编码 （ binary -> ascii ）

```js
window.btoa('js')  // 'anM='
window.atob('anM=')  // 'js'
```

- btoa 编码过程
    - 1、"j" 的 ASCII 码是 106，二进制表示是 01101010 ， "s" 的 ASCII 码是 115，二进制表示是 01110011
    - 2、"js" 拼接起来就是 01101010 01110011 。 原始数据不足 3个字节，填充 0 ， 01101010 01110011 00000000
    - 3、按 6位分割 011010 100111 001100 000000 ，10进制数据就是 26，39，12，0 。因为 ASCII 只有 128个，只支持6位
    - 4、对映 base64 映射表就是 anM=
- base64 填充
    - base64 对于原始数据最后一个不足3字节的都会填充0，以达到每3个字节一组，对映 ASCII 就是4个一组。
    - btoa('j') -> 'ag=='   /   btoa('jsa') -> 'anNh'
- base64 映射表
    - `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`
    - 将每组的二进制转为10进制之后，作为索引取上面映射表的值。 0->A 26->a 52->0 61->9 ， 填充的 0 -> =

## Unicode 问题

 > btoa('我') // The string to be encoded contains characters outside of the Latin1 range. btoa 函数只能处理 ASCII 包含的数据，不能处理中文 ， emoji 等

- Unicode : 是一个更大的编码集合，集合可以包含所有的符号，不仅英文，中文，还有其他语种。
- UTF-8 : utf-8 是现在互联网基本统一的编码方式。 utf-8 是 unicode 的一种实现方式。 还有 utf-16 utf-32 等
- `TextEncoder & TextDecoder`：

`btoa` 只支持可以用8位2进制表示的字符， 这里借助 `TextEncoder` 将汉字换成成字节数组 `Uint8Array` 。 这样每个都是一个8位二进制数据，就在 `btoa` 函数处理范围了·

```js
const base64Encode = function (str) {
    const u8Arr = new TextEncoder().encode(str);
    const strArr = Array.from(u8Arr, (u8) => String.fromCodePoint(u8)).join(
        '',
    );
    return window.btoa(strArr);
};

const base64Decode = function (str) {
    const base64Str = window.atob(str);
    const u8Arr = Uint8Array.from(base64Str.split(''), (str) =>
        str.codePointAt(),
    );
    return new TextDecoder().decode(u8Arr);
};

/**
 * TextEncoder TextDecoder  默认是采用 Utf-8 编码。
 * new TextEncoder().encode('我')  // Uint8Array(3) [230, 136, 145] 可以验证 utf-8 编码下中文是 3 个字节存储。
 */

base64Encode('我')  // '5oiR'
base64Decode('5oiR')  // '我'
// emoji 也是支持的
base64Encode('🆗') // '8J+Glw=='
base64Decode('8J+Glw==') // '🆗'
```

## 用途

- `Data URL` ： `data:[<mediatype>][;base64],<data>` 前缀为 `data:` 的一种 url scheme 
    - 将体积小的图片，字体资源转成 base64 数据，可以减少 http 请求
    - `canvas.toDataURL()` 返回的是一个 base64 类型的 data url  `data:image/png;base64,iVBORw.....`
- 传输二进制数据 ：一般我们处理的都是文本数据，如果需要在处理二进制数据，需要转成 base64 数据来传输。 （ 如果是跨越 http 请求，可以通过 FormData 来传输二进制数据 ）。

## 学到了什么？

- ASCII 是美国很早期的编码，只定义了128个字符
- Unicode 是为了扩展 ascii ，全球定义的编码，上限百万个，目前收集了十几万个字符。 
- Utf-8 是 unicode 的一种实现方式，类似还有 utf-16 utf-32。 
- utf-8 的特点是可变字节长度，英文字符 1个字节，中文字符 3个字节
- base64 的算法： 每3个字节转成4个6位，不足补0 , 每个6位做映射输出。 `A...Za...z0...9+/` 映射表共 64个
- atob & btoa 有处理局限，谨慎使用，如有需要，可以通过 `TextEncoder & TextDecoder` 协助