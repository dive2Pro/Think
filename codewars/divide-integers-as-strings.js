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

function divideWithLength(a, splitCount = 4, isReverse = true) {
  let ary = transformArray(a);
  const ar = [];
  function transformArray(ary) {
    if (isReverse) {
      return ary
        .split("")
        .reverse()
        .join("");
    }
    return ary;
  }
  while (ary.length >= splitCount) {
    ar.push(transformArray(ary.substring(0, splitCount)));
    ary = ary.substr(splitCount);
  }
  if (ary.length) {
    ar.push(transformArray(ary));
  }
  return isReverse ? ar.reverse() : ar;
}

const zero = "0000";

/**
 *
 * @param a
 * @param b
 * @returns {String}
 */
function plus(a, b) {
  const ar = divideWithLength(a);
  const br = divideWithLength(b);
  const minLength = Math.min(ar.length, br.length);
  const maxLength = Math.max(ar.length, br.length);
  const diff = maxLength - minLength;

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
  return (up + result.join("")).replace(/^0+/, "");
}

function minusLargeNumber(a, b) {
  const ar = divideWithLength(a);
  const br = divideWithLength(b);
  const minLength = Math.min(ar.length, br.length);
  const maxLength = Math.max(ar.length, br.length);
  let isAGreater = undefined;

  let aIndex = 0;
  let bIndex = 0;
  let result = [];
  if (minLength === maxLength) {
  } else if (minLength === ar.length) {
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
  const conclusion = result
    .reverse()
    .map(item => {
      item -= borrow;
      if (item < 0) {
        item = 10000 + item;
        borrow = 1;
      } else {
        borrow = 0;
      }
      if (item === 0) {
        return zero;
      }
      if (String(item).length > 3) {
        return item;
      }
      return new Array(4 - String(item).length).fill("0").join("") + item;
    })
    .reverse()
    .join("")
    .replace(/^0+/, "");

  if (conclusion === "") {
    return "0";
  }
  return isAGreater ? conclusion : "-" + conclusion;
}

const assert = require("assert");
// assert(minusLargeNumber("1230323", "1230432") === "-109");
// assert(
//   minusLargeNumber(
//     "320036276531210888643541764971472811902028538660766718244093362935422079905832001486945819661520558229591418300726487559950498147955442654058000000",
//     "2320036276531210888643541764971472811902028538660766718244093362935422079905832001486945819661520558229591418300726487559950498147955442654058000000"
//   ) ===
//     "-2" +
//       "320036276531210888643541764971472811902028538660766718244093362935422079905832001486945819661520558229591418300726487559950498147955442654058000000"
//         .split("")
//         .map(() => "0")
//         .join("")
// );
assert(
  minusLargeNumber(
    "939505827968948445973544748857230403738254348855530393872821114747954031898000000000",
    "939504057761136033770201049795370502853553145445177729752438704117440898699920000000"
  ) ===
    "1770207812412203343699061859900884701203410352664120382410630513133198080000000"
);

function multiplyLargeNumber(a, b) {
  const ar = divideWithLength(a);
  const br = divideWithLength(b);
  let outerPrev = "0";
  br.reverse().forEach((aItem, aIndex) => {
    let prev = "0";
    const reversed = ar.slice().reverse();
    reversed.forEach((bItem, bIndex) => {
      const postFix = new Array(bIndex).fill(zero).join("");
      const current = String(aItem * bItem) + postFix;
      prev = plus(prev, current);
    });
    outerPrev = plus(outerPrev, prev + new Array(aIndex).fill(zero).join(""));
    prev = "0";
  });

  return outerPrev;
}

// assert(multiplyLargeNumber("34", "3") === "102");
// assert(multiplyLargeNumber("1234", "4321") === "5332114");
// assert(multiplyLargeNumber("12983129374", "987521") === "12821112902541854");
// assert(
//   multiplyLargeNumber("123456789012345678901", "987654321098765432101") ===
//     "121932631137021795224857491221237463801001"
// );
// assert(
//   multiplyLargeNumber(
//     "12345678901234567890112312343425623465",
//     "98765432109876543210141235345854682345"
//   ) ===
//     "1219326311370217952250300024470394799261293874475216792488970827621153225425"
// );

function moduleStrings(a, b) {
  const divisor = Math.floor(divideLargeStrings(a, b));
  const c = multiplyLargeNumber(b, divisor + "");
  const d = minusLargeNumber(a, c);
  return d;
}

//
// assert(
//   moduleStrings(
//     "939505827968948445973544748857230403738254348855530393872821114747954031898000000000",
//     "5360263235206627606064865179808357882910865086523675942263674198488297610000000"
//   ) ===
//     "1770207812412203343699061859900884701203410352664120382410630513133198080000000"
// );
//
// assert(
//   moduleStrings(
//     "806160378791769632145949425386117897986198850319404809328923212111802902139796726577002039605249868269904022000000",
//     "11473912626946940954600256434679307219404988661902653420283242873500"
//   ) === "8950850288266066345366157503055559809845551220953401574138612487500"
// );

function compareAbs(a, b) {
  let isAGreater = undefined;
  let isEqual = false;
  if (a.length === b.length) {
    let aIndex = 0;
    let bIndex = 0;
    while (true) {
      if (aIndex === a.length) {
        isEqual = true;
        break;
      }
      const indexResult = +a[aIndex] - +b[bIndex];
      if (indexResult !== 0) {
        isAGreater = indexResult > 0;
        break;
      }
      aIndex++;
      bIndex++;
    }
  } else isAGreater = a.length > b.length;
  return isEqual ? 0 : isAGreater ? 1 : -1;
}

/**
 *  超大数的除法实现
 *  首先把 a, b 划分为 万进制 的数组 ar, br
 *  while()
 *    通过从高到低一步步将 ar 的 item 拿到 组合成一个数值来检查什么时候可以 大于 b
 *    这个数值就是 guess 值
 *    拿到这个guess 值, 开始继续 猜, (guess -- ) * b  比较 a
 *    如果 guess * b < a 则跳出 猜 链
 *    将 a = a - (guess * b)
 *    记录 guess
 *  end
 *  最后 记录所有的guess, 就为 商,
 *  a - b * 商 = 余数
 *
 * @param {String} a 被除数
 * @param {String} b 除数
 * @param {Number}retain  保留的小数点后数字的个数
 */
function divideLargeStrings(a, b, retain = 15) {
  function innerDivide(ary) {
    return divideWithLength(ary, 4, true);
  }
  let ar = innerDivide(a);
  const br = innerDivide(b);
  const base = 10000;

  let a_l = ar.length,
    b_l = br.length,
    post = [],
    ps = 0,
    result = [],
    index = 0;

  while (index < a_l) {
    post.push(ar[index++]);
    if (compareAbs(post, br) < 0) {
      continue;
    }
    let guess,
      highx,
      highy,
      p_l = post.length;

    highx = post[0] * base + +post[2];
    highy = br[0] * base + +br[2];
    // if (highx < highy) {
    //   highx *= 10;
    // }
    if (post.length > b_l) {
      highx = (highx + 1) * base;
    }
    guess = Math.ceil(highx / highy);
    let waitForMinus;
    do {
      const c = multiplyLargeNumber(b, guess + "");
      if (compareAbs(c, post.join("")) < 1) {
        waitForMinus = c;
        break;
      }
      guess--;
    } while (guess);
    result.push(guess);
    post = innerDivide(minusLargeNumber(post.join(""), waitForMinus));
  }

  const divider = result.join("");
  const r = [divider, minusLargeNumber(a, multiplyLargeNumber(divider, b))];

  return r
}

assert(
  divideLargeStrings(
    "939505827968948445973544748857230403738254348855530393872821114747954031898000000000",
    "5360263235206627606064865179808357882910865086523675942263674198488297610000000"
  ) ===
    "1770207812412203343699061859900884701203410352664120382410630513133198080000000"
);
