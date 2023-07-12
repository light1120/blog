# cac

## 简介

[CAC](https://github.com/cacjs/cac): Command And Conquer is a JavaScript library for building CLI apps

## 优点

轻量，无依赖，简单

## API

一般执行命令是在 package.json 的 scripts 中配置 类似 `TX build --foo abc ...`

- command: 第一个参数， 对应 `build`
- option: 接受后面的参数 ，对应`--foo `
- action: 处理完了参数之后，将参数，回调 action 的方法
- help: 对应`-h`，`--help`, 对显示帮助信息
- version: 设置当前版本
- parse: 解析接受的参数

## 用法

```
import { cac } from "cac";
const cli = cac();
cli
  .command("build <entry> [...otherFiles]", "Build your app")
  .option("--foo ", "Foo option")
  .option("--bar <path>", "Foo option")
  .action((entry, otherFiles, options) => {
    console.log(entry);
    console.log(otherFiles);
    console.log(options);
    /**
     * node cac.js build a.js b.js c.js --foo --bar bar
     * a.js
     * [ 'b.js', 'c.js' ]
     * { '--': [], foo: true, bar: 'bar' }
     */
  });
cli.help();
cli.version("0.0.0");
cli.parse();
```
