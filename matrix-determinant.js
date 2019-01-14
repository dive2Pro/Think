const assert = require('assert')

const Test = {
    assertEquals(v, v2) {
        assert(v === v2)
    }
}


function determinant(m) {

    /**
     * Base Matrix -> [ [a,b], [c,d] ]
     *
     * @param matrix
     * @return number
     */
    const calcBaseMatrix = matrix => {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    }

    const calcMatrix = (matrix) => {
        let result = 0
        const length = matrix.length;
        if(length === 1) {
            return matrix[0][0]
        }
        if(length === 2) {
            return calcBaseMatrix(matrix)
        }
        let fixedRow = 0;
        function remove(row, column) {
            let copy = matrix.slice();
            copy.shift();
            copy = copy.map( ary => ary.filter((_, i) => i !== column))
            return copy;
        }
        for(let i = 0; i< length ; i ++  ) {
            const operator = i % 2 === 0 ? 1 : -1;
            const value = matrix[0][fixedRow];
            const minor = remove(0, fixedRow ++)
            result += operator * value * (calcMatrix(minor))
        }
        return result
    }
    // return calcMatrix(m)
    return calcMatrix(m)
}


/**
 * TODO: 也许只适用 3x3 matrix
 * @param m
 * @returns {*}
 */
function test (m) {
    const height = m.length;
    const width = m[0].length
    if(height === 1 && width === 1) {
        return m[0][0]
    }
    function calcWithDirection(direction) {
        let total = 0;
        for(let c = 0 ; c < width; c ++) {
            let c_w = direction === 1 ? c : width - 1 - c;
            let c_h = 0
            let value = 1;
            for(let r = 0 ; r < height ; r ++) {
                value = value * m[c_h][c_w];
                c_h = (c_h + 1) % height
                c_w = (c_w + direction) < 0 ? width -1 : (c_w + direction) % width
            }
            total += value
        }
        return total
    }

    return calcWithDirection(1) - calcWithDirection(-1)
}

const m1 = [ [1, 3], [2,5]]
const m2 = [
    [2,5,3],
    [1,-2,-1],
    [1, 3, 4]]

Test.assertEquals(determinant([[1]]), 1)
Test.assertEquals(determinant(m1),-1)
Test.assertEquals(determinant(m2),-20)