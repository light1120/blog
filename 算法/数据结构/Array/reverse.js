/**
 * 数组反转
 * @param {} dataArray
 */
const ArrayReverse = function (dataArray) {
  const len = dataArray.length;
  if (len <= 1) {
    return dataArray;
  }
  for (let i = 0, j = len - 1; i < len / 2; i++, j--) {
    [dataArray[i], dataArray[j]] = [dataArray[j], dataArray[i]];
  }
  return dataArray;
};

const dataArray = [3, 1, 41, 5, 2, 64, 23, 4];
console.log(ArrayReverse(dataArray));
