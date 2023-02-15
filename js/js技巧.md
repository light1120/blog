# 令人瞠目结舌的 JS 技巧代码

### 1、 生成 10 位随机字符串

```
Math.random().toString(36).substr(2,10)

```

### 2、可以快速打印一个五分制的评分情况

```
function getRating(rating) {
    if(rating > 5 || rating < 0) throw new Error('数字不在范围内');
    return '★★★★★☆☆☆☆☆'.substring(5 - rating, 10 - rating );
}
```

### 3、实现一个函数 where，它返回它被调用的时候所在的函数的名字。

```
function where() {
  let reg = /\s+at\s(\S+)\s\(/g;
  let str = new Error().stack.toString();
  let res = reg.exec(str) && reg.exec(str);
  return res && res[1];
}

```

### 4、函数重载

```
function addMethod(object, name, fn) {
    var old = object[name];
    object[name] = function(){
        if (fn.length == arguments.length)
           return fn.apply(this, arguments)
        else if (typeof old == 'function')
           return old.apply(this, arguments);
    };
}
```

### 5、简单的字符串加密解密算法

```
function encode(str,padding=5) {
  return !str?str:str.split('').map(function(s){ return String.fromCharCode(s.charCodeAt()+padding)}).join('')
}
function decode(str,padding=5){
  return !str?str:str.split('').map(function(s){ return String.fromCharCode(s.charCodeAt()-padding)}).join('')
}
// encode('light')  // 'qnlmy'
// decode('qnlmy')  // 'light'
```

### 6、短横命名与驼峰命名转换

```
function toCamel(str) {
  return str.replace(/(\w)(_)(\w)/g,( match,$1,$2,$3 )=> `${$1}${$3.toUpperCase()}`)
}
function toDash(str) {
  return str.replace(/([a-z])([A-Z])/g,( match,$1,$2 )=> `${$1}_${$2.toLowerCase()}`)
}
```
