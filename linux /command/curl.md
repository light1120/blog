### 基础用法
* curl abc.com    //默认get请求
* curl -A 'micromessenger' abc.com  //覆盖user-agent
* curl -b 'abc=123' abc.com	//附带cookie请求
* curl -c cookie.txt abc.com  //将请求返回附带的cookie写入文件
* curl -d 'abc=123' -X POST abc.com  //发送post请求   -d会将请求转换成post  -x post可以省略
* curl -i abc.com   //会输出请求返回的请求头
* curl -I abc.com  //发送head请求，并输出header
* curl -o abc.txt abc.com  //会将请求返回数据写入abc.txt
* curl -X POST abc.com  //指定请求方法
* curl -v abc.com //输入请求过程yum
* curl -trace - abc.com  //输出请求二进制流

### 实用技巧
* curl -v baidu.com  可以看到域名本次解析的ip地址
* chrome -> 开发者工具 -> network ->右键copy -> copy as curl
*  curl 'https://ug.baidu.com/mcp/pc/pcsearch' \
  -H 'Accept: */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: BAIDUID=2EC10E1D80852F0454747CB539A7D2B5:FG=1; BIDUPSID=2EC10E1D80852F0454747CB539A7D2B5; PSTM=1649819609; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; H_PS_PSSID=37545_36553_37561_37352_36884_34812_37402_37395_37406_36789_37537_37482_26350_37284_22159_37455' \
  -H 'Origin: https://www.baidu.com' \
  -H 'Pragma: no-cache' \
  -H 'Referer: https://www.baidu.com/s?wd=%E2%80%9C%E8%BA%BA%E5%B9%B3%E2%80%9D%E4%B8%8D%E5%8F%AF%E5%8F%96%EF%BC%8C%E2%80%9C%E8%BA%BA%E8%B5%A2%E2%80%9D%E4%B8%8D%E5%8F%AF%E8%83%BD&sa=fyb_n_homepage&rsv_dl=fyb_n_homepage&from=super&cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --data-raw '{"invoke_info":{"pos_1":[{}],"pos_2":[{}],"pos_3":[{}]}}' \
  --compressed