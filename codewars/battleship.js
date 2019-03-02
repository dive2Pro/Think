// https://www.codewars.com/kata/battleship-field-validator/train/javascript

/**
 *  FIXME:
 *      检查是否有斜向相邻的 1 存在
 *      如果没有再检查 各种舰的存在个数
 * @param field {[[number]]}
 */
function validateBattlefield(field) {
  const requirement = {
    battleShip: {
      length: 4,
      count: 1
    },
    cruisers: {
      length: 3,
      count: 2
    },
    destroyers: {
      length: 2,
      count: 3
    },
    submarines: {
      length: 1,
      count: 4
    }
  };
  const str = field.map(row => row.join("")).join("\n");

  function determentOblique() {
    const reg = /(1([10\n]{11})1)|(1([10\n]{9})1)/gi;
    return reg.test(str);
  }

  if (determentOblique()) {
    return false;
  }

  function determentCounts() {
    const newStr = field.map(row => row.join("")).join("");
    return [[4, 1], [3, 2], [2, 3], [1, 4]].every(([length, count]) => {
      let result;
      const reg = new RegExp(`1([10]{9}1){${length}`, "gi");
      let calc = 0;
      while ((result = reg.exec(newStr)) != null) {
        calc++;
      }
      return calc === count;
    });
  }

  return determentCounts();
}

const assert = require("assert");

assert(
  [
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ] === true
);
