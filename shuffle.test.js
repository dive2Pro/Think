
const a = [0, 1, 2, 3, 4, 5, 6];

{
  function swap(els, i, j) {
    let t = els[i];
    els[i] = els[j];
    els[j] = t;
  }
  function shuffle2(els) {
    let t;
    [].forEach.call(els, (_, i) => {
      t = Math.floor(Math.random() * els.length);
      swap(els, i, t);
    });
  }
 
  function shuffle(els) {
    let t;
    [].forEach.call(els, (_, i) => {
      t = Math.floor(Math.random() * (i + 1));
      swap(els, i, t);
    });
  }
  function test(func) {
    let count = 600000;
    let i;
    function startRecord() {
      let arrAry = [];
      return {
        record(ary) {
          ary.forEach((v, i) => {
            arrAry[i] = arrAry[i] || {};
            arrAry[i][v] = arrAry[i][v] || 0;
            arrAry[i][v] = arrAry[i][v] + 1;
          });
        },
        getResult() {
          return arrAry;
        }
      };
    }
    const r = startRecord();
    for (i = 0; i < count; i++) {
      let newA = [...a];
      func(newA);
      r.record(newA);
    }
    const result = r.getResult();
    result.forEach((v, i) => {
      console.log(`${i} : `, v);
    });
  }
  test(shuffle2);
  console.log(" =============  分割线 ============");
  test(shuffle);
  
}
