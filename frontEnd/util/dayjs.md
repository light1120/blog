## Dayjs

### 文档
* [Dayjs](https://dayjs.gitee.io/zh-CN/)

### 优点
* 轻量 2kb
* 简单易用
* 不可变对象**immutable**，每次api操作都返回一个新的Dayjs对象
* 国际化

### 缺点
* 很多功能需要扩展插件

### 使用
* 浏览器 
```
<script src="https://unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
<script>console.log(dayjs().format());</script>
<script src="https://unpkg.com/dayjs@1.8.21/plugin/utc.js"></script>
<script>dayjs.extend(window.dayjs_plugin_utc)</script>
<script>console.log(dayjs.utc().format());</script>
```
* Nodejs
```
import dayjs from 'dayjs';
import uct from "dayjs/plugin/utc"
console.log(dayjs().format());
dayjs.extend(utc)
console.log(dayjs.utc().format());
```

### 常用功能
* 取值：`dayjs().year();dayjs().day();`
* 格式化: `dayjs().format();dayjs().format('DD/MM/YYYY')`
* 时间戳: `dayjs().valueOf();dayjs().unix()`
* 比较：`dayjs('2022/9/17') < dayjs('2022/9/18')`
* 国际化: 
```
<script src="https://unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
<script src="https://unpkg.com/dayjs@1.8.21/locale/zh-hk.js"></script>
<script>
  // 设置当前语言环境
  dayjs.locale("zh-hk");
</script>
<script src="https://unpkg.com/dayjs@1.8.21/plugin/localeData.js"></script>
<script>
  dayjs.extend(window.dayjs_plugin_localeData);
</script>
<script>
  console.log(dayjs.weekdays());
  console.log(dayjs.months());
  globalLocaleData = dayjs.localeData();
  console.log(globalLocaleData.months());
  console.log(globalLocaleData.weekdaysShort());
</script>
```