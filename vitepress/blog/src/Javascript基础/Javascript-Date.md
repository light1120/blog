# Date 

> Date 是 javascript 内置的对象，也是我们日常工作经常需要处理的对象。

### 1、简介

- `Date` 是一个用于表述时间戳的对象。 
- 时间戳是从 `1970.1.1 0.0.0` 开始的累加的一个数字, 每毫秒加1。时间戳表示的是标准时间。
- 标准时间（UTC）: 原子时秒长为基础，几乎等同与GMT
- 格林尼治平均时间 (GMT) : 子午线那里的标准时间。
- 北京时间 (CST) : 北京时间

### 2、构造函数 & 静态函数

- `new Date()` : 构造函数接受的参数很多

```
new Date()
new Date(value)
new Date(dateString)
new Date(dateObject)
new Date(year, monthIndex)
new Date(year, monthIndex, day)
new Date(year, monthIndex, day, hours)
new Date(year, monthIndex, day, hours, minutes)
new Date(year, monthIndex, day, hours, minutes, seconds)
new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
```

- `Date.now()` : 返回当前此刻时间戳
- `Date.parse()` : 根据字符串返回时间戳
- `Date.UTC()` : 根据入参年月日等返回时间戳

##### 数学运算

- 加法 : 返回**当地时间**字符串(`toString()`的结果)拼接。
- 减法，乘法，除法 : 等同时间戳数字坐运算 ; **减法：**一般用于计算2个时间的时间戳间隔
- 大于 等于 小于 : 等同时间戳数字坐比较 ; **大于/小于：**一般用于2个时间的前后比较

### 3、实例方法

- `getFullYear`:  整年比如 1970
- `getMonth`: 月份 0-11 表示 1-12月
- `getDate`: 日期 1-31 
- `getHours`: 小时 0-23
- `getMinutes`: 分钟 0-59
- `getSeconds`: 秒钟 0-59
- `getMilliseconds`: 毫秒 0-999
- `getDay`: 星期 0-6 表示 星期日-六
  
- `setXXXX`: 修改某个具体时间。 **没有setDay()方法** 修改星期数值不会产生唯一的日期
- `getUTCXXXX` , `setUTCXXXX` : 返回，修改标准时间的年份，月份等。

- `getTime` , `setTime` : 返回，修改时间戳
- `valueOf` : 等价 `getTime`

##### 字符串方法

- `toISOString()` : 返回 `ISO` 格式的字符串格式 `YYYY-MM-DDTHH:mm:ss.sssZ`，是一个UTC时间 。各个语言，平台都认。
- `toJSON()` : 对象的序列化，实则调用 `toISOString()` 。序列化用于夸平台传输，所以需要调用大家都认的字符串格式。
  
**重点：** 序列化，跨平台时需要注意，不要调用别的方法。

- `toString()` : 本地时间的字符串， `Wed Dec xx xxxx xx:xx:xx GMT+0800`  这里 `+08` 代表东8区，中国标准时间
- `toDateString()` : 取上面字符串日期部分
- `toTimeString()` : 取上面字符串时间部分


- `toLocaleString()` : 返回本地时间的字符串 ，可以通过参数返回指定语言的字符串
```
date.toLocaleString()           // 'xxxx/xx/xx xx:xx:xx' 中国
date.toLocaleString('en-GB')    // 'xx/xx/xxxx, xx:xx:xx' 英国
date.toLocaleString('en-US')    // 'xx/xx/xxxx, x:xx:xx PM' 美国
date.toLocaleString('ko-KR')    // 'xxxx. xx. xx. 오후 x:xx:xx' 韩国
```
- `toLocaleDateString()` : 取上面字符串日期部分
- `toLocaleTimeString()` : 取上面字符串时间部分

- `toUTCString()` , `date.toGMTString()` : 返回标准时间字符串 `'Wed, xx Dec xxxx xx:xx:xx GMT'`，这2个函数等价 


### 4、时区

> 时间戳是唯一的。某个确定数字的时间戳表示的是某个唯一的时间刻，无论任何时候，任何地点，都不会变化。

但是由于地球自传，人们生活的地理位置不同，如果全球按照标准时间，会导致全球的9点时刻，有的人是早上，有的人是中午，有的是晚上，有的是半夜。为了方便人们的生活，出现了时区，全球划分为24个时区, 每个区间隔1小时，西12-西1-中时区-东1-东12区。这样全球标准时间的9点，人们都是白天，21点都是黑夜，符合人们的作息习惯。（西1和东1中间有一个完整时区中时区， 西12和东12实则是一个时区）

**注意：**  不管任何时区的同一时刻的时间戳都是一样的，虽然你是9点，我是21点，时间戳都是一样，表示方式不一样而已。

