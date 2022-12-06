# eggjs 源码
> 从`npm run start`开始读源码
package.json:
```
"scripts": {
    "start": "egg-scripts start --daemon --title=node-test-light",
    "stop": "egg-scripts stop --title=node-test-light"
  },
```

## egg-scripts
`egg-scripts start --daemon --title=node-test-light` 做了什么？具体查看[egg-scripts](../node_modules/eggjs/egg-scripts.md)。
* egg-scripts start 组合了一条命令(省略了一些路径)
```
node --no-deprecation --trace-warnings /data/home/xxx/node_modules/egg-scripts/lib/start-cluster {"title":"node-test-light","baseDir":"/data/home/xxx","framework":"/data/home/xxx/node_modules/egg"} --title=node-test-light
```
* [start-cluster](https://github.com/eggjs/egg-scripts/blob/master/lib/start-cluster) bash文件内容：
```
require(options.framework).startCluster(options);
```
* [egg startCluster](https://github.com/eggjs/egg/blob/master/index.js#L9) 方法
```
exports.startCluster = require('egg-cluster').startCluster;
```
我们可以清楚知道这里最终就是执行了egg-cluster模块的startCluster方法

## egg-cluster
// TODO
egg-scripts组合了执行start-cluster的命令并传了一些参数，`start-cluster`，具体查看[egg-cluster](../node_modules/eggjs/egg-cluster.md)怎么启动