# 配置注解

## @Configuration

这是一个Spring框架的核心注解，用于标识一个类为**配置类**。告诉Spring容器这个类包含Bean的定义和配置信息，允许在该类中使用@Bean注解定义Bean

作用：在Spring Boot应用启动时，Spring会自动扫描并加载这些**配置类**，相当于传统的XML配置文件，但以Java代码的方式实现

类中有多种值
- 静态值（直接在代码中写死的值）
- 从application.yml/application.properties中获取的动态值
- 通过@Value、@ConfigurationProperties等注解注入的值
- 通过@Bean方法动态生成的值

## @Value

用于注入配置属性值。从配置文件（如application.yml或application.properties）中读取配置值
支持SpEL（Spring表达式语言）,可以将配置值注入到类的字段、方法参数或构造函数参数中

```java
@Value("${配置键名}")，其中${}中的内容对应配置文件中的键名。

@Value("${test.api-key}")：  从配置文件中读取api-key的值
@Value("${test.merchant-account}")：从配置文件中读取merchant-account的值
```

## 配置文件

不同文件路径可以存在多个文件的 yml properties ，不冲突，是补充关系。 不同路径有优先级。

- application.yml  : yml 格式
- application.properties : key=value 格式

### 配置文件的加载机制

application.yml/application.properties在Spring启动时：

- Spring Boot启动时自动加载这些配置文件
- 解析所有配置项并创建一个全局的Environment实例
- 这个Environment实例包含了所有的配置属性

@Value的工作机制：

- 当Spring创建带有@Value注解的Bean时
- 会从Environment实例中查找对应的配置值
- 将找到的值注入到被@Value注解的字段中

完整机制

- Spring Boot启动 → 加载application.yml → 创建Environment实例
- 扫描到@Configuration类 → 创建Config Bean
- 处理@Value注解 → 从Environment中查找对应值 → 注入到字段
- 最终创建Config实例包含了从配置文件读取的值

## 其他配置，其优先级

- 命令行参数
- 第三方配置服务（Apollo/Nacos）
- application-{profile}.yml
- application.yml
- 默认配置

## 第三方配置服务（Apollo）

- 1、添加 apollo 配置
```yml
<dependency>
    <groupId>com.ctrip.framework.apollo</groupId>
    <artifactId>apollo-client</artifactId>
    <version>1.9.1</version>
</dependency>
```
- 2、启用Apollo配置

```java
@SpringBootApplication
@EnableApolloConfig  // 启用Apollo配置
public class SpringBootApplication {
    public static void main(String[] args) {
}
```
- 3、Configuration类保持不变
- 4、复杂配置 @ConfigurationProperties(prefix = "order")
- 5、apollo 启动配置
```yml
app:
  id: test
apollo:
  cacheDir: /opt/data/
  cluster: default
  autoUpdateInjectedSpringProperties: ¨true
  bootstrap:
    enabled: true
    namespaces: application,redis,local-common,common
    eagerLoad:
      enabled: false
  config-service: http://xxx:xxxx
```