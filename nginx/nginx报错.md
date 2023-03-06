# nginx 报错

> 在学习配置 nginx 服务器中可能遇到的一起“bug”，记录下解决过程。**一定要认真看日志**

### web 服务器出现 403 错误

403 错误是没有权限的错误，先后排除是否因为 cros ，location 规则 而导致的问题。从错误日志看到这条信息`2023/03/06 23:10:50 [error] 13131#13131: *14 open() "/data/xxx/xxx/xxx.png" failed (13: Permission denied)`然后 google 下`13: Permission denied`是 linux 文件系统的报错，原因是没有权限打开文件，这才发现是因为 nginx 用户没有权限文件所属用户，修改 nginx 配置 `user xxxx` 或者 `chown`修改文件所属用户即可。
