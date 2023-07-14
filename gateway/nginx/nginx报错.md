# nginx 报错

> 在学习配置 nginx 服务器中可能遇到的一些“bug”，记录下解决过程。**一定要认真看日志**

### web 服务器出现 403 错误

403 错误是没有权限的错误，先后排除是否因为 cros ，location 规则 而导致的问题。从错误日志看到这条信息`2023/03/06 23:10:50 [error] 13131#13131: *14 open() "/data/xxx/xxx/xxx.png" failed (13: Permission denied)`然后 google 下`13: Permission denied`是 linux 文件系统的报错，原因是没有权限打开文件，这才发现是因为 nginx 用户没有权限文件所属用户，修改 nginx 配置 `user xxxx` 或者 `chown`修改文件所属用户即可。

### an invalid response was received from the upstream server

nginx 配置了反向代理之后，api 接口会代理带后台服务器， 如果 后台服务器无响应，或者配置的 ip+port 找不到服务，就会报错。我遇到的问题是，某个服务配置的 `xx.xx.xx.xxx:41031` , 但是服务启动的端口是 `10024`，前端在请求接口时，就返回了这个错误

分析：

- 服务进程是否正常? 监听端口多少？
- 是否有`access`日志，`access` 日志
- 使用 ip + port 的方式请求接口，是否有响应，正常，那基本就是上游代理的问题了
- 再检查配置的 ip + port 是否匹配
