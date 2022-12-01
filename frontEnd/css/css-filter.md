## css filter
### 1.简介
filter属性可以为元素添加一层滤镜效果
### 2.语法
CSS 标准里包含了一些已实现预定义效果的函数。用法很简单，例如：`filter: blur(5px);`，[demo](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter#%E5%B0%9D%E8%AF%95%E4%B8%80%E4%B8%8B)
```
/* URL to SVG filter */
filter: url("filters.svg#filter-id");

/* <filter-function> values */
filter: blur(5px);
filter: brightness(0.4);
filter: contrast(200%);
filter: drop-shadow(16px 16px 20px blue);
filter: grayscale(50%);
filter: hue-rotate(90deg);
filter: invert(75%);
filter: opacity(25%);
filter: saturate(30%);
filter: sepia(60%);

/* Multiple filters */
filter: contrast(175%) brightness(3%);

/* Use no filter */
filter: none;

/* Global values */
filter: inherit;
filter: initial;
filter: revert;
filter: revert-layer;
filter: unset;
```
* `filter: url("filters.svg#filter-id")` : 给svg元素filter引入过滤
* `filter: blur(5px)`: 高斯模糊
* `filter: brightness(2)`: 更加明亮，默认1，0是黑色
* `filter: contrast(200%)`: 颜色对比度
* `filter: drop-shadow(16px 16px 10px black)`: 阴影效果
* `filter: grayscale(100%)`: 改变图像灰度
* `filter: hue-rotate(90deg)`: 颜色旋转，360deg一个周期，相差360deg效果一样
* `filter: invert(100%)`: 颜色反转，100%是完全反转，默认0
* `filter: opacity(50%)`: 透明度，默认100%，无效果
* `filter: saturate(200%)`: 饱和度，跟grayscale数值相反 saturate(0%)==grayscale(100%)
* `filter: sepia(100%)`: 转成深褐色
* `filter: contrast(175%) brightness(103%)`: 符合函数，多个组合使用

### 3.实践
[巧用CSS filter，让你的网站更加酷炫！](https://zhuanlan.zhihu.com/p/405728600)