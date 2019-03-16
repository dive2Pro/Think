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

  while (true) {
    if (aIndex === ar.length) {
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

let assert = require("assert");

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

// assert(
//   minusLargeNumber(
//     "939505827968948445973544748857230403738254348855530393872821114747954031898000000000",
//     "939504057761136033770201049795370502853553145445177729752438704117440898699920000000"
//   ) ===
//     "1770207812412203343699061859900884701203410352664120382410630513133198080000000"
// );

let open = false;
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
      const rp = plus(prev, current);
    //   console.log(`${aItem} * ${bItem}`);
    //   console.log(
    //     `
    //   prev = ${new Array(72 - prev.length).fill(" ").join("")}${prev}
    //   re   = ${new Array(72 - current.length).fill(" ").join("")}${current}
    // outer  = ${new Array(72 - rp.length).fill(" ").join("")}${rp}
    //     `
    //   );
      prev = rp;
    });
    if (open) {
    }
    // console.log(aItem, a, b);
    const withPadding = prev + new Array(aIndex).fill(zero).join("");
    const last = plus(outerPrev, withPadding);
    console.log(aItem, " !");
    if (open) {
      console.log(
        `
      prev = ${new Array(72 - outerPrev.length).fill(" ").join("")}${outerPrev}
      re   = ${new Array(72 - withPadding.length)
        .fill(" ")
        .join("")}${withPadding}
    outer  = ${new Array(72 - last.length).fill(" ").join("")}${last}
        `
      );
    }
    outerPrev = last;
    prev = "0";
  });

  return outerPrev === "" ? "0" : outerPrev;
}
assert(
  multiplyLargeNumber("615890885328133965222845725150", "6646") ===
    "4093210823890778332871032689346900"
);

console.log(plus("7218280000000000000", "108000649704248"));
// assert();
open = true;
assert(
  multiplyLargeNumber("158712943806334851810027081406646", "3988") ===
    "632947219899663389018388000649704248"
);
const test1 = multiplyLargeNumber(
  "158712943806334851810027081406646",
  "726172858908853281339883465222845725150"
);
open = false;

assert(
  multiplyLargeNumber(
    "726172858908853281339883465222845725150",
    "158712943806334851810027081406646"
  ) ===
    "115253032149686357613393802731270567086219729693177191505592109899346900"
);

(function() {
  let prev = "0";
  const ary = divideWithLength("158712943806334851810027081406646");
  ary.forEach((str, index) => {
    const result = [
      "726172858908853281339883465222845725150",
      "4263360854653877614746455824323327252355650",
      "2137126723768755206983277038150834969116450",
      "5855131761382084007443480380091805081884450",
      "2530712413297353685469493876301617352147750",
      "1314372874625024439225189072053350762521500",
      "196066671905390385961768535610168345790500",
      "5911047071518065710106651406913964202721000",
      "4826144820308238907784865509871032689346900"
    ];
    const re = multiplyLargeNumber(
      str,
      "726172858908853281339883465222845725150"
    );

    const reEnd = re + new Array(ary.length - index - 1).fill("0000").join("");
    const next = plus(reEnd, prev);
    // console.log(str, index, "prev = ", prev, " re = ", re);
    console.log(`
      prev = ${new Array(next.length - prev.length).fill(" ").join("")}${prev}
      re   = ${new Array(next.length - reEnd.length)
        .fill(" ")
        .join("")}${reEnd} 
      next = ${next}
      `);
    prev = next;
    assert(re === result[index]);
  });
  console.log(prev === test1);
})();
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
//
// assert(
//   multiplyLargeNumber(
//     "158712943806334851810027081406646",
//     "28777608657985832625975726172858908853281339883465222845725150"
//   ) ===
//     "4567378985815600761057984409124530832791014316799961120567086219729693177191505592109899346900"
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
  // if (a == 0) {
  //   return ["0", String(b)];
  // }
  function innerDivide(ary) {
    return divideWithLength(ary, 1);
  }

  let ar = innerDivide(a);
  const br = innerDivide(b);
  const base = 10;

  let a_l = ar.length,
    b_l = br.length,
    post = [],
    ps = 0,
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
    let guess,
      highx,
      highy,
      p_l = post.length;

    highx = post[0] * base + +(post[1] ? post[1] : "0");
    highy = br[0] * base + +(br[1] ? br[1] : "0");
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

  let divider = result.join("").replace(/^0+/, "");
  if (divider === "") {
    divider = "0";
  }

  const r = [divider, minusLargeNumber(a, multiplyLargeNumber(divider, b))];

  return r;
}

// assert(
//   divideLargeStrings(
//     "4567378985815600761057984409124549009115290307115109574181817969628530746835620232187309098000",
//     "28777608657985832625975726172858908853281339883465222845725150"
//   ).every(
//     (item, index) =>
//       item ===
//       [
//         "158712943806334851810027081406646",
//         "18176324275990315148453614731749898837569644114640077409751100"
//       ][index]
//   )
// );

assert(
  divideLargeStrings("600001", "100").every(
    (item, index) => item === ["6000", "1"][index]
  )
);
assert(
  divideLargeStrings("0", "5").every(
    (item, index) => item === ["0", "0"][index]
  )
);

assert(
  divideLargeStrings("1000", "10").every(
    (item, index) => item === ["100", "0"][index]
  )
);

assert(
  divideLargeStrings("10", "2").every(
    (item, index) => item === ["5", "0"][index]
  )
);

assert(
  divideLargeStrings("469568889900", "1387").every(
    (item, index) => item === ["338550028", "1064"][index]
  )
);

assert(
  divideLargeStrings("1784803210000", "3981").every(
    (item, index) => item === ["448330371", "3049"][index]
  )
);

assert(
  divideLargeStrings(
    "704226164031802189360946130268885680894923364752136228054441817267065696023954924537510314584727338809158443849575864562745396548000000000",
    "25215643464820888352367793775362441659277185288133631851836673958543698824000000"
  ).every(
    (item, index) =>
      item ===
      [
        "27928145677277264181388818628421527094806598639506431121552",
        "14852371209841923144411663584126756630303179041699016160927078704573093152000000"
      ][index]
  )
);

// assert(
//   divideLargeStrings(
//     "939505827968948445973544748857230403738254348855530393872821114747954031898000000000",
//     "5360263235206627606064865179808357882910865086523675942263674198488297610000000"
//   ) ===
//     "1770207812412203343699061859900884701203410352664120382410630513133198080000000"
// );
