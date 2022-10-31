## Mysql 基础

### 常用
```
// 登录数据库
mysql -uroot -p123456;
// 登录远程数据库
// ip 端口 账户 密码 database
mysql -hxx.xx.xx.xx -Pxxxx -uxxxx -pxxxx  xxxx
// 查看所有数据库列表
show databases;
// 进入到某数据库
use xxxx;
// 查看当前所属数据库
select database(); 
// 查看所有表
show tables;
// 查看表的行总数
select count(*) from table;
// 按f_xxx倒序查询10个
select * from t_xxx order by f_xxx  limit 10;
// 查看表结构
desc xxx_table; 
```

### 数据库
```
// 查看所有的数据库
SHOW DATABASES ;
// 创建一个数据库
CREATE DATABASE k;
// 删除一个数据库
DROP DATABASE k;
// 使用这个数据库
USE k;
// 数据库备份
mysqldump -u root -p db_name > file.sql
mysqldump -u root -p db_name table_name > file.sql
// 数据库还原
mysql -u root -p < C:\file.sql
```

### 表
```
// 查看所有的表
SHOW TABLES ;
// 创建一个表
CREATE TABLE n(id INT, name VARCHAR(10));
CREATE TABLE m(id INT, name VARCHAR(10), PRIMARY KEY (id), FOREIGN KEY (id) REFERENCES n(id), UNIQUE (name));
CREATE TABLE m(id INT, name VARCHAR(10));
// 直接将查询结果导入或复制到新创建的表
CREATE TABLE n SELECT * FROM m;
// 新创建的表与一个存在的表的数据结构类似
CREATE TABLE m LIKE n;
// 创建一个临时表
// 临时表将在你连接MySQL期间存在。当断开连接时，MySQL将自动删除表并释放所用的空间。也可手动删除。
CREATE TEMPORARY TABLE l(id INT, name VARCHAR(10));
// 直接将查询结果导入或复制到新创建的临时表
CREATE TEMPORARY TABLE tt SELECT * FROM n;
// 删除一个存在表
DROP TABLE IF EXISTS m;
// 更改存在表的名称
ALTER TABLE n RENAME m;
RENAME TABLE n TO m;
// 查看表的结构(以下五条语句效果相同）
DESC n;   // 因为简单，所以建议使用
DESCRIBE n;
SHOW COLUMNS IN n;
SHOW COLUMNS FROM n;
EXPLAIN n;
// 查看表的创建语句
SHOW CREATE TABLE n;
ALTER TABLE n ADD age VARCHAR(2) ;
// 删除字段
ALTER TABLE n DROP age;
// 更改字段属性和属性
ALTER TABLE n CHANGE age a INT;
// 只更改字段属性
ALTER TABLE n MODIFY age VARCHAR(7);
// 增加数据
INSERT INTO n VALUES (1, 'tom', '23'), (2, 'john', '22');
INSERT INTO n SELECT * FROM n;  // 把数据复制一遍重新插入
// 删除数据
DELETE FROM n WHERE id = 2;
// 更改数据
UPDATE n SET name = 'tom' WHERE id = 2;
// 数据查找
SELECT * FROM n WHERE name LIKE '%h%';
// 数据排序(反序)
SELECT * FROM n ORDER BY name, id DESC ;
```

### 键 
```
// 添加主键
ALTER TABLE n ADD PRIMARY KEY (id);
ALTER TABLE n ADD CONSTRAINT pk_n PRIMARY KEY (id);   // 主键只有一个，所以定义键名似乎也没有什么用
// 删除主键
ALTER TABLE n DROP PRIMARY KEY ;
// 添加外键
ALTER TABLE m ADD FOREIGN KEY (id) REFERENCES n(id);    // 自动生成键名m_ibfk_1
ALTER TABLE m ADD CONSTRAINT fk_id FOREIGN KEY (id) REFERENCES n(id);   // 使用定义的键名fk_id
// 删除外键
ALTER TABLE m DROP FOREIGN KEY `fk_id`;
// 修改外键
ALTER TABLE m DROP FOREIGN KEY `fk_id`, ADD CONSTRAINT fk_id2 FOREIGN KEY (id) REFERENCES n(id);    // 删除之后从新建
// 添加唯一键
ALTER TABLE n ADD UNIQUE (name);
ALTER TABLE n ADD UNIQUE u_name (name);
ALTER TABLE n ADD UNIQUE INDEX u_name (name);
ALTER TABLE n ADD CONSTRAINT u_name UNIQUE (name);
CREATE UNIQUE INDEX u_name ON n(name);
// 添加索引
ALTER TABLE n ADD INDEX (age);
ALTER TABLE n ADD INDEX i_age (age);
CREATE INDEX i_age ON n(age);
// 删除索引或唯一键
DROP INDEX u_name ON n;
DROP INDEX i_age ON n;
```

