# Nginx

> nginx 是一个高性能，高可靠的 web、反向代理服务器。支持热部署

## 1、特点

- 高性能，高并发，高可靠
- 模块化架构，扩展性好
- 异步非阻塞事件模型
- 热部署

## 2、应用场景

- 静态资源服务器
- 反向代理服务器
- openresty

## 3、正向代理服务器 VS 反向代理服务器

> 正向和反向是从服务对象来看的，就是作用于 client 或者 server

- 正向：帮助 client 向 internet 发送信息，并将收到的结果返回给 client； client -> 正向 proxy -> internet
  - 作用：服务不可达，需要借助代理
- 反向：帮助 server 接收 internet 发来的信息，处理后并返回 internet； internet -> 反向 proxy -> server
  - 作用： 动静分离，负载均衡，动态扩充

## 4、常用命令

- 系统命令

```
yum install nginx -y    # 安装
yum remove nginx        #卸载
systemctl start nginx   #启动
systemctl stop nginx    #停止
systemctl restart nginx #重启
systemctl enable nginx  #开机自启动，
systemctl disable nginx #关闭自启动
systemctl reload nginx  #重载配置：
systemctl status nginx  #状态查询
```

- 程序命令

```
nginx -s reload  # 向主进程发送信号，重新加载配置文件
nginx -s reopen   # 重启 Nginx
nginx -s stop    # 快速关闭
nginx -s quit    # 等待工作进程处理完成后关闭
nginx -T         # 查看当前 Nginx 最终的配置
nginx -t         # 检查配置是否有问题
```

## 5、nginx 配置

### 5.1、默认配置

