// es module 文件需要以.mjs后缀
// 导入export default ,如果没有定义会报错
import moduleB from "./moduleB.mjs";
// 导入指定的变量
import { num, obj, incNum } from "./moduleB.mjs";
// 导入所有
import * as module from "./moduleB.mjs";

console.log(moduleB === module.default);

console.log("num:", num, obj.num);
incNum();
// num = num + 1; //报错 导出的变量都是constant无法修改
console.log("num:", num, obj.num);

// console.log("module:", module);
/**
module: [Module: null prototype] {
  default: { str: 'string' },
  incNum: [Function: incNum],
  num: 0,
  obj: { num: 0 }
}
 */

if (true) {
  // import() 动态导入， 返回一个promise
  import("./moduleB.mjs").then((module) => {
    console.log(module.num, module.obj.num);
    module.incNum();
    console.log(module.num, module.obj.num);
    console.log(module.default);
  });
}
