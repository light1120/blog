### 进程，端口相关

- `pwd` 查看当前目录
- `pwdx + 进程号` 查看进程运行地址
- `lsof -i:9876` 查看 9876 端口号进程 / **lsof -i**查询端口占用进程跟当前用户有关系，A 用户无法查看 B 用户占用的端口
- `ps aux | grep xxx` 查看 xxx 进程
- `kill -9 123456` 杀掉进程号 123456
- `netstat -antp | grep 8000` 查看端口监听信息
- `ps aux | grep "run serve" | grep -v grep | awk '{print $2}' | xargs kill -9` : 将筛选出来的进程全部 kill 掉
- `lsof -i:3000 | awk 'NR>1{print $2}' | xargs kill -9` : 删除端口占有的进程

### netstat 显示网络状态

- `-a`: 查看所有的socket
- `-t`: 查看 tcp
- `-u`: 查看 udp
- `-l`: 查看 LISTEN 状态
- `-p`: 显示进程pid, 例如`12345/node`


### 文件,目录相关

- `./xxx` 执行 xxx 文件
- `./xxx & ` 执行 xxx 文件，同时终端还能做其他事情
- `cp -r src/inc dist/` 把 inc 目录 copy 到 dist 下
- `find /data test.conf` //查找文件
- `scp xx/xx test@111.111.111.111:/xxx/xxx` 传输文件
- `scp -v -r xx/xx test@111.111.111.111:/xxx/xxx` 传输目录
- `scp -r -P 36000 ./xxx root@xx.xx.xx.xx:/data/xxx/` 传输目录
- sz 、rz 上传和下载文件命令
- ln [参数][源文件或目录][目标文件或目录]
  创建硬连接：以副本的形式存在
  创建软连接： ln -s 以快捷方式存在
  ** 源文件地址必须是绝对路径 **，不然在执行时，找不到源文件
- tail -f test.log 动态查看文件，一般用于查看日志
- grep 'content_filters' access.log > content.txt : 搜索文件中的内容，保存到文
- `chown 用户名 文件名 -R` 用户组 用户名 可以用 ll 查看，用户组在前

- `ls -l`: 列出目录下的文件和目录，第一列的字符表示文件或目录的类型和权限。其中**第一个字符**表示文件类型，例如：
  - \- 表示普通文件
  - d 表示目录
  - l 表示符号链接
  - c 表示字符设备文件
  - b 表示块设备文件
  - s 表示套接字文件
  - p 表示管道文件`
  - 可以通过 grep 过滤文件类型；`ls -l | grep "^-"` 过滤普通文件；加上` ｜wc -l` 统计文件数量
- `ls -lR`: 递归列出目录下的文件和目录

```
#ll test.conf
-rw-r--r-- 1 root root 643 Feb 21 23:33 test.conf
```

- `chmod` : 修改文件可读可写可执行属性
  - chmod 777 test : 赋予 777 属性
  - chmod +x test : 添加 x 属性
  - chmod -x test : 去掉 x 属性
- `chown` : 修改文件所属
  - `chown 用户名 文件名 -R` -R 递归修改目录下文件的所属
- `chgrp` : 修改文件所属组
  - `chgrp 用户组 文件名 -R` -R 表示递归目录下所有文件

查看目录占用磁盘空间

- `du -sh` : 当前目录所以文件总大小
- `du -ah` : 列举所以文件大小
- `du -ah | sort -h` : 按照大小从小到大排序 `| head` : 前 10 个 `| tail `: 后 10 个
- `du -h --max-depth=1` : 当前目录下所有的目录或者文件的大小

### other

- which + 命令 //查看命令安装目录
- ssh -l root 11.11.11.11 xxxx
- free
- top
- cat /proc/cpuinfo| grep "processor" | wc -l // 查看 cpu 个数
- alias 别名

### tar

- z : gzp
- c : create
- x : unpress
- v : list

* tar -xzvf xxx.tar.gz       // 解压压缩文件
* tar -czvf xxx.tar.gz xxx   // 创建压缩文件
