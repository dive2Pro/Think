function divideWithLength(a, splitCount = 4, isReverse = true) {
  a = String(a);
  if (a.length <= 1) {
    return [a];
  }
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
        /* 只是一个判断有问题, 花费了几个小时来找这个错误, 每个小模块的测试也是有必要的, 并且务必要测试条件充分*/
        item = zero.substr(0, 4 - item.length) + item;
      }
      return item.substr(item.length - 4);
    })
    .reverse();
  return (up + result.join("")).replace(/^0+/, "");
}

function minusLargeNumber(a, b) {
  const ar = divideWithLength(a);
  const br = divideWithLength(b);
  let isAGreater = compareAbs(a, b);

  let aIndex = 0;
  let bIndex = 0;
  let result = [];

  if (isAGreater === 0) {
    return "0";
  }

  if (isAGreater === 1) {
    aIndex = ar.length - br.length;
    result = ar.slice(0, aIndex);
  } else {
    bIndex = br.length - ar.length;
    result = br.slice(0, bIndex);
  }

  while (true) {
    if (aIndex === ar.length || bIndex === br.length) {
      break;
    }
    if (isAGreater === 1) {
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

function multiplyLargeNumber(a, b) {
  const ar = divideWithLength(a);
  const br = divideWithLength(b);
  let outerPrev = "0";
  let prev = "0";
  br.reverse().forEach((aItem, aIndex) => {
    prev = "0";
    const reversed = ar.slice().reverse();
    reversed.forEach((bItem, bIndex) => {
      const postFix = new Array(bIndex).fill(zero).join("");
      const current = String(aItem * bItem) + postFix;
      prev = plus(prev, current);
    });
    const withPadding = prev + new Array(aIndex).fill(zero).join("");
    outerPrev = plus(outerPrev, withPadding);
    prev = "0";
  });

  return outerPrev === "" ? "0" : outerPrev;
}

function compareAbs(a, b) {
  if (+a === 0 && +b === 0) {
    return 0;
  } else if (+a === 0) {
    return -1;
  } else if (+b === 0) {
    return 1;
  }
  if (Array.isArray(a)) {
    a = a.join("");
  }
  if (Array.isArray(b)) {
    b = b.join("");
  }

  a = a.replace(/^0+/, "");
  b = b.replace(/^0+/, "");

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

function trim(ary) {
  let i = ary.length;
  while (ary[--i] === 0);
  ary.length = i + 1;
}

function divideLargeStrings(a, b, retain = 15) {
  function innerDivide(ary) {
    return divideWithLength(ary, 1);
  }

  let ar = innerDivide(a);
  const br = innerDivide(b);
  const base = 10;

  let a_l = ar.length,
    b_l = br.length,
    post = [],
    result = [],
    index = 0;

  while (index < a_l) {
    post.push(ar[index++]);
    // 这一段将后缀的 0 抹掉
    trim(post);
    if (compareAbs(post, br) < 0) {
      result.push(0);
      continue;
    }
    let guess, highx, highy;

    highx = post[0] * base + +(post[1] ? post[1] : "0");

    highy = br[1] ? br[0] * base + +(br[1] ? br[1] : "0") : br[0];
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

  let divider = result.join("").replace(/^0+/, "");
  if (divider === "") {
    divider = "0";
  }

  return [divider, minusLargeNumber(a, multiplyLargeNumber(divider, b))];
}

function largeDiv(a, b) {
  if (+b === 0) {
    throw new Error("0 can not be divider");
  }
  if (+a === 0) {
    return "0";
  }
  let isNegative = false;
  if (Number(a) < 0 && Number(b) < 0) {
    a = a.substr(1);
    b = b.substr(1);
  } else if (Number(a) > 0 && Number(b) < 0) {
    isNegative = true;
    b = b.substr(1);
  } else if (Number(a) < 0 && Number(b) > 0) {
    isNegative = true;
    a = a.substr(1);
  }

  function decimalLength(n) {
    if (Number.isInteger(+n)) {
      return 0;
    }
    return n.split(".")[1].length;
  }

  const a_dl = decimalLength(a);
  const b_dl = decimalLength(b);
  const commonMultiply = Math.max(a_dl, b_dl);
  const limit = 20;

  function fillWithZero(an, length) {
    if (length == 0) {
      return an;
    }
    const [q, p = ""] = an.split(".");

    const r = q + p + new Array(length - p.length).fill("0").join("");
    return r.replace(/^0+/g, "");
  }
  a = fillWithZero(a, String(commonMultiply));
  b = fillWithZero(b, String(commonMultiply));

  function process(na, nb, count, result) {
    const [c, d] = divideLargeStrings(na, nb);
    result.push(c);
    if (d == 0 || count++ === limit + 1) {
      return;
    }
    process(d + "0", nb, count, result);
  }
  let result = [];
  let diffLength = 0;
  if (compareAbs(a, b) < 0) {
    diffLength = Math.abs(a.length - b.length) + 1;
    a += new Array(diffLength).fill("0").join("");
  }
  process(a, b, 0, result);
  if (diffLength) {
    const first = result[0];
    if (diffLength >= first.length) {
      const diffAry = new Array(diffLength - first.length).fill("0");
      const diffStr = diffAry.join("") + result.join("");
      result = `0.${diffStr}`;
    } else {
      if (first.length === 1) {
        result = `0.${result.join("")}`;
      } else {
        result =
          first.substr(0, first.length - 1) +
          `.${first[first.length - 1]}${result.join("")}`;
      }
    }
  } else {
    if (result.length > 1) {
      result = result[0] + "." + result.slice(1).join("");
    } else {
      result = result[0];
    }
  }
  const [q, p = ""] = result.split(".");
  if (!p) {
    result = q;
  } else {
    result = q + "." + p.substr(0, limit).replace(/0+$/, "");
  }
  if (+result === 0) {
    return "0";
  }
  console.log(result);
  return `${isNegative ? "-" + result : result}`;
}

const assert = require("assert");

assert(
  largeDiv(
    "10304506520411685330054696866974332928698492316799983389050475703862878599362328932659232001813192102856545",
    "1106"
  ) ===
    "9316913671258305000049454671767027964465182926582263462070954524288316997615125617232578663483898827175.89963833634719710669"
);
assert(largeDiv("907799", "1010913") === "0.89799913543499786826");

assert(
  largeDiv("57657158965697612113263438787665279499022", "6") ===
    "9609526494282935352210573131277546583170.33333333333333333333"
);
assert(largeDiv("562", "56982354782154521") === "0.0000000000000098627");
assert(largeDiv("1", "1") === "1");
assert(largeDiv("5", "2") === "2.5");
assert(largeDiv("-5", "-2") === "2.5");
assert(largeDiv("13.25", "-0.53") === "-25");
assert(largeDiv("-6", "2") === "-3");
assert(largeDiv("22", "7") === "3.14285714285714285714");
assert(largeDiv("1", "3") === "0.33333333333333333333");
assert(largeDiv("1", "9") === "0.11111111111111111111");
assert(largeDiv("1", "10000000000000000000000000") === "0");
assert(largeDiv("50", "3") === "16.66666666666666666666");
assert(largeDiv("0.5", "0.866025403") === "0.57735026971258486282");
assert(largeDiv("1", "10000000000000000000000000") === "0");
