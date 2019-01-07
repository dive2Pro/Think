const GOAL = 4;
const represent = ["r", "y", "-"]
const enum_borad = {
    red: "r",
    yellow: "y",
    space: '-'
}
const enum_on_board = {
    player: 'player',
    space: 'space'
}

const representmeaning = {
    "r" : enum_on_board.player,
    "y" : enum_on_board.player,
    "-" : enum_on_board.space,
}

/**
 * 
 * @param {[[string]]} board 
 */
function connectFour(board) {
    const boardobj = new Board(board);
    boardobj.run();
    return boardobj.result()
}

const Direction = {
    nw: [-1, -1] ,
    n: [0, -1],
    ne: [1, -1],
    w: [-1, 0],
    e: [1, 0],
    sw: [-1, 1],
    s: [0, 1],
    se: [1, 1]
}

const opposedirection = {
    "nw": "se",
    "n": "s",
    "ne": "sw",
    "w": "e",
    "sw": "ne",
    "s": "n",
    "se": "nw",
    "e": 'w'
}

const pubsub = function () {
    const cbs = []
    return {
        pub(...args) {
            cbs.forEach(cb => cb(...args))
        },
        sub(cb) {
            cbs.push(cb)
        }
    }
}();

class Board {

    constructor(board) {
        this.board = board;
        this.rows = this.board.length;
        this.columns = this.board[0].length;
        this.grids = []
        const self = this;
        function findfirstnospace() {
            loop:
                for(let i =0; i < self.rows; i ++ )  {
                    for(let k = 0; k < self.columns; k++) {
                        if(self.getvalue(k, i) != enum_borad.space) {
                            self. x = k;
                            self. y = i;
                            break loop;
                        }
                    }
                }
        }       
        findfirstnospace();
        function iswon(tag, value) {
            self.currentResult = value
        }
        pubsub.sub(iswon);
    }

    isfull() {
        const self = this
        const { columns, rows } = self
        return [[0, 0], [0, rows -1], [columns -1 , 0], [columns -1 , rows -1]].every((cardinal) => {
            return self.getvalue(cardinal[0], cardinal[1]) !== enum_borad.space
        })
    }
    isoverflow({x, y}, cardinal) {
        const nextx = x + cardinal[0]
        const nexty = y + cardinal[1]
        const {rows, columns} = this
        if( nextx < 0 || nextx == columns || nexty == rows || nexty < 0) {
            return true
        }
        return false
    }

    movetonext() {
        let { x, y, columns, rows, currentResult } = this
        if(currentResult) {
            console.log('We have a winner!');
            return;
        }
        if ( x + 1 == columns && y + 1 == rows) {
            console.log('no more move')
            return;
        }

        if( x + 1 == columns) {
            y += 1
            x = 0;
        } else {
            x += 1
        }
        this.x = x;
        this.y = y
        this.run();
    }

    getvalue(x, y) {
        const result = this.board[y][x]
        return result
    }

    addgrid(grid) {
        const { x, y } = grid
        this.grids[y] = this.grids[y] || []
        this.grids[y][x] = grid
    }
    run() {
        const { x, y } = this
        if(this.grids[y] && this.grids[y][x]) {
            this.grids[y][x].init()
        } else {
            new Grid(this, { x, y }).init()
        }
    };

    result() {
        const self = this
        const result = this.currentResult;
        function getboardstatus() {
            if(result != null) {
                return result.value;
            } else if(self.isfull()) {
                return 'draw'
            } else {
                return 'in progress'
            }
        }
        return getboardstatus()
    }
}

const directions = Object.keys(Direction);

class Grid {
    constructor(board, { x, y }) {
        this.x = x
        this.y = y
        this.value = board.getvalue(x, y)
        this.board = board;
        board.addgrid(this)
        this.next = null
        this.prev = null
        this.stop = false
        pubsub.sub((tag) => {
            this.stop = true
        })
        this.canmove = {};
        directions.forEach( key => {
            this.canmove[key] = true
        })
    }

