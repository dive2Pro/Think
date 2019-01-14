const assert = require('assert')

const Test = {
    assertEquals(v, v2) {
        assert(v === v2)
    }
}

function nextBigger(n) {
    n = '' + n
    const isSameDigits = () => {
        return n.length === 1 || n.replace(new RegExp(n[0], 'gi'), '') === ''
    }

    const isTheBiggest = () => {
        return n.split("").reduce((p, c) => {
            if (p === false) {
                return false
            }

            if (p - c >= 0) {
                return c
            }
            return false
        }) !== false
    }

    if (isSameDigits() || isTheBiggest()) {
        return -1;
    }

    const findTheNextBiggerInPlace = () => {
        // 从右到左检查, 正常是逆序
        // 碰到第一个落点, 将其插入与第一个(如果是多个相同的值, 那么和相同的最后一个)比落点大的位置
        let max = Number.MIN_SAFE_INTEGER
        let index = 0;
        for(let i = n.length - 1; i > 0 ; i --) {
            if(n[i] >= max) {
                max = n[i]
            } else {
                max = n[i]
                index = i;
                break;
            }
        }
        const rightNumbers = n.slice(index);
        let target = ''
        for(let i = rightNumbers.length - 1 ; i > 0; i--) {
            if(rightNumbers[i] > n[index]) {
                target = rightNumbers[i]
                break
            }
        }
        const switchString = n[index]
        const changeIndex = rightNumbers.indexOf(target)
        const ary = n.split("")
        ary[index] = target
        ary[index + changeIndex] = switchString
        // 继续正序排序右边的
        const result = ary.slice(0, index + 1).concat(ary.slice(index + 1).sort())

        return Number(result.join(""))
    }

    return findTheNextBiggerInPlace()
}





Test.assertEquals(nextBigger(1234567890),1234567908)
Test.assertEquals(nextBigger(2365),2536)
Test.assertEquals(nextBigger(12),21)
Test.assertEquals(nextBigger(531),-1)
Test.assertEquals(nextBigger(111),-1)
Test.assertEquals(nextBigger(513),531)
Test.assertEquals(nextBigger(2017),2071)
Test.assertEquals(nextBigger(414),441)
Test.assertEquals(nextBigger(144),414)