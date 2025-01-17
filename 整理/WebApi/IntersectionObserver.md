# IntersectionObserver

[IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) 用于监视元素与其祖先元素或视窗（viewport）的交叉状态。当元素进入或离开视窗或与其他元素相交时，它会触发回调函数。这对于实现懒加载、无限滚动和性能优化等功能非常有用。如果是监听 Dom 树变化，如元素添加，属性修改等，使用[MutationObserver](./MutationObserver.md)

## 使用场景：

- 图片懒加载：当图片进入视窗时，才加载图片资源。
- 无限滚动：当用户滚动到页面底部时，自动加载更多内容。
- 性能优化：仅在元素可见时执行动画或其他计算密集型操作。

## 例子

实现滑动到底部，无限加载
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IntersectionObserver Example</title>
</head>
<body>
    <ul id="list">
        <!-- 列表项将被添加到这里 -->
    </ul>
    <div id="loadMore">加载更多...</div>
    <script>
        const list = document.getElementById('list');
        const loadMore = document.getElementById('loadMore');

        // 模拟异步加载数据的函数
        function fetchData() {
            return new Promise((resolve) => {
                setTimeout(() => {
                const items = [];
                for (let i = 0; i < 10; i++) {
                    items.push(`Item ${Date.now() + i}`);
                }
                resolve(items);
                }, 1000);
            });
        }

        // 将数据添加到列表中
        async function addItems() {
            const items = await fetchData();
            items.forEach((item) => {
                const listItem = document.createElement('li');
                listItem.textContent = item;
                list.appendChild(listItem);
            });
        }

        // IntersectionObserver 的回调函数
        function handleIntersection(entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                // 当 "加载更多" 元素可见时，添加更多列表项
                addItems();
                }
            });
        }

        // 创建 IntersectionObserver 实例
        const observer = new IntersectionObserver(handleIntersection);

        // 开始观察 "加载更多" 元素
        observer.observe(loadMore);

        // 初始化时加载一些列表项
        addItems();
    </script>
</body>
</html>
```