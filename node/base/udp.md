# UDP/datagram sockets

> dagram 模块提供了 udp 数字报套接字的实现

## UDP 简介

- udp 是一种面向无连接的，非可靠的传输层协议
- 场景：dns 、广播、数据量较少场景
- (详细信息](https://en.wikipedia.org/wiki/User_Datagram_Protocol)

## 用法

- server:

  ```
  import dgram from "dgram";

  const server = dgram.createSocket("udp4");

  server.on("error", (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
  });

  server.on("message", (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });

  server.on("listening", () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });

  server.bind(8000);
  ```

- client:

  ```
  import dgram from "dgram";

  const client = dgram.createSocket("udp4");

  client.send(Buffer.from("test msg"), 8000, "127.0.0.1", (err) => {
    client.close();
  });

  ```

## Api & Event

- dgram.createSocket(options[, callback])
  - options: object
    - type: 'udp4'/'udp6' 必须.
    - reuseAddr: true: socket.bind() will reuse the address, Default: false.
      ipv6Only <boolean> Setting ipv6Only to true will disable dual-stack support, i.e., binding to address :: won't make 0.0.0.0 be bound. Default: false.
      recvBufferSize <number> Sets the SO_RCVBUF socket value.
      sendBufferSize <number> Sets the SO_SNDBUF socket value.
      lookup <Function> Custom lookup function. Default: dns.lookup().
      signal <AbortSignal> An AbortSignal that may be used to close a socket.
- server.bind([port][, address][, callback])
  - port: 端口
  - address: ip
  - callback: (err)=>{} 异常回调
- server.close(): 断开连接
- client.send(msg[, offset, length][, port][, address][, callback])
  - msg: string array buffer
  - offset: msg 起始位置
  - length: offset 开始后长度
  - port: 端口
  - address: ip
  - callback: (err)=>{} 异常回调
- server.on('message', (msg, rinfo) => {}) 接收 client 发来的消息
- server.on('error', (err)=>{})
