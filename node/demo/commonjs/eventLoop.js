const process = require("process");

setImmediate(() => {
  console.log("immediate");
  Promise.resolve().then(() => {
    console.log("promise2");
    process.nextTick(() => {
      console.log("nextTick2");
    });
  });
});
setImmediate(() => {
  console.log("immediate2");
});
Promise.resolve().then(() => {
  console.log("promise");
});
process.nextTick(() => {
  console.log("nextTick");
});

console.log("1");
// 执行一个setImmediate回调之后，校验nextTick 和Promise 在执行下一个setImmediate
// 1
// nextTick
// nextTick2
// promise
// immediate
// promise2
// nextTick3
// immediate2
