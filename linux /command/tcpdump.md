## Tcpdump 命令

### 简介
tcpdump ： dump the traffic on a network，根据使用者的定义对网络上的数据包进行截获的包分析工具。是linux强大的网络数据采集分析工具

### 用法
```
tcpdump [-aAbdDefhHIJKlLnNOpqStuUvxX#] [ -B size ] [ -c count ]
        [ -C file_size ] [ -E algo:secret ] [ -F file ] [ -G seconds ]
        [ -i interface ] [ -j tstamptype ] [ -M secret ] [ --number ]
        [ -Q in|out|inout ]
        [ -r file ] [ -s snaplen ] [ --time-stamp-precision precision ]
        [ --immediate-mode ] [ -T type ] [ --version ] [ -V file ]
        [ -w file ] [ -W filecount ] [ -y datalinktype ] [ -z postrotate-command ]
        [ -g ] [ -k (flags) ] [ -o ] [ -P ] [ -Q meta-data-expression ]
        [ --apple-tzo offset ] [--apple-truncate ]
        [ -Z user ] [ expression ]
```
功能非常强大，选项特别多，慢慢学习，实际用时再详细了解

### 处理实际问题
- 浏览器输入url是否访问到你的服务 `tcpdump -i eth1 port 7001` 通过 -i 指定网卡 port 端口，如果有链接请求，酒会输出相应的内容
- todo : 待工作中使用后补充