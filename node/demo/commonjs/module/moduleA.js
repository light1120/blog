// commonjs  每个文件都是一个模块，文件中有个文件内全局变量module， 外部require得到的是module的expots对象
// commonjs 内部有__filename \ __dirname 全局变量
// console.log(module);
/**
 * Module {
  id: '/Users/.../.../demo/moduleA.js',
  path: '/Users/.../.../demo',
  exports: {},
  filename: '/Users/.../.../demo/moduleA.js',
  loaded: false,
  children: [],
  paths: [
    '...'
    '/node_modules'
  ]
}
 */
// console.log(module.filename === __filename); //true
// console.log(module.path === __dirname); //true

let num = 0;
const obj = {
  num: 0,
};
const incNum = function () {
  num = num + 1;
  obj.num = obj.num + 1;
};

module.exports = {
  num,
  obj,
  incNum,
};

// module.exports 会覆盖exports. 操作

console.log("in module:", num, obj.num);
