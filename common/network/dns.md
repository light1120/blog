# DNS

> DNS：Domain Name System 域名系统，作用就是将域名解析成 ip

## 域名结构

`www.server.com` 域名是以`.`来分割，从右往左

- 根域名
- 一级域名 (com , cn ，org...)
- 二级域名 (server.com)
- 三级域名 (home.server.com)
- ...

`www`有什么用？为啥有的网址有，有的网址没有？ 以`www.server.com`为例，这就是一个普通的三级域名，根其他三级域名（`home.server.com`）没什么区别。添加`www`是基于习惯原因，默认会指向二级域名`server.com`

## 域名解析过程

<div align="center"><img src='./images/dns.png' width=400 alt=''> </img></div>

- 客户端：向本地 DNS 服务器发起请求询问 ip
- 本地 DNS 服务器：从缓存中查找，有就返回，没有就向根 DNS 服务器发起请求询问 ip
- 根 DNS 服务器：返回一级域名（`.com`）的 DNS 服务器地址
- 本地 DNS 服务器：向一级 DNS 服务器发起请求询问 ip
- 一级 DNS 服务器：返回二级域名（`server.com`）的 DNS 服务器的地址
- 本地 DNS 服务器：向二级 DNS 服务器发起请求询问 ip
- 二级 DNS 服务器：返回域名（`server.com`）的 ip，并返回给客户端
- 客户端：拿到服务器的 ip，向服务器发起请求

### 其他

- 客户端: 一般有 DNS 解析后的缓存，例如：chrome: [chrome://net-internals/#dns](chrome://net-internals/#dns)
- 本地 DNS: 服务器也有 DNS 解析后的缓存，一切的 DNS 解析过程都是由本地 DNS 发起的。一般是由各国的运营商管理
- 根 DNS 服务器只有 13 台，基本在美国。如果美国屏蔽（`.cn`）的解析，中国网络是否就瘫痪了？
  - 基本不会
  - 根 DNS 服务器地址，配置在本地 DNS，在想根 DNS 服务器解析的后，本地 DNS 会有缓存。所以备份根 DNS 服务器在国内运营商
  - 如果美国切段解析，只需要将本地 DNS 配置的根 DNS 地址，指向备份即可
  - 在美国就无法访问中国网络，其他国家网络能否访问，需要看他们是否有类似的备份
- `dns-prefetch`: 预获取dns解析，减少请求延迟；不适应需要跟很多的第三方网站有连接
  - 仅跨域可用
  - 与`preconnect`结合使用:  会与服务器建立连接，包括 DNS解析，TCP连接，TSL握手
    ```
    <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.gstatic.com/">
    ```
