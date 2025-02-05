# vscode 远程开发

- 1、安装 `remote-ssh` 插件

- 2、配置远程开发机
  一般是 ~/.ssh/config 文件， 可以配置多台开发机
  ```
  Host devcloud_xxx
    HostName 9.xx.xx.xxx
    User root
    Port xxx
  ```
- 3、免密登陆
  - 使用 `ssh-keygen -t rsa` 生产一对密钥对。公钥存储在 `id_rsa.pub` 文件，私钥存储在 `id_rsa` 文件
  - 将公钥拷贝到开发机的`~/.ssh/authorized_keys` 文件中。 注意文件中可能也有其他同事的公钥，不要覆盖，一条记录一行，不要空行
  - 也可以通过命令拷贝`ssh-copy-id -p PORT USER@x.xx.xxx.xxx`
