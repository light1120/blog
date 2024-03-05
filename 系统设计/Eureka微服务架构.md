# Eureka 微服务架构

#### Eureka 是什么

Eureka 是一个微服务框架，Eureka 由两个组件组成：Eureka 服务器和 Eureka 客户端

Eureka 服务器是一个服务注册中心。服务实例启动时，Eureka 客户端会向 Eureka 服务器注册服务信息，包括服务的 IP 地址、端口号、健康检查 URL 等。服务实例会定期向 Eureka 服务器发送心跳，以表明它们仍然可用。如果 Eureka 服务器在一段时间内没有收到服务实例的心跳，它会认为该服务实例已经下线，并从服务注册表中删除该服务实例。

Eureka Client 而是一个库，它会被集成到你的服务实例中。在服务实例启动时，Eureka Client 会被初始化，并向 Eureka Server 注册服务信息以及获取其他服务实例的信息。这些信息会被 Eureka Client 保存在内存中，用于服务发现和负载均衡。

#### 部署 Eureka 服务器

- 1、基于 Spring Boot 创建一个 Eureka 服务器 的应用程序，配置 cluster 配置文件

```
eureka:
  client:
    serviceUrl:
      defaultZone: http://eureka1:8761/eureka,http://eureka2:8762/eureka,http://eureka3:8763/eureka
```

- 2、分别启动 3 个服务实例

```
java -jar eureka-server-0.0.1-SNAPSHOT.jar --eureka.instance.hostname=eureka1 --server.port=8761
java -jar eureka-server-0.0.1-SNAPSHOT.jar --eureka.instance.hostname=eureka2 --server.port=8762
java -jar eureka-server-0.0.1-SNAPSHOT.jar --eureka.instance.hostname=eureka3 --server.port=8763
```

Eureka 本身没有主节点（master）的概念。所有 Eureka 服务器实例都是对等的，它们之间会相互复制服务注册表。这意味着，如果一个实例发生故障，其他实例仍然可以继续提供服务发现功能。这种对等的架构有助于提高 Eureka 集群的可用性和容错能力

#### 注册微服务

- 1、添加依赖
- 2、配置 eureka

```
eureka:
  client:
    serviceUrl:
      defaultZone: http://eureka1:8761/eureka,http://eureka2:8762/eureka,http://eureka3:8763/eureka
```

- 3、添加 @EnableEurekaClient

#### 客户端发起服务

- 1、在启动应用程序后，初始化客户端对下

```
const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
  instance: {
    app: 'node-service',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': 3000,
      '@enabled': 'true',
    },
    vipAddress: 'node-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    serviceUrls: {
      default: [
        'http://eureka1:8761/eureka',
        'http://eureka2:8762/eureka',
        'http://eureka3:8763/eureka',
      ],
    },
  },
});

client.start();
```

serviceUrls 这里也需要一个随机方法，实现一个简单的负载均衡，client 会请求列表中的第一台服务器，如果报错再依次请求，如果固定数组，那么第一台服务器会压力较大。这里可以使用随机，实现简单的负载均衡

- 2、 获取服务 ip / port

```
client.getInstancesByAppId('YOUR_SERVICE_NAME', (error, instances) => {
  if (error) {
    console.error('Error fetching instances:', error);
  } else {
    // 这里实现一个 queryRandom 随机方法，实现一个简单的负载均衡 。 实际返回的instances 也不是固定的
    const randomInstance =  queryRandom(instances);
  }
});
```

- 3、向微服务发起请求


