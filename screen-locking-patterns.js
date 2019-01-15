const assert = require('assert')

const Test = {
    assertEquals(v, v2) {
        assert(v === v2)
    }
}

/**
 *  ??????,
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

    const express = [
        "A", "B", "C",
        "D", "E", "F",
        "G", "H", "I"
    ]

    const board = [
        [0,0], [1,0], [2,0],
        [0,1], [1,1], [2,1],
        [0,2], [1,2], [2,2]
    ]

    const chart = express.reduce((p,c,index) => {
        p[c] = board[index]
        return p
    } , {})


    const start = chart[firstDot]
    const calcCostLength = (p1, p2) => {
        return p1[0] - p2[0] + p1[1] - p2[1]
    }

    // 如果路径中的中间位置已经经过
    // 中间这一点就不能算作一点
    const canConnect = (remain, start, end) => {
        //  p1 x = p2 x && p1 y - p2 y === 2
        //  p1 x - p2 x === 2 && p1 y - p2 y === 0 || 2
        const xDistance = Math.abs(start[0] - end[0])
        const yDistance = Math.abs(start[1] - end[1])
        const isDistanceOnlyOne =  (xDistance === 1 || yDistance === 1)
        if(isDistanceOnlyOne === false) {
            // 此时连线距离大于1
            // 检查中间这个点是否在 remain中, 如果不在, 则表示这个已经是经过了的
            // FIXED passing over a point that has already been 'used'
            const middle = [
                start[0] === end[0] ? start[0] :  xDistance / 2,
                start[1] === end[1] ? end[1] :  yDistance / 2,
            ]
            return remain.find((re) => isSamePoint(re, middle)) == null
        }
        return true
    }
    /**
     *  point  remain length
     *
     * @param remain
     * @param point
     * @param length
     */
    let possible = 0;
    const isSamePoint = (p1, p2) => {
        return p1[0] === p2[0] && p1[1] === p2[1]
    }

    const saveClueRecord = clue => {
        const result = Object.keys(clue).sort().reverse().map( k => clue[k])
        // console.log(result, possible)
    }

    const step = (remain, point, length, clue) => {
        clue[length] = point
        if(length <= 1) {
            // 此时步骤已经走完
            // originClues.splice(0, originClues.length)
            possible += 1
            saveClueRecord(clue)
            return;
        }

        remain.forEach( (p, index) => {
            if(canConnect(remain, point, p)) {
                const nextLength = length - 1
                const nextRemain = remain.filter( p2 => !isSamePoint(p2, p))
                step(nextRemain , p , nextLength, clue)
            }
        })
    }

    // 为了debug, 每个节点散发出去的这个结构是这样的:

    /**
     * {
     *              - b1
     *       - a1   - b2
     *
     *                      - b1
     *              - b2
     *
     *     a - a2   - b1    - b2
     *
     *       - a3
     *
     * }
     */
    const  originClues = {

    }
    step(board.filter( p2 => !isSamePoint(p2, start)) ,start, length , originClues)
    return possible;
}



Test.assertEquals(countPatternsFrom('A', 0), 0); // ????
Test.assertEquals(countPatternsFrom('A', 10), 0); // ???? 9, ????????????
Test.assertEquals(countPatternsFrom('B', 1), 1); // ??

// 2 ??, ?????
// [cb, cf, ce, cd, ch]
// D A -> [B, G, E, F, H] -> 5
// D
// Test.assertEquals(countPatternsFrom('C', 2), 5);
// Test.assertEquals(countPatternsFrom('D', 2), 7);
Test.assertEquals(countPatternsFrom('D', 3), 37);
Test.assertEquals(countPatternsFrom('E', 4), 256);
Test.assertEquals(countPatternsFrom('E', 8), 23280);
