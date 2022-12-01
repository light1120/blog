### 查看环境变量
* `echo $LIGHT`  查看LIGHT环境变量值
* `env` 查看所有变量
* `export` 查看所有变量

### 设置环境变量
* `export LIGHT="light"` 设置环境变量 (仅限当前登录有效)
* `declare -x LIGHT="light"`  设置环境变量  -x 指设置环境变量
* `unset LIGHT` 删除环境变量
* `vi /etc/profile`  添加 `export LIGHT="light"`  执行 `source  /etc/profile` 对所有用户生效 (每次重启terminal需要执行source)
* `vi /etc/bashrc` 添加 `export LIGHT="light"` 重启terminal即可，不需每次source
* 同理 `/home/xxx/.bash_profile` , `/home/xxx/.bashrc` 对xxx用户有效

### profile，bashrc 区别
* /etc/profile for every shell（like bash,zsh） ; bashrc for bash shell
* .bash_profile is executed for login shells, while .bashrc is executed for interactive non-login shells.