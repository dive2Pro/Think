/**
 * 如果直接运行在浏览器这种可以使用 {@with } 关键词的环境中
 *
 * with(self) {
 *  haha.has(2).arms.each(arm => having(1).hand.having(5).fingers);
 * }
 * having就会指向 self的having
 *
 * 但现在的问题是因为运行环境的问题, 不允许使用 with
 * 一个办法是将其声明在 函数的 body 的头部
 *
 */

function replaceArrowFnToNormalFn(fnBody) {
  const index = fnBody.indexOf("function");
  if (index > -1) {
    const body = fnBody.substr(index);
    const bodyStartIndex = body.indexOf("{");
    const bodyStart = body.substr(0, bodyStartIndex);
    const bodyRest = body.substr(bodyStartIndex + 1);

    return `${bodyStart}{
    ${fieldToVariable()}
    ${bodyRest}
    `;
  }
  const [args, body] = fnBody.split("=>");
  return `
    function(${args}){
    ${fieldToVariable()}
      return (
        ${body}
      )
    }
  `;
}

function fieldToVariable() {
  return [
    "const having = self.having.bind(self);",
    "const name = self.name;",
    "const being_the = self.being_the;"
  ].join("");
}

class Thing {
  constructor(name) {
    this.name = name;
  }

  get is_a() {
    // return { };
    const self = this;
    return new Proxy(
      {},
      {
        get(obj, prop) {
          self[`is_a_${prop}`] = true;
          return obj[prop];
        }
      }
    );
  }
  get is_not_a() {
    const self = this;
    return new Proxy(
      {},
      {
        get(obj, prop) {
          self[`is_a_${prop}`] = false;
          return obj[prop];
        }
      }
    );
  }

  get is_the() {
    const self = this;
    return new Proxy(
      {},
      {
        get(obj, prop) {
          obj[prop] = new Proxy(
            {},
            {
              get(obj2, prop2) {
                self[prop] = prop2;
                return obj2[prop2];
              }
            }
          );
          return obj[prop];
        }
      }
    );
  }

  get being_the() {
    const self = this;
    return new Proxy(
      {},
      {
        get(obj, prop) {
          obj[prop] = new Proxy(
            {},
            {
              get(obj2, prop2) {
                self[prop] = prop2;
                obj2[prop2] = new Proxy(
                  {},
                  {
                    get(obj3, prop3) {
                      if (prop3 === "with") {
                        obj3.with = self.has.bind(self);
                      }
                      if (prop3 === "and_the") {
                        obj3.and_the = self.being_the
                      }
                      return obj3[prop3];
                    }
                  }
                );
                return obj2[prop2];
              }
            }
          );
          return obj[prop];
        }
      }
    );
  }
  get and_the() {}

  has(number) {
    const self = this;
    return new Proxy(
      {},
      {
        get(obj, prop) {
          let newOne;
          if (number > 1) {
            newOne = new Array(number).fill(
              new Thing(prop.slice(0, prop.length - 1))
            );
            newOne = new Proxy(newOne, {
              get(obj2, prop2) {
                if (prop2 in obj2) {
                  return obj2[prop2];
                }
                if (prop2 === "each") {
                  obj2.each = function(fn) {
                    obj2.forEach(item => {
                      const self = item;
                      const str = `(${replaceArrowFnToNormalFn(
                        fn.toString()
                      )})(item)`;
                      return eval(str);
                    });
                  };
                }
                return obj2[prop2];
              }
            });
          } else {
            newOne = new Thing(prop);
            newOne = new Proxy(newOne, {});
          }
          obj[prop] = newOne;
          self[prop] = newOne;
          return obj[prop];
        }
      }
    );
  }
  having(n) {
    return this.has(n);
  }

  get can() {
    const self = this;
    return new Proxy(
      {},
      {
        get(obj, prop) {
          obj[prop] = function(name, phrase) {
            var fn = replaceArrowFnToNormalFn(phrase.toString());
            self[name] = []
            self[prop] = function(arg) {
              const result =  eval(`(${fn}).call(self, arg)`);
              self[name].push(result)
              return result
            }.bind(self);
          };
          return obj[prop];
        }
      }
    );
  }
}

const haha = new Thing("haha");

// haha.is_a.person;
// haha.is_not_a.man;
// haha.is_the.parent_of.you;
//
// console.log(haha.is_a_person);
// console.log(haha.is_a_man);
// console.log(haha.parent_of);
//
// haha.has(2).legs;
//
// console.log(haha.legs);
// console.log(haha.legs[0] instanceof Thing);
//
// haha.has(1).head;
//
// console.log(haha.head instanceof Thing);
//
haha.has(2).arms.each(arm => having(1).hand.having(5).fingers);
//
// console.log(haha.arms);
// console.log(haha.arms[0].hand.fingers.length);
//
// haha.can.speak("spoke", function(ha) {
//   return `${name} : ${ha}`
// });
haha.can.speak('spoke', phrase => `${name} says: ${phrase}!`);

console.log( haha.speak("hi") )
console.log( haha.spoke)
// console.log(haha.arms[0].hand.fingers.length);


// haha
//   .has(1)
//   .head.having(2)
//   .eyes.each(eye => being_the.color.blue.with(1).pupil.being_the.color.black);

// const eyes = haha.head.eyes;
// console.log(haha.head.eyes);
// haha
//   .has(1)
//   .head.having(2)
//   .eyes.each(eye => being_the.color.blue.and_the.shape.round);
//
// const eyes = haha.head.eyes;
// console.log(haha.head.eyes);
