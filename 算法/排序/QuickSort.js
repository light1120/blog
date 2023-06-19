/**
 * 快速排序
 * 思路： 分治，递归。 一般以第一个为基线，比基线大的放右边数组，比基线小的放左边数组，然后递归遍历左右2个数组
 * 时间复杂度： nlogn
 */

const QuickSort = function (dataArray) {
  const len = dataArray.length;
  if (len <= 1) {
    return dataArray;
  }
  const base = dataArray[0];
  const leftArray = [];
  const rightArray = [];
  for (let i = 1; i < len; i++) {
    if (dataArray[i] > base) {
      rightArray.push(dataArray[i]);
    } else {
      leftArray.push(dataArray[i]);
    }
  }
  return [...QuickSort(leftArray), base, ...QuickSort(rightArray)];
};

const dataArray = [3, 1, 41, 5, 2, 64, 23, 4];
console.log(QuickSort(dataArray));
