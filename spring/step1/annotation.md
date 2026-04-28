## annotation 注解

#### @Autowired
  
  Spring框架中的依赖注入注解，用于自动装配bean。当Spring容器发现这个注解时，会自动查找匹配的bean实例并注入到被注解的字段、构造函数或方法中。
    
  在Spring框架中，以下注解的类会被自动注入到Spring容器中：

  - @Component：通用组件注解，任何类都可以使用
  - @Service：用于服务层组件，语义上表示业务逻辑服务
  - @Repository：用于数据访问层组件，通常与数据库交互
  - @Controller：用于控制层组件，处理Web请求
  - @Configuration：配置类注解，通常与@Bean一起使用定义bean
  - @RestController：结合了@Controller和@ResponseBody，用于RESTful API
  - @ConfigurationProperties：用于绑定配置文件中的属性