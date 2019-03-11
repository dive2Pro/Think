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

    has(number) {
        const self = this;
        return new Proxy(
            {},
            {
                get(obj, prop) {
                    if (number > 1) {
                        self[prop]  =  new Array(number).fill(new Thing(prop.slice(0, prop.length -1)))
                    } else {
                        self[prop] = new Thing(prop);
                    }
                    return obj[prop];
                }
            }
        );
    }
    having(n) {
        return this.has(n)
    }
}


const haha = new Thing("haha");

haha.is_a.person;
haha.is_not_a.man;
haha.is_the.parent_of.you;

console.log(haha.is_a_person);
console.log(haha.is_a_man);
console.log(haha.parent_of);

haha.has(2).legs;

console.log(haha.legs);
console.log(haha.legs[0] instanceof Thing);

haha.has(1).head;

console.log(haha.head instanceof Thing);
