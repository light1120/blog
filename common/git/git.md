# git 版本管理

## 概念

WorkSpace 工作区
Index/Stage 缓存区
Repository 本地仓库
Remote 远程仓库

## 命令

- 1、新建代码库
  git init //在当前新建一个 git 代码库
  git init [pro-name] //新建目录，并初始化为 git 代码库
  git clone [url] //克隆远程代码库到本地仓库（克隆：包括所有提交历史）

- 2、配置 .gitignore 文件
  git config --list //显示当前 git 配置
  git config -e [--global] //编辑配置文件
  git config [--global] user.name //设置用户名
  git config [--global] user.mail //设置用户邮箱
  git config --unset [--global] [xxxx] //删除某一项配置
  git config //列出所有操作命令
  git config --global crendential.helper manager //在 push 、pull 的时候只需输入一次密码

- 3、添加/删除文件
  git add [file1] [file2] //添加文件到缓存区
  git add [dir] //添加目录到缓存区
  git add . //添加目录下所有文件到缓存区
  git add --all //添加所有文件到缓存区
  git rm [file1] [file2] //删除文件，将本次删除放入到缓存区
  git rm --cached [file] //停止追踪文件，但该文件会保留在工作区
  git rm [fileName1] [fileName2] //修改文件名，并放入到缓存区

- 4、代码提交
  git commit [file] -m [message] //提交文件缓存区到本地仓库
  git commit -a //提交工作区自上次提交的变化，直接到仓库
  git commit -v //提交是显示所有 diff 信息
  git commit --amend -m [message]//使用这次提交来替代上次提交

- 5、撤销
  git checkout origin/master -- static/ 拉取远程仓库分支的单个目录
  git checkout [file] //撤销工作区的修改，使得工作区文件同上次 commit 或者提交到缓存区的文件相同
  git checkout [commit] [file] //恢复 commit 的文件到缓存区和工作区
  git checkout . //撤销所有文件修改
  git reset [file] //重置缓存区的文件，与上次 commit 一致，工作区不变
  git reset --hard //重置缓存区和工作区的文件，与上次 commit 一致，工作区变化
  git reset [commit] //重置当前分支的 head 为 commit，同时重置缓存区，工作区不变
  git reset --hard [commit] //重置当前分支的 head 为 commit，同时重置缓存区和工作区，与 commit 一致
  git revert [commit] //新建一个 commit，撤销该 commit，后者所有的变化都将被撤销，并应用到当前分支

- 6、查看信息
  git status //显示有变更的文件
  git log //显示当前分支的版本历史
  git log --stat //显示 commit 历史，以及每次 commit 发生变成的文件
  git log -s [keyword] //根据关键词来搜索历史
  git log [tag] HEAD --pretty=format:%s //显示某个 commit 之后的所有变动，每个 commit 占一行
  git log -5 --pretty --oneline //显示最近 5 次 commit，每个 commit 占一行
  git log -p [file] //显示某个文件相关的每一次 diff
  git blame [file] //显示某个文件在什么人什么时候修改过
  git diff //显示缓存区与工作区之间的差异
  git diff --cached [file] //显示缓存区与 commit 之间的差异
  git diff HEAD //显示工作区与当前分支最新 commit 之间的差异
  git diff [1-branch]...[2-branch]//显示两次提交之间的差异
  git diff branch1 branch2 --stat //查看 2 个分支之间的差异，显示文件列表

git diff --shortstat "@{0 day ago}" //显示今天写了多少代码
git diff master:src/xxx/xxx.js feature_xxx:src/xxx/xxx.js //比较两个
git show [commit] //显示某次提交之后的元数据和内容的变化
git show --name-only [commit] //显示某次提交发生变化的文件
git show [commit]:[file] //显示某次提交该文件变化的内容
git reflog //显示当前分支的最近几次提交
git diff commit1 commit1 --src/.. //比较某个目录或文件 2 次提交

