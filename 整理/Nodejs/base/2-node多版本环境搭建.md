## nodejs 多版本环境搭建

### yum

- 1、下载需要安装的 rpm 包，
- 2、直接 yum install nodejs-xxxx.rpm 安装即可
- 3、这里安装在/usr/bin
- 4、选择版本时，直接 yum install 需要的版本的 rpm 包

### n

[n](https://github.com/tj/n) 是一个 npm 包。 要先安装 npm

- 1、npm install -g n // 这里需要先安装 npm , 可以先使用 yum install nodejs 再 yum remove
- 2、n install xx.xx.xx //这里安装在/usr/local/bin 不能直接使用命令
- 3、ln -s /usr/local/bin/node /usr/bin/node 创建软链。npm npx 也需要
- 4、n 选择版本

### nvm

[nvm](https://github.com/nvm-sh/nvm) 是一个独立的工具

- 1、`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash` 或者 `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
- 2、`nvm install v20.10.0` : 安装
- 3、`nvm use v20.10.0` : 使用

### 直接下载官网 tar 包 https://nodejs.org/download/release/

- 1、wget https://nodejs.org/dist/v16.10.0/node-v16.10.0-linux-x64.tar.xz
- 2、解压 xz -d node-v16.10.0-linux-x64.tar.xz && tar -xf node-v16.10.0-linux-x64.tar
- 3、创建软链 ln -s /xxx/xxx/node /usr/local/bin/node
- 4、选择版本时，只需要更改软链即可。 或者设置环境变量，
