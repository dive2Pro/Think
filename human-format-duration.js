const assert = require('assert')

const Test = {
    assertEquals(v, v2) {
        assert(v === v2)
    }
}

function formatDuration(seconds) {
    if(seconds === 0) {
        return 'now'
    }
    const formats = [
        1, // seconds
        60, // minutes
        3600, // hours
        3600 * 24, // days
        3600 * 24 * 365 // years
    ]
    const express = [
        " year",
        " day",
        " hour",
        " minute",
        " second"
    ];

    const results = []

    function addExpress(result, index) {
        const eps = express[index]
        if(result > 1) {
            result += `${eps}s`
        } else {
            result += `${eps}`
        }
        return result
    }
    formats.reverse().reduce((p, fmt, index) => {
        if(p===0) {
           return p;
        }
        const hasValue = p % fmt !== p
        if(!hasValue && fmt !== 1) {
            return p
        }
        const remain = (p % fmt)
        let result = Number.parseInt(p / fmt)
        result = addExpress(result, index)
        results.push(result)
        return remain;
    }, seconds)
    function moreThan2() {
        const rest = results.slice(0, results.length - 2).join(', ');
        const lastTwo = results.slice(results.length - 2).join(' and ')
        return rest + ', '+ lastTwo
    }
    return results.length > 2 ? moreThan2() : results.join(' and ');
}

Test.assertEquals(formatDuration(1), "1 second");
Test.assertEquals(formatDuration(62), "1 minute and 2 seconds");
Test.assertEquals(formatDuration(120), "2 minutes");
Test.assertEquals(formatDuration(3600), "1 hour");
Test.assertEquals(formatDuration(3662), "1 hour, 1 minute and 2 seconds");
