/**
 * 冒泡排序
 * 思路：循环比较：通过比较左右2相邻的数据大小，如果左>右，就调换的方式进行排序。然后循环
 * 第一轮循环，每次循环最后面的就是最大的数，如果某次循环没有发生调换，就说明排序已经完成
 * 时间复杂度： n^2
 */

const BubbleSort = function (dataArray) {
  const len = dataArray.length;
  if (len <= 1) {
    return dataArray;
  }
  let noSwap = true;
  for (let i = len; i > 0; i--) {
    noSwap = true;
    for (let j = 0; j < i - 1; j++) {
      if (dataArray[j] > dataArray[j + 1]) {
        [dataArray[j], dataArray[j + 1]] = [dataArray[j + 1], dataArray[j]];
        noSwap = false;
      }
    }
    if (noSwap) {
      break;
    }
  }
  return dataArray;
};

const dataArray = [3, 1, 41, 5, 2, 64, 23, 4];
console.log(BubbleSort(dataArray));
