# 前端 web 安全 

> 安全在前端项目中是非常重要，必不可少的，需要从很多方向来考虑。

## 常见攻击方式

### XSS

XSS（ Cross Site Scripting ）跨站脚本攻击 。主要是通过注入 script 脚本来实现攻击，一般分2中，持久性XSS , 反射性XSS

- 持久性XSS : 通过注入脚本或者SQL的方式将脚本存储到数据库，进而恶意执行脚本，恶意拉取其他信息。
- 反射性XSS : 将恶意脚本加在URL

如何防范？

- 输入输出，进行转义，将脚本变成纯字符串。
- 禁止输入脚本特殊字符。

### CSRF

CSRF （ Cross-Site Request Forgeries ）是跨站点请求伪造 。主要是通过伪造其他身份请求进行攻击。

如何防范？ 

- 执行操作使用POST, 避免GET
- 使用 Token 用于身份校验
- 设置 cookie 为 httpOnly

### 点击劫持

点击劫持 ( click hijacking ) 通过 iframe 加载其他网站信息，在其上面覆盖透明UI, 进而获取信息。

如何防范？

- 设置 X-Frame-Options 响应头，避免被恶意网站的 iframe 加载 ； SAMEORIGIN 只运行相同域名加载

### 中间人攻击

MITM （ Man-in-the-middle attack ）中间人攻击，客户端发起的请求，被中间人拦截后，修改并重放请求进行攻击

如何防范？

- https ：减少请求破译风险
- 数据加密：关键性数据进行 RSA 加密
- 票据校验：关键接口，后台设立一次性票据，每次请求之前发放票据，后台接口返回结果后过期票据。避免接口被重放

## 常见得安全措施

### 基础安全措施

- https : 最常见，减少破译成本
- token : 设立 token 校验用户态
- cookie : httpOnly 避免 cookie 滥用，盗取
- 借助框架 : 借助 vue react 来避免 xss 攻击
- X-Frame-Options: SAMEORIGIN 避免被恶意网站 iframe 加载
- CSP (Content Security Policy) : 内容安全策略，通过白名单机制，指定可加载的资源

### 业务安全措施

- 数据安全
    - 传输安全: 使用 RSA 非对称加密，客户端使用公钥加密，服务端使用私钥解密
    - 存储安全: 敏感信息存储 : 存储 hash + 盐 后的值，避免脱库
- 接口安全
    - ip 频控限流 : 使用 nginx limit_req 对 ip 限流， 防止 DDos
    - 接口限频 : 通过 redis 计数的方式，或者 令牌桶，滑动窗口等算法实现，防止接口被刷
    - 接口请求签名 : 对接口 query body ticket AES 加密生成签名 ， 服务端使用同样算法计算出签名，判断是否被串改。
    - 一次性接口票据: 客户端先请求票据，带票据请求接口，服务端校验票据，返回请求，过期票据。避免接口重放
    - 增加权限系统 : 增强业务数据的安全性，避免访问到非权限范围内的数据。
