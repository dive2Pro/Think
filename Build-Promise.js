function noop() {

}

var GlobalError
var IS_ERROR = "_@Error"


function trycallOne(fn, response) {
    try {
        return fn(response);
    } catch (ex) {
        GlobalError = ex;
        return IS_ERROR
    }
}

function trycallTwo(fn, resolve, reject) {
    try {
        fn(resolve, reject);
    } catch (ex) {
        GlobalError = ex;
        return IS_ERROR
    }
}

const pending = 0,
    resolved = 1,
    rejected = 2,
    adopted = 3

/**
 * abcdefghijklmnopqrstuvwxyz
 * ABCDEFGHIJKLMNOPQRSTUVWXYZ
 * 每一个 Promise 都有且只有这四种状态
 * 每一个 promise 的值都是幂等的, promise 肯定有一个字段保存 _value
 * 
 * - pending
 * - resolved
 * - rejected
 * - adopted the state of another promise , _value
 * 
 * @param {Function} fn 
 */
function Promise(fn) {
    // 0. 初始化必须通过 new
    if (!this || typeof this !== 'object') {
        throw new Error('必须使用 new 创建 Promise')
    }
    // 1. promise 接受的是一个 function
    if (typeof fn !== 'function') {
        throw new TypeError('参数必须是 函数')
    }


    this._deferredState = 0
    this._state = pending
    if (fn === noop) {
        return
    }
    doResolve(fn, this)
}
/**
 * 上下文环境还是在之前的 Promise 中
 * 
 * then 是告诉 上一个 Promise , 有一个接盘侠准备好了. 通过设置 _deferreds 的值来通知
 * 如果在 then 连接的时候发现 上一个 Promise 已经被 处理了, 传给 then 的参数就会被调用
 * 并根据上一个 Promise._state决定调用哪一个回调
 * 
 * 如果最内层的 promise 还处于 pengding 状态
 * 这个时刻的 promise 已经可以去处理了, 修改它的状态 为可处理
 * 如果有多个 then 连接到 这个 promise, 这些 then 都需要被通知到
 * 
 * @param {Function} resolve 
 * @param {Function} reject 
 * @return {Promise} res
 */
Promise.prototype.then = function (resolve, reject) {
    // 1. 如果上一个 Promise 持有的是 Promise, 将它层层剥离到不是 Promise 为止
    var self = this;
    //
    const res = new Promise(noop)
    while (self._state === adopted) {
        self = self._value
    }
    const deferred = {
        resolve,
        reject,
        promise: res
    }
    // 返回一个新的 Promise
    handle(self, deferred)
    return res
}

function handle(self, deferred) {
    // 2. 检查 这个 promise 的 状态
    if (self._state === pending) {
        // 3. 如果 === pending, 
        if (self._deferredState === 0) {
            self._deferredState = 1
            self._deferreds = deferred
        } else
        if (self._deferredState === 1) {
            self._deferredState = 2
            self._deferreds = [self._deferreds, deferred]
        } else {
            self._deferreds.push(deferred)
        }
    } else {
        // 4. 处理结果
        handleResult(self, deferred)
    }
}

function handleResult(promise, deferred) {
    setTimeout(() => {
        var cb = promise._state === resolved ? deferred.resolve : deferred.reject
        if (!cb) {
            /** new Promise((resolve, reject) => {
             *   resolve('something')
             * }).then().then(args => {
             *   console.log(args) // something
             * })
             */
            // 如果没有回调函数, 这个 promise 仍然可以被链式调用
            // 结果是上一个promise 的结果
            // 当前的 deferred 没有 then , 不会被处理

            if (promise._state === resolved) {
                resolve(deferred.promise, promise._value)
            } else {
                reject(deferred.promise, promise._value)
            }
        } else {
            const res = trycallOne(cb, promise._value)
            if (res === IS_ERROR) {
                reject(deferred.promise, GlobalError)
            } else {
                resolve(deferred.promise, res)
            }
        }
    })
}

function getThen(obj) {
    try {
        return obj.then
    } catch (ex) {
        GlobalError = ex;
        return IS_ERROR
    }
}


// ------------------------  resolve    & reject --------------------------

/**
 * 
 * 不论是 resolve 和 reject , 他们返回的 promise 都可以通过之前的 `Promise` 对象进行 链式调用, 所以 需要将之前的 promise 也传入
 */

