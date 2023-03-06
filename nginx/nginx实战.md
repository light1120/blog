# nginx 实战

> 针对日常具体的功能给出的解决方案

### 1、防盗链

> 防盗链，就是防有人盗用你的链接。 别人在他的网站上引用了你的资源(图片,音频)

referer 请求头包含了当前请求页面的来源页面的地址，即表示当前页面是通过此来源页面里的链接进入。那么可以通过 referer 来判断是哪个网址需要请求当前资源，如果不是期望值，就直接返回 404 错误码，而非返回真实资源。`ngx_http_referer_module`模块提供了指令[valid_referers](http://nginx.org/en/docs/http/ngx_http_referer_module.html#valid_referers)来校验请求头中的 referer 字段值

```
valid_referers none blocked server_names
               *.example.com example.* www.example.org/galleries/
               ~\.google\.;

if ($invalid_referer) {
    return 403;
}
```

`valid_referers`校验之后会，可以用`$invalid_referer`获取到校验结果，校验成功为空，失败为 1。代码块可以设置在 server 模块或者 location 模块

语法: `valid_referers none | blocked | server_names | string ...;`

- none: 请求头中没有 Referer 字段，允许浏览器空窗口打开
- blocked: 请求头中有 Referer 字段，但是值不对，被修改了，没有以 http,https 开头
- server_names: Referer 字段值包含了 server name
- 正则表达式
