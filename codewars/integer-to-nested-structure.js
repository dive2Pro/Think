function encode(n) {
  function findAllFactors(nb) {
    const sqrt = parseInt(Math.sqrt(nb));
    let result = [];
    for (let i = 1; i <= sqrt; i++) {
      if (nb % i === 0) {
        if (i > 1) {
          result.push(i);
        }
        result.push(nb / i);
      }
    }
    return result;
  }
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
      .sort();

    return result.map(mapRule);
  }

  function turnToBrackets(ary) {
    if (ary.length !== 0) {
      return "[" + ary.map(turnToBrackets).join("") + "]";
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

function decode(n) {}

console.log(encode(46));
console.log(encode(3));
console.log(encode(4));
console.log(encode(5));
console.log(encode(6));
