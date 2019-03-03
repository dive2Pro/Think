// https://www.codewars.com/kata/battleship-field-validator/train/javascript

/**
 *  FIXME:
 *      检查是否有斜向相邻的 1 存在
 *      如果没有再检查 各种舰的存在个数
 * @param field {[[number]]}
 */
function validateBattlefield(field) {
  const str = field.map(row => row.join("")).join("\n");
  function determentOblique() {
    const reg = /(1([10\n]{11})1)|(1([10\n]{9})1)/gi;
    return reg.test(str);
  }

  if (determentOblique()) {
    return false;
  }

  function determentCounts() {
    let newStr = field.map(row => row.join("")).join("");
    let calc = 0;
    const isNoLessShip = [[4, 1], [3, 2], [2, 3], [1, 4]].every(
      ([length, count]) => {
        calc = 0;
        function verticalDeterment() {
          let result;
          const regStr = "((1)([10]{9}))";
          const reg = new RegExp(`${regStr}{${length}}`, "gi");
          while ((result = reg.exec(newStr)) != null) {
            calc++;
            newStr = newStr.replace(reg, function(word) {
              return word
                .split("")
                .map((s, index) => {
                  if (index % 10 === 0) {
                    return 0;
                  }
                  return s;
                })
                .join("");
            });
          }
        }

        function horizonDeterment() {
          let result;
          const reg = new RegExp(`(1{${length}})`, "");
          while ((result = reg.exec(newStr)) != null) {
            calc++;
            newStr = newStr.replace(reg, new Array(length).fill("0").join(""));
          }
        }
        // TODO: 这里拿到的是一串 如 :  1000010000100001
        //        要将匹配的这几段的第一个1给替换掉
        if (length === 1) {
        } else {
          verticalDeterment();
        }
        horizonDeterment();
        return calc === count;
      }
    );

    return isNoLessShip
  }

  return determentCounts();
}

const assert = require("assert");

assert(
  validateBattlefield([
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
  ]) === true
);

assert(
  validateBattlefield([
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]) === false
);