function resolve(promise, nextValue) {
    // https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (promise === nextValue) {
        // 这里不是抛出一个 异常, 会使用一个 promise 把它包裹起来
        // throw new TypeError('resolve() 中的参数不能是原 promise ')
        return reject(
            promise,
            new TypeError('resolve() 中的参数不能是原 promise ')
        )
    }

    if (typeof nextValue === 'object' || typeof nextValue === 'function') {
        let then = getThen(nextValue)

        const typeOf = typeof then
        if (then === IS_ERROR) {
            return reject(promise, GlobalError)
        }
        if (typeOf === 'function' && then instanceof Promise) {
            // 当前这个 Promise 持有的是另外一个 Promise
            promise._state = adopted
            promise._value = nextValue
            return finale(promise, nextValue)
        } else if (typeOf === 'function') {
            // 如果这是个函数, 绑定到 nextValue, 传入 resolvePromise 和 rejectPromise
            doResolve(then.bind(nextValue), promise)
            return
        }
    }

    // 这个值被promise保存

    promise._state = resolved
    promise._value = nextValue
    return finale(promise)
}

function reject(promise, reason) {
    promise._value = reason
    promise._state = rejected
    finale(promise)
}

// =======================  resolve   & reject  =============================

/**
 * 记住是如何使用 Promise 的
 * 
 * const p1 = new Promise((resolve, reject) => {
 *  setTimeout(() => {
 *      resolve(something)
 * }, 500)
 * });
 * // 这个时候 p1的值是 something
 * var something = Promise.resolve(2)
 * 如果这个something 是一个 promise 或者 不带 then 的对象, 或者是基本类型, 这个 promise 不会被触发,
 * 只有被 then 链式调用的时候, 这里的 _deferredState 才会改变, 根据它的状态 来处理链式调用
 * 
 * 所以 这里只会处理 resolved 或者 rejected 这两种情况
 * 
 * promies .then 中回调返回的可以是任意多个链式的 promise
 * @param {Promise} promise 
 * @param {Value} nextValue 
 */
function finale(promise) {
    if (promise._deferredState === 1) {
        // then
        handleResult(promise, promise._deferreds)
    }
    if (promise._deferredState === 2) {
        for (var i = 0; i < promise._deferreds; i++) {
            handleResult(promise, promise._deferreds[i])
        }
    }
}



// 开始执行 fn, fn 接受两个参数, 一个 resolve, 一个 reject
// 这两个执行哪一个, 另外一个都不会执行
// 执行后返回的是一个 全新的 Promise
// 如果在执行中有错误 

// 如果没有 catch 或者下一个 then 出现, 这个错误会被 `吞没`
function doResolve(fn, promise) {
    var done = false
    const res = trycallTwo(fn, function (nextValue) {
        if (done) return
        done = true
        // 这里开始将数据放入 下一个 resolved Promise
        resolve(promise, nextValue)
    }, function (reason) {
        if (done) return
        done = true
        // 这里将信息放入 rejected Promise
        reject(promise, reason)
    })
    if (!done && res === IS_ERROR) {
        // 处理在 resolve 和 reject 前抛出的错误
        done = true
        reject(promise, GlobalError)
    }
}

/**
 * 接受的值是: 
 * 基本类型 -> 用 promise 包裹
 * Promise -> 展开
 * 是 function 
 * @param {Object} nextValue 
 */
Promise.resolve = function (nextValue) {
    const res = new Promise(noop)
    res._value = nextValue
    if (typeof nextValue === 'object' && nextValue.constructor === Promise) {
        res._state = adopted
    } else {
        res._state = resolved
    }
    return res
}

Promise.reject = function (nextValue) {
    const res = new Promise(noop)
    res._state = rejected
    res._value = nextValue
    reject(res, nextValue)
    return res
}

/**
 * 如果链条中没有 rejected, 它不会有作用, 只是作为一个 promise 的桥接
 * 如果上一个有 rejected, 处理这个 rejected, 然后将 fn 的返回值作为 返回的 Promise 的值
 * 
 * @param {ErrorMessage} err 
 * @return {Promise}
 */
Promise.prototype.catch = function (fn) {
    if (typeof fn !== 'function') {
        return
    }
    const res = new Promise(noop)
    let self = this
    while(self._state === adopted) {
        self = self._value
    }
    const deferred = {
        resolve: null,
        reject: fn,
        promise: res
    }

    if (self._state === rejected) {
        handleResult(self, deferred)
    } else {    
        handle(self, deferred)
    }
    return res
}
// tests

// const p1 = new Promise(function (resolve, reject) {
//         setTimeout(() => {
//             resolve('haha')
//         }, 500)
//     }).then(value => {
//         console.log(value)
//         value()
//     })
//     .then(() => {}).then(() => {}).then(() => {}, (err) => {
//         // console.log(err)
//     })

{
    // Promise.resolve(new Promise((resolve, reject) => {
    //     setTimeout(() => resolve(22), 1500)
    // })).then(value => {
    //     // console.log(value)
    // })
} 

{
    Promise.reject(
        new Promise(() => {})
    )
    .then(() => {
        console.log('---')
    }
    , (value) => {
        console.log(valuea
    }
)
.catch(reason => {
    console.log(reason, ' = reason')
    return {
        a:  1
    }
}).then(value => {
    console.log(value, '====')
})
}
