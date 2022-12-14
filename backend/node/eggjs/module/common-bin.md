# common-bin

## 简介：
[common-bin](https://github.com/node-modules/common-bin)是基于[yargs](http://yargs.js.org/)的一个上层抽象的一个通用bin tool。可以基于common-bin构建自己的bin tool
## Demo-[my-git](https://github.com/node-modules/common-bin/tree/master/test/fixtures/my-git)
* 目录
```
test/fixtures/my-git
├── bin
│   └── my-git.js
├── command
│   ├── remote
│   │   ├── add.js
│   │   └── remove.js
│   ├── clone.js
│   └── remote.js
├── index.js
└── package.json
```
`/bin/my-git.js`就是引入了index.js（如下）创建了`MainCommand`实例，并执行了`start`方法。
* index.js - 这里做了2件事
    * 基础了Command对象，并实例化， start方法在Command类中
    * this.load加载了同级command目录下的文件
    以command目录下的clone.js（如下）来看。同样继承了`Command`类，重载了`run`和`description`方法
```
'use strict';

const path = require('path');
const Command = require('../../..');

class MainCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: my-git <command> [options]';

    // load sub command
    this.load(path.join(__dirname, 'command'));
  }
}

module.exports = MainCommand;
```
* clone.js - 实现具体的逻辑`my-git clone`具体的操作
```
'use strict';

const Command = require('../../../..');

class CloneCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.yargs.usage('clone <repository> [directory]');

    this.yargs.options({
      depth: {
        type: 'number',
        description: 'Create a shallow clone with a history truncated to the specified number of commits',
      },
    });
  }

  async run({ argv }) {
    console.log(argv);
    console.log('git clone %s to %s with depth %d', argv.repository, argv.directory, argv.depth);
  }

  get description() {
    return 'Clone a repository into a new directory';
  }
}

module.exports = CloneCommand;
```
**[Command](https://github.com/node-modules/common-bin/blob/master/lib/command.js)** 核心
* load(fullPath)：load方法作用就是遍历目录下的所有js文件，并执行add方法
* add(name, target)：add方法作用就是判断如果导出对象有继承`CommonBin`对象，就加入到`this[COMMANDS]`map中
```
  load(fullPath) {
    assert(fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory(),
      `${fullPath} should exist and be a directory`);

    // load entire directory
    const files = fs.readdirSync(fullPath);
    const names = [];
    for (const file of files) {
      if (path.extname(file) === '.js') {
        const name = path.basename(file).replace(/\.js$/, '');
        names.push(name);
        this.add(name, path.join(fullPath, file));
      }
    }

    debug('[%s] loaded command `%s` from directory `%s`',
      this.constructor.name, names, fullPath);
  }

  /**
   * add sub command
   * @param {String} name - a command name
   * @param {String|Class} target - special file path (must contains ext) or Command Class
   * @example `add('test', path.join(__dirname, 'test_command.js'))`
   */
  add(name, target) {
    assert(name, `${name} is required`);
    if (!(target.prototype instanceof CommonBin)) {
      assert(fs.existsSync(target) && fs.statSync(target).isFile(), `${target} is not a file.`);
      debug('[%s] add command `%s` from `%s`', this.constructor.name, name, target);
      target = require(target);
      // try to require es module
      if (target && target.__esModule && target.default) {
        target = target.default;
      }
      assert(target.prototype instanceof CommonBin,
        'command class should be sub class of common-bin');
    }
    this[COMMANDS].set(name, target);
  }
```
到这里，整个对象就初始化完了。前面看到的`start`方法就是基类的[start](https://github.com/node-modules/common-bin/blob/master/lib/command.js#L130)方法。start方法就是执行`await this[DISPATCH]();`
* `this[DISPATCH]()`：如果子命令存在，就执行子类`clone`的的`[DISPATCH]`方法。此时子类没有孙类，就执行下面的逻辑，到`run`方法；`my-git command1 command2 command3` 如果有这样的命令就会一直子类，孙类找下去，找到最终类，就执行其`run`方法，所以我们需要在命令最终类重载`run`方法就行。默认[run](https://github.com/node-modules/common-bin/blob/master/lib/command.js#L65)就是`showHelp()`
```
async [DISPATCH]() {
    // define --help and --version by default
    //...省略

    // get parsed argument without handling helper and version
    const parsed = await this[PARSE](this.rawArgv);
    const commandName = parsed._[0];

    //...省略

    // if sub command exist
    if (this[COMMANDS].has(commandName)) {
      const Command = this[COMMANDS].get(commandName);
      const rawArgv = this.rawArgv.slice();
      rawArgv.splice(rawArgv.indexOf(commandName), 1);

      debug('[%s] dispatch to subcommand `%s` -> `%s` with %j', this.constructor.name, commandName, Command.name, rawArgv);
      const command = this.getSubCommandInstance(Command, rawArgv);
      await command[DISPATCH]();
      return;
    }

    // register command for printing
    for (const [ name, Command ] of this[COMMANDS].entries()) {
      this.yargs.command(name, Command.prototype.description || '');
    }

    debug('[%s] exec run command', this.constructor.name);
    const context = this.context;

    // print completion for bash
    if (context.argv.AUTO_COMPLETIONS) {
      // slice to remove `--AUTO_COMPLETIONS=` which we append
      this.yargs.getCompletion(this.rawArgv.slice(1), completions => {
        completions.forEach(x => console.log(x));
      });
    } else {
      // handle by self
      await this.helper.callFn(this.run, [ context ], this);
    }
  }
```
## 总结
* 每个命令子类都需要继承`Command`基类
* 如果需要子命令下还有孙命令，需要在子类的构造函数中load / add 孙类
* 每个命令具体实现需要在命令类中重载`run`方法
* 如果只有单个或者很少命令或者制定某几个，可以直接this.add，加载所有this.load
* [context](https://github.com/node-modules/common-bin/blob/master/lib/command.js#L265)：执行命令的上下文，包含{ cwd, env, argv, rawArgv }属性的对象，是`run`方法的参数`run(context){}`