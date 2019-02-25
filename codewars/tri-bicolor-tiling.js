// https://www.codewars.com/kata/tri-bicolor-tiling/train/javascript

function triBicolorTiling(n, r, g, b) {
  // 只使用也必须使用 r g b 中两种来 排列
  // 组合后不可超过 n 的长度
  // TODO: n 为数组, r 占用的位置 又把其分为两个数组
  // 检查断点的 index, 和 其到端点的距离 得出有哪些位置共有多少种类

  function colorPositions(length, aColorLength) {
    if (length > aColorLength) {
      return length - aColorLength;
    }
    return 0;
  }

  const red = {
    count: r,
    value: "r"
  };
  const green = {
    count: g,
    value: "g"
  };

  const blue = {
    count: blue,
    value: "b"
  };

  const colors = [red, green, blue];

  const selection = [[0, 1], [0, 2], [1, 2], [1, 0], [2, 1], [2, 0]];

  let result = 0;

  result = selection.reduce((p, c) => {
    const [pivot, next] = [colors[c[0]], colors[c[1]]];

    function calcWith(apivot, start, total) {
      if (apivot.count + start > n) {
        return total;
      }
      const leftLength = start + 1;
      const rightLength = n - start + apivot.count;
      const options =
        colorPositions(leftLength, next.count) +
        colorPositions(rightLength, next.count);
      return calcWith(apivot, start + 1, total + options);
    }
    return p + calcWith(pivot, 0, 0);
  }, 0);

  return result;
}
