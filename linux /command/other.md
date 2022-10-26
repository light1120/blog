### 进程相关
* `pwd`  查看当前目录
* `pwdx + 进程号`  查看进程运行地址 
* `lsof -i:9876`  查看9876端口号进程
* `ps aux | grep xxx` 查看xxx进程
* `kill -9 123456`    杀掉进程号123456



### 文件,目录相关
* `./xxx` 执行xxx文件
* `./xxx & ` 执行xxx文件，同时终端还能做其他事情
* `cp -r src/inc dist/`  把inc目录copy到dist下
* `find /data test.conf`   		//查找文件
* `scp xx/xx test@111.111.111.111:/xxx/xxx` 传输文件 
* `scp -v -r xx/xx test@111.111.111.111:/xxx/xxx` 传输目录
*  sz 、rz 	上传和下载文件命令 
* ln [参数][源文件或目录][目标文件或目录]
 创建硬连接：以副本的形式存在
 创建软连接： ln -s  以快捷方式存在
* tail -f  test.log 动态查看文件，一般用于查看日志
* `chgrp 用户组 文件名 -R`   -R表示递归目录下所有文件
* `chown 用户名 文件名 -R` 用户组 用户名 可以用ll查看，用户组在前


### other
* which + 命令  				//查看命令安装目录
* ssh -l root 11.11.11.11  xxxx
* free
* top
* cat /proc/cpuinfo| grep "processor"   //     查看cpu个数
