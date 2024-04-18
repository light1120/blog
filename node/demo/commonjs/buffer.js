const { Buffer } = require("buffer");
const fs = require("fs");

const b1 = Buffer.alloc(4);
const buf = Buffer.from("buffer");
// fill 就是填充的意思，可以为字符串，数字 ，第二第三参数是 from end
b1.fill("A", 0, 1);
b1.fill(0x41, 1, 2);
b1.fill(65, 2, 3);
// write 跟 fill差不多，只能是字符串，第二第三参数是 from length
b1.write("CD", 3, 1);
console.log(b1.toString());

fs.readFile("./test.text", (err, data) => {
  // data 就是一个Buffer 对象，如果readFile第二个参数设置了编码格式'utf-8'，那么data就是 toString('utf-8')的结果
  console.log(data.toString("utf-8"));
});
