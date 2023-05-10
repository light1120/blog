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
  - 数据卷：进程产生数据（业务数据，日志数据）应该写入数据卷，不然会跟随容器进程消亡，数据卷会跳过容器，直接跟接宿主（文件/网络）写操作
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
  - docker rmi：删除一个或多个镜像。
  - docker build：使用 Dockerfile 文件构建一个新的镜像。
    - docker build -t nginx:v1 : 打标构建
    - -f : 指定文件构建，默认当前目录下 `Dockerfile` 、`dockerfile`
    - [build options](https://docs.docker.com/engine/reference/commandline/build/)
  - docker push：将一个镜像推送到 Docker 仓库中。(先要登录)
    - docker tag nginx:v1 username/nginx:v1 : (这里 username 需要是 login 时的 username)
    - docker push username/nginx:v1 : 把镜像推送到仓库
  - docker login: 登录镜像仓库
    - docker login --username xxx --password xxxx (mirrors.xxx.com) : 登录镜像仓库，如果没有指定，就是登录官方镜像仓库（hub.docker.com）
    - 登录凭证存放`~/.docker/config.json`
  - docker logout: 登出镜像仓库
- 容器命令
  - docker ps : 查看容器 `-a` 查看所有的
  - docker rm : 删除容器 ; `ps -a `看不到 ，
  - docker run : 启动新容器， `docker run --name webserver -d -p 80:80 nginx`，可以启动本地镜像，也可以直接启动远程仓库的镜像
    - -d : 后台运行 返回容器 id
    - -p : 映射端口 容器外:容器内 ;`-p 8000:8000 -p 8080:8080` 映射多个 ；`-p 8000-9000:8000-9000` 映射范围
    - -rm : 终止后就删除
    - -it : 打开终端接受输入流，相当于今日了容器，可以直接输入命令
    - --name : 设置别名
  - docker exec : 进入容器 `docker exec -it webserver bash`
  - docker kill : 终止容器 , 跟`docker stop` 一样 ; `ps -a `可以看到
  - docker start : 启动存在的容器
  - docker restart : 重启存在的容器
  - docker container prune : 删除所有终止的容器

### 5.3、docker compose

> docker 容器编排。就是操作很多容器

## 6、dockerfile

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

https://www.docker.com/blog/intro-guide-to-dockerfile-best-practices/
https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
https://mp.weixin.qq.com/s/phWk-tw0fdUokcRMOeCJIw
https://mp.weixin.qq.com/s/DB38jsvzrNWc1NqQOEqdKw
