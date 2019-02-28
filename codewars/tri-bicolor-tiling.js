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
// triBicolorTiling(20, 2, 3, 4);

function triBicolorTiling(n, r, g, b) {
  console.log(n, r, g, b);

  console.time("2");
  const resultSet = new Set();

  function addToSet(v) {
    counting++;
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

  let counting = 0;
  selection.forEach(c => {
    console.time(1);
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
          result.push(
            toStrFor(".", leftCount) +
              toStrFor(value, count) +
              toStrFor(".", rightCount)
          );
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
    console.time("calc");
    calcWith(pivot, 0, 0);
    console.timeEnd("calc");
    // 这里就已经拿到所有正确的组合 都是 已有两个单个的组合
    // 下一步找到 连续的 . 并将其替换成 等数量的 color 并记录可执行的个数
    function getRidOfBlackOptions() {
      let result = 0;
      function replaceTempAndSave(aStr) {
        const nextStr = aStr.replace(new RegExp("@", "g"), ".");
        addToSet(nextStr);
      }
      currentInputs.forEach(str => {
        // console.time("currentInput");
        const reg = /\.{2,}/gi;
        let matched = reg.exec(str);
        if (!matched) {
          return;
        }

        function testAvaiable(str) {
          return [pivot, next].some(aColor => {
            return new RegExp(`\\.{${aColor.count},${aColor.count}}`).test(str);
          });
        }

        function findCombinations(start, length, newOption) {
          replaceTempAndSave(newOption);
          if (!testAvaiable(newOption)) {
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

        // console.timeEnd("currentInput");
      });
      // console.log(counting);
      return result;
    }
    // console.time("getRid");
    getRidOfBlackOptions();
    // console.timeEnd("getRid");
    console.timeEnd(1);
  });

  console.log(counting, " -- ");
  console.log(resultSet.size);
  // console.log(Array.from(resultSet.values()), resultSet.size);
  console.timeEnd("2");
  return resultSet.size;
}

/**
 *
 * 前面的处理会导致很多额外的计算, 从而导致性能低下
 * 在 (10, 2, 2, 2) 的情况下 浪费有将近10倍
 * 浪费的主力在于: 首轮处理导致二轮处理的量指数增加
 * 解决办法:
 *  1. 选出两个元素 [r,g] 和 [@]进行组合, 在 [n] 的长度限制下 找到尽可能多的组合方式
 *  2. 确保 [r,g]两个元素都至少有一次被调用
 *
 *  FIXME: 1 已经办到, 只要正确处理2 就可
 *  --- 2 的处理办法 ---
 *  1. 记录 [r,g]被调用的次数[a,b], 在这个递归链条中, 如果下一次 [testAvaiable]返回的为false
 *     并且[a,b]没有都 > 0 则不添加到最终结果中
 *  FIXME: 在处理 超大可能性的时候 会因为计算次数过多导致内存爆掉, 比如 (100, 2, 3, 4)
 */
function proposal_first(n, r, g, b) {
  console.time("proposal");
  const resultSet = new Set();
  let counting = 0;
  function addToSet(v) {
    counting++;
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
  const selection = [[0, 1], [0, 2], [1, 2]];

  function toStrFor(aStr, aCount) {
    return new Array(aCount).fill(aStr).join("");
  }
  // TODO: 这里在 (20,2,2,2) 的情况下会用掉一半的时间
  function replaceTempAndSave(aStr) {
    // aStr = aStr.replace(new RegExp("@", "g"), ".");
    addToSet(aStr);
  }

  selection.forEach(([a, b]) => {
    const aC = colors[a];
    const bC = colors[b];

    function testAvaiable(str) {
      return [aC, bC].filter(aColor => {
        return str.indexOf(toStrFor(".", aColor.count)) > -1;
        // return new RegExp(`\\.{${aColor.count},${aColor.count}}`).test(str);
      });
    }

    function recursionFind(newOption, aUsed, bUsed, dotIndex) {
      const ary = [aC, bC].filter(aColor => {
        return aColor.count + dotIndex <= newOption.length;
      });

      if (aUsed > 0 && bUsed > 0) {
        replaceTempAndSave(newOption);
      }
      if (!ary.length) {
        return;
      }
      ary.push({ count: 1, value: "@" });
      // [aC, bC, { count: 1, value: "@" }]
      ary.forEach(aColor => {
        let atemp = aUsed;
        let btemp = bUsed;
        if (aColor.count > 1) {
          if (aColor == aC) {
            atemp++;
          } else if (aColor == bC) {
            btemp++;
          }
          const left = newOption.substr(0, dotIndex);
          const right = newOption.substr(dotIndex);
          const index = right.indexOf(toStrFor(".", aColor.count));
          const nextStr =
            right.substr(0, index) +
            toStrFor(aColor.value, aColor.count) +
            right.substr(index + aColor.count);
          recursionFind(left + nextStr, atemp, btemp, dotIndex + aColor.count);
        } else {
          // rege = new RegExp("\\.");
          recursionFind(newOption, aUsed, bUsed, dotIndex + 1);
        }
        // replace it with
        // const nextStr = newOption.replace(
        //   rege,
        //   toStrFor(aColor.value, aColor.count)
        // );
        // if (nextStr != newOption) {
        //   recursionFind(nextStr, atemp, btemp);
        // }
      });
    }
    recursionFind(toStrFor(".", n), 0, 0, 0);
  });

  // console.log(resultSet);
  console.log(counting, " --- --- ", resultSet.size);
  // console.log(resultSet.size);
  console.timeEnd("proposal");
  // return resultSet.size;
  return counting;
}

function proposal(n, r, g, b) {
  console.time("proposal");
  const resultSet = new Set();
  let counting = 0;
  function addToSet(v) {
    counting++;
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
  const selection = [[0, 1], [0, 2], [1, 2]];

  function toStrFor(aStr, aCount) {
    return new Array(aCount).fill(aStr).join("");
  }

  function replaceTempAndSave(aStr) {
    // aStr = aStr.replace(new RegExp("@", "g"), ".");
    addToSet(aStr);
  }

  selection.forEach(([a, b]) => {
    const aC = colors[a];
    const bC = colors[b];
    aC.str = toStrFor(aC.value, aC.count);
    aC.dotStr = toStrFor(".", aC.count);
    bC.str = toStrFor(bC.value, bC.count);
    bC.dotStr = toStrFor(".", aC.count);

    function testAvaiable(str, dotIndex) {
      return [aC, bC].some(aColor => {
        return aColor.count + dotIndex <= str.length;
      });
    }

    function recursionFind(newOption, aUsed, bUsed, dotIndex) {
      const ary = testAvaiable(newOption, dotIndex);
      if (aUsed > 0 && bUsed > 0) {
        replaceTempAndSave(newOption);
      }
      if (!ary) {
        return;
      }

      [aC, bC].forEach(aColor => {
        let atemp = aUsed;
        let btemp = bUsed;
        if (aColor == aC) {
          atemp++;
        } else {
          btemp++;
        }
        const left = newOption.substr(0, dotIndex);
        const right = newOption.substr(dotIndex);
        const index = right.indexOf(aColor.dotStr);
        const nextStr =
          right.substr(0, index) +
          aColor.str +
          right.substr(index + aColor.count);
        recursionFind(left + nextStr, atemp, btemp, dotIndex + aColor.count);
      });

      recursionFind(newOption, aUsed, bUsed, dotIndex + 1);
    }
    recursionFind(toStrFor(".", n), 0, 0, 0);
  });

  // console.log(resultSet);
  console.log(counting, " --- --- ", resultSet.size);
  // console.log(resultSet.size);
  console.timeEnd("proposal");
  // return resultSet.size;
  return counting;
}
console.time("empty");

for (let i = 0; i < 3014442; i++) {
  if (i % 2 === 0 && i % 3 === 0) {
  }
  // new RegExp(/\\.{2}/).exec("asdf");
  // "asdf".replace("s", "@@@");
}

console.timeEnd("empty");
// triBicolorTiling(10, 2, 3, 4);
// proposal(10, 2, 3, 4);
proposal(20, 2, 2, 2);
// proposal(100, 2, 3, 4);
