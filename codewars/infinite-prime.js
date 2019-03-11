const small_primes = new Set([
  2,
  3,
  5,
  7,
  11,
  13,
  17,
  19,
  23,
  29,
  31,
  37,
  41,
  43,
  47,
  53,
  59,
  61,
  67,
  71,
  73,
  79,
  83,
  89,
  97,
  101,
  103,
  107,
  109,
  113,
  127,
  131,
  137,
  139,
  149,
  151,
  157,
  163,
  167,
  173,
  179,
  181,
  191,
  193,
  197,
  199,
  211
]);

const max_int = 2147483647;
const offsets = [
  10,
  2,
  4,
  2,
  4,
  6,
  2,
  6,
  4,
  2,
  4,
  6,
  6,
  2,
  6,
  4,
  2,
  6,
  4,
  6,
  8,
  4,
  2,
  4,
  2,
  4,
  8,
  6,
  4,
  6,
  2,
  4,
  6,
  2,
  6,
  6,
  4,
  2,
  4,
  6,
  2,
  6,
  4,
  2,
  4,
  2,
  10,
  2
];
// # pre-calced sieve of eratosthenes for n = 2, 3, 5, 7
const indices = [
  1,
  11,
  13,
  17,
  19,
  23,
  29,
  31,
  37,
  41,
  43,
  47,
  53,
  59,
  61,
  67,
  71,
  73,
  79,
  83,
  89,
  97,
  101,
  103,
  107,
  109,
  113,
  121,
  127,
  131,
  137,
  139,
  143,
  149,
  151,
  157,
  163,
  167,
  169,
  173,
  179,
  181,
  187,
  191,
  193,
  197,
  199,
  209
];
class Primes {
  static *stream() {
    let start = 0;
    while (true) {
      start = nextPrime(start);
      yield start;
    }
  }
}


function isPrime(n) {
  // 如果 n 是一个 32位的数字, 执行一个完整的分治算法
  if (n < 212) {
    return small_primes.has(n);
  }
  for (let p of small_primes) {
    if (n % p === 0) {
      return false;
    }
  }
  if (n < max_int) {
    let i = 211;
    while (i * i < n) {
      for (let o of offsets) {
        i += o;
        if (n % i === 0) {
          return false;
        }
      }
    }
    return true;
  }
}

// # primes less than 212
function nextPrime(on) {
  if (on < 2) return 2;

  // 第一个比 n 大的奇数
  let n = (on + 1) | 1;

  if (n < 212) {
    while (true) {
      if (small_primes.has(n)) {
        return n;
      }
      n += 2;
    }
  }

  // 通过二分法找到 筛选的数字位置
  let x = Number.parseInt(n % 210);
  let s = 0;
  let e = 47;
  let m = 24;

  while (m !== e) {
    if (indices[m] < x) {
      s = m;
      m = (s + e + 1) >> 1;
    } else {
      e = m;
      m = (s + e) >> 1;
    }
  }

  let i = Number.parseInt(n + (indices[m] - x));

  const offs = offsets.slice(m).concat(offsets.slice(0, m));
  while (true) {
    for (let o of offs) {
      if (isPrime(i)) {
        return i;
      }
      i += o;
    }
  }
}

const assert = require("assert");

function verify(from_n, ...vals) {
  const stream = Primes.stream();
  for (let i = 0; i < from_n; ++i) {
    const value = stream.next();
    // console.log(value)
  }
  for (let v of vals) {
    const value = stream.next().value;
    // console.log(value, v);
    assert(value === v);
  }
}

verify(0, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29);
verify(10, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71);
verify(1000, 7927, 7933, 7937, 7949, 7951, 7963, 7993, 8009, 8011, 8017);