- 7、远程同步
  git remote //下载远程仓库的所有变动
  git remote -v //显示所有的远程仓库
  git remote show remote //显示某个远程仓库的信息
  git remote add [name] [url] //增加一个信息远程仓库，并命令
  git remote prune origin //删除远程已经删除过的分支
  git pull [remote] [branch] //拉取远程仓库的变化，并合并到分支
  git push [remote] [branch] //上传本地分支到远程仓库
  git push [remote] --force //强制上传，即使有冲突
  git push [remote] -all //上传所有的分支

- 8、分支
  git branch //显示本地所有分支
  git branch -r //显示远程所有分支
  git branch -a //显示本地和远程所有分支
  git branch [branch-name] //新建一个分支，但停留在当前分支
  git checkout -b [branch] //新建一个分支，并切换该分支
  git checkout [branch-name] //切换到该分支，并更新工作区
  git checkout - //切换到上一个分支
  git merge [branch] //合并该分支到当前分支
  git checkout [branch] src/xxx/xx//合并该分支文件夹到当前分支
  git branch -d [branch-name] //删除分支
  git branch -dr [remote/branch] //删除远程分支
  git pust origin --delete [branch-name] //删除远程分支

- 9、标签
  git tag //显示所有的标签
  git tag [tag] //在当前 commit 新建一个 tag
  git tag [tag] [commit] //在该 commit 新建一个 tag
  git tag -d [tag] //删除本地 tag
  git push origin :refs/tags/[tagName] //删除远程 tag
  git show [tag] //查看 tag 信息
  git push [remote] [tag] //提交该 tag
  git push [remote] --tags //提交所有 tag
  git checkout -b [branch] [tag] //新建一个分支，指向该 tag
  git fetch //拉取远程分支
  git checkout -b xxx origin/xxx //拉取远程分支，并新建到本地

## submodule

- 添加
  git submodule add http://git.xxxx.com/xxx/xxxx.git lib
  git commit -am '添加子模块 [lib]'
- 检出
  git clone http://git.xxxx.com/xxx/xxxx.git subtest --recurse-submodules
- 删除子仓库
  删除 .gitsubmodule 相关内容
- 子仓库目录
  git rm -r --cached <子仓库路径>

## 常用配置

- .gitignore 文件 : 文件内容列出 git 不跟踪的文件类型
- git 操作保存密码 :
  - windows : `git config --global credential.helper manager`
  - linux : `git config --global credential.helper store`
- 全局设置
  - user.name : `git config --global user.name xx`
  - user.email : `git config --global user.email xxx`
  - 替换 : `git config --global url."git@git.xxx.com".insteadOf "https://git.xxx.com/"`
- 配置 ssh

  - ssh 公钥
    https://git-scm.com/book/zh/v2/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5
  - `ssh-keygen -o` : 生成一对公钥和私钥 。将 id_rsa.pub 的内容给 git 服务器管理配置 （ git 远程仓库 ）

    ```
    ls ~/.ssh/

    authorized_keys2 id_rsa id_rsa.pub known_hosts config
    ```

    - 在 config 配置 git 服务器和私钥地址

    ```
    Host git.xxx.com
    HostName git.xxx.com
    User git
    Port 22
    ```

## 技巧

- 修改 commit 内容 :
  - `git commit --amend -m [message]` : 使用这次提交来替代上次提交
- git init 之后添加全程仓库地址，然后 push 代码
  - `git remote add origin git@git.xxx.com:xxxxx/xxxx.git`

## 合并 某个分支的 某几个 commit `cherry pick`

```
git cherry-pick <commitHash1> <commitHash2>
```

如果 cherry pick 之后需要回滚 commit 时 `git revert` 。他会重新回滚代码，到缓冲区，需要再次 commit 下，之前 commit 的代码就回滚了。 `git log` 中之前的 commit 不会消失，会再多一个 commit

```
git revert <commitHash1>
```
