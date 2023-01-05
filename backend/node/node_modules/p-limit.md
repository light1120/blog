# p-limit
* 在调用promise或者异步函数时控制并发数

### 场景
* 在使用`promise.all`批量调用第三方服务时，控制并发数减轻对方服务器压力

### 用法
```
import pLimit from 'p-limit';

const limit = pLimit(1);

const input = [
	limit(() => fetchSomething('foo')),
	limit(() => fetchSomething('bar')),
	limit(() => doSomething())
];

// Only one promise is run at once
const result = await Promise.all(input);
console.log(result);
```

### 源码
[源码](https://github.com/sindresorhus/p-limit/blob/main/index.js)很简单，用了一个队列辅助，把所有需要执行的函数放到队列，入队列的时候开始计数，如果当前计数小于并发数，就直接出队列执行函数。（前面入队列的函数，入队列后就直接出队列执行了，后面入队列的，就等待出队列）。之前的每个函数执行完了之后都调用出队列，再执行出队列的函数，这样当前最大执行函数的个数都控制在并发数内
```
    const next = () => {
		activeCount--;

		if (queue.size > 0) {
			queue.dequeue()();
		}
	};

	const run = async (fn, resolve, args) => {
		activeCount++;

		const result = (async () => fn(...args))();

		resolve(result);

		try {
			await result;
		} catch {}

		next();
	};

	const enqueue = (fn, resolve, args) => {
		queue.enqueue(run.bind(undefined, fn, resolve, args));

		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// when the run function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			await Promise.resolve();

			if (activeCount < concurrency && queue.size > 0) {
				queue.dequeue()();
			}
		})();
	};
```
* `limit(() => doSomething())`执行的就是`enqueue`入口函数，把每个异步函数入队列，在`activeCount < concurrency`内就直接出队并执行了`queue.dequeue()()`。
* 由于`activeCount++`在一个microtask内，所以在比较`activeCount < concurrency`时也需要放到一个microstask内，所以为什么这里需要用async包一层