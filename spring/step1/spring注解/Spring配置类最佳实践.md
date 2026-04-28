# Spring 配置类与配置属性最佳实践指南

## 1. 概述

本文档详细介绍 Spring Boot 中配置类的设计模式、相关注解的使用方法以及最佳实践，帮助开发者编写高质量、可维护的配置类。

## 2. 核心注解解析

### 2.1 @ConfigurationProperties

**作用**：将配置文件中的属性批量绑定到 Java Bean 的字段上。

**特点**：
- 支持复杂类型（Map、List、嵌套对象）
- 类型安全
- 支持松散绑定（如 `my-property` 可以绑定到 `myProperty`）
- 支持 JSR-303 验证

**使用示例**：
```java
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private int port;
    private Map<String, String> servers;
    private List<String> features;
    // getters and setters
}
```

**配置文件**：
```yaml
app:
  name: my-application
  port: 8080
  servers:
    db: localhost:3306
    cache: localhost:6379
  features:
    - auth
    - logging
    - monitoring
```

### 2.2 @Value

**作用**：注入单个配置值，支持 SpEL 表达式。

**特点**：
- 功能强大，支持复杂表达式
- 不类型安全
- 适用于简单值

**使用示例**：
```java
@Component
public class SimpleConfig {
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.timeout:5000}") // 默认值
    private int timeout;
    
    @Value("#{systemProperties['user.region']}")
    private String region;
}
```

### 2.3 @Configuration

**作用**：标记一个类为配置类，相当于 XML 配置文件。

**使用示例**：
```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

### 2.4 Lombok 注解

- **@Getter/@Setter**：自动生成 getter/setter 方法
- **@Data**：生成 getter、setter、toString、equals、hashCode
- **@NoArgsConstructor/@AllArgsConstructor**：生成构造函数

## 3. 配置类设计模式

### 3.1 基本配置类

```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    private String name;
    private int port;
    private boolean enabled;
}
```

### 3.2 嵌套配置类

```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    private String name;
    private Database database;
    private Security security;
    
    @Getter
    @Setter
    public static class Database {
        private String url;
        private String username;
        private String password;
    }
    
    @Getter
    @Setter
    public static class Security {
        private boolean enabled;
        private String secretKey;
    }
}
```

### 3.3 集合配置

```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    private List<String> servers;
    private Map<String, String> endpoints;
    private Map<String, ServerConfig> serverConfigs;
    
    @Getter
    @Setter
    public static class ServerConfig {
        private String host;
        private int port;
    }
}
```

## 4. 配置类最佳实践

### 4.1 统一的注解使用

**推荐**：
```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    private String name;
    private int port;
    private Map<String, String> servers;
}
```

**不推荐**：
```java
@Component
public class AppProperties {
    @Value("${app.name}")
    private String name;
    
    @Setter
    private Map<String, String> servers;
}
```

### 4.2 属性访问控制

- 所有属性保持 `private`
- 通过专门的业务方法提供受控访问
- 避免直接暴露内部数据结构

```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    private Map<String, String> serverMap;
    
    // 提供专门的业务方法
    public String getServerUrl(String serverName) {
        return serverMap.get(serverName);
    }
    
    public boolean isValidServer(String serverName) {
        return serverMap.containsKey(serverName);
    }
}
```

### 4.3 添加验证

```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
@Validated
public class AppProperties {
    @NotBlank
    private String name;
    
    @Min(1024)
    @Max(65535)
    private int port;
    
    @NotEmpty
    private Map<String, @NotBlank String> servers;
}
```

### 4.4 使用构造函数注入（可选）

```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
public class AppProperties {
    private final String name;
    private final int port;
    
    public AppProperties(String name, int port) {
        this.name = name;
        this.port = port;
    }
}
```

## 5. 配置文件组织

### 5.1 多环境配置

```
src/main/resources/
├── application.yml          # 默认配置
├── application-dev.yml      # 开发环境
├── application-test.yml     # 测试环境
├── application-prod.yml     # 生产环境
└── application-local.yml    # 本地开发
```

### 5.2 配置分层

```yaml
# application.yml
spring:
  profiles:
    active: dev
    
---
# application-dev.yml
app:
  name: my-app-dev
  port: 8080
  
database:
  url: jdbc:mysql://localhost:3306/dev_db
  username: dev_user
  
---
# application-prod.yml
app:
  name: my-app-prod
  port: 80
  
database:
  url: jdbc:mysql://prod-server:3306/prod_db
  username: prod_user
```

## 6. 高级用法

### 6.1 条件化配置

```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
@ConditionalOnProperty(name = "app.feature.enabled", havingValue = "true")
public class FeatureProperties {
    private String name;
    private String version;
}
```

### 6.2 配置刷新

```java
@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
@RefreshScope
public class DynamicProperties {
    private String configValue;
}
```

### 6.3 配置元数据

创建 `META-INF/spring-configuration-metadata.json` 提供 IDE 支持：

```json
{
  "groups": [
    {
      "name": "app",
      "type": "com.example.AppProperties",
      "sourceType": "com.example.AppProperties"
    }
  ],
  "properties": [
    {
      "name": "app.name",
      "type": "java.lang.String",
      "description": "应用名称",
      "sourceType": "com.example.AppProperties"
    }
  ]
}
```

## 7. 常见问题与解决方案

### 7.1 配置不生效

**问题**：配置类中的属性没有被正确绑定。

**解决方案**：
1. 确保类上有 `@Component` 或 `@Configuration` 注解
2. 确保有 `@ConfigurationProperties` 注解且 prefix 正确
3. 确保配置文件格式正确
4. 检查是否有拼写错误

### 7.2 类型转换错误

**问题**：配置文件中的值无法转换为目标类型。

**解决方案**：
1. 使用合适的类型（如 Duration、DataSize）
2. 自定义转换器
3. 使用字符串类型并在 getter 中进行转换

```java
private String timeout;

public Duration getTimeout() {
    return Duration.parse(timeout);
}
```

### 7.3 循环依赖

**问题**：配置类之间相互依赖导致循环依赖。

**解决方案**：
1. 重新设计配置结构
2. 使用 `@Lazy` 注解
3. 将配置分解为更小的、独立的配置类

## 8. 总结

- 使用 `@ConfigurationProperties` 处理复杂配置
- 使用 `@Value` 处理简单值
- 保持配置类设计的一致性
- 遵循最小权限原则
- 提供专门的业务方法而不是直接暴露属性
- 添加适当的验证
- 合理组织配置文件结构

遵循这些最佳实践，可以编写出高质量、易维护的 Spring Boot 配置类。