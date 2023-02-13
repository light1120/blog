//在需要的时候 require 导入 commonjs 模块。

const { num, obj, incNum } = require("./moduleA.js");

console.log("num:", num, obj.num);
incNum();
// num = num + 1; //报错 导出的变量都是constant无法修改
obj.num = 2;
console.log("num:", num, obj.num);

const moduleA = require("./moduleA.js");
console.log("moduleA:", moduleA);
console.log("num:", moduleA.num, moduleA.obj.num);