```
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

### 5.2、详细配置

- 5.2.1 main 全局配置

  ```
  user nginx group；
  # 指定 nginx worker 的所属用户 和用户组
  pid  /var/run/nginx.pid;
  # master进程pid文件路径，文件内容就是pid号
  worker_processes 6;
  # 子进程worker的个数，设置auto 就是跟cup个数保持一致
  worker_rlimit_nofile 65535;
  # 每个worker 进程最大连接数
  worker_cpu_affinity  000001 000010 000100 001000 010000 100000;
  # 将worker跟cpu绑定。同一个进程在不同CPU上运行会有性能消耗，缓存失效
  worker_rlimit_core 50M;
  # worker core文件存放大小限制
  working_directory /opt/nginx/tmp;
  # worker core文件存放目录
  worker_priority -10;
  # 取值-20～19 ，120-10=110，worker进程在linux中的优先级，越小优先级越高
  worker_shutdown_timeout 5s;
  # worker优雅退出时间超时
  timer_resolution 100ms;
  # worker内部使用的计时器精度
  daemon on;
  # nginx 后台运行，默认on
  ```

- 5.2.2 event 配置

  ```
  events {
    use	epoll;
    # 事件驱动模型，linux下epoll。 其他平台可选 select poll 等
    worker_connections	65535;
    # 子进程最大连接数
    accept_mutex off;
    # 负载均衡互斥锁，默认关闭，建议关闭
    # [惊群问题](https://en.wikipedia.org/wiki/Thundering_herd_problem)；
    # 未开启，请求较少时会唤醒全部子进程，抢占一个连接，造成性能损耗。 但是请求较多，未开启，因为没了锁的消耗，反而会提高些性能。
    # 高版本epoll中的EPOLLEXCLUSIVE也优化了这里，因此建议关闭
  }
  ```

- 5.2.3 http 配置

  > `http{...}` 是针对 http 请求的配置，一般只需要设置一个 http 模块就行。 主要是由[ngx_http_core_module](http://nginx.org/en/docs/http/ngx_http_core_module.html)提供

  - 日志相关

    ```
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';
    # 定义了一种“main”日志格式，在需要配置日志时可用指定格式，相关可用参数参考下面变量部分。
    access_log  /var/log/nginx/access.log main;
    # 设置了访问日志文件路径，日志格式按照main格式，如果error没有定义按照默认
    error_log	/data/log/nginx/error.log error;
    # 设置了访问错误日志文件路径，日志格式按照error格式；如果error没有定义按照默认
    ```

  - 文件类型相关

    ```
    include  mime.types;
    # 覆盖了几乎所有的文件类型和文件后缀
    default_type  application/octet-stream;
    # 默认，位置的应用程序文件
    ```

  - 传输性能相关

    > sendfile 是 linux 内核中的一个系统调度，将原来的 read+write => sendfile 2 个操作变成一个操作，提高传输效率

    ```
    sendfile on;
    tcp_nopush  on;
    tcp_nodelay off;
    #tcp_nopush \ tcp_nodelay 是互斥的，tcp_nopush 是将包累计一定大小后再传输，传输效率更高，而不是按时间0.2秒后传输
    ```

  - 导入模块相关

    随着项目复杂度增加，配置也变得复杂，可以将部分配置抽离到单独文件，再通过 include 的方式引入。这里的 include 的作用就是简单的将文件的内容复制到 include 地方

    ```
    include mime.types;
    include upstream.conf;
    include vhosts/*.conf;
    ```

  - gzip 相关

    ```
    gzip on;
    gzip_min_length 1000;
    gzip_buffers 16 8k;
    gzip_comp_level 1;
    gzip_types text/plain application/x-javascript text/css application/xml application/javascript;
    gzip_disable "MSIE [1-6]\.";
    ```

  - Buffers 相关

    > 就是 nginx 在处理中用到的 buffer， 如果 buffer 太小会，会多次写缓存文件，影响性能

    ```
    client_body_buffer_size 10K;
    # 允许客户端请求的最大单个文件字节数
    client_header_buffer_size 1k;
    # 用于设置客户端请求的Header头缓冲区大小，大部分情况1KB大小足够
    client_max_body_size 8m;
    # 设置客户端能够上传的文件大小，默认为1m
    large_client_header_buffers 2 1k;
    # 该指令用于设置客户端请求的Header头缓冲区大小
    ```

  - Timeout 相关

    ```
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    # 给到客户端的keepalive超时时间
    send_timeout 10;
    ```

  - header 响应

    ```
    proxy_set_header	X-Real-IP $remote_addr; #header中设置ip
    # 往header中添加数据，发往后台
    ```

  - 其他

    ```
    server_tokens off;
    # 隐藏nginx的版本号
    proxy_intercept_errors on;
    # 捕获返回的300以上的错误码，可以在server中设置下面错误响应页
    error_page  400 /404.html;
    error_page  404 /404.html;
    error_page  500 /404.html;

    ```

- 5.2.4 server 配置
  - 基础配置
    ```
    listen 8080;
    # 监听端口
    server_name xxxserver.com;
    # 虚拟服务器名
    charset utf-8;
    # 编码
    access_log /xx/xxx-access.log main;
    # 请求日志地址，以main格式存储
    error_log /xx/xxx-.log error;
    # 错误日志地址，以error格式存储
    add_header Set-Cookie "HttpOnly";
    # 设置cookie
    add_header X-Frame-Options "SAMEORIGIN";
    # 设置header
    expires    24h;
    # 设置过期
    ```
  - location

### 5.3、变量

| 变量取值              | 举例                         | 描述                             |
| --------------------- | ---------------------------- | -------------------------------- |
| $remote_addr          | 27.16.220.84                 | 客户端 ip                        |
| $remote_port          | 56838                        | 客户端 端口                      |
| $server_addr          | 172.17.0.2                   | 服务端 ip                        |
| $http_x_forwarded_for | 172.17.0.2                   | http 头中的 X-Forwarded-For 字段 |
| $server_port          | 8081                         | 服务端 端口                      |
| $server_protocol      | HTTP/1.1                     | 服务端 协议                      |
| $binary_remote_addr   | 茉                           | 二进制客户端 ip                  |
| $connection           | 126                          | tcp 连接序号                     |
| $uri                  | /test/                       | 请求 url 不包含参数              |
| $request_uri          | /test/?pid=121414&cid=sadasd | 请求 url 包含参数                |
| $scheme               | http                         | 协议名 http/https                |
| $request_method       | GET                          | 请求方法                         |
| $request_length       | 518                          | 请求长度                         |
| $status               | 200                          | 响应状态码                       |
| $time_local           | 17/Jan/2023:17:14:08 +0800   | 时间                             |
| $time_iso8601         | 2023-01-17T16:51:42+08:00    | 时间                             |
| $bytes_sent           | 518                          | 发送到客户端大小                 |
| $body_bytes_sent      | 518                          | 响应体                           |
| $args                 | pid=121414&cid=sadasd        | 全部请求参数                     |
| $arg_pid              | 121414                       | 获取指定参数值                   |
| $is_args              | ?                            | 是否包含参数，?/空               |
| $query_string         | pid=121414&cid=sadasd        | 与 args 一样                     |
| $host                 | server.com                   | 虚拟服务器名                     |
| $http_user_agent      | Mozilla/5.0 ... Safari/537.3 | 客户端 ua                        |
| $http_referer         |                              | 从哪里过来的                     |
| $http_via             |                              | 代理服务器相关信息               |
| $http_cookies         | xx=yy; xxx=yyy               | cookie                           |
| $request_time         | 0.000                        | 处理 request 消耗时间            |
| $https                |                              | 是否开启 https, on/空            |
| $request_filename     | /usr/share/nginx/html/test/  | 磁盘文件地址                     |
| $document_root        | /usr/share/nginx/html        | 文件夹路径                       |
| $limit_rate           | 0                            | 响应速度上限                     |
