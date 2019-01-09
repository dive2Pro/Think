const assert = require('assert')
/**
 * 接受数组, 数组
 * @param {[[String]]} postStacks 
 */
function calculatePost(postStacks) {

}

/**
 * 
 * 解析字符串后:
 *  ast: {
 *      value: null 或者是  ([1-9]), + - *  / ^,
//  *      operator: null 或者是 + - *  / ^,
 *      type: number, operator, expression
 *      left:  ast,
 *      right: ast
 *  }
 * 
 */
function node() {
    return {

    }
}

/**
 * 
 * @param {*} str 
 * @returns string
 */
function trim(str) {
    return str.replace(/\s/gi, "")
}

/**
 * 从   3 + (15 ÷ (7 − (1 + 1))) × 3 − (2 + 3 ^ (1 + 1)) 
 *      中找出所有的优先级 
 * @param {*} infixNotation 
 */
function splitFromInfixToPostFix(infixNotation) {
    let current // 正在操作的字符
    let prev // 之前操作的数值
    let currentOperator // 正在进行中的操作符
    let prevOperator // 上一个操作符

    let index = 0 ;
    let nextIndex = 0;

    const wordsReg = /\d+/gi;

    let str = trim(infixNotation);
    let nextStr = str;
    // 解析到 ( 时, 使用 Reg 来获取 () 的值, 
    // 并开始解析这段截取的值
    // 最后截取字符串
    function run(obj) {
        prev = current;
        current = str[index];
        nextStr = str.substr(index);
        if(/\d/.test(current)) {
            if(obj.left){
                obj.left = current
            } else {
                obj.right = current
            }
        } else {
            prevOperator = currentOperator
            currentOperator = current
        }
    }
    run();

    class Engine {
        /**
         * 建立类 AST 解析时: 
         * - 开始时, 添加一个空 node -> head, head指向的是 *栈顶*
         * - 如果第一个是  (),
         *      -  设置它的 type 为 expression,
         *      -  调整 index 的位置, 截取这部分为 expression 的值
         *      -  设置它为 node 的 left, 并继续解析
         * *下面的为 当有 left 时继续解析的处理步骤*
         *          -  符号 
         *              - +, -  : 设置 node.operator
         *              - *, /  : 设置 node.operator
         *  栈顶的都是 带有 Operator 的 node, 如果没有分支了
         *                         检查栈顶的 node, 如果node .operator 的优先级 相比当前的
         *                          - 要低: 
         *                          - 平级: 
         *                         将当前的 node 入栈
         *                         head 指向一个新建的node
         *                         这个
         *              - ^ : 设置 node.addons, 'addons'
         *                  如果 下一个是 () 截取这一段 为 addons
         *                  如果 下一个是 值 , 截取这一个值
         *                  -  () 添加 一个新的 bnode 为  node.addons
         *                          {
         *                              type: 'expression',
         *                              expression : substr
         *                          }
         *                  -  数值 添加一个新的 bnode 为 node.addons
         *                          {
         *                              type: 'value',
         *                              value: string
         *                          }
         */
        constructor() {

        }
    }
}


function Engine (command) {
    const stacks = [];
    command = trim(command);

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

    const wordsReg = /\d+/gi;
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
                        if(head.value === '+' || head.value === '-') {
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
                    // 它们两个的优先级最低, 如果之前的是完备的 node, 这个operatorNode 应该是节点
                    if(!currentNode && !isStackEmpty()) {
                        const head = stacks.pop()
                        operatorNode.left = head
                    } else {
                        operatorNode.left = getAndResetLeft()
                    }
                    currentNode = operatorNode
                    break
            }
        }
        subCommand(current)
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
        _postOrder(stacks, postResult)
        return postResult.join('')
    }
    function _postOrder(stacks, result) {

        function precessWithNode(node, resultAry) {
            const { left, right, value, type, addons, _value } = node
            switch(node.type) {
                case 'operator': 
                    // right 有可能为null, // --此时后一个 node 的值才是这一个的 right--
                    if(right) {
                        precessWithNode(left, resultAry)
                        precessWithNode(right, resultAry)
                    } else {
                        // 当 right 为null 时,
                        console.log(resultAry)
                        const tempAry = []
                        precessWithNode(left, tempAry)
                        tempAry.forEach( i => {
                            resultAry.unshift(i)
                        })
                    }

                    resultAry.push(value)
                    break
                case 'express':
                    resultAry.push(postOrder(_value))
                    if(addons) {
                        precessWithNode(addons, resultAry)
                        resultAry.push('^')
                    }
                    break
                case 'value': 
                    resultAry.push(node.value)
                    if(addons) {
                        precessWithNode(addons, resultAry)
                        resultAry.push('^')
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

    function start() {
        while(command.length) {
            run()
        }
        return stacks;
    }
    return {
        start,
        postOrder
    }
}



function toPostfix(infix) {
    const postStacks = splitFromInfixToPostFix(infix)
    const result = calculatePost(postStacks)
    return result
}

{
    const engine = Engine("2+7")
    const result = engine.start()
    assert(result.length === 1)
    assert(result[0].left.value === '2')
    assert(result[0].right.value === '7')

    assert(engine.postOrder(result) === '27+')
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
    // 562-9*+371-^+
    const result = engine.start()
    console.log(result)
    assert(engine.postOrder(engine.start()) === '562-9*+371-^+')
}
