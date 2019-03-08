console.log(pi(1000));
console.log(pi(6543223));

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
        let q = (lo + p + 1) / -2;
        q = q - Math.floor(q / p) * p;

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

module.exports = pi
