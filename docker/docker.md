# Docker

> docker 是一个划时代的技术，极大的提高了计算机的虚拟化能力，提高了应用的运维效率，在云时代起着非常重要的作用

## 1、docker 是什么？

docker 是一种轻量级的容器化技术，可以将应用程序和其依赖项打包到一个可移植的容器中，以便在任何地方运行。主要用于进程隔离，还包括文件系统，网络设备等。相较于虚拟机技术，减少了硬件虚拟，操作系统，因此非常轻量便捷。

## 2、docker 的优势

- 相对虚拟机，更高效利用计算机资源，更轻量便捷，更快启动
- 环境一致性，docker 镜像提供了内核外完整的运行环境，应用运行于 docker 容器中，避免了环境差异导致的问题
- CI/CD，用 Dockerfile 对镜像构建，持续集成；一次构建，随意部署，持续部署
- 快速迁移，环境一致性带来的多平台任意部署
- 持续开发，镜像可以基于其他镜像构建。 真实业务中可以构建基础镜像，框架镜像，业务镜像等

## 3、基本概念

- 镜像（Image）：镜像就是一个分层存储文件系统，可以一层一层构建，包含了运行应用程序所需的所有文件和配置。不包含任何动态数据。
- 容器（Container）：容器就是一个特殊进程，可以拥有独立的文件系统，网络，进程空间。也是分层运行，可以在容器中运行容器，容器层跟随容器层创建，消亡。
  - 数据卷：数据卷存在于宿主机，进程产生数据（业务数据，日志数据）应该写入数据卷，不然会跟随容器进程消亡，数据卷会跳过容器，直接跟接宿主（文件/网络）写操作。
  - **应用程序前台运行** : docker 容器默认会将第一个进程作为容器正在运行的依据，如果进程结束，容器状态就会变成`Exited`。在配置 Dockerfile 的 CMD 启动命令，时需要注意使用前台运行 ; 例如：nginx : `CMD ["nginx" "-g" "daemon off;"]`
