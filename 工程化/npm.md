# Npm

## 发布包

```
alias tnpm="npm --registry https://mirrors.xxxxx.com/npm/"

tnpm login

tnpm publish
```

- monorepo 项目 ： cd 到子包目录 , 然后 publish 即可。 注意子包中是否有引入其他的子包 'workspace\*' ，如果有需要改成版本号
- private ： 如果 package.json 中 设置了 `private : "true"` 。 依然会提示发布成功，但是实际没有发布成功。控制台会有下面提示，因为 `private` 跳过了发布

```
npm WARN publish Skipping workspace @xxx/xxx, marked as private
```
