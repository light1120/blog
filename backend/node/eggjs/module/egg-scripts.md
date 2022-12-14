# egg-scripts 源码阅读
>`egg-scripts start --daemon --title=node-test-light`到底做了什么

## 简介
[egg-scripts](https://github.com/eggjs/egg-scripts)是基于[common-bin](../node_modules/common-bin.md)的 bin 工具。提供了2个命令`egg-scripts start`和`egg-scripts stop`。

## `egg-scripts start`做了什么
通过`common-bin`我们了解到`egg-scripts start`最终执行的[start.js](https://github.com/eggjs/egg-scripts/blob/master/lib/cmd/start.js)的`run`方法

```
* run(context) {
    context.execArgvObj = context.execArgvObj || {};
    const { argv, env, cwd, execArgvObj } = context;
    const HOME = homedir();
    const logDir = path.join(HOME, 'logs');

    // egg-script start
    // egg-script start ./server
    // egg-script start /opt/app
    let baseDir = argv._[0] || cwd;
    if (!path.isAbsolute(baseDir)) baseDir = path.join(cwd, baseDir);
    argv.baseDir = baseDir;

    const isDaemon = argv.daemon;

    argv.framework = yield this.getFrameworkPath({
      framework: argv.framework,
      baseDir,
    });

    this.frameworkName = yield this.getFrameworkName(argv.framework);

    const pkgInfo = require(path.join(baseDir, 'package.json'));
    argv.title = argv.title || `egg-server-${pkgInfo.name}`;

    argv.stdout = argv.stdout || path.join(logDir, 'master-stdout.log');
    argv.stderr = argv.stderr || path.join(logDir, 'master-stderr.log');

    // normalize env
    env.HOME = HOME;
    env.NODE_ENV = 'production';

    // it makes env big but more robust
    env.PATH = env.Path = [
      // for nodeinstall
      path.join(baseDir, 'node_modules/.bin'),
      // support `.node/bin`, due to npm5 will remove `node_modules/.bin`
      path.join(baseDir, '.node/bin'),
      // adjust env for win
      env.PATH || env.Path,
    ].filter(x => !!x).join(path.delimiter);

    // for alinode
    env.ENABLE_NODE_LOG = 'YES';
    env.NODE_LOG_DIR = env.NODE_LOG_DIR || path.join(logDir, 'alinode');
    yield mkdirp(env.NODE_LOG_DIR);

    // cli argv -> process.env.EGG_SERVER_ENV -> `undefined` then egg will use `prod`
    if (argv.env) {
      // if undefined, should not pass key due to `spwan`, https://github.com/nodejs/node/blob/master/lib/child_process.js#L470
      env.EGG_SERVER_ENV = argv.env;
    }

    // additional execArgv
    execArgvObj.deprecation = false; // --no-deprecation
    execArgvObj.traceWarnings = true; // --trace-warnings

    const command = argv.node || 'node';

    const options = {
      execArgv: context.execArgv, // getter for execArgvObj, see https://github.com/node-modules/common-bin/blob/master/lib/command.js#L332
      env,
      stdio: 'inherit',
      detached: false,
    };

    this.logger.info('Starting %s application at %s', this.frameworkName, baseDir);

    // remove unused properties from stringify, alias had been remove by `removeAlias`
    const ignoreKeys = [ '_', '$0', 'env', 'daemon', 'stdout', 'stderr', 'timeout', 'ignore-stderr', 'node' ];
    const clusterOptions = stringify(argv, ignoreKeys);
    // Note: `spawn` is not like `fork`, had to pass `execArgv` youself
    const eggArgs = [ ...(options.execArgv || []), this.serverBin, clusterOptions, `--title=${argv.title}` ];
    this.logger.info('Run node %s', eggArgs.join(' '));

    // whether run in the background.
    if (isDaemon) {
      this.logger.info(`Save log file to ${logDir}`);
      const [ stdout, stderr ] = yield [ getRotatelog(argv.stdout), getRotatelog(argv.stderr) ];
      options.stdio = [ 'ignore', stdout, stderr, 'ipc' ];
      options.detached = true;

      console.log('Run spawn `%s %s`', command, eggArgs.join(' '));
      const child = this.child = spawn(command, eggArgs, options);
      this.isReady = false;
      child.on('message', msg => {
        /* istanbul ignore else */
        if (msg && msg.action === 'egg-ready') {
          this.isReady = true;
          this.logger.info('%s started on %s', this.frameworkName, msg.data.address);
          child.unref();
          child.disconnect();
          this.exit(0);
        }
      });

      // check start status
      yield this.checkStatus(argv);
    } else {
      options.stdio = [ 'inherit', 'inherit', 'inherit', 'ipc' ];
      debug('Run spawn `%s %s`', command, eggArgs.join(' '));
      const child = this.child = spawn(command, eggArgs, options);
      child.once('exit', code => {
        // command should exit after child process exit
        this.exit(code);
      });

      // attach master signal to child
      let signal;
      [ 'SIGINT', 'SIGQUIT', 'SIGTERM' ].forEach(event => {
        process.once(event, () => {
          debug('Kill child %s with %s', child.pid, signal);
          child.kill(event);
        });
      });
    }
  }
```

//TODO-具体过程待添加

最后通过打印日志`console.log('Run spawn `%s %s`', command, eggArgs.join(' '));`得到
```
node --no-deprecation --trace-warnings /data/home/xxx/node_modules/egg-scripts/lib/start-cluster {"title":"node-test-light","baseDir":"/data/home/xxx","framework":"/data/home/xxx/node_modules/egg"} --title=node-test-light
```
实际上就是组合了一条命令，通过node来启动了'start-cluster'这个可执行文件，具体如下
```
#!/usr/bin/env node

'use strict';

const options = JSON.parse(process.argv[2]);
require(options.framework).startCluster(options);

```
就是启动了framework的startCluster方法，这里的framework就是egg模块，最终启动了[egg-cluster](https://github.com/eggjs/egg/blob/master/index.js#L9)的方法
```
exports.startCluster = require('egg-cluster').startCluster;
```