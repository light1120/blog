## nodejs多版本环境搭建
### yum
* 1、下载需要安装的rpm包，
* 2、直接yum install nodejs-xxxx.rpm 安装即可
* 3、这里安装在/usr/bin 
* 4、选择版本时，直接yum install 需要的版本的rpm包

### n
* 1、npm install -g n    // 这里需要先安装npm , 可以先使用yum install nodejs 再 yum remove
* 2、n install xx.xx.xx   //这里安装在/usr/local/bin 不能直接使用命令
* 3、ln -s /usr/local/bin/node /usr/bin/node 创建软链。npm npx也需要
* 4、n 选择版本

### 直接下载官网tar包 https://nodejs.org/download/release/
* 1、wget  https://nodejs.org/dist/v16.10.0/node-v16.10.0-linux-x64.tar.xz
* 2、解压 xz -d node-v16.10.0-linux-x64.tar.xz && tar -xf node-v16.10.0-linux-x64.tar
* 3、创建软链
* 4、选择版本时，只需要更改软链即可。 或者设置环境变量，