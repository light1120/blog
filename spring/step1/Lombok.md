# Java Lombok 注解使用指南

## 概述

Lombok 是一个 Java 库，通过注解自动生成常见代码（如 getter/setter、构造函数、toString 等），减少样板代码，提高开发效率。本文档详细介绍 Lombok 常用注解、组合用法及最佳实践。

## 一、核心注解一览

|     |     |     |
| --- | --- | --- |
| 注解  | 作用  | 生成内容 |
| `@Data` | 综合注解 | getter + setter + toString + equals + hashCode + RequiredArgsConstructor |
| `@Getter/@Setter` | 生成访问器 | 所有字段的 getter/setter 方法 |
| `@ToString` | 生成 toString | 包含所有字段的字符串表示 |
| `@EqualsAndHashCode` | 生成相等性方法 | equals() 和 hashCode() |
| `@NoArgsConstructor` | 无参构造函数 | 无参数的构造器 |
| `@AllArgsConstructor` | 全参构造函数 | 包含所有字段的构造器 |
| `@RequiredArgsConstructor` | 必需参数构造函数 | final 字段 + @NonNull 字段的构造器 |
| `@Builder` | 建造者模式 | 链式构建对象 |
| `@Slf4j` | 日志支持 | 自动生成 log 日志对象 |
| `@Value` | 不可变类 | final 字段 + getter + 全参构造 + equals/hashCode/toString |
| `@SneakyThrows` | 异常处理 | 自动抛出受检异常，无需显式 try-catch |

## 二、常用注解详解

### 1\. `@Data` — 最常用的综合注解

```java
@Data
public class User {
    private Long id;
    private String name;
    private Integer age;
}
// 自动生成：所有字段的 getter/setter、toString、equals、hashCode、RequiredArgsConstructor
```

### 2\. `@Getter` / `@Setter` — 精细控制

```java
public class User {
    @Getter @Setter private String name;      // 单字段控制
    @Getter private String readOnlyField;     // 只读
    @Setter(AccessLevel.PRIVATE) private String secret; // 私有 setter
}
```

### 3\. `@Builder` — 链式构建

```java
@Builder
public class User {
    private String name;
    private Integer age;
}
// 使用：User user = User.builder().name("张三").age(25).build();
```

### 4\. `@Slf4j` — 日志简化

```java
@Slf4j
public class UserService {
    public void process() {
        log.info("处理中...");  // 无需手动声明 Logger
    }
}
```

### 5\. `@NoArgsConstructor` / `@AllArgsConstructor` — 构造函数

```java
@NoArgsConstructor   // 生成无参构造
@AllArgsConstructor  // 生成全参构造
public class User {
    private String name;
    private Integer age;
}
```

### 6\. `@Value` — 不可变类

```java
@Value
public class Config {
    String host;
    int port;
}
// 所有字段变为 final，只生成 getter，无 setter
```

## 三、字段级别注解

|     |     |
| --- | --- |
| 注解  | 作用  |
| `@NonNull` | 空值检查，自动在构造函数/setter 中添加 null 检查 |
| `@Cleanup` | 自动调用 close()，用于资源管理（如流） |

```java
public class Example {
    @NonNull private String name;  // 构造时自动检查 null
    
    public void readFile() throws IOException {
        @Cleanup InputStream in = new FileInputStream("file.txt");
        // 自动调用 in.close()
    }
}
```

## 四、常用注解组合

### 1\. POJO/DTO 标准组合（最常用）

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
}
```

**适用场景**：数据传输对象、普通 Java Bean

**生成内容**：

- 所有字段的 getter/setter

- toString、equals、hashCode

- 无参构造 + 全参构造

### 2\. 实体类组合（JPA/MyBatis）

```java
@Entity
@Table(name = "t_user")
@Getter
@Setter
@NoArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
}
```

**为什么不用** `@Data`**？**

- JPA 实体的 `equals/hashCode` 可能导致问题（延迟加载、代理对象）

- `toString` 可能触发懒加载，导致 N+1 查询或异常

### 3\. Builder 模式组合（推荐）

```java
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String name;
    private Integer age;
    private String email;
}

// 使用方式
UserRequest request = UserRequest.builder()
    .name("张三")
    .age(25)
    .email("zhangsan@example.com")
    .build();
