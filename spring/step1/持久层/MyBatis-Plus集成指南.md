# MyBatis-Plus 集成指南

## 概述

MyBatis-Plus 是一个 MyBatis 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

## 集成步骤

### 1. 添加依赖

在 `pom.xml` 中添加 MyBatis-Plus 依赖：

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.1</version>
</dependency>

<!-- MySQL 驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
    <scope>runtime</scope>
</dependency>
```

### 2. 配置数据源

在 `application.yml` 中配置数据库连接：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo_db?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
  mapper-locations: classpath*:/mapper/**/*.xml
```

### 3. 启动类配置

在 Spring Boot 启动类上添加 `@MapperScan` 注解：

```java
@SpringBootApplication
// 单个路径
@MapperScan("com.example.demo.mapper")
// 多个路径
// @MapperScan(basePackages = {"com.example.demo1.**.db.mapper", "com.example.demo2.**.db.mapper"})
public class Application {
    //...
}
```

## 代码示例

### 1. 实体类

```java
package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    // ...
}
```

### 2. Mapper 接口

```java
package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    // BaseMapper 已经提供了基本的 CRUD 方法
    // 如果需要自定义 SQL，可以在这里添加方法
}
```

### 3. Service 层

```java
package com.example.demo.service;
import com.example.demo.entity.User;
import java.util.List;

public interface UserService {
    User saveUser(User user);
    //...
}
```

```java
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public User saveUser(User user) {
        // ...
        userMapper.insert(user);
        // userMapper.updateById(user);
        // userMapper.selectById(id);
        return user;
    }
    // ...
}
```

### 4. Controller 层

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
}
```

## 常用操作示例

### 1. 基本 CRUD 操作

```java
// 插入
User user = new User();
user.setUsername("张三");
user.setEmail("zhangsan@example.com");
userMapper.insert(user);

// 根据 ID 查询
User user = userMapper.selectById(1L);

// 根据条件查询
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.eq("username", "张三");
User user = userMapper.selectOne(wrapper);

// 查询所有
List<User> users = userMapper.selectList(new QueryWrapper<>());

// 更新
User user = userMapper.selectById(1L);
user.setEmail("newemail@example.com");
userMapper.updateById(user);

// 删除
userMapper.deleteById(1L);
```

### 2. 条件查询

```java
// 使用 QueryWrapper 构建复杂条件
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.like("username", "张")
       .ge("age", 18)
       .orderByDesc("create_time");
List<User> users = userMapper.selectList(wrapper);

UpdateWrapper<User> wrapper1 = new UpdateWrapper<User>();
wrapper1
    .eq("id",id)
    .set("update_time",LocalDateTime.now());
    userMapper.update(null, wrapper1);

// 
```

### 3. 分页查询

```java
// 分页查询
Page<User> page = new Page<>(1, 10); // 第1页，每页10条
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.orderByDesc("create_time");
IPage<User> userPage = userMapper.selectPage(page, wrapper);
```

## 注意事项

1. 确保实体类与数据库表字段一一对应
2. 使用 `@TableName` 注解指定表名（如果表名与实体类名不一致）
3. 使用 `@TableId` 注解标记主键字段
4. 使用 `@TableField` 注解标记字段（如果字段名与数据库列名不一致）
5. 逻辑删除字段需要使用 `@TableLogic` 注解



## 优势

- **无侵入**：只做增强不做改变，引入它不会对现有工程产生影响
- **损耗小**：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作
- **强大的 CRUD 操作**：内置通用 Mapper，通过少量配置即可实现单表大部分 CRUD 操作
- **支持 Lambda 形式调用**：通过 Lambda 表达式，方便的编写各类查询条件
- **支持主键自动生成**：支持多达 4 种主键策略，可自由配置
- **支持 ActiveRecord 模式**：支持 ActiveRecord 形式调用，实体类只需继承 Model 类即可进行强大的 CRUD 操作
- **支持自定义全局通用操作**：支持全局通用方法注入
- **内置代码生成器**：采用代码或者 Maven 插件可快速生成 Mapper、Model、Service、Controller 层代码
- **内置分页插件**：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询