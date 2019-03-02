class Primes {
  static *stream() {
    let start = 1;
    while (true) {
      start++;
      if (isPrime(start)) {
        yield start;
      }
    }
  }
}

function isPrime(n) {
  if (n <= 3) {
    return n > 1;
  } else if (n % 2 === 0 || n % 3 === 0) {
    return false;
  }

  let i = 5;
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
    i += 6;
  }
  return true;
}

const assert = require("assert");

function verify(from_n, ...vals) {
  const stream = Primes.stream();
  for (let i = 0; i < from_n; ++i) {
    const value = stream.next();
    // console.log(value)
  }
  for (let v of vals) assert(stream.next().value === v);
}

verify(0, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29);
verify(10, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71);
