# docker compose

## 简介

## 原理

## docker run vs docker-compose up

docker run 和 docker-compose up 都是基于 Docker 引擎来运行容器的。它们之间的主要区别在于如何配置和管理容器。以下是它们在容器配置、网络等方面的一些区别：

- 容器配置：
  - docker run：使用命令行参数来配置容器，例如设置环境变量、端口映射、卷挂载等。这种方式适用于简单的容器配置，但在处理复杂的多容器应用时可能变得繁琐。
  - docker-compose up：使用 docker-compose.yml 文件来定义和配置容器。这种方式允许您在一个文件中管理整个应用的配置，使得配置更加集中和易于维护。
- 网络：
  - docker run：默认情况下，使用 docker run 运行的容器会连接到 Docker 宿主机上的默认网络（通常是 bridge 网络）。如果需要，您可以使用 --network 参数手动指定其他网络。
  - docker-compose up：默认情况下，docker-compose 会为每个项目创建一个新的网络，以确保容器之间的网络隔离。您可以在 docker-compose.yml 文件中自定义网络设置，例如使用现有网络或创建新的网络。
- 服务依赖和启动顺序：
  - docker run：没有内置的依赖管理功能，因此您需要手动控制容器的启动顺序，以确保依赖关系得到满足。
  - docker-compose up：支持定义服务之间的依赖关系，使用 depends_on 配置项确保容器按照正确的顺序启动。
- 容器编排：
  - docker run：需要手动配置容器之间的网络连接和资源共享。这可能会导致配置过程变得复杂和容易出错。
  - docker-compose up：通过 docker-compose.yml 文件中的配置，可以轻松地实现容器编排，使它们可以相互通信并共享资源。

## 示例：

```
version: '3'
services:
  redis:
    image: "redis:latest"
    networks:
      - mynetwork

  mynodejs:
    build: .
    depends_on:
      - redis
    ports:
     - "8000:8000"
    networks:
      - mynetwork
    environment:
      - REDIS_HOST=redis

networks:
  mynetwork:
    driver: bridge
    driver_opts:
      "com.docker.network.bridge.name": "docker0"
```

## 命令