- 仓库（Repository）：镜像集中存储和分发服务；[官方镜像仓库](https://hub.docker.com/search?q=&type=image&image_filter=official)
- Dockerfile：就是一个文本文件，包含了一系列指令，用于构建 Docker 镜像

## 4、docker 架构

> docker 使用的 c/s 架构，包括 docker client , docker daemon 。容器相关的操作都是 有 docker daemon 来完成的，docker client 只是向 docker daemon 发送指令

<div align="center"><img src='./images/architecture.svg' width=600 alt=''> </img></div>

- docker daemon : docker 守护进程，就是 `/usr/bin/dockerd` 。docker.service 配置文件中就是指定 dockerd 来启动
- docker client : docker 客户端，包括 `docker cli` , `docker compose` , `docker destop`
- docker registry : docker 镜像存储和分发服务

## 5、docker 相关操作命令

### 5.1、dockerd

> docker 守护进程，用来管理容器的。安装之后第一步就是先启动 dockerd 进程

- docker.service : service unit , 实际上就是执行了
  - systemctl start docker
  - systemctl stop docker
  - systemctl restart docker
  - systemctl status docker
- dockerd 命令 : `dockerd [options]`
  - --registry-mirrors : 设置镜像加速源
  - --http-proxy : 出口代理
  - 还有很多
  - `/etc/docker/daemon.json`: 可以在 daemon.json 文件中配置响应的参数，就不用在启动 dockerd 时指定参数。[完整的 daemon 配置](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-configuration-file)

### 5.2、docker cli

> docker 命令行，一般用了最多的，命令。 包括镜像的构建相关，对容器运行相关

- 镜像命令
  - docker search nginx : 从仓库中搜索
  - docker pull：从 Docker 仓库中拉取一个镜像。
  - docker images：列出所有本地的镜像。
  - docker tag : 镜像打标
    - docker tag name:v1 new-name:v1 : 重命名
  - docker rmi：删除一个或多个镜像。
  - docker build：使用 Dockerfile 文件构建一个新的镜像。
    - docker build -t nginx:v1 : 打标构建
    - -f : 指定文件构建，默认当前目录下 `Dockerfile` 、`dockerfile`
    - [build options](https://docs.docker.com/engine/reference/commandline/build/)
    - 构建上下文 : `docker build -t nginx:v3 .` 这里的 `.` 就是当前目录为构建上下文，默认会在构建上下文中找 dockerfile 文件
  - docker history: 查看某个镜像的构建历史步骤
    - docker history --no-trunc nginx:v2 : 显示详细信息
  - docker push：将一个镜像推送到 Docker 仓库中。(先要登录)
    - docker tag nginx:v1 username/nginx:v1 : (这里 username 需要是 login 时的 username)
    - docker push username/nginx:v1 : 把镜像推送到仓库
  - docker login: 登录镜像仓库
    - docker login --username xxx --password xxxx (mirrors.xxx.com) : 登录镜像仓库，如果没有指定，就是登录官方镜像仓库（hub.docker.com）
    - 登录凭证存放`~/.docker/config.json`
  - docker logout: 登出镜像仓库
- 容器命令
  - docker ps : 查看容器 `-a` 查看所有的
    - -a : 显示所有的包括 killed
    - -q : 只显示 容器 ID
  - docker rm : 删除容器 ; `ps -a `看不到 ，
  - docker run : 启动新容器， `docker run --name webserver -d -p 80:80 nginx`，可以启动本地镜像，也可以直接启动远程仓库的镜像
    - -d : 后台运行 返回容器 id
    - -p : 映射端口 容器外:容器内 ;`-p 8000:8000 -p 8080:8080` 映射多个 ；`-p 8000-9000:8000-9000` 映射范围
    - -rm : 终止后就删除
    - -it : 打开终端接受输入流，相当于今日了容器，可以直接输入命令
    - --name : 设置别名
  - docker exec : 进入容器 `docker exec -it webserver bash`
  - docker stop : 终止容器 `docker stop $(docker ps -q)` 批量终止所有的容器
  - docker inspect : 获取元数据
    - `docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id>` : 查看 docker 容器内部 ip
  - docker kill : 终止容器 , 跟`docker stop` 一样 ; `ps -a `可以看到
  - docker top : 显示了容器内所有进程在宿主机上的 PID
  - docker start : 启动存在的容器
  - docker restart : 重启存在的容器
  - docker container prune : 删除所有终止的容器
  - docker cp : 宿主跟容器之间拷贝
    - docker cp ./file CONTAINER:/work/file ：宿主拷贝到容器
    - docker cp CONTAINER:/path - : 容器拷贝到宿主标准输出流； `docker cp CONTAINER:/var/logs/app.log - | tar x -O | grep "ERROR"` 拷贝容器的日志文件，解压到宿主，并检索'ERROR'，输出到标准输出流

## 6、Dockerfile

### 简介

> dockerfile 是一个文本文件，可以任何命名。里面包含的是一条条指令，在构建镜像时会按照指令构建，一条指令就是一层，一层层构建。

一个简单的构建 nodejs 的 dockerfile 文件。以`node:14-alpine`为基础镜像，当前`/app` 目录为工作目录，拷贝`package.json`，安装依赖，拷贝所以文件，暴露 3000 端口，配置 `npm start` 启动命令

```
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Dockerfile 指令

- FROM ： 指定基础镜像，在此基础上构建。必备，第一条指令
- RUN ： 执行命令，用来执行一些操作。
  - shell 格式： RUN echo 'test'->test.html
  - exec 格式： RUN [ "echo", "test", "test.html" ]
  - 每一条 RUN 命令就会构建一层，最好将一些了命令写到一个 RUN 里面，命令直接用 `&&` , 换行`\`
- COPY ： 拷贝文件，支持；支持 shell , exec ；
  - **构建上下文** : 路径不能超过构建上下文范围，不然会找不到文件。
  - 支持 通配符
  - --chown=<user>:<group> : 指定用户，组
- ADD ：高级版拷贝 ；仅仅在要自动解压缩的情况下使用 ADD ，其余均使用 COPY
- CMD ：容器启动命令，支持 shell , exec ；
  - CMD echo $HOME == CMD [ "sh", "-c", "echo $HOME" ] : shell 模式其实就是用 `sh -c` 来执行命令
  - CMD ["nginx", "-g", "daemon off;"] : exec 模式
- ENTRYPOINT : 跟 CMD 一样，支持 shell , exec
  - `<ENTRYPOINT> "<CMD>"`: 有了 ENTRYPOINT 之后，CMD 就不是直接执行命令，而是作为 ENTRYPOINT 的参数
  - 场景 1 ，docker run image -i : 命令中的 '-i' 作为 CMD ，当成参数 传递给 ENTRYPOINT
  - 场景 2 ，redis 中，需要先执行一些脚步，再启动 redis-server
- ENV : 设置环境变量。 可以在 CMD , WORKDIR , RUN 等命令中展开
  - 格式：`ENV <key1>=<value1> <key2>=<value2>`
- ARG : 构建参数 ，也是设置成环境变量，只是容器运行时不存在
  - 格式：`ARG <参数名>[=<默认值>]`
  - `docker build --build-arg <参数名>=<值>` : 可以覆盖
  - 生效范围：FROM 指令之前定义的，只能用于 FROM 指令中。后续如果使用，需要再次定义。多段构建时需要注意
- VOLUME : 定于数据卷，用于存储容器中程序产生的数据
  - 格式： `VOLUME <路径>` / `VOLUME ["<路径1>", "<路径2>"...]`
  - `docker run -v` : 指定数据卷
- EXPOSE : 暴露端口，实际上不会真的暴露端口。
  - 格式：`EXPOSE <端口1> [<端口2>...]`
  - 作用：帮助其他人使用时，快速了解镜像应用程序的监听端口，而不需要去看程序代码。 `docker run -P` 不指定端口时，会映射到这个端口
- WORKDIR ：容器内部，工作目录。 不能使用 CD 命令； 可以多个组合； `docker exec ` 进入的默认路径，就是最终的 WORKDIR 路径，
  - 多个组合： `WORKDIR /a`,`WORKDIR b`,`WORKDIR c` 最终的路径就是 `/a/b/c`
- USER : 指定用户，用户组 。会影响 CMD RUN 等命令的操作身份 。 使用之前需要先创建用户
  - 格式：`USER <用户名>[:<用户组>]`
  - `RUN groupadd -r redis && useradd -r -g redis redis`: `USER redis`
- HEALTHCHECK : 健康检查 --interval 间隔 ， --timeout 超时 ， CMD 检查命令 返回 0 成功，1 失败
- LABEL : 添加镜像说明（作者 日期 等。。）
- SHELL : 指定 RUN CMD 的 shell 程序，默认 /bin/sh
  - 默认 : `SHELL ["/bin/sh", "-c"]`
- ONBUILD : 后面跟随 RUN COPY 等命令，其他镜像以此为基础镜像构建时才会执行，后面的命令

### 多阶段构建

多阶段构建就是一个 dockerfile 中包含多个 FROM 。 每个 FROM 表示一个阶段。例如下：第二阶段只使用了第一阶段构建好的产物

```
# 第一阶段：构建应用程序
FROM node:14 AS builder
# 设置工作目录
WORKDIR /app
# 将应用程序代码复制到容器中
COPY . .
# 安装应用程序依赖项
RUN npm install
# 构建应用程序
RUN npm run build
# 第二阶段：运行应用程序
FROM node:14-alpine
# 设置工作目录
WORKDIR /app
# 从第一阶段复制应用程序代码
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
# 启动应用程序
CMD ["npm", "start"]
```

- 减小镜像大小 ：二阶段中仅复制所需的一阶段的构建结果，从而减小最终镜像的大小。
- 简化构建过程 ：将复杂的项目分阶段构建，每个阶段，就比较清晰，容易维护
- 安全性和隔离 ：每个阶段都可以选择适合每个阶段的最简单的基础镜像，每个阶段都是隔离的

### 最佳实践

[官方最佳实践](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

- 理解[构建上下文](https://docs.docker.com/build/building/context/)
- 使用 `.dockerignore` 文件，跟 `.gitignore` 使用方法一样，用于剔除无关的文件
- 使用[多阶段构建](https://docs.docker.com/build/building/multi-stage/)
- 避免安装不需要的包
- 解构应用程序：比如一个 web 应用，需要三个容器，web 应用，数据库，缓存 。方便横向扩容，复用。如果容器之间有相互依赖，用于[ 容器网络 ](https://docs.docker.com/network/)连接起来
- 最小化构建层数： 必要时将一些命令连接起来，减少层数 `RUN  xxx && yyy & zzz`
- 构建缓存 ： `docker build --no-cache=true`
- Dockerfile : 理解 dockerfile 的指令
  - FROM : 尽量使用官方镜像，推荐使用 [alpine](https://hub.docker.com/_/alpine/) , 小于 6M ,仍然是一个 linux 完整发行版本
  - LABEL : 记录镜像相关信息
  - RUN : 将复杂的命令，连接起来，通过 `\` 分割 ， 一条命令一行
    - apt-get :
    ```
    RUN apt-get update && apt-get install -y \
        package-bar \
        package-baz \
        package-foo \
        # 指定版本
        s3cmd=1.1.* \
    ```
  - CMD : 建议用 exec 格式 ：`CMD ["executable", "param1", "param2"...]`
  - ADD 和 COPY : 除了需要自动解压，其他都使用 `COPY`
  - VOLUME : 强烈建议使用数据卷来管理，变化的数据
  - ENTRYPOINT : 一般用于 主命令 ，CMD 配置 参数
    - 配置辅助脚本: `ENTRYPOINT ["/docker-entrypoint.sh"]` , 在 sh 文件中处理参数逻辑
  - USER ：通过配置 USER ，避免使用 `sudo` 。 必要，使用 `gosu` 替换
  - WORKDIR ：尽量使用绝对路径

https://mp.weixin.qq.com/s/phWk-tw0fdUokcRMOeCJIw
https://mp.weixin.qq.com/s/DB38jsvzrNWc1NqQOEqdKw
