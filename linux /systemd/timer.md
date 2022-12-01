## Systemd timer

### 1，简介
[Timers](https://wiki.archlinux.org/title/systemd/Timers)是systemd是以.timer结尾的单元文件，通过.service文件或者事件来控制。可以作为一个定时的选择，替代cron。已经内置支持calender time事件和monotonic time 事件。

### 2，VS cron
- 自动生成日志，配合 Systemd 的日志工具，很方便除错
- 可以设置内存和 CPU 的使用额度，比如最多使用50%的 CPU
- 任务可以拆分，依赖其他 Systemd 单元，完成非常复杂的任务

### 3，参考：清除临时文件定时器
- `/usr/lib/systemd/system/systemd-tmpfiles-clean.timer`
```
#  This file is part of systemd.
#
#  systemd is free software; you can redistribute it and/or modify it
#  under the terms of the GNU Lesser General Public License as published by
#  the Free Software Foundation; either version 2.1 of the License, or
#  (at your option) any later version.

[Unit]
Description=Daily Cleanup of Temporary Directories
Documentation=man:tmpfiles.d(5) man:systemd-tmpfiles(8)

[Timer]
OnBootSec=15min
OnUnitActiveSec=1d
```
- `/usr/lib/systemd/system/systemd-tmpfiles-clean.service`
```
#  This file is part of systemd.
#
#  systemd is free software; you can redistribute it and/or modify it
#  under the terms of the GNU Lesser General Public License as published by
#  the Free Software Foundation; either version 2.1 of the License, or
#  (at your option) any later version.

[Unit]
Description=Cleanup of Temporary Directories
Documentation=man:tmpfiles.d(5) man:systemd-tmpfiles(8)
DefaultDependencies=no
Conflicts=shutdown.target
After=systemd-readahead-collect.service systemd-readahead-replay.service local-fs.target time-sync.target
Before=shutdown.target

[Service]
Type=oneshot
ExecStart=/usr/bin/systemd-tmpfiles --clean
IOSchedulingClass=idle
```

### 4，Timer Unit
以.timer结尾的systemd单元文件，主要有2种
- Realtime timers : 被calendar event触发，cron jobs 也是这个被日历事件出发。通过设置**OnCalendar**来定义，绝对时间来控制
- Monotonic timers : 在某个相对的时间点之后的时间段触发，设置以下参数
    - OnActiveSec ：定义定时器，相对于定时器本身触发
    - OnBootSec ：定义定时器，相对于机器启动
    - OnStartupSec ：定义定时器，相对于服务管理器启动，跟OnBootSec类似
    - OnUnitActiveSec：定义定时器，相对于定时器本身上次被触发
    - OnUnitInactiveSec ：定义定时器，相对于定时器本身上次被停用

例子：`test.timer`
```
[Unit]
Description=write hello to test.txt every minute

[Timer]
OnCalendar=*:0/1

[Install]
WantedBy=multi-user.target
```
说明：
- Unit：定义元数据
- Timer：Timer部分是定时器专属配置，查看[所有配置](https://man.archlinux.org/man/systemd.timer.5)；可以设置触发规则 realtime timers 或者 monotonic times。 Unit指定具体的执行service，不写就默认是同名 xxx.service
- Install：WantedBy `systemctl enable xxx.timer`和`systemctl disable xxx.timer`时将定时器归属到哪个target，查看[所有的target](https://man.archlinux.org/man/systemd.special.7)


### 5，Service unit
例子：`test.service`
```
[Unit]
Description=systemd scheduler for exec test.sh
[Service]
Type=simple
ExecStart=/bin/bash  /data/home/systemd-timer/test.sh
[Install]
WantedBy=multi-user.target
```
Service说明：
- Type: simple就是只设置了ExecStart选项
- ExecStart：systemctl start所要执行的命令
- ExecStop：systemctl stop所要执行的命令
- ExecReload：systemctl reload所要执行的命令
- 查看[Service所有的配置](https://man.archlinux.org/man/systemd.service.5)

附/data/home/systemd-timer/test.sh
```
//创建test.sh
$ touch test.sh

//写入具体任务执行代码
$ vi test.sh

#!/bin/sh
echo "This is only a test: $(date)" >> "/data/home/systemd-timer/test.txt"

//修改权限成可执行
$ chmod 777 test.sh
```

### 6，systemd
- systemd unit 文件目录
    - /lib/systemd/system：系统默认的单元文件
    - /etc/systemd/system：用户安装的软件的单元文件
    - /usr/lib/systemd/system：用户自己定义的单元文件
- systemd timer相关命令
    - $ sudo systemctl start test.timer : 启动定时器
    - $ sudo systemctl stop test.timer : 关闭定时器
    - $ sudo systemctl enable test.timer : 开启开机启动定时器
    - $ sudo systemctl disable test.timer : 关闭开机启动定时器
    - $ systemctl status test.timer : 查看定时器状态
    - $ systemctl list-timers : 查看运行中的定时器
    - $ systemctl daemon-reload : 运行中修改之后需要重启


### 7，tips
- `systemctl start test.service` : 通过启动service判断service是否如预期
- `systemctl list-timers` : 判断定时器是否运行
```
$ systemctl list-timers
NEXT  LEFT   LAST                         PASSED     UNIT         ACTIVATES
n/a   n/a    Mon 2022-11-07 22:43:39 CST  5min ago   test.timer   test.service
```
这里的n/a状态说明定时器没有正常启动。next：下一次执行的时间，left：剩余时间，last：上一次执行时间， passed：上次执行之后过了多长时间。如果start之后没有正常启动，可以试试enable,restart,daemon-reload等命令，仍然不行需要检查target是否正常。正常状态如下
```
NEXT                         LEFT     LAST                         PASSED  UNIT                         ACTIVATES
Tue 2022-11-08 11:11:00 CST  45s left Tue 2022-11-08 11:10:00 CST  14s ago test.timer                   test.service
```

