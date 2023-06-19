/**
 * 插入排序，
 * 原理： 类似打扑克，将第一个作为有序数组，后面的作为无序数组。
 * 将无序数组后的数据依次拿出，然后跟有序数组从后往前比较，如果发现前面数字小，就放后面
 * 时间复杂度： n^2
 * 不适合大数据量
 */

const InsertionSort = function (dataArray) {
  const len = dataArray.length;
  if (len <= 1) {
    return dataArray;
  }
  //遍历无序数组，初始态第一后以后的数据为无序数据
  for (let i = 1; i < len; i++) {
    const currentItem = dataArray[i];
    let j = 0;
    // 从后往前遍历有序数据，从0->i-1 为有序数组
    for (j = i - 1; j >= 0; j--) {
      if (dataArray[j] > currentItem) {
        // 数据后移
        dataArray[j + 1] = dataArray[j];
        // dataArray[j] = currentItem; // 每次都要插入，可以循环完了，找到正确的位置，循环外一次插入
      } else {
        break;
      }
    }
    // 将数据插入正确的位置
    dataArray[j + 1] = currentItem;
  }
  return dataArray;
};

const dataArray = [3, 1, 41, 5, 2, 64, 23, 4];
console.log(InsertionSort(dataArray));
