# docker compose

## 1、简介

compose 实现为了对 docker 容器的编排。 通常一个 web 服务包括，web 应用，数据库，缓存，可能还有队列，负载均衡等服务。compose 提供了 `docker-compose.yml` 用来定义多个容器组合的项目。从而对整个项目进行管理。

- `docker-compose xxx` : 单独下载`docker-compose`二进制文件，然后运行
- `docker compose xxx` : 以插件的方式，安装`docker-compose`

## 2、示例

包含 2 个容器，一个 web ，一个 redis 。web 会 `docker build xxx .` 以当前目录为构建上下问，构建镜像，并依赖了 redis 容器，redis 容器是直接启动构建好的镜像`redis:alpine`。

```
version: '3'
services:

  web:
    build: .
    depends_on:
      - redis
    ports:
     - "5000:5000"

  redis:
    image: "redis:alpine"
```

## 3、docker compose up

`docker compose up` 基本是最常见的命令，用于启动容器。执行后，做了很多事

- 1、解析 `docker-compose.yml` 文件：Docker Compose 首先解析 `docker-compose.yml` 文件，读取其中定义的服务、网络、卷等配置信息
- 2、构建镜像：如果 `docker-compose.yml` 文件中的服务定义了 `build` 配置，Docker Compose 会自动构建相应的 Docker 镜像。如果镜像已经存在，它将使用现有的镜像
- 3、创建网络：Docker Compose 会根据 `docker-compose.yml` 文件中的配置创建相应的网络。默认情况下，它会为整个项目创建一个新的`bridge`类型网络 `<project_name>_default`，以确保容器之间的网络隔离。也可以在文件中自定义网络设置。
  - `docker network ls` : 查看网络
  - `docker-compose up --network mynetwork`: 指定网络
- 4、创建卷：Docker Compose 会根据 `docker-compose.yml` 文件中的配置创建相应的卷。卷用于在容器之间或与宿主机之间共享数据。
- 5、创建并启动容器：Docker Compose 会根据 `docker-compose.yml` 文件中定义的服务创建并启动容器。在这个过程中，它会处理服务之间的依赖关系`depends_on`，确保容器按照正确的顺序启动。此外，Docker Compose 还会将容器连接到相应的网络，并配置端口映射、环境变量、卷挂载等。
- 6、输出日志：默认是在前台运行，也可以通过`-d`指定后台运行

相对于 `docker run` 做了什么

`docker run` 会解析命令行参数来配置容器，包括设置环境变量、端口映射、卷挂载等。如果没有`--network`指定网络，会链接到宿主机上的默认网络（名字`bridge`的网络）。如果没有指定网络，宿主机也没有`bridge`网络，会报错，需要 systemctl 重新下 docker 服务。

## 4、docker compose 命令

格式： `docker compose [-f=<arg>...] [options] [COMMAND] [ARGS...]`

参数：

- -f, --file FILE 指定使用的 Compose 模板文件，默认为 docker-compose.yml，可以多次指定。
- -p, --project-name NAME 指定项目名称，默认将使用所在目录名称作为项目名。
- --verbose 输出更多调试信息。
- -v, --version 打印版本并退出。

命令：

- up : 创建并启动服务
  - `-d` : 后台运行
  - `--force-recreate` : 强制重新创建
  - `--no-recreate` : 不强制重新创建，存在即不创建，跟 `--force-recreate` 相反
- build : 构建项目中的配置了 `build` 的容器
- run : 在容器中执行命令
- down : 停止容器，删除网络
- exec : 进入容器
- config : 显示配置，内容基本和`docker-compose.yml`内容差不多，需要注意，命令执行目录需要跟文件目录同级
- images : 列举项目中的镜像
- kill : 发送信号`SIGKILL`停止容器
  - -s : 指定信号`docker compose kill -s SIGINT`
- logs : 输出日志
- port : 输出端口信息
- ps : 查看容器
- pull : 拉起镜像
- push : 推送镜像
- start : 启动存在的容器
- stop : 停止所有容器
- restart : 重新启动容器
- pause : 停止一个容器
- unpause : 恢复停止中的容器
- rm : 删除已经 stop 的容器 ， -f 强制删除
- version : 版本信息

## 5、docker-compose.yml 指令

`docker-compose.yml`文件中指令非常多，可以参阅 [docker-compose v3 文档](https://docs.docker.com/compose/compose-file/compose-file-v3/)

从最外层往里开始。除了 version，其他 service , networks 等，需要在第二层指定先名字，可以任意定义，第三次才是具体配置。

- version : 版本，可以指定 `3` 或者 `3.x`
- service : 服务，一个服务就是一个容器，包括 web ，mysql ,redis 等。[service 详细](https://docs.docker.com/compose/compose-file/compose-file-v3/#service-configuration-reference)
  > name 第一层需要指定 service 名字，可以作为 host 在代码中使用，如上面示例，定义了一个名字`redis`的服务。在代码中可以通过 使用`redis`字符串作为`host`链接 redis 服务器
  - build : 指定构建上下文，或者指定参数等
  - images : 指定镜像
  - depends_on : 依赖容器，指定启动顺序
  - environment : 环境变量
  - ports ： 端口映射
  - network,volumes,configs,secrets : 指定网络数据卷等
  - deploy ：部署相关，使用`docker swarm` 时需要
- networks : 网络，可以配置默认网络，或者创建自定义网络。[network 详细](https://docs.docker.com/compose/compose-file/compose-file-v3/#network-configuration-reference)
  - driver : 驱动 ，默认为 "bridge"。其他可用驱动程序包括 "host"、"overlay" 和 "macvlan"
  ```
  networks:
    my-network:
      driver: bridge
      driver_opts:
        com.docker.network.bridge.name: my-custom-bridge
      attachable: true
      enable_ipv6: false
      ipam:
        driver: default
        config:
          - subnet: 172.28.0.0/16
            ip_range: 172.28.5.0/24
            gateway: 172.28.5.254
        options:
          foo: bar
      internal: false
      labels:
        com.example.description: "This is my custom network"
  ```
- volumes : 自定义数据卷
  ```
  volumes:
    my-volume:
      driver: local
      driver_opts:
        type: nfs
        o: addr=10.40.0.199,nolock,soft,rw
        device: ":/path/to/dir"
      external: false
      labels:
        com.example.description: "This is my custom volume"
  ```
- configs : 配置文件，可以将配置文件从宿主复制到容器内
  - file : 指定文件
  ```
  configs:
    my-config:
      file: ./my-config.conf
      external: false
      labels:
        com.example.description: "This is my custom config"
  ```
- secrets : 敏感信息文件，主要是账户密码等，可以拷贝至容器内
  - file : 指定文件
  ```
  secrets:
    my-secret:
      file: ./my-secret.txt
      external: false
      labels:
        com.example.description: "This is my custom secret"
  ```
