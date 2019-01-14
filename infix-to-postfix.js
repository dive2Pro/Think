const assert = require('assert')

/**
 * 
 * @param {*} str 
 * @returns string
 */
function trim(str) {
    return str.replace(/\s/gi, "")
}

function Engine (originCommand) {
    let stacks = [];
    let command = trim(originCommand);

    let index = 0;
    let currentNode;

    function resetCurrentNode() {
        currentNode = null
    }
    function initNode(node = {}) {
        if(!node) {
            node = {}
        }
        return node;
    }
    let left
    function getAndResetLeft() {
        const v = left
        left = null
        return v
    }
    // 分为 currentNode 有无两种
    function dealWithNumber(str) {
        function value() {
            return {
                type: 'value',
                value: str
            }
        }
        if(currentNode) {
            // 只有未满的
            currentNode.right = value()

            pushCurrentNode()
        } else {
            left = value()
        }
    }

    function subCommand(str) {
        const length = str.length;
        command = command.substr(length)
    }

    const brackeReg = /(\(.+?\))/gi;

    function getNextBracket() {
        let count = 1;
        let str = '('
        for(let i = 1; i < command.length ; i ++ ) {
            const nextStr = command[i];
            if(nextStr === '(') {
                count ++;
            } else if (nextStr === ')') {
                count --;
            }
            str += nextStr
            if(count === 0 ) {
                break
            }
        }
        return str
    }
    function pushCurrentNode() {
        stacks.push(currentNode)
        currentNode = null;
    }

    function nextNumber() {
        const number = command[index];
        return number;
    }

    /**
     * head 这些节点都是以
     */
    function getHead() {
        return stacks[stacks.length - 1]
    }

    function getExpressValue(node) {
        const express = node.value
        const expressContent = express.slice(1, express.length - 1)
        node._value = Engine(expressContent).start()
    }

    function run () {
        const current = command[index];
        const wordsReg = /\d+/gi;
        if(wordsReg.test(current)) {
            dealWithNumber(current)
        } else {
            let operatorNode
            switch(current) {
                case '(':
                    // 截取这个 bracket 作为 left 或者right
                    const express = getNextBracket()
                    const node = initNode()
                    node.type = 'express'
                    node.value = express;
                    getExpressValue(node)
                    // 证明是类似 (1 + 3) ... 这样以 ()为首
                    if(!currentNode) {         
                        left = node;
                    } else {
                        if(!currentNode.left)  {
                            // TODO remove
                            currentNode.left = currentNode
                        } else if (!currentNode.right) {
                            currentNode.right = node
                            pushCurrentNode();
                        }
                    }
                    subCommand(express);

                    if(command.length <= 0 && left) {
                        currentNode = node;
                        pushCurrentNode();
                    }

                    return;
                case '^': 
                    // 会截取下一个值, 可能是 (value...) 也可能是 [1-9]
                    subCommand(current);
                    let addons = initNode()
                    if(command.startsWith("(")) {
                        const express = getNextBracket()
                        addons.type = 'express'
                        addons.value = express
                        getExpressValue(addons)
                    } else {
                        const value = nextNumber()
                        addons.type = 'value'
                        addons.value = value
                    }
                    subCommand(addons.value)
                    if(left) {
                        left.addons = addons
                    } else if (currentNode) {
                        // 如果 currentNode 存在, 证明该currentNode 还未满, 此时有且只有 left
                        currentNode.left.addons = addons
                    } else {
                        const head =  getHead();
                        // head 一定是一个 operator node, 且是满足的, ^ 是作用在 right 上面的
                        head.right.addons = addons
                        // if(isExpress(head)) {
                        //     head.addons = addons;
                        // } else {
                        //    // 如果是不 express
                        // }
                    }
                    return
                case '/': 
                case '*': 
                    operatorNode = {
                        type: 'operator',
                        value: current
                    }
                    if(!currentNode && !isStackEmpty()) {
                        // 需要比较和上一个 node 的优先级,
                        const head = getHead();
                        // 如果优先级高于, 栈顶不出栈, 但 右节点 需要拿出来
                        if(isGreaterOperator(operatorNode, head)) {
                            operatorNode.left = head.right
                            head.right = null
                            currentNode = operatorNode
                        }
                        // 同级
                        else {
                            operatorNode.left = stacks.pop();
                            currentNode = operatorNode
                        }
                    } else {
                        // 此时为 stack 是 empty
                        operatorNode.left = getAndResetLeft();
                        currentNode = operatorNode
                    }
                    break
                case '+': 
                case '-': 
                    operatorNode = {
                        type: 'operator',
                        value: current
                    }
                    // 它们两个的优先级最低, 如果之前的是完备的 node,
                    // 并且 这个 node 的优先级高于当前的, 需要检查上上一个node
                    // 如果上上一个node 和当前的同级, 则需要将上一个放入该right
                    // 这个operatorNode 应该是节点
                    if(!currentNode && !isStackEmpty()) {
                        const head = stacks.pop()
                        if(isGreaterOperator(head, operatorNode) && stacks.length ) {
                            const nextHead = stacks.pop()
                            nextHead.right = head;
                            operatorNode.left = nextHead

                        } else {
                            operatorNode.left = head
                        }
                    } else {
                        operatorNode.left = getAndResetLeft()
                    }
                    currentNode = operatorNode
                    break
            }
        }
        subCommand(current)

    }
    function isGreaterOperator(node, otherNode) {
        return ["*", "/"].find( st => st === node.value) &&
                ["+", "-"].find((st => st === otherNode.value))
    }

    function isStackEmpty() {
        return stacks.length === 0
    }
    /**
     * 
     * @param {[*]} stacks 
     */
    function postOrder(stacks) {
        let postResult = []
        _order('post', stacks, postResult)
        return postResult.join('')
    }

    function _order(order, stacks, result) {
        function precessWithNode(node, resultAry) {
            const { left, right, value, type, addons, _value } = node
            function opeWithOrder(value, cb) {
                if(order === 'prefix') {
                    resultAry.push(value)
                }
                cb()
                if(order === 'post') {
                    resultAry.push(value)
                }
            }
            switch(type) {
                case 'operator': 
                    // right 有可能为null, // --此时后一个 node 的值才是这一个的 right--
                    opeWithOrder(value, () => {
                        if(right) {
                            precessWithNode(left, resultAry)
                            precessWithNode(right, resultAry)
                        } else {
                            // 当 right 为null 时, 置 left 到队首
                            const tempAry = []
                            precessWithNode(left, tempAry)
                            resultAry.splice(0,0, ...tempAry)
                        }
                    })

                    break
                case 'express':
                    resultAry.push( order === 'post' ?  postOrder(_value) : prefixOrder(_value))
                    if(addons) {
                        opeWithOrder('^', () => {
                            precessWithNode(addons, resultAry)
                        })
                    }
                    break
                case 'value':
                    if(addons) {
                        opeWithOrder('^', () => {
                            resultAry.push(node.value)
                            precessWithNode(addons, resultAry)
                        })
                    } else {
                        resultAry.push(node.value)
                    }

                    break
            }

        }
        while(stacks.length) {
            const currentNode = stacks.pop()
            precessWithNode(currentNode, result)
        }
        return result
    }
    function prefixOrder(stacks) {
        let postResult = []
        _order('prefix', stacks, postResult)
        return postResult.join('')
    }
    function start() {
        _init()
        while(command.length) {
            run()
        }
        return stacks;
    }
    function _init() {
        currentNode = null
        command = trim(originCommand)
        stacks = []
    }
    return {
        start,
        postOrder,
        prefixOrder
    }
}

