const http = require("http");
const fs = require("fs");
const { pipeline } = require("stream");

const server = http.createServer((req, res) => {
  if (req.url === "/upload") {
    const img = fs.createWriteStream("./img.png", "utf-8");

    /** 监听data, 写入chunk */
    // req.on("data", (chunk) => {
    //   // chunk 是一个buffer
    //   img.write(chunk);
    // });
    // req.on("end", () => {
    //   img.end();
    //   res.end("upload success");
    // });
    // req.on("error", (err) => {
    //   console.log(err);
    //   res.end("upload fail");
    // });

    /** 使用pipe */
    // req.pipe(img);
    // res.end("upload success");

    /** 处理异常 */
    // req.on("error", () => {});
    // img.on("error", () => {});
    // req.pipe(img);
    // res.end("upload success");

    /** 使用pipeline */
    pipeline(req, img, (err) => {
      res.end("upload fail");
    });
    res.end("upload success");
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ hello: "World" }));
  }
});

//server.listen(3000);

// const { Readable } = require("node:stream");
// const readable = Readable.from([1, 2, "22", { c: 1 }]);
// readable.on("data", (chunk) => {
//   console.log(chunk);
// });

const rimg = fs.createReadStream("../../images/libuv.png");
const wimg = fs.createWriteStream("./libuv.png");
// 如果添加了"data"事件的句柄，就会直接启动流，将流设置成流动模式
rimg.on("data", (chunk) => {
  wimg.write(chunk);
});
// rimg.pipe(wimg)
