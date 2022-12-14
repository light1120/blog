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
`egg-scripts start --daemon --title=node-test-light` 做了什么？具体查看[egg-scripts](./module/egg-scripts.md)。
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
egg-scripts组合了执行start-cluster的命令并传了一些参数，`start-cluster`，具体查看[egg-cluster](./module/egg-cluster.md)怎么启动。
```
//agent 实例化
const Agent = require(options.framework).Agent;
  agent = new Agent(options);
//worker 实例化
const Application = require(options.framework).Application;
  app = new Application(options);
```
我从egg-cluster中看到，agent进程和worker进程都是实例化了framework中导出的[Agent](https://github.com/eggjs/egg/blob/master/lib/agent.js#L15)，[Application](https://github.com/eggjs/egg/blob/master/lib/application.js#L52)类。 而他们都继承了[EggApplication](https://github.com/eggjs/egg/blob/master/lib/egg.js#L35)，`EggApplication`又继承了`EggCore`。我们先看看`EggCore`做了哪些？回过来再看看他们在继承了`EggCore`基类之后做了哪些

## egg-core
egg应用最终都是继承了`EggCore`，具体看看[egg-core]('./module/egg-core.md')怎样定义的