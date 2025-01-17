### 工作中的nodejs Tips

* 动态修改Nodejs中的内存限制
Node.js中默认会对可用内存做出限制，当使用的内存超出1.5GB的默认值时，会报内存溢出的异常
    - `node --max-old-space-size=4096 index.js`
    - `NODE_OPTIONS=--max-old-space-size=4096 node index.js`

在大型项目中使用webpack，或者的启动eggjs dev时会导致内存溢出，可以添加参数扩展nodejs运行时内存

*

