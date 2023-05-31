# Shell 实战

## 定义函数实现杀死某个端口的占用进程

```
killpp() {
  if [ -z "$1" ]; then
    echo "Usage: killpp <port>"
    return 1
  fi

  port=$1
  pid=$(lsof -t -i :$port)

  if [ -z "$pid" ]; then
    echo "No process found on port $port"
    return 1
  fi

  echo "Killing process $pid on port $port"
  kill -9 $pid
}
```

可以将`killpp`函数拷贝到`~/.bashrc` 或 `~/.bash_profile` 文件中，并使用 `source ~/.bashrc` 或 `source ~/.bash_profile`。就可以直接执行 `killpp 8000` 杀死占用端口 8000 的进程。

## 定义函数实现杀死 ps 中包含特定字符出的所有进程

```
killsp() {
  if [ -z "$1" ]; then
    echo "Usage: killsp <string>"
    return 1
  fi

  string=$1
  pids=$(ps aux | grep "$string" | grep -v "grep" | awk '{print $2}')

  if [ -z "$pids" ]; then
    echo "No processes found with string: $string"
    return 1
  fi

  for pid in $pids; do
    echo "Killing process $pid with string: $string"
    kill -9 $pid
  done
}
```

可以将`killsp`函数拷贝到`~/.bashrc` 或 `~/.bash_profile` 文件中，并使用 `source ~/.bashrc` 或 `source ~/.bash_profile`。就可以直接执行 `killsp yarn` 杀死所有跟 `yarn` 相关的进程。