    init() {
        if(this.value === enum_borad.space) {
        } else {
            const self = this
            directions.forEach( direction => {
                if(self.canmove[direction]) {
                    self.attemp(this, direction)
                }
            })
        }
        this.board.movetonext()
    }

    /**
     * 检查八个方向上相邻的 grid,
     *  检查到该方向上成功 * 或者是到达边界, 或者是失败
     * 
     * 第一个 grid 的 w, nw, n, ne 这四个方向是沙漠
     * 在某个方向上碰到同类时, 此时调用栈是 a1 -> a1.attemp() -> a2.
     * 
     * @param {grid} grid
     */
    attemp(grid, direction) {
       const nextgrid =  grid._go(Direction[direction])
       if(nextgrid === false) {
           this.close(direction)
           return 
       }
       nextgrid.prev = grid
       grid.next = nextgrid;
       nextgrid.compete(grid, direction)
    }

    /**
     * 
     * @param {[number]} cardinal 
     */
    _go(cardinal) {
        const {x, y} = this
        const nextx = x + cardinal[0]
        const nexty = y + cardinal[1]

        // 超过边界
        if(this.board.isoverflow(this, cardinal)) {
            return false
        }

        return new Grid(this.board, { x: nextx, y: nexty})
    }
    /**
     * 
     * @param {grid} nextgrid 
     * @param {keyof direction} direction 
     * @param {keyof direction } direction 
     */
    compete(grid, fromdirection ) {
        if(this.value === grid.value) {
            // move to next grid
            grid.test(this, fromdirection)
            if(!this.stop) {
                this.attemp(this, fromdirection)
            }
        } else {
            this.close(fromdirection)
        }
    }

    /**
     * 关闭该方向
     * 
     * @param {string} direction 
     */
    close(direction) {
        let grid = this
        if(grid.prev) {
            // close both direction
            while(grid) {
                // take care of the direction
                // grid.closedirection(opposedirection[direction])
                grid.closedirection(direction)
                const prevGrid = grid.prev;
                grid.prev = null
                grid = prevGrid
            }
        } else {
            // close this direction
            grid.closedirection(direction)
        }
    }

    closedirection(direction) {
        this.canmove[direction] = false
        // console.log(this, this.canmove)
    }

    test(grid) {
        let count = 1;
        // 不是测试是否有 prev
        while(grid.prev) {
            grid = grid.prev // 
            count ++
        }
        if(count === GOAL) {
            pubsub.pub('success', this)
        } 
    }

}


var boardAry = [['-','-','-','-','-','-','-'],
             ['-','-','-','-','-','-','-'],
             ['-','-','-','R','R','R','R'],
             ['-','-','-','Y','Y','R','Y'],
             ['-','-','-','Y','R','Y','Y'],
             ['-','-','Y','Y','R','R','R']];

console.log(betterSolution(boardAry))

const Y = 'y';
const R = 'r';
var expectDraw = [
    [Y,R,Y,R,Y,R,Y],
    [R,Y,R,R,Y,R,Y],
    [Y,Y,R,R,R,Y,R],
    [R,R,Y,Y,Y,R,Y],
    [Y,Y,Y,R,Y,R,Y],
    [R,Y,R,R,R,Y,R]];
console.log(betterSolution(expectDraw))


const Space ='-'

var expectY = [
    ['-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-'],
    ['-',R,'-','-','-','-','-'],
    ['-',R,Y,'-','-','-','-'],
    ['-',R,Y,Y,Y,Y,'-'],
    ['-',Y,R,R,Y,R,'-']];


function betterSolution(board) {
    const columns = board[0].length
    
    let  boardStr =  board.map( item => item.join("")).join(" ");
    function strReg (length) {
        return new RegExp("(\w).{"+length  + "}\1.{" + length + "}\1.{" + length + "}\1")
    }
    let m = [ 
            /(\w)\1\1\1/,
            strReg(columns),
            strReg(columns - 1),
            strReg(columns + 1)
        ].reduce((m , re) => { return m || boardStr.match(re)} , null)
    return m ? m[0] : boardStr.replace("-", "") == boardStr ? 'draw' : 'in progress';
}
