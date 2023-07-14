# nginx 实战

> 针对日常具体的功能给出的解决方案

## 1、防盗链

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

## 2、SSI

> [ssi](http://nginx.org/en/docs/http/ngx_http_ssi_module.html)(server side include): 可以理解为简易的服务端渲染

相关配置:

```
ssi on;
ssi_silent_errors on;
ssi_types text/html;
ssi_value_length 256;
ssi_min_file_chunk 1k;
ssi_last_modified off;
```

SSI 格式：`<!--# command parameter1=value1 parameter2=value2 ... -->` command 如下

- echo : 输出变量的值
  - var: 变量名
  - default: 默认值

```
window.serverTimeStr = '<!--#echo var="DATE_GMT" -->';
window.serverName = '<!--#echo var="SERVER_NAME" -->';
window.client_ip = '<!--#echo var="remote_addr" -->';
// 可以得到三个变量，分别是服务端时间，服务名，客户端IP （ 一般浏览器无法获取客户端IP，这里只需借助 SSI 模块，在加一行代码即可 ）
```

- include: 包含一个请求的响应数据，可以请求文件内容，可以请求接口内容
  - file : 文件名
  - virtual : 声明一个请求
  - stub : 在加载过程中出现异常，如果 404 等，页面中会出现 2 个 body，一个是 404 页面。这时需要使用 `stub` 来填充，可以使用 block 命令创建的一个空白模块，这样页面中的 404 就显示空白
  - wait : 是否同步，等待请求返回结果才继续 SSI 进程
  - set : 将请求的响应数据赋值给某个变量

```
<!--#include file="/inc/test.html"-->
<!--#include virtual="/inc/test.html" stub="file_not_found"  -->
```

- block: 定义 stub , 给 include 的 stub 使用

```
<!--# block name="one" -->
stub
<!--# endblock -->
```

- config : 配置
  - errmsg : 配置 SSI 过程出现错误时的 报错信息
  - timefmt : 时间格式
- set: 设置变量的值

```
<!--#set var="client_ip_set" value="$remote_addr" -->
<script>
    window.client_ip_set = '<!--#echo var="client_ip_set" -->';
</script>
```

- if : 条件渲染

```
<!--# if expr="$name = text" -->
...
<!--# elif expr="..." -->
...
<!--# else -->
...
<!--# endif -->
```

## 3、操作 Hearder , Cookie

-