- 1、用时间戳用于计算，传输，是不会有问题的
- 2、在将时间表示出来时，需要考虑时区。
- 3、年月日时分秒等的 `get/set` 方法都是基于当地时区来的， `getUTCXXXX` , `setUTCXXXX` 则是基于子午线（中时区）来的

> 场景：我们在国内做了一个9点秒杀活动，但是去到国外的人也想参与，如果直接取 `getHours` 跟 9 比较会出现，国内8点多还不可以参与活动，国外已经10点多，可以参加活动，这就是一个时区问题。当我们的前端程序运行在国外时，需要知道，国内的9点的时间戳的数值，才能和当前时间比较是否可以参与活动。

- 1、构建国内9点的时间戳 比较 国外当前时间的时间戳 ： 用于判断用户是否可以参与活动
```js
Date.UTC(xxxx, xx, xx, 1, 0, 0) < new Date().getTime()
// Date.UTC 来创建标准时间，因为国内时东8时区，所以这里的小时数值是1。
```
- 2、将用户参与活动的时间传入后台，用于校验是否真的符合活动要求。 
```js
Date.UTC(xxxx, xx, xx, 1, 0, 0) 
new Date(xxxx, xx, xx, 9, 0, 0)
// 后台部署在国内属于东8区，上面2中都表示，国内9点时刻
```
- 3、用于参与活动之后，需要把用户参与的活动时间显示出来。 其他时区如何显示东8区的时间？

`getTimezoneOffset` : 获取标准时间跟当地时间的时区差，单位为分钟

```js
// 东8区的9点，如果我是东6区就是7点，我是东10区就是11点。 需要计算所在时区和东8区之间的差

const offset = new Date().getTimezoneOffset()/60 - (-8)  // 当前时区跟东8区的差 ， 如果我是东6区，差值就是2，那时间戳就需要增加2小时
const curTime = serverTime + offset * 3600 * 1000
const curHours = new Date(curTime).getHours()  // 这里的小时就是9点 ，不能直接+2，可能会夸天跨月
```

### 5、工具 dayjs

> [dayjs](https://day.js.org/zh-CN/) 是一个非常轻量的处理时间和日期的js库， api 跟 moment.js 类似

我们在处理日期的时候经常会遇到跨星期，跨月的时候通常只能通过时间戳计算，再取值。 或者处理时区需要通过当前时区偏移值来计算，相对比较麻烦，还可能出错。

- dayjs 所有 api 返回都是一个新 dayjs 对象，避免对象引用机制产生bug。
- format 格式化： 提供了丰富的格式化规则 , 如 `.format('HH:mm:ss')`
- 操作
  - `Add` : 可以对时间 ` + / - ` 操作，非常方便。支持负数 ，单位可以年月日时分秒等 `add(7, 'day')` 。
  - `Subtract` ：减法，同上
-  比较 : 
    > 这里是比较的时间，会根据第二个参数，比较维度发生变化。 如果没有参数，比较时间戳是否一直； 如果参数是 'month'，会比较 month，year 都是否一样。如果是'day'，会比较 day，month，year 是否都一样。 after , before 的逻辑也是如此。
   - `isSame` : `.isSame(dayjs(...), 'month')` 
   - `isAfter` : 语法一样
   - `isBefore` : 语法一样 
- `utcOffset` : 获取/设置偏移量。
  
  不会修改具体时间戳，只是显示会有偏移 。跟 `.getTimezoneOffset()` 数值一样，只是相反。
```js
dayjs.extend(utc) // 需要 utc 插件
new Date().getTimezoneOffset()  // -480 ，utc 相较于当地时间
dayjs(new Date()).utcOffset()   // 480 ，当地时间相较于 utc

// 处理 4 中的问题，如何把东8区的时间9点时间，在其他时区也显示9点时间 ？？
// 1、上面的处理方法是比较时区，对时间戳计算。
// 2、这里有个小问题，就是对时间戳做了修改，可能会带来其他的bug。
// 3、实际上不管在哪里，某一刻的时间戳是固定的，不会发生变化。
const joinTime = dayjs(Date.UTC(2024,0,1,6,0,0))  // 构建一个东三区的9点时间。
// 当地时区是东8区，修改下问题，东三区的9点在东8区也显示9点
const joinTimeOffset = joinTime.utcOffset(3)    // 修改时区偏移，-16到16是小时，也可以是240分
// 需要按照哪个时区显示，就设置这个时区的偏移，在别的时区按照东8区显示，这里就是8
joinTimeOffset.format('YYYY-MM-DD hh:mm:ss') // '2024-01-01 09:00:00' 东8区也是9点。
console.log(joinTime.valueOf() ===  joinTimeOffset.valueOf())  // true , 时间戳一样
```
- 还有很多其他功能，比如国际化等