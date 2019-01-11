const assert = require('assert')

const Test = {
    assertEquals(v, v2) {
        assert(v === v2)
    }
}

/**
 *  数据结构的图,
 *
 * @param firstDot
 * @param length
 * @return number - the number of combinations starting from the given point,
 *                  that have the given length
 */
function countPatternsFrom(firstDot, length) {
    if(length < 1 || length > 9) {
        return 0
    }
    if(length === 1) {
        return 1
    }

    // 图以向量为基本单位
    const express = [
        "A", "B", "C",
        "D", "E", "F",
        "G", "H", "I"
    ]
    const board = [
        [0,0], [0,1], [0,2],
        [1,0], [1,1], [1,2],
        [2,0], [2,1], [2,2]
    ]

    const chart = express.reduce((p,c,index) => {
        p[c] = board[index]
        return p
    } , {})

    const start = chart[firstDot]
    const calcCostLength = (p1, p2) => {
        return p1[0] - p2[0] + p1[1] - p2[1]
    }
    // p1 p2 连接成一条线
    // 如果在这条线上有其他点 则该点当前不可到达
    const canConnect = (p1, p2) => {
        // 判断是否在这条线上可能会有点 :
        //  p1 x = p2 x && p1 y - p2 y === 2
        //  p1 x - p2 x === 2 && p1 y - p2 y === 0 || 2
        const xDistance = Math.abs(p1[0] - p2[0])
        const yDistance = Math.abs(p1[1] - p2[1])

        return (xDistance === 1 || yDistance === 1)
        // return ((xDistance === 0 || xDistance === 2) && yDistance !== 1) ||
        //     ((yDistance === 0 || yDistance === 2) && xDistance !== 1)

    }
    /**
     *  point 连接 remain 中的某一个时, 要考虑 length 的长度
     *
     *  TODO: passing over a point that has already been 'used'
     *  将要每一个可能性
     * @param remain
     * @param point
     * @param length
     */
    let possible = 0;
    const isSamePoint = (p1, p2) => {
        return p1[0] === p2[0] && p1[1] === p2[1]
    }

    const step = (remain, point, length) => {
        if(length <= 1) {
            return;
        }
        remain.forEach( p => {
            if(canConnect(p, point)) {
                possible += 1;
                step( remain.filter( p2 => !isSamePoint(p2, p)) , p , length - 1)
            }
        })
    }

    step(board.filter( p2 => !isSamePoint(p2, start)) ,start, length )
    return possible;
}



Test.assertEquals(countPatternsFrom('A', 0), 0); // 没有点击
Test.assertEquals(countPatternsFrom('A', 10), 0); // 点击超过 9, 但是图标是不可重复划击的
Test.assertEquals(countPatternsFrom('B', 1), 1); // 单点

// 2 个点, 对角不可跳
// [cb, cf, ce, cd, ch]
// Test.assertEquals(countPatternsFrom('C', 2), 5);
// Test.assertEquals(countPatternsFrom('D', 2), 7);
Test.assertEquals(countPatternsFrom('D', 3), 37);
Test.assertEquals(countPatternsFrom('E', 4), 256);
Test.assertEquals(countPatternsFrom('E', 8), 23280);
