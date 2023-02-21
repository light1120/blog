# yum 相关命令

## 查看，安装，卸载

- yum info nodejs
- yum install nodejs
- yum list installed nodejs
- yum remove nodejs

## 下载 rpm 包

- rpm : redhat package manager
- wget https://rpm.nodesource.com/pub_10.x/el/7/x86_64/nodejs-10.20.0-1nodesource.x86_64.rpm
- wget https://rpm.nodesource.com/pub_14.x/el/7/x86_64/nodejs-14.0.0-1nodesource.x86_64.rpm
- wget https://nginx.org/packages/rhel/7/x86_64/RPMS/nginx-1.20.0-1.el7.ngx.x86_64.rpm

## yum 安装 rpm 包

- 升级 yum update nodejs-14.0.0-1nodesource.x86_64.rpm
- 降级 yum downgrade nodejs-12.20.0-1nodesource.x86_64.rpm
