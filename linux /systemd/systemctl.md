# systemctl

> systemctl 是 systemd 的主命令，用于管理系统资源

## 1，Unit（单元）

每一种系统资源称为一个 unit。所有的 unit 可分 12 种:

- Service unit：系统服务
- Target unit：多个 Unit 构成的一个组
- Device Unit：硬件设备
- Mount Unit：文件系统的挂载点
- Automount Unit：自动挂载点
- Path Unit：文件或路径
- Scope Unit：不是由 Systemd 启动的外部进程
- Slice Unit：进程组
- Snapshot Unit：Systemd 快照，可以切回某个快照
- Socket Unit：进程间通信的 socket
- Swap Unit：swap 文件
- Timer Unit：定时器

- systemd unit 文件目录
  - /lib/systemd/system：系统默认的单元文件
  - /etc/systemd/system：用户安装的软件的单元文件
  - /usr/lib/systemd/system：用户自己定义的单元文件

## 2，Unit 配置文件

/usr/lib/systemd/system 目录下有很多 .service 文件，其实就是这些 unit 的配置文件，告诉了系统如何启动应用。

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

`[Service]` 说明：

- Type: simple 就是只设置了 ExecStart 选项
- ExecStart：systemctl start 所要执行的命令
- ExecStop：systemctl stop 所要执行的命令
- ExecReload：systemctl reload 所要执行的命令
- 查看[Service 所有的配置](https://man.archlinux.org/man/systemd.service.5)

`Install`: 说明

- WantedBy 是将 unit 归到某个 target 的意思。target 就是 unit 组。[所有的 target](https://man.archlinux.org/man/systemd.special.7)

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

说明： 中间 `[Service]` 是 service unit , `[Timer]` 是指 timer unit 。其他类似

## 3，常用 systemctl 命令

以 nginx.service 为例，

- systemctl status nginx(.service) : 查看应用状态( nginx / nginx.service 均可)
- systemctl cat nginx : 查看配置文件
- systemctl enable nginx : 开机自启动
- systemctl disable nginx : 关闭自启动
- systemctl start nginx : 开启服务
- systemctl stop nginx : 关闭服务
- systemctl kill nginx : 杀死服务进程
- systemctl reload nginx : 重新加载服务配置文件
- systemctl show nginx : 查看服务底层参数
- systemctl daemon-reload : 重新加载所有修改的配置文件
- systemctl reset-failed : 重置失败次数，默认一个服务 10 秒内最多可以重启 5 次，超过会报错，需要`reset-failed`重置
