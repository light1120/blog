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

> 根据参数数量不同创建不同的执行逻辑

```
function overLoadSingle(object, name, fn) {
  var old = object[name];
  object[name] = function(){
    if (fn.length == arguments.length)
      return fn.apply(this, arguments)
    else if (typeof old == 'function')
      return old.apply(this, arguments);
  };
}

function overloadMulti(obj, name) {
  const Fnlist = [];
  Fnlist[0] = obj[name];
  Fnlist[obj[name].length] = obj[name];
  return function (fn) {
    const oldFn = Fnlist[fn.length];
    if (!!oldFn) {
      throw new Error(`function with ${fn.length} arguments already exist`);
    } else {
      Fnlist[fn.length] = fn;
    }
    obj[name] = function () {
      const fn = Fnlist[arguments.length] || Fnlist[0];
      return fn.apply(obj, arguments);
    };
  };
}

const loadObj = {
  num: 1,
  addNum: function () {
    console.log(`fun0: ${this.num + 0}`) ;
  },
};
const fn1 = function (num1) {
    console.log(`fun1: ${this.num + num1}`) ;
};
const fn2 = function (num1, num2) {
    console.log(`fun2: ${this.num + num1 + num2}`) ;
};
const fn3 = function (num1, num2, num3) {
    console.log(`fun3: ${this.num + num1 + num2 + num3}`) ;
};

// 重载一个函数
// overLoadSingle(loadObj, "addNum",fn1)
// loadObj.addNum()
// loadObj.addNum(1)
// loadObj.addNum(1,2)

// 重载多个函数
// const overloadAddNum= overloadMulti(loadObj, "addNum");
// overloadAddNum(fn1)
// overloadAddNum(fn2)
// overloadAddNum(fn3)
// loadObj.addNum()
// loadObj.addNum(1)
// loadObj.addNum(1,2)
// loadObj.addNum(1,2,3)
// loadObj.addNum(1,2,3,4)
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
