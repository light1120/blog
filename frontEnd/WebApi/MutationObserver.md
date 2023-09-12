# MutationObserver

[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) 用于监视 DOM 树的更改，例如元素的添加、删除或属性的修改。当观察的元素发生变化时，它会触发回调函数。这对于跟踪 DOM 更改并根据需要执行操作非常有用。如果要监听 DOM 与 viewport 的交叉状态，使用[IntersectionObserver](./IntersectionObserver.md)

## 使用场景

- 监视 DOM 元素的属性变化，例如类名、样式或自定义属性。
- 监视子节点的添加或删除，例如在列表中添加或删除项目。
- 监视 DOM 树的更改，以便在第三方库或其他代码修改 DOM 时执行操作。

## 例子

```
// 选择需要观察变动的节点
const targetNode = document.getElementById("some-id");

// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
    } else if (mutation.type === "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();

```