{
    const engine = Engine("2+7")
    const result = engine.start()
    assert(result.length === 1)
    assert(result[0].left.value === '2')
    assert(result[0].right.value === '7')
    assert(engine.postOrder(result) === '27+')
    assert(engine.prefixOrder(engine.start()) === '+27')
}

{
    const engine = Engine('(2+7)')
    const result = engine.start()
    assert(result[0].type === 'express')
    assert(engine.postOrder(result) === '27+')
}

{
    const engine = Engine("1 + (2 + 7 )")
    const result = engine.start()

    assert(result.length === 1)
    assert(result[0].left.value === '1')
    assert(result[0].right.type === 'express')
    assert(engine.postOrder(result) === '127++')
}
{
    const engine = Engine("1^3 + (2 + 7 )")
    const result = engine.start()

    assert(result.length === 1)
    assert(result[0].left.value === '1')
    assert(result[0].left.addons.value === '3')
    assert(result[0].right.type === 'express')

    assert(engine.postOrder(result) === '13^27++')
}

{
    const engine = Engine("1^3 + (2 + 7 )^(3+2)")
    const result = engine.start()

    assert(result.length === 1)
    assert(result[0].left.value === '1')
    assert(result[0].left.addons.value === '3')
    assert(result[0].right.type === 'express')
    assert(result[0].right.addons.type === 'express')

    assert(engine.postOrder(result) === '13^27+32+^+')
}

{
    const engine = Engine("1^3 * 3 + (2 + 7 )^(3+2)")
    const result = engine.start()

    assert(result.length === 1)
    assert(result[0].value === '+')
    assert(result[0].left.type === 'operator')
    assert(result[0].left.value === '*')
    assert(result[0].right.type === 'express')
    assert(result[0].right.addons.type === 'express')
}

{
    const engine = Engine("1^3 * 3 + (2 + 7 )^(3+2)*3")
    const result = engine.start()

    assert(result.length === 2)
    assert(result[0].value === '+')
    assert(result[0].right === null)
    assert(result[1].type === 'operator')
    assert(result[1].value === '*')
    assert(result[1].left.addons.type === 'express')
    assert(result[1].right.type === 'value')
    assert(result[1].right.value === '3')
}

{
    const engine = Engine('3*3/(7+1)')
    assert(engine.postOrder(engine.start()) === '33*71+/')
}

{
    const engine = Engine('5+(6-2)*9+3^(7-1)')
    const result = engine.start()
    console.log(result)
    assert(engine.postOrder(engine.start()) === '562-9*+371-^+')
    assert(engine.prefixOrder(engine.start()) === '++5*-629^3-71')
    // +5*-629+^3-71
}

{
    const engine = Engine('(5-4-1)+9/5/2-7/1/7')
    const result = engine.start()
    assert(engine.postOrder(engine.start()) === '54-1-95/2/+71/7/-')
}