### 视图 
```
// 创建视图
CREATE VIEW v AS SELECT id, name FROM n;
CREATE VIEW v(id, name) AS SELECT id, name FROM n;
// 查看视图(与表操作类似)
SELECT * FROM v;
DESC v;
// 查看创建视图语句
SHOW CREATE VIEW v;
// 更改视图
CREATE OR REPLACE VIEW v AS SELECT name, age FROM n;
ALTER VIEW v AS SELECT name FROM n ;
// 删除视图
DROP VIEW IF EXISTS v;
```

### 链接
```
// 内联接
SELECT * FROM m INNER JOIN n ON m.id = n.id;
// 左外联接
SELECT * FROM m LEFT JOIN n ON m.id = n.id;
// 右外联接
SELECT * FROM m RIGHT JOIN n ON m.id = n.id;
// 交叉联接
SELECT * FROM m CROSS JOIN n;   // 标准写法
SELECT * FROM m, n;
// 类似全连接full join的联接用法
SELECT id,name FROM m
UNION
SELECT id,name FROM n;
```

### 函数相关
```
// 聚合函数
SELECT count(id) AS total FROM n;   // 总数
SELECT sum(age) AS all_age FROM n;   // 总和
SELECT avg(age) AS all_age FROM n;   // 平均值
SELECT max(age) AS all_age FROM n;   // 最大值
SELECT min(age) AS all_age FROM n;   // 最小值
// 数学函数
SELECT abs(-5);   // 绝对值
SELECT bin(15), oct(15), hex(15);   // 二进制，八进制，十六进制
SELECT pi();   // 圆周率3.141593
SELECT ceil(5.5);   // 大于x的最小整数值6
SELECT floor(5.5);   // 小于x的最大整数值5
SELECT greatest(3,1,4,1,5,9,2,6);   // 返回集合中最大的值9
SELECT least(3,1,4,1,5,9,2,6);    // 返回集合中最小的值1
SELECT mod(5,3);    // 余数2
SELECT rand();    // 返回０到１内的随机值，每次不一样
SELECT rand(5);   // 提供一个参数(种子)使RAND()随机数生成器生成一个指定的值。
SELECT round(1415.1415);   // 四舍五入1415
SELECT round(1415.1415, 3);   // 四舍五入三位数1415.142
SELECT round(1415.1415, -1);    // 四舍五入整数位数1420
SELECT truncate(1415.1415, 3);    // 截短为3位小数1415.141
SELECT truncate(1415.1415, -1);   // 截短为-1位小数1410
SELECT sign(-5);    // 符号的值负数-1
SELECT sign(5);    // 符号的值正数1
SELECT sqrt(9);   // 平方根3
SELECT sqrt(9);   // 平方根3
// 字符串函数
SELECT concat('a', 'p', 'p', 'le');   // 连接字符串-apple
SELECT concat_ws(',', 'a', 'p', 'p', 'le');   // 连接用','分割字符串-a,p,p,le
SELECT insert('chinese', 3, 2, 'IN');    // 将字符串'chinese'从3位置开始的2个字符替换为'IN'-chINese
SELECT left('chinese', 4);   // 返回字符串'chinese'左边的4个字符-chin
SELECT right('chinese', 3);   // 返回字符串'chinese'右边的3个字符-ese
SELECT substring('chinese', 3);   // 返回字符串'chinese'第三个字符之后的子字符串-inese
SELECT substring('chinese', -3);   // 返回字符串'chinese'倒数第三个字符之后的子字符串-ese
SELECT substring('chinese', 3, 2);   // 返回字符串'chinese'第三个字符之后的两个字符-in
SELECT trim(' chinese ');    // 切割字符串' chinese '两边的空字符-'chinese'
SELECT ltrim(' chinese ');    // 切割字符串' chinese '两边的空字符-'chinese '
SELECT rtrim(' chinese ');    // 切割字符串' chinese '两边的空字符-' chinese'
SELECT repeat('boy', 3);    // 重复字符'boy'三次-'boyboyboy'
SELECT reverse('chinese');    // 反向排序-'esenihc'
SELECT length('chinese');   // 返回字符串的长度-7
SELECT upper('chINese'), lower('chINese');    // 大写小写 CHINESE    chinese
SELECT ucase('chINese'), lcase('chINese');    // 大写小写 CHINESE    chinese
SELECT position('i' IN 'chinese');    // 返回'i'在'chinese'的第一个位置-3
SELECT position('e' IN 'chinese');    // 返回'i'在'chinese'的第一个位置-5
SELECT strcmp('abc', 'abd');    // 比较字符串，第一个参数小于第二个返回负数- -1
SELECT strcmp('abc', 'abb');    // 比较字符串，第一个参数大于第二个返回正数- 1
// 时间函数
SELECT current_date, current_time, now();    // 2018-01-13   12:33:43    2018-01-13 12:33:43
SELECT hour(current_time), minute(current_time), second(current_time);    // 12  31   34
SELECT year(current_date), month(current_date), week(current_date);   // 2018    1   1
SELECT quarter(current_date);   // 1
SELECT monthname(current_date), dayname(current_date);   // January  Saturday
SELECT dayofweek(current_date), dayofmonth(current_date), dayofyear(current_date);    // 7   13  13
// 控制流函数
SELECT if(3>2, 't', 'f'), if(3<2, 't', 'f');    // t f
SELECT ifnull(NULL, 't'), ifnull(2, 't');    // t 2
SELECT isnull(1), isnull(1/0);    // 0 1 是null返回1，不是null返回0
SELECT nullif('a', 'a'), nullif('a', 'b');    // null a 参数相同或成立返回null，不同或不成立则返回第一个参数
SELECT CASE 2
       WHEN 1 THEN 'first'
       WHEN 2 THEN 'second'
       WHEN 3 THEN 'third'
       ELSE 'other'
       END ;     // second
// 系统信息函数
SELECT database();    // 当前数据库名-test
SELECT connection_id();   // 当前用户id-306
SELECT user();    // 当前用户-root@localhost
SELECT version();   // 当前mysql版本
SELECT found_rows();    // 返回上次查询的检索行数
```

