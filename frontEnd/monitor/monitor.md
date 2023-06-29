# Monitor

> 每个运行中的 app，都需要有特点的监控体系，不论 web ，小程序，node , app 原生。

## Monitor for Web

- error
  - `window.addEventListener('unhandledrejection' ()=>{})` ： promise
  - `window.onerror` : 运行时 js 异常
  - `window.document.addEventListener('error', errorHandler, true)` ： 资源架在异常
- close
  - `window.onunload`
- device
  - navigator.userAgent
  - navigator.connection
- spa
  - history.pushState
  - history.replaceState
- API-speed
  - rewrite xhr
  - rewrite fetch
- performance : window.performance
  - performance.timing
- web-vitals : window.PerformanceObserver
  - npm: [web-vitals](https://github.com/GoogleChrome/web-vitals)
  - LCP: 最大内容绘制
  - FID: 首次输入延迟

### tools

- chrome plugin : Lighthouse

## Monitor for others

- 调用原生的能力
