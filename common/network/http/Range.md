# Range

Range 是一个请求首部，告知服务器返回文件的哪一部分。在一个 Range 首部中，可以一次性请求多个部分，服务器会以 multipart 文件的形式将其返回。如果服务器返回的是范围响应，需要使用 206 Partial Content 状态码。假如所请求的范围不合法，那么服务器会返回 416 Range Not Satisfiable 状态码，表示客户端错误。服务器允许忽略 Range 首部，从而返回整个文件，状态码用 200 。

https://mp.weixin.qq.com/s?__biz=Mzg3OTYzMDkzMg==&mid=2247495472&idx=1&sn=bc73cba1c6a4075dddddc88fe270772b
