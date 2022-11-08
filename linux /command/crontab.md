## crontab

### 1，crontab 基础
- crond : crond 是linux下一个周期性执行某个任务的守护进程
- crontab 命令 : 用户控制计划任务的命令
- crontab 文件 : 编写计划任务，没一行代表一个任务
    - 格式：
        minute hour day month week user command
        ```
        .---------------- minute (0 - 59)
        |  .------------- hour (0 - 23)
        |  |  .---------- day of month (1 - 31)
        |  |  |  .------- month (1 - 12) OR jan,feb..
        |  |  |  |  .---- day of week (0 - 6)
        |  |  |  |  |
        *  *  *  *  * user-name  command 
        ```
    - 特殊字符
        - 星号（*）：代表所有可能的值
        - 逗号（,）：指定一个列表范围，例如“1,2,5,7,8,9”
        - 中杠（-）：指定一个连续范围，例如“2-6”
        - 正斜线（/）：指定时间的间隔频率，例如“0-23/2”表示每两小时执行一次。同时正斜线可以和星号一起使用，例如*/10，如果用在minute字段，表示每十分钟执行一次。
- crontab 用法： 
    - crontab -u : root身份可以使用，创建删除任务
    - crontab -l : 查看当前用户下的任务
    - crontab -e : 编辑任务，增加，删除
    - crontab -r : 清空所有的任务

### 2，系统的配置文件
一般来说，crond 默认有三个地方会有执行脚本配置文件，他们分别是：
- /etc/crontab : 系统配置文件
- /etc/cron.d/* : 系统配置文件
- /var/spool/cron/* : 用户自己配置文件，就是`crontab -e`存储内容

以cron进程会每分钟去读取一次 /etc/crontab 与 /var/spool/cron 里面的数据内容，所以我们只需要编辑内容然后保持，cron就会自动读取然后执行。修改完内容之后最好重启下`systemctl restart crond`避免没有加载最新内容

### 3，Tips
- 一般就用`crontab -e`来处理任务; 例如`* * * * *  systemctl start test.service` 可以每分钟用systemctl去执行test.service达到systemd timer的效果; 其实就是在`/var/spool/cron`创建了个文件, 打开root文件就看到crontab -e 输入的内容
-  千万不要使用`crontab -r`, 命令直接清空所以任务，容易误操作，建议使用`crontab -e`
- 系统资源分配不均：例如有5个任务都是每隔10分钟去执行其他的程序，如果设置成`*/10 * * * *`那么会在某个时间段系统会特别忙；建议设置成`1,11,21,31,41,51 * * * *`、`2,12,22,32,42,52 * * * *`、`3,13,23,33,43,53 * * * *`、`4,14,24,34,44,54 * * * *`、`5,15,25,35,45,55 * * * *`。即达到效果，也使得系统在某分钟也不繁忙