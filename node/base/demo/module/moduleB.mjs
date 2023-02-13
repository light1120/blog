// es module 文件需要以.mjs后缀
// es module 文件内没有 commonjs module 文件中的 module对象、__filename 、__dirname
//当前文件的地址 dirname+filename
// console.log(import.meta.url);
// file:///Users/.../.../moduleB.mjs

let num = 0;
const obj = {
  num: 0,
};
const incNum = function () {
  num = num + 1;
  obj.num = obj.num + 1;
};

export { num, obj, incNum };

export default {
  str: "string",
};

console.log("in module:", num, obj.num);
