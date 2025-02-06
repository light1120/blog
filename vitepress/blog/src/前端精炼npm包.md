
## 程序方面

await-to-js

p-limit




## 工程方面

- [archiver](https://www.npmjs.com/package/archiver)

>用于生成归档文件 ; 一般用于构建离线包， 或者传输前打包

```ts
// 将指定目录生成zip文件
const createZipArchive = (sourceDir: string, outputPath: string) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } }); // 设置压缩级别为最高

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
};
```

- [nodemailer](https://nodemailer.com/about/)

> 一个简单上手的发送邮件的 node 模块， 用于发送邮件服务。

```js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    //这里的pass是邮箱的smtp授权码，可以在邮箱的设置中找到
    //也可以用官方提高的测试号 const {user,pass} = await nodemailer.createTestAccount();
    user: 'xxxxxx@qq.com',
    pass: 'xxxxxx', //设置的smtp授权码
  }
});

const mailOptions = {
  from: '"test mail" <xxxxxx@qq.com>', // sender address
  to: 'xxxxx@qq.com',
  subject: 'Hello', // Subject line
  // 发送text或者html格式
  text: "Hello world?", // plain text body
  html: "<b>Hello world?</b>", // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});
```