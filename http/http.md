# Http

## 缓存

### 强缓存

> 由浏览器控制，直接返回 200 。http 请求没到服务端

- Expires
- Cache-Control

### 协商缓存：304

> http 请求到了服务器，由服务器控制，返回 304

- Etag/If-None-Match
- Last-Modifed/If-Modified-Since
