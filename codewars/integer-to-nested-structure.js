const isPrime = function(n) {
  if (n <= 3) {
    return n > 1;
  } else if (n % 2 === 0 || n % 3 === 0) {
    return false;
  }

  let i = 5;
  const sqrt = parseInt(Math.sqrt(n));
  while (i <= sqrt) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
};

function encode(n) {
  function findAllFactors(nb) {
    let result = [];
    let index = 2;
    while (nb !== 1) {
      const remainder = nb % index;
      if (remainder === 0) {
        nb = nb / index;
        result.push(index);
      } else {
        index++;
      }
    }
    return result;
  }

  function findPrimeIndexHoc() {
    function primes(n) {
      const b = new Array(n + 1).fill(true);
      let p = 2;
      const ps = [];

      for (p; p < n + 1; p++) {
        if (b[p]) {
          ps.push(p);
          for (let k = p; k < n + 1; k += p) {
            b[k] = false;
          }
        }
      }

      return ps;
    }

    const ps = primes(3163).slice(1);

    const sieve = new Array(500).fill(true);
    function count(lo, hi) {
      for (let i = 0; i < 500; i++) {
        sieve[i] = true;
      }

      for (let p of ps) {
        if (p * p > hi) {
          break;
        }

        // 在翻译成js的时候, 发现怎么调试结果都不正确
        // 仔细检查后发现原来是不同的编程语言的 % 操作是不同的
        // @link https://segmentfault.com/a/1190000015581794
        let q = ((lo + p + 1) / - 2)
        q = q - Math.floor( q / p) * p

        if (lo + q + q + 1 < p * p) {
          q += p;
        }

        for (let j = q; j < 500; j += p) {
          sieve[j] = false;
        }
      }

      const middle = Math.floor((hi - lo) / 2);
      return sieve.slice(0, middle).filter(Boolean).length;
    }

    const piTable = new Array(10000).fill(0);
    for (let i = 1; i < 10000; i++) {
      piTable[i] = piTable[i - 1] + count(1000 * (i - 1), 1000 * i);
    }

    function pi(n) {
      if (n < 2) {
        return 0;
      }

      if (n === 2) {
        return 1;
      }

      const i = Math.floor(n / 1000);
      return piTable[i] + count(1000 * i, n + 1);
    }

    return function actualFunction(prime) {
        return pi(prime)
    }
  }

  const findPrimeIndex = findPrimeIndexHoc();

  function mapRule(number) {
    if (number === 2) {
      return [];
    }
    return [...process(findPrimeIndex(number))];
  }

  function process(number) {
    const result = findAllFactors(number)
      .filter(isPrime)
      .sort((a, b) => a - b);

    return result.map(mapRule);
  }

  function turnToBrackets(ary) {
    if (ary.length !== 0) {
      return "[" + ary.map(turnToBrackets).join("") + "]";
    } else if (ary.length > 1) {
      return ary.map(turnToBrackets).join("");
    } else {
      return "[]";
    }
  }

  function replaceBracketWithDecimal(str) {
    return str.replace(/\[/gi, "1").replace(/\]/gi, "0");
  }

  function removeUselessBracket(str) {
    return str.replace(/(?:10+)$/g, "");
  }
  function binaryStringToDecimal(binary) {
    return Number.parseInt(binary, 2);
  }

  // const p1 = process(n);
  // const p2 = process(n);
  return binaryStringToDecimal(
    removeUselessBracket(
      replaceBracketWithDecimal(
        process(n)
          .map(item => {
            return turnToBrackets(item);
          })
          .join("")
      )
    )
  );
}

function findIndexPriceHoc() {
  let primes = [2, 3, 5, 7];
  return function actualFunction(index) {
    if (primes.length >= index) {
      return primes[index - 1];
    }
    let last = primes[primes.length - 1];
    while (primes.length < index) {
      last++;
      if (isPrime(last)) {
        primes.push(last);
      }
    }
    return last;
  };
}

const findIndexPrime = findIndexPriceHoc();

function decode(n) {
  /**
   * @link https://stackoverflow.com/questions/9939760/how-do-i-convert-an-integer-to-binary-in-javascript
   * @param dec
   * @returns {*}
   */
  function dec2bin(dec) {
    return (dec).toString(2);
  }

  let fullStr = dec2bin(n) + "1";
  const oneCount = fullStr.split("").filter(item => item === "1").length;
  const zeroCount = fullStr.length - oneCount;
  fullStr += new Array(oneCount - zeroCount).fill(0).join("");

  function replaceBinaryWithBracket(str) {
    return str.replace(/1/gi, "[").replace(/0/gi, "],");
  }
  const arryStr = "[" + replaceBinaryWithBracket(fullStr) + "]";
  const arry = eval(arryStr);

  function mapRule(ary, index) {
    if (Number.isInteger(ary)) {
      return ary;
    }
    if (ary.length === 0) {
      return 2;
    }
    if (ary.length === 1) {
      if (Array.isArray(ary[0])) {
        const first = ary[0];
        if (first.length > 1) {
          return [findIndexPrime(mapRule(ary[0]))];
        } else {
          return findIndexPrime(mapRule(ary[0]));
        }
      } else {
        return findIndexPrime(ary[0]);
      }
    }
    return [
      ary.reduce((p, c) => {
        let cr = mapRule(c);
        if (Array.isArray(cr)) {
          cr = mapRule(cr);
        }
        return p * cr;
      }, 1)
    ];
  }

  const result = arry.map((item, i) => {
    const re = mapRule(item);

    return re;
  });
  return result.reduce((p, c) => {
    return p * mapRule(c);
  }, 1);
}

const assert = require("assert");

// console.log(encode(46));
// console.log(encode(3));
// console.log(encode(4));
// console.log(encode(5));
// console.log(encode(6));
// console.log(encode(10000));
// console.log(encode(10001));
// console.log(encode(10002));
// console.log(encode(10003));
// assert(encode(46) === 185);
// assert(encode(10004) === 2863321);
//
// assert(decode(encode(3)) === 3);
// assert(decode(encode(4)) === 4);
// assert(decode(encode(5)) === 5);
// assert(decode(encode(46)) === 46);
// assert(decode(encode(10000)) === 10000);
// assert(decode(encode(10001)) === 10001);
// assert(decode(encode(10002)) === 10002);
// assert(decode(encode(10003)) === 10003);

// console.profile('q')
console.time("1");
//
// console.profileEnd('q')
// console.log(r);
// console.time("2");
// decode(r);
// console.timeEnd("2");
// assert(decode(encode(8205079)) === 8205079);
// assert(decode(encode(5174401)) === 5174401);
// assert(decode(encode(3253410)) === 3253410);
// assert(decode(encode(1967142)) === 1967142);
assert(decode(encode(795525)) === 795525);
// console.log(count)
console.timeEnd("1");
