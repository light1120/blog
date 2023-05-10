# Docker 常见问题

## dockerd 重启失败超过次数

`Job for docker.service failed because start of the service was attempted too often. See "systemctl status docker.service" and "journalctl -xe" for details. To force a start use "systemctl reset-failed docker.service" followed by "systemctl start docker.service" again.`

上面报错是 docker 重启超过次数后报错。

```
TimeoutStartSec=0
RestartSec=2
Restart=always
```

docker.service 配置文件中指定了重启报错之后会每隔 2 秒重启。 docker 重启报错一般是 `/etc/docker/daemon.json` 配置文件报错，仔细检查下。如果确认没问题，就重装下 docker。

## docker run -p

`docker run --name webserver -d -p 2000:2000 nginx`

使用 `-p` 参数映射端口时，如果 `-p 2000:2000` 。访问外部 2000 端口没效果。内部端口必须是 80 。是因为 nginx 镜像 内部设置文件 只开启了 80 端口。 所以在使用 `-p` 映射内外端口时，外部可以随意指定一个可用端口，内部必须清楚应用程序对外暴露的端口，如果指定了 80 端口，必须是 `-p xxxx:80`

## docker push

在 push 到 hub.docker.com 官方仓库时，要保持 username 一致，`docker build -t nginx:v1 username/my-nginx:v1` ,这里的 username 要 跟`docker login` 的 username 一致。 不然 push 会报错
