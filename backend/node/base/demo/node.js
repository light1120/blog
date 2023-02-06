const http = require('http')
const server = http.createServer((res,res)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.end(JSON.stringify({text:'hello World'}))
})
server.listen(3000)