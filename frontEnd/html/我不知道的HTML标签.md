# 我不知道的 HTML 标签

## 上标、下标 <sup> <sub>

```
<sup>[1]</sup><sub>[2]</sub>
```

一般用于说明某个专有名次，或者某个数字。**受 flex 的影响**，如果自身或者父元素设置了 flex 布局，会影响上下标的显示

## 高亮 <mark>

```
<mark>高亮文本</mark>
```

高亮一段文本

## 进度条 <progress>

```
<progress max="100" value="60"/>
```

最大进度 100，当前 60。 原生进度条，兼容性好，各大浏览器均已兼容

## 查看详情 <details>

```
<details>
  //默认，如需要修改，添加此标签<summary>my详情</summary>
  <p>我是一段被隐藏的内容</p>
</details>
```

默认会隐藏一段内容，点击详情，显示隐藏的内容。默认“详情”文案，如需要修改，添加`summary`标签

## 文案居中 <center>（已经废弃）

```
<center>居中</center>
```

就是加了个`text-align="center"`

## 代码 <code>

```
<p>Regular text. <code>This is code.</code> Regular text.</p>
```

## 预定义格式 <pre>

```
<pre>
  L          TE
    A       A
      C    V
       R A
</pre>
```

文案，空格，换行等会照样显示

## <map>