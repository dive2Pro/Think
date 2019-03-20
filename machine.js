function machine(name) {
  class Machine {
    constructor(name) {
      this.name = name;
      this._tasks = [];
      this._firsts = []
    }
    do(sm) {
      const map = cb  => {
        console.log(this.name, " ", sm);
        this._execute(cb)
      };
      this._pushTask(map);
      return this;
    }
    waitFirst(n) {
      const map = cb  => {
        setTimeout(() => {
          console.log("wait", n);
          this._execute(cb)
        }, n * 100);
      };
      this._firsts.push(map)
      return this;
    }
    wait(n) {
      const map = cb  => {
        setTimeout(() => {
          console.log('wait: ' , n)
          this._execute(cb)

        }, n * 100);
      };
      this._pushTask(map);
      return this;
    }
    _pushTask(task, index) {
      if (index !== undefined) {
        this._tasks.splice(index, 0, task);
      } else {
        this._tasks.push(task);
      }
    }
    _run() { 
      const tasks = this._firsts.concat(this._tasks)
      function mapStr(index) {
        if(index == tasks.length - 1) {
          return `tasks[${index}]()`
        }
        return `tasks[${index}](() => ${mapStr(index + 1)})`
      }
      eval(mapStr(0))
    } 
    _execute(cb) {
        if(cb) {
          cb()
        }
    }
    execute() {
      const map = cb => {
        console.log("start ", this.name);
        this._execute(cb)
      };
      this._pushTask(map, 0);
      this._run();
    }
  } 

  return new Machine(name);
}

// machine("ygy").execute();
// start ygy
// machine('ygy').do('eat').execute();
// start ygy
// ygy eat
// machine("ygy")
//   .wait(5) 
//   .do("eat")
//   .execute();
// start ygy
// wait 5s（这里等待了5s）
// ygy eat
machine("ygy")
  .waitFirst(5)
  .do("eat")
  .execute();
