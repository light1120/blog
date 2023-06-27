# Grid

> css 中最强大的布局方案 ，flex 是一维的， grid 是二维的

## 基本概念

- 容器（container） ： `display : grid` / `display : inline-grid`
- 项目 (item) : 顶层子元素，采用网格定位
- 单元格：通过 X 行线，Y 列线，将容器划分成 (X-1)(Y-1) 个单元格，所有的项目就会依此排列。默认一个项目就是一个单元格。如果项目超过了单元格数量，容器会自动创建 `隐式单元格`，容纳所有的项目。`grid-auto-rows`,`grid-auto-columns`可以扩展隐式单元格

https://juejin.cn/post/6854573220306255880
