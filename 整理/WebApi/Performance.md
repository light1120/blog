# Performance API

> Performance API 是一组用于衡量 web 应用性能的标准。

## 1、performance

performance 是 window 下的一个对象，浏览器加载页面之后，会自动获取一些性能指标

### 属性

- eventCounts : (已经触发的事件总数) EventCounts {size: 36}
- memory : （js 堆内存数据-已经废弃）MemoryInfo {totalJSHeapSize: 71970726, usedJSHeapSize: 68019698, jsHeapSizeLimit: 4294705152}
- navigation : （文档加载相关数据- 已经废弃，用 PerformanceNavigationTiming 替代）PerformanceNavigation {type: 0, redirectCount: 0}
- onresourcetimingbufferfull : null
- timeOrigin : 1697684284205.6
- timing : （文档加载相关数据 - 已经废弃 ，PerformanceNavigationTiming 替代）PerformanceTiming {navigationStart: 1697684284205, unloadEventStart: 0, …}

### 方法

- now : 时间戳
- mark : 创建一个 `mark` 类型的 entry
- clearMarks : 清除一个或者所有 `mark` 类型的 entry，
- measure : 创建一个 `measure` 类型的 entry
- clearMeasures : 清除一个或者所有 `measure` 类型的 entry，
- clearResourceTimings : 清除所有的 `resource` 类型的 entry
- setResourceTimingBufferSize : 设置 `resource` 类型的 entry 容量
- getEntries ：获取 `performance timeline` 所有 entry
- getEntriesByName : 通过 name 获取
- getEntriesByType : 通过 type 获取

## 2、深入理解 Performance

- `performance timeline` ：记录了整个页面加载过程中的很多类型的性能指标，包括 tcp ssl 加载资源，渲染页面等。
- `PerformanceEntry` : `performance timeline` 中单个`metric`数据 ，浏览器加载页面过程中会自动生成， 也可以用户构建`mark`,`measure`2 种类型的 entry , 每一个 entry 都是继承`PerformanceEntry`
  - `name` : 名字
  - `entryType` : 类型，所有支持的值 `PerformanceObserver.supportedEntryTypes : ['element', 'event', 'first-input', 'largest-contentful-paint', 'layout-shift', 'longtask', 'mark', 'measure', 'navigation', 'paint', 'resource', 'visibility-state']`
  - `startTime` : entry 开始时间
  - `duration` : entry 持续时间

## 3、PerformanceObserver(\*)

> 推荐使用 PerformanceObserver 来或许性能指标， performance.timing 等相关数据已经废弃，不建议使用。

### 用法

```
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(`${entry.entryType} metric:`, entry);
    }
});
observer.observe({ entryTypes: ['resource'] });
// 会打印 resource 类型的 metric 数据
observer.disconnect();
// 如果不需要继续监控，可以关闭
```

entryTypes 可以用 `PerformanceObserver.supportedEntryTypes`, 会监控所有的在代码执行之后产生的 metric 数据

所有的 metric 数据都会存储在 `window.performance.getEntries()` 中，但是一些类型的数据会有容量限制。

## 4、PerformanceEntry 类型

### 4.1 PerformanceResourceTiming : `resource` 类型

可以检索和分析有关加载应用程序资源的详细网络计时数据。包括 XHR Fetch <SVG>，image script 等。`Web Worker` 中支持。

性能指标如下:

- Measuring TCP handshake time (connectEnd - connectStart)
- Measuring DNS lookup time (domainLookupEnd - domainLookupStart)
- Measuring redirection time (redirectEnd - redirectStart)
- Measuring interim request time (firstInterimResponseStart - requestStart)
- Measuring request time (responseStart - requestStart)
- Measuring TLS negotiation time (requestStart - secureConnectionStart)
- Measuring time to fetch (without redirects) (responseEnd - fetchStart)
- Measuring ServiceWorker processing time (fetchStart - workerStart)
- Checking if content was compressed (decodedBodySize should not be encodedBodySize)
- Checking if local caches were hit (transferSize should be 0)
- Checking if modern and fast protocols are used (nextHopProtocol should be HTTP/2 or HTTP/3)
- Checking if the correct resources are render-blocking (renderBlockingStatus)

### 4.2 PerformanceNavigationTiming ： `navigation` 类型

`PerformanceNavigationTiming`继承`PerformanceResourceTiming`。也是一只 `resource` , 但是比较特殊，只在页面发生变化时监控 document 的数据。一般用来监控页面加载时间，如 dom 完成时间等

