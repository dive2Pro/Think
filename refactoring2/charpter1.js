/**
 *
 * Any fool can write code that a
 * computer can understand.
 * Good programmers write code
 * that humans can understand.
 *
 */

function statement(invoice, plays) {
  function playFor(aPerformance) {
    return plays[aPerformance.playId];
  }
  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber / 100);
  }
  // default name for a parameter includes the type name
  function amountFor(aPerformance) {
    let result = 0;
    // a notoriously volatile form of storage
    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }

    return result;
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }
  function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    // replace temp with query
    // because temporary variables create a lot of locally scoped names that complicate extractions
    // const play = plays[perf.playID];
    // const thisAmount = amountFor(perf);
    // add volume credits
    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;
}

// ---------------------------------------------------------

function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  function totalVolumeCredits(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumeCredits;
    }
    return result;
  }
  // function enrichPerformance(aPerformance) {
  //   const result = { ...aPerformance };
  //   result.play = playFor(aPerformance);
  //   result.amount = amountFor(result);
  //   result.volumeCredits = volumeCreditsFor(result);
  //   return result;
  // }

  class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
      this.performance = aPerformance;
      this.play = aPlay;
    }

    get amount() {
      throw new Error("need override!");
    }

    get volumeCredits() {
      return Math.max(this.performance.audience - 30, 0);
    }
  }

  class TragedyCalculator extends PerformanceCalculator {
    get amount() {
      let result = 40000;
      if (this.performance.audience > 30) {
        result += 1000 * (this.performance.audience - 30);
      }
      return result;
    }
  }
  
  class ComedyCalculator extends PerformanceCalculator {
    get amount() {
      let result = 30000;
      if (this.performance.audience > 20) {
        result += 10000 + 500 * (this.performance.audience - 20);
      }
      result += 300 * this.performance.audience;
      return result;
    }

    get volumeCredits() {
      return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
  }

  function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
      case "tragedy":
        return new TragedyCalculator(aPerformance, aPlay);
      case "comedy":
        return new ComedyCalculator(aPerformance, aPlay);
      default:
    }
  }

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = { ...aPerformance };
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playId];
  }

  function amountFor(aPerformance) {
    let result = 0;
    // a notoriously volatile form of storage
    switch (aPerformance.play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }

    return result;
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function totalAmount(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }
    return result;
  }
  return statementData;
}

function statement2(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber / 100);
}

function renderPlainText(data) {
  // default name for a parameter includes the type name

  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    // replace temp with query
    // because temporary variables create a lot of locally scoped names that complicate extractions
    // const play = plays[perf.playID];
    // const thisAmount = amountFor(perf);
    // add volume credits
    // print line for this order
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function renderHtml(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}