```

**注意**：`@Builder` 需要配合 `@AllArgsConstructor`，否则编译报错

### 4\. 不可变对象组合

```java
@Value
@Builder
public class Config {
    String host;
    int port;
    String environment;
}

// 使用方式（所有字段只读）
Config config = Config.builder()
    .host("localhost")
    .port(8080)
    .environment("dev")
    .build();
// config.setHost("xxx") → 不存在此方法
```

**适用场景**：配置类、常量类、线程安全对象

### 5\. 日志类组合

```java
@Slf4j
@Service
public class UserService {
    
    public void process(String userId) {
        log.info("开始处理用户: {}", userId);
        try {
            // 业务逻辑
            log.debug("处理详情...");
        } catch (Exception e) {
            log.error("处理失败: {}", userId, e);
        }
    }
}
```

**其他日志注解**：

- `@Log` → `log`

- `@Log4j` → `log`

- `@Log4j2` → `log`

- `@CommonsLog` → `log`

## 五、场景化最佳实践

### 场景一：API 响应对象

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private Integer code;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .code(200)
            .message("success")
            .data(data)
            .build();
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        return ApiResponse.<T>builder()
            .code(code)
            .message(message)
            .build();
    }
}
```

### 场景二：请求参数对象

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {
    
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @Min(0) @Max(150)
    private Integer age;
}
```

### 场景三：配置属性类

```java
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    
    private String name;
    private String version;
    private Database database = new Database();
    
    @Getter @Setter
    public static class Database {
        private String url;
        private String username;
        private String password;
    }
}
```

### 场景四：工具类

```java
@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)  // 私有构造，防止实例化
public class StringUtils {
    
    public static boolean isEmpty(String str) {
        return str == null || str.isEmpty();
    }
    
    public static String trim(String str) {
        return str == null ? null : str.trim();
    }
}
```

## 六、常见陷阱与避坑

### 1\. `@Data` + JPA 实体 = 潜在问题

```java
// ❌ 不推荐
@Data
@Entity
public class User {
    @Id
    private Long id;
    @OneToMany
    private List<Order> orders;  // toString 可能触发懒加载！
}

// ✅ 推荐
@Getter
@Setter
@Entity
public class User {
    @Id
    private Long id;
    @ToString.Exclude  // 如果必须用 @Data，排除关联字段
    @OneToMany
    private List<Order> orders;
}
```

### 2\. `@Builder` 默认值问题

```java
// ❌ 默认值不生效
@Builder
public class Config {
    private int timeout = 5000;  // Builder 模式下会被覆盖为 0
}

// ✅ 使用 @Builder.Default
@Builder
public class Config {
    @Builder.Default
    private int timeout = 5000;  // 正确设置默认值
}
```

### 3\. `@EqualsAndHashCode` 与继承

```java
// ❌ 可能导致问题
@EqualsAndHashCode
public class Child extends Parent {
    private String childField;
}

// ✅ 正确做法
@EqualsAndHashCode(callSuper = true)  // 包含父类字段
public class Child extends Parent {
    private String childField;
}
```

## 七、注解组合速查表

|     |     |     |
| --- | --- | --- |
| 场景  | 推荐组合 | 说明  |
| 普通 DTO | `@Data` | 一键搞定 |
| JPA 实体 | `@Getter` + `@Setter` + `@NoArgsConstructor` | 避免 equals/hashCode 问题 |
| 构建复杂对象 | `@Builder` + `@AllArgsConstructor` + `@NoArgsConstructor` | 兼顾 Builder 和无参构造 |
| 不可变对象 | `@Value` + `@Builder` | 线程安全 |
| 服务类 | `@Slf4j` + `@Service` | 日志支持 |
| 工具类 | `@NoArgsConstructor(access = PRIVATE)` | 防止实例化 |
| 配置类 | `@Getter` + `@Setter` + `@ConfigurationProperties` | 属性绑定 |

## 八、使用注意事项

1. **IDE 插件**：需安装 Lombok 插件，否则 IDE 会报红

2. **编译依赖**：Maven/Gradle 需添加依赖

3. **慎用** `@Data`：JPA 实体类建议只用 `@Getter/@Setter`，避免 equals/hashCode 问题

4. `@Builder` **与无参构造**：同时使用时需加 `@NoArgsConstructor` 和 `@AllArgsConstructor`
<br />