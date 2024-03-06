# JSBridge

> web H5 于 原生 app (android ios) 是无法直接交互的，就需要一个 bridge 来链接两端传递信息

## 原理

因为 web 页面是运行在 webview 上的，所以，交互都是借助 webview 来进行;

- Android: `WebView` ：
- IOS : `WKWebView` ：

## 实现

### IOS

[WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)是使用较多的轻量的 ios bridge 库。

- 注入 bridge

```
window.onload = function () {
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
  }
  window.setupWebViewJavascriptBridge = setupWebViewJavascriptBridge
}
```

- js 调用 原生

```
window.setupWebViewJavascriptBridge(function (bridge) {
    bridge.callHandler('playMusic', { musicId: 1 }, function (data) {
        console.log('app触发成功了，音乐正在播放。。。APP回调返回的数据：', data)
    })
})
```

- 原生调用 js

```
window.setupWebViewJavascriptBridge(function (bridge) {
  bridge.registerHandler('stateChange', function (data, responseCallback) {
    console.log('收到APP请求stateChange事件，请求的数据是：', data)
    // 可以返回给app一个回调
    responseCallback('朕已经收到APP爱卿的请求了，且退下！')
  })
})
```

### Android

andrdoid 是直接往 webview 注入了全局对象。这里注入的名称需要跟 IOS 协商，保持一致，函数的名字也需要协商一致

```
webView.addJavascriptInterface(new NativeBridge(this), "WebViewJavascriptBridge");

class NativeBridge {
  private Context ctx;
  NativeBridge(Context ctx) {
    this.ctx = ctx;
  }

  // 增加JS调用接口
  @JavascriptInterface
  public void showNativeDialog(String text) {
    new AlertDialog.Builder(ctx).setMessage(text).create().show();
  }
}
```

## Native -> Web

- Android : `evaluateJavascript`

```
webView.evaluateJavascript("javascript:onFunction('android调用JS方法')",....

)
```

- IOS: `evaluateJavaScript`

```
[webView evaluateJavaScript:@"onFunctionIOS('IOSTestFunction2方法执行完成')"

]
```

## 优化

- 封装 Api : 原生提供的能力通过 bridge 封装成函数，方便上层调用，不用关心底层的实现
- 消息队列，异步：提供的 api，使用消息队列和异步的方式，防止增加原生的压力，阻塞 web 主线程
- 监听`WebViewJavascriptBridgeReady`防止调用的生活，还未初始化完成
