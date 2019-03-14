// Expected: '['3414990',
// '73398598494894631970554118110829322444415764752125230834469300185009672715990994150572960677254687871722792808027049136156119337870771680359780000\']',
// instead got: '['3414990', '7.339859864734738e+145']'

/**
 *  js 中的最大安全整数 {@link https://medium.com/dailyjs/javascripts-number-type-8d59199db1b6}
 *  超过后的数会被表示为: 7.339859849489463e+145
 *  这样会丢失数字的精度
 *  解决办法是利用数列式计算, 按10进位
 *  TODO: 这里使用的是按 10000 进位
 */

function divideWithLength(a, splitCount = 4) {
  let reversedA = a
    .split("")
    .reverse()
    .join("");
  const ar = [];
  while (reversedA.length >= splitCount) {
    ar.push(
      reversedA
        .substring(0, splitCount)
        .split("")
        .reverse()
        .join("")
    );
    reversedA = reversedA.substr(splitCount);
  }
  if (reversedA.length) {
    ar.push(
      reversedA
        .split("")
        .reverse()
        .join("")
    );
  }
  return ar.reverse();
}
function divideStrings(a, b) {
  const ar = divideWithLength(a);
  const br = divideWithLength(b);
  const minLength = Math.min(ar.length, br.length);
  const maxLength = Math.max(ar.length, br.length);
  const diff = maxLength - minLength;

  function plus() {
    let aIndex = 0;
    let bIndex = 0;
    let result = [];
    if (diff === 0) {
    } else {
      if (minLength === ar.length) {
        bIndex = br.length - minLength;
        result = br.slice(0, bIndex);
      } else {
        aIndex = ar.length - minLength;
        result = ar.slice(0, aIndex);
      }
    }

    while (true) {
      if (aIndex === ar.length) {
        break;
      }
      result[Math.max(aIndex, bIndex)] = +ar[aIndex] + +br[bIndex];
      aIndex++;
      bIndex++;
    }
    let up = "0";
    const zero = "0000";

    result = result
      .reverse()
      .map(item => {
        item = String(+up + +item);
        if (+item === 0) {
          return zero;
        }
        if (item.length > 4) {
          up = item.substring(0, item.length - 4);
        } else {
          up = "0";
          item = zero.substr(0, item.length) + item;
        }
        return item.substr(item.length - 4);
      })
      .reverse();
    result = (up + result.join("")).replace(/^0+/, "");
    console.log(result);
    return result;
  }

  function minus() {
    let isAGreater = undefined;

    let aIndex = 0;
    let bIndex = 0;
    let result = [];
    if (minLength === ar.length) {
      bIndex = br.length - minLength;
      result = br.slice(0, bIndex);
      isAGreater = false;
    } else {
      isAGreater = true;
      aIndex = ar.length - minLength;
      result = ar.slice(0, aIndex);
    }

    let isEqual = false;
    if (isAGreater === undefined) {
      while (true) {
        if (aIndex === ar.length) {
          isEqual = true;
          break;
        }
        const indexResult = +ar[aIndex] - +br[bIndex];
        if (indexResult !== 0 && isAGreater === undefined) {
          isAGreater = indexResult > 0;
          break;
        }
        aIndex++;
        bIndex++;
      }
    }

    if (isEqual) {
      return 0;
    }

    while (true) {
      if (aIndex === ar.length) {
        break;
      }
      if (isAGreater) {
        result[Math.max(aIndex, bIndex)] = +ar[aIndex] - +br[bIndex];
      } else {
        result[Math.max(aIndex, bIndex)] = +br[aIndex] - +ar[bIndex];
      }
      aIndex++;
      bIndex++;
    }

    let borrow = 0;
    const zero = "0000";
    const conclution = result
      .reverse()
      .map(item => {
        item -= borrow;
        if (item < 0) {
          item = 10000 + borrow;
          borrow = 1;
        } else {
          borrow = 0;
        }
        if (item === 0) {
          return zero;
        }
        return zero.replace(/^0+/, "") + item;
      })
      .reverse()
      .join("")
      .replace(/^0+/, "");

    return isAGreater ? conclution : "-" + conclution;
  }
  return minus();
}

// divideStrings(
//   "2320036276531210888643541764971472811902028538660766718244093362935422079905832001486945819661520558229591418300726487559950498147955442654058000000",
//   "8320036276531210888643541764971472811902028538660766718244093362935422079905832001486945819661520558229591418300726487559950498147955442654058100000"
// );

// divideStrings("123", "1230");
const assert = require("assert");
assert(divideStrings("1230323", "1230432") === "-109");
assert(
  divideStrings(
    "320036276531210888643541764971472811902028538660766718244093362935422079905832001486945819661520558229591418300726487559950498147955442654058000000",
    "2320036276531210888643541764971472811902028538660766718244093362935422079905832001486945819661520558229591418300726487559950498147955442654058000000"
  ) ===
    "-2" +
      "320036276531210888643541764971472811902028538660766718244093362935422079905832001486945819661520558229591418300726487559950498147955442654058000000"
        .split("")
        .map(() => "0")
        .join("")
);
