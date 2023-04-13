# Nginx 配置例子

> 以下内容来自 chatgpt

以下是一个适合电商系统的详细的nginx.conf配置文件，其中包含了反向代理、负载均衡、缓存、HTTPS等常用配置。

```
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    keepalive_timeout 65;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 反向代理
    upstream backend {
        server backend1.example.com:8080;
        server backend2.example.com:8080;
    }

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # 负载均衡
    upstream backend {
        server backend1.example.com:8080 weight=5;
        server backend2.example.com:8080 weight=5;
        server backend3.example.com:8080;
    }

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # 缓存
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    proxy_cache_valid 200 5m;
    proxy_cache_valid 404 1m;

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_cache my_cache; proxy_cache_bypass $http_pragma;
            proxy_cache_revalidate on;
            add_header X-Cache-Status $upstream_cache_status;
        }
    }

    # HTTPS
    server {
        listen 443 ssl;
        server_name example.com;

        ssl_certificate /etc/nginx/ssl/example.com.crt;
        ssl_certificate_key /etc/nginx/ssl/example.com.key;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

在这个配置文件中，我们首先指定了Nginx运行的用户和进程数，并设置了错误日志和进程ID文件的路径。然后，我们定义了一个events块，用于配置Nginx的事件模型。

在http块中，我们首先包含了mime.types文件，并设置了默认的MIME类型。然后，我们定义了一个log_format，用于配置Nginx的访问日志格式，并设置了访问日志的路径。接着，我们开启了sendfile、tcp_nopush和tcp_nodelay等优化选项，并设置了keepalive_timeout和gzip等参数。

接下来，我们定义了三个server块，分别用于反向代理、负载均衡和缓存。在反向代理和负载均衡的server块中，我们使用了upstream指令来定义后端服务器的列表，并在location块中使用proxy_pass指令来进行反向代理和负载均衡。在缓存的server块中，我们使用了proxy_cache_path指令来定义缓存路径和缓存区域，并在location块中使用proxy_cache指令来启用缓存。

最后，我们定义了一个HTTPS的server块，用于配置HTTPS协议的访问。在这个server块中，我们使用了ssl_certificate和ssl_certificate_key指令来指定SSL证书和私钥的路径，并在location块中使用proxy_pass指令来进行反向代理。

总之，这个配置文件包含了反向代理、负载均衡、缓存、HTTPS等常用配置，可以为电商系统提供高性能和高可用性的服务。