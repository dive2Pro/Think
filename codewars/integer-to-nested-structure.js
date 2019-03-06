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
  if (n < 2) {
    return n;
  }
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
    let primes = [2];
    let current = 2;
    let last = 0;
    return function actualFunction(prime) {
      const index = primes.indexOf(prime);
      if (index > -1) {
        return index + 1;
      }

      while (current <= prime) {
        current++;
        if (isPrime(current)) {
          last++;
          primes.push(current);
        }
      }
      return last + 1;
    };
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
    return (dec >>> 0).toString(2);
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

  const result = arry.map(item => {
    const re = mapRule(item);

    return re;
  });
  // FIXME: 这里的解括号还是有问题
  return result.reduce((p, c) => {
    return p * mapRule(c);
  }, 1);
}

const assert = require("assert");

console.log(encode(46));
console.log(encode(3));
console.log(encode(4));
console.log(encode(5));
console.log(encode(6));
console.log(encode(10000));
console.log(encode(10001));
console.log(encode(10002));
console.log(encode(10003));
assert(encode(46) === 185);
assert(encode(10004) === 2863321);

assert(decode(encode(3)) === 3);
assert(decode(encode(4)) === 4);
assert(decode(encode(5)) === 5);
assert(decode(encode(46)) === 46);
assert(decode(encode(10000)) === 10000);
assert(decode(encode(10001)) === 10001);
assert(decode(encode(10002)) === 10002);
assert(decode(encode(10003)) === 10003);
assert(decode(encode(10004)) === 10004);