<div align="center"><img src='../img/navigatorTiming.svg' width=800 alt=''> </img></div>

- startTime: Always 0.
- unloadEventStart: (if there is a previous document) the timestamp immediately before the current document's unload event handler starts.
- unloadEventEnd: (if there is a previous document) the timestamp immediately after the current document's unload event handler completes.
- domInteractive: timestamp when DOM construction is finished and interaction with it from JavaScript is possible.
- domContentLoadedEventStart: timestamp immediately before the current document's DOMContentLoaded event handler starts.
- domContentLoadedEventEnd: timestamp immediately after the current document's DOMContentLoaded event handler completes.
- domComplete: timestamp when the document and all sub-resources have finished loading.
- loadEventStart: timestamp immediately before the current document's load event handler starts.
- loadEventEnd: timestamp immediately after the current document's load event handler completes.

### 4.3 PerformanceMark 、PerformanceMeasure : `mark`, `measure` 类型

可以由开发者构建的 2 个类型，其他的都是由浏览器构建

- PerformanceMark ：在 `performance timeline` 添加一个标记

```
performance.mark('myMark1', {
  startTime: performance.now(),  // 默认 performance.now()
  detail: {  // meta数据
    htmlElement: 'myElement',
    // xxx : xxxx
  },
})
// 返回数据
{
    entryType: "mark",
    name: "myMark1",
    startTime:
    duration: 0
    detail:
}
```

- PerformanceMeasure ：`performance timeline`中 2 个 `mark` 之间的间隔

```
const PerformanceMeasure1 = performance.('myMeasure1', 'myMark1', 'myMark2')
//返回数据
{
    entryType : 'measure'
    name: 'myMeasure1'
    startTime:
    duration:
    detail:
}
const PerformanceMeasure2 = performance.('myMeasure2', {
   start?: xxx,
   duration?: xxx,
   end?: xxx
})
```

### 4.4 其他

- PerformancePaintTiming : `paint` 类型
  - name : `first-paint 或者 first-contentful-paint`, `FP / FCP` metric
  - startTime : 开始绘制时间
- PerformanceEventTiming : `event` 或者 `first-input` 类型，`first-input` 类型用于监控 `first input delay (FID)` metric
  - Total duration : `duration` 持续时间
  - Event Delay : `processingStart - startTime` FID 延时
  - Event Handler duration : `processingEnd - processingStart` 事件处理持续时间
- LargestContentfulPaint (实验性): `largest-contentful-paint` 类型，用于监控 `Largest Contentful Paint (LCP)` metric.
- LayoutShift (实验性) ：`layout-shift` 类型
- PerformanceElementTiming (实验性) ：`element` 类型，监控标记了 `elementtiming` 属性的 dom 节点
  - loadTime：加载时间
  - renderTime: 渲染时间
- PerformanceLongTaskTiming (实验性) : `longtask` 类型， 监控 UI 线程超过 50 milliseconds。
- TaskAttributionTiming (实验性) : `taskattribution` 类型，监控长任务中的 web worker
- VisibilityStateEntry (实验性) : `visibility-state` 类型 , 监控 visibilitychange 事件`document.addEventListener('visibilitychange'})`

## 5、web worker 支持的 performance Api

- Performance
- PerformanceEntry : 只支持 `mark`,`measure`,`resource` 类型 entry
- PerformanceMeasure
- PerformanceMark
- PerformanceObserver
- PerformanceResourceTiming

## 6、tips

- PerformanceResourceTiming : 最大 buffer 是 250。超过之后需要手动清空，或者加大 buffer

```
function handleFilledBufferSize(event) {
  console.log("WARNING: Resource Timing Buffer is FULL! " );
  performance.setResourceTimingBufferSize(500); // 扩大buffer
  // performance.clearResourceTimings(); // 清空buffer
}

performance.addEventListener("resourcetimingbufferfull", handleFilledBufferSize);
```

- PerformanceObserver: observe()

在使用 observe 方法监控指标时，`observer.observe({ entryTypes: ['resource'] });` 默认只会返回 调用 observe 方法之后的指标。如果需要返回整个`performance timeline` 所有的数据，需要指定 `buffered : true` 参数。 但是这样只能返回 某一个 entryType 类型的数据。当然也可以使用 `performance.getEntries()`过滤

```
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(`${entry.entryType} metric:`, entry);
    }
});
observer.observe({ type: 'resource' , buffered : true });
```
