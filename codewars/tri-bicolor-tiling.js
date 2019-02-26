// https://www.codewars.com/kata/tri-bicolor-tiling/train/javascript

function triBicolorTiling_first_try(n, r, g, b) {
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

function triBicolorTiling_second_try(n, r, g, b) {
  const resultSet = new Set();

  function addToSet(v) {
    resultSet.add(v);
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
    count: b,
    value: "b"
  };

  const colors = [red, green, blue];
  const selection = [[0, 1], [0, 2], [1, 2], [1, 0], [2, 1], [2, 0]];
  function toStrFor(aStr, aCount) {
    return new Array(aCount).fill(aStr).join("");
  }
  function pivotStr(apivot) {
    return toStrFor(apivot.value, apivot.count);
  }

  selection.forEach(c => {
    const [pivot, next] = [colors[c[0]], colors[c[1]]];

    function calcWith(apivot, start) {
      if (apivot.count + start > n) {
        return;
      }

      function colorPositions(range, aColor) {
        // console.log(" --- ===", range, aColor);
        const [start, end] = range;
        const { value, count } = aColor;
        if (end - start < count) {
          return [];
        } else if (end - start == count) {
          return [toStrFor(value, count)];
        }
        let result = [];
        for (let i = 0; i < end - count; i++) {
          const leftCount = i;
          const rightCount = end - count - i;

          const leftRemain = colorPositions([0, leftCount], aColor);
          const rightRemain = colorPositions([0, rightCount], aColor);
          console.log(" --- ", leftRemain, rightRemain);
          const left = toStrFor(".", leftCount);
          const right = toStrFor(".", rightCount);
          const middle = toStrFor(value, count);

          result.push(left + middle + right);
        }
        return result;
      }

      const leftBlocks = toStrFor(".", start);
      const rightBlocks = toStrFor(".", n - start - apivot.count);

      const leftOptions = colorPositions([0, start], next);
      leftOptions.forEach(option => {
        const newOption = option + pivotStr(apivot) + rightBlocks;
        addToSet(newOption);
      });
      const rightOptions = colorPositions([0, n - start - apivot.count], next);

      //   console.log(leftBlocks, leftOptions, rightOptions, rightBlocks);
      rightOptions.forEach(option => {
        const newOption = leftBlocks + pivotStr(apivot) + option;
        addToSet(newOption);
      });

      calcWith(apivot, start + 1);
    }
    calcWith(pivot, 0, 0);
  });
  console.log(Array.from(resultSet.values()).sort(), resultSet.size);
  return resultSet.size;
}

// triBicolorTiling(5, 2, 3, 4);
// triBicolorTiling(6, 2, 3, 4);
// triBicolorTiling(6, 2, 2, 2);
triBicolorTiling(10, 2, 3, 4);
// triBicolorTiling(10, 2, 2, 2);

function triBicolorTiling(n, r, g, b) {
  const resultSet = new Set();

  function addToSet(v) {
    resultSet.add(v);
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
    count: b,
    value: "b"
  };

  const colors = [red, green, blue];
  const selection = [[0, 1], [0, 2], [1, 2], [1, 0], [2, 1], [2, 0]];
  function toStrFor(aStr, aCount) {
    return new Array(aCount).fill(aStr).join("");
  }
  function pivotStr(apivot) {
    return toStrFor(apivot.value, apivot.count);
  }

  selection.forEach(c => {
    const [pivot, next] = [colors[c[0]], colors[c[1]]];
    const currentInputs = [];

    function calcWith(apivot, start) {
      if (apivot.count + start > n) {
        return;
      }

      function colorPositions(range, aColor) {
        // console.log(" --- ===", range, aColor);
        const [start, end] = range;
        const { value, count } = aColor;
        if (end - start < count) {
          return [];
        } else if (end - start == count) {
          return [toStrFor(value, count)];
        }
        let result = [];
        for (let i = 0; i < end - count; i++) {
          const leftCount = i;
          const rightCount = end - count - i;
          const left = toStrFor(".", leftCount);
          const right = toStrFor(".", rightCount);
          const middle = toStrFor(value, count);
          result.push(left + middle + right);
        }
        return result;
      }

      const leftBlocks = toStrFor(".", start);
      const rightBlocks = toStrFor(".", n - start - apivot.count);

      const leftOptions = colorPositions([0, start], next);
      leftOptions.forEach(option => {
        const newOption = option + pivotStr(apivot) + rightBlocks;
        addToSet(newOption);
        currentInputs.push(newOption);
      });
      const rightOptions = colorPositions([0, n - start - apivot.count], next);

      //   console.log(leftBlocks, leftOptions, rightOptions, rightBlocks);
      rightOptions.forEach(option => {
        const newOption = leftBlocks + pivotStr(apivot) + option;
        addToSet(newOption);
        currentInputs.push(newOption);
      });

      calcWith(apivot, start + 1);
    }
    calcWith(pivot, 0, 0);
    // 这里就已经拿到所有正确的组合 都是 已有两个单个的组合
    // 下一步找到 连续的 . 并将其替换成 等数量的 color 并记录可执行的个数
    function getRidOfBlackOptions() {
      let result = 0;
      let counting = new Set();
      function replaceTemp(aStr) {
        const nextStr = aStr.replace(new RegExp("@", "g"), ".");
        if (nextStr.length) {
          counting.add(nextStr);
        }
        resultSet.add(nextStr);
      }
      currentInputs.forEach(str => {
        const reg = /\.{2,}/gi;
        let matched;
        while ((matched = reg.exec(str)) != null) {
          // console.log(matched);
          // matched.forEach(matchedDots => {
          // 现在的问题是 在一定的长度中, 共有多少种组合方式?
          // 组合中必须含有至少一个 pivot 或者 next
          // 递归
          // console.log(matchedDots, " --- ");
          // });
        }
        function findCombinations(start, length, newOption) {
          replaceTemp(newOption);
          if (start >= length) {
            return;
          }
          [pivot, next, { count: 1, value: "@" }].forEach(aColor => {
            let rege;
            if (aColor.count > 1) {
              rege = new RegExp(`\\.{${aColor.count},${aColor.count}}`);
            } else {
              rege = new RegExp("\\.");
            }
            // replace it with
            const nextStr = newOption.replace(
              rege,
              toStrFor(aColor.value, aColor.count)
            );
            if (nextStr != newOption) {
              findCombinations(start + aColor.count, length, nextStr);
            }
          });
        }

        findCombinations(0, str.length, str);
      });
      // console.log(counting);
      return result;
    }
    getRidOfBlackOptions();
  });
  console.log(Array.from(resultSet.values()).sort(), resultSet.size);
  return resultSet.size;
}
