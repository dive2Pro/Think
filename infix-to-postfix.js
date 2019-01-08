
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
    return str.replace(" ", "")
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

class Engine {
    constructor(command) {
        this.command = command

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

    function dealWithNumber(str) {

    }

    function subCommand(str) {
        const length = str.length;
        command.substr(length)
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

    function run () {
        const current = command[index];
        if(wordsReg.test(current)) {
            dealWithNumber(current)
        } else {
            switch(current) {
                case '(':
                    const express = getNextBracket()
                    const node = initNode()
                    node.type = 'express'
                    node.value = express;

                    // 证明是类似 (1 + 3) ... 这样以 ()为首
                    if(!currentNode) {         
                        currentNode = initNode(currentNode)
                    }
                    if(!currentNode.left)  {
                        currentNode.left = currentNode
                    } else if (!currentNode.right) {
                        currentNode.right = currentNode
                        pushCurrentNode();
                    }
                    subCommand(express);
                    return;
                case '^': 
                    subCommand(current);
                    let addons = initNode()
                    if(command.startsWith("(")) {
                        const express = getNextBracket()
                        addons.type = 'express'
                        addons.value = express
                    } else {
                        const value = nextNumber()
                        addons.type = 'value'
                        addons.value = value
                    }
                    subCommand(addons.value)

                    if (currentNode) {
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
                    break
                case '/': 
                    break
                case '*': 
                    break
                case '+': 
                case '-': 
                    const operatorNode = {
                        type: 'operator',
                        value: current
                    }
                    // 它们两个的优先级最低, 如果之前的是完备的 node, 这个operatorNode 应该是节点
                    if(!currentNode) {
                        const head = stacks.pop()
                        operatorNode.left = head
                    } else {
                        operatorNode.left = currentNode
                    }
                    currentNode = operatorNode
                    break
            }
        }
        subCommand(current)
    }


    return {
        run
    }
}



function toPostfix(infix) {
    const postStacks = splitFromInfixToPostFix(infix)
    const result = calculatePost(postStacks)
    return result
}



console.log(toPostfix("2+7*5") === '275*2', ' -- ')
