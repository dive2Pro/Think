const assert = require('assert')

function traverseTCPStates(eventList){
    var state = "CLOSED";  // initial state, always
    // Traversal code goes here
    const fsm = {
        CLOSED: {
            APP_PASSIVE_OPEN: 'LISTEN',
            APP_ACTIVE_OPEN: 'SYN_SENT',
        },
        LISTEN: {
            RCV_SYN: 'SYN_RCVD',
            APP_SEND: 'SYN_SENT',
            APP_CLOSE: 'CLOSED'
        },
        SYN_RCVD: {
            APP_CLOSE: 'FIN_WAIT_1',
            RCV_ACK: 'ESTABLISHED'
        },
        SYN_SENT: {
            RCV_SYN: 'SYN_RCVD',
            RCV_SYN_ACK: 'ESTABLISHED',
            APP_CLOSE: 'CLOSED'
        },
        ESTABLISHED: {
            APP_CLOSE: 'FIN_WAIT_1',
            RCV_FIN: 'CLOSE_WAIT'
        },
        FIN_WAIT_1: {
            RCV_FIN: 'CLOSING',
            RCV_FIN_ACK: 'TIME_WAIT',
            RCV_ACK: 'FIN_WAIT_2'
        },
        CLOSING: {
            RCV_ACK: 'TIME_WAIT'
        },
        FIN_WAIT_2: {
            RCV_FIN: "TIME_WAIT"
        },
        TIME_WAIT: {
            APP_TIMEOUT: 'CLOSED'
        },
        CLOSE_WAIT: {
            APP_CLOSE: 'LAST_ACK'
        },
        LAST_ACK: {
            RCV_ACK: 'CLOSED'
        }
    }

    const addProxy = (key) => {
        return new Proxy(fsm[key], {
            get: function(target, property) {
                return target[property] ? target[property] : 'ERROR'
            }
        })
    }



    Object.keys(fsm).forEach(key => {
        fsm[key] = addProxy(key);
    })


    while(eventList.length){
        const nextCommand = eventList.shift();
        state = fsm[state][nextCommand]
    }


    return state;
}

const Test = {
    assertEquals(v, v2) {
        assert(v === v2)
    }
}

Test.assertEquals(traverseTCPStates(["APP_ACTIVE_OPEN","RCV_SYN_ACK","RCV_FIN"]), "CLOSE_WAIT")
Test.assertEquals(traverseTCPStates(["APP_PASSIVE_OPEN",  "RCV_SYN","RCV_ACK"]), "ESTABLISHED")
Test.assertEquals(traverseTCPStates(["APP_ACTIVE_OPEN","RCV_SYN_ACK","RCV_FIN","APP_CLOSE"]), "LAST_ACK")
Test.assertEquals(traverseTCPStates(["APP_ACTIVE_OPEN"]), "SYN_SENT")
Test.assertEquals(traverseTCPStates(["APP_PASSIVE_OPEN","RCV_SYN","RCV_ACK","APP_CLOSE","APP_SEND"]), "ERROR")