### 用户相关
```
// 增加用户
CREATE USER 'test'@'localhost' IDENTIFIED BY 'test';
INSERT INTO mysql.user(Host, User, Password) VALUES ('localhost', 'test', Password('test'));    // 在用户表中插入用户信息，直接操作User表不推荐
// 删除用户
DROP USER 'test'@'localhost';
DELETE FROM mysql.user WHERE User='test' AND Host='localhost';
FLUSH PRIVILEGES ;
// 更改用户密码
SET PASSWORD FOR 'test'@'localhost' = PASSWORD('test');
UPDATE mysql.user SET Password=Password('t') WHERE User='test' AND Host='localhost';
FLUSH PRIVILEGES ;
// 用户授权
GRANT ALL PRIVILEGES ON *.* TO test@localhost IDENTIFIED BY 'test';
// 授予用'test'密码登陆成功的test@localhost用户操作所有数据库的所有表的所有的权限
FLUSH PRIVILEGES ;   // 刷新系统权限表,使授予权限生效
// 撤销用户授权
REVOKE DELETE ON *.* FROM 'test'@'localhost';   // 取消该用户的删除权限
```

### 存储过程
```
// 创建存储过程
DELIMITER //    // 无参数
CREATE PROCEDURE getDates()
  BEGIN
    SELECT * FROM test ;
  END //
CREATE PROCEDURE getDates_2(IN id INT)    // in参数
  BEGIN
    SELECT * FROM test WHERE a = id;
  END //
CREATE PROCEDURE getDates_3(OUT sum INT)    // out参数
  BEGIN
    SET sum = (SELECT count(*) FROM test);
  END //
CREATE PROCEDURE getDates_4(INOUT i INT)    // inout参数
  BEGIN
    SET i = i + 1;
  END //
DELIMITER ;
// 删除存储过程
DROP PROCEDURE IF EXISTS getDates;
// 修改存储过程的特性
ALTER PROCEDURE getDates MODIFIES SQL DATA ;
// 修改存储过程语句（删除再重建）略
// 查看存储过程
SHOW PROCEDURE STATUS LIKE 'getDates';    // 状态
SHOW CREATE PROCEDURE getDates_3;   // 语句
// 调用存储过程
CALL getDates();
CALL getDates_2(1);
CALL getDates_3(@s);
SELECT @s;
SET @i = 1;
CALL getDates_4(@i);
SELECT @i;    // @i = 2
```