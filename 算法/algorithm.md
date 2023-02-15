# 常见算法题

## 获取数字数字中重复次数最多的数字和次数

```
const maxRepeatNum = (arr) => {
  let count = 0;
  let num = 0;
  const numMap = new Map();
  arr.map((item) => {
    if (numMap[item]) {
      numMap[item] = numMap[item] + 1;
    } else {
      numMap[item] = 1;
    }
    if (numMap[item] > count) {
      num = item;
      count = numMap[item];
    }
  });
  return [num, count];
};

const numArray = [1, 2, 3, 3, 4, 2, 2, 21, 1, 22, 3, 112, 23, 1, 12];
maxRepeatNum(numArray)  // [2,3]
```
