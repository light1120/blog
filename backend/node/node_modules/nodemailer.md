# nodemailer
## 简介
[nodemailer](https://nodemailer.com/about/) 是一个简单上手的发送邮件的node模块，很简单，几分钟就可以上手。
## 示例：
```
'use strict';
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
  //lightjiang@tencent.com yuniyu@tencent.com
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