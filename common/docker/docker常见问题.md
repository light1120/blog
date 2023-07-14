# Docker 遇到的问题

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

## yum-config-manager --add-repo http://xxx.xxx/docker-ce/linux/centos/docker-ce.repo

centos 添加 dokcer 仓库之后 ，`yum install -y docker-ce` 报错

```
https://download.docker.com/linux/centos/2.2/x86_64/stable/repodata/repomd.xml: [Errno 14] HTTPS Error 404 - Not Found
Trying other mirror.
To address this issue please refer to the below wiki article

https://wiki.centos.org/yum-errors

If above article doesn't help to resolve this issue please use https://bugs.centos.org/.

 One of the configured repositories failed (Docker CE Stable - x86_64),
 and yum doesn't have enough cached data to continue. At this point the only
 safe thing yum can do is fail. There are a few ways to work "fix" this:

     1. Contact the upstream for the repository and get them to fix the problem.

     2. Reconfigure the baseurl/etc. for the repository, to point to a working
        upstream. This is most often useful if you are using a newer
        distribution release than is supported by the repository (and the
        packages for the previous distribution release still work).

     3. Run the command with the repository temporarily disabled
            yum --disablerepo=docker-ce-stable ...

     4. Disable the repository permanently, so yum won't use it by default. Yum
        will then just ignore the repository until you permanently enable it
        again or use --enablerepo for temporary usage:

            yum-config-manager --disable docker-ce-stable
        or
            subscription-manager repos --disable=docker-ce-stable

     5. Configure the failing repository to be skipped, if it is unavailable.
        Note that yum will try to contact the repo. when it runs most commands,
        so will have to try and fail each time (and thus. yum will be be much
        slower). If it is a very temporary problem though, this is often a nice
        compromise:

            yum-config-manager --save --setopt=docker-ce-stable.skip_if_unavailable=true

failure: repodata/repomd.xml from docker-ce-stable: [Errno 256] No more mirrors to try.
https://download.docker.com/linux/centos/2.2/x86_64/stable/repodata/repomd.xml: [Errno 14] HTTPS Error 404 - Not Found
```

** `sed -i  "s/\$releasever/7/g"  /etc/yum.repos.d/docker-ce.repo` ** ， 之后再 `yum install -y docker-ce`

## docker exec -it xxxxx bash 报错

```
OCI runtime exec failed: exec failed: unable to start container process: exec: "/bin/bash": stat /bin/bash: no such file or directory: unknown
```

由于基础镜像不一致，导致解析 bash 报错。 可以尝试下面几种方法

```
docker exec -it container-xxxxx /bin/bash
docker exec -it container-xxxxx /bin/sh
docker exec -it container-xxxxx /bin/csh
```

## Docker Compose Redis Error: connect ECONNREFUSED 127.0.0.1:6379

```
const { createClient } = require("redis");
const redisClient = createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});
redisClient.connect();
```

原因是 redis 包 v4 版本有 bug， 需要使用 `legacyMode: true` 。建议使用 `ioredis` 包，更好更强大

## docker run 报错 docker: Error response from daemon: failed to create endpoint nodejs-8000 on network bridge: network b08e2c7b642194a1bc9339072cce830588eb02309c67360ebb32f324705c94c1 does not exist.

- 1、可以重启 docker 服务，会默认创建一个 bridge 网络

```
systemctl restart docker
```

- 2、创建网络，然后 docker run 指定网络

```
docker network create my-network
docker run --network my-network
```

## docker run 宿主机可以 curl 容器应用，docker compose 不可以 curl 容器应用

```
networks:
  mynetwork:
    driver: bridge
    driver_opts:
      "com.docker.network.bridge.name": "docker0"
```

这里使用了宿主机的 docker0 网卡作为驱动。让 Docker Compose 使用宿主机上的默认桥接网络，而不是为每个项目创建一个新的网络。这样可以避免与宿主机上其他网络的冲突。但是会降低容器之间的隔离

```
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id>
ifconfig docker0
//ip 在同一网段
```
