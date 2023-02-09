const http = require("http");
const fs = require("fs");
const { pipeline } = require("stream");

const server = http.createServer((req, res) => {
  if (req.url === "/upload") {
    const img = fs.createWriteStream("./img.png", "utf-8");

    /** 监听data, 写入chunk */
    req.on("data", (chunk) => {
      // chunk 是一个buffer
      img.write(chunk);
    });
    req.on("end", () => {
      img.end();
      res.end("upload success");
    });
    req.on("error", (err) => {
      console.log(err);
      res.end("upload fail");
    });

    /** 使用pipe */
    // req.pipe(img);
    // res.end("upload success");

    /** 处理异常 */
    // req.on("error", () => {});
    // img.on("error", () => {});
    // req.pipe(img);
    // res.end("upload success");

    /** 使用pipeline */
    // pipeline(req, res, (err) => {
    //     res.end("upload success");
    // });
    // res.end("upload success");
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ hello: "World" }));
  }
});

server.listen(3000);
