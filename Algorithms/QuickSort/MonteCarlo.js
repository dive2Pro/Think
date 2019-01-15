import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App({ ary, isFinished, N }) {
  const grids = ary.slice(0, ary.length - 2);
  const itemStyle = { width: `${50}px`, height: `50px` };
  if (isFinished) {
    console.error("Bomb!");
  }
  return (
    <div className="App" style={{ width: N * 50, height: N * 50 }}>
      {grids.map((grid, i) => {
        return (
          <div key={i} style={itemStyle} className={grid.status + " item"}>
            <span>{grid.status}</span>
          </div>
        );
      })}
    </div>
  );
}

const rootElement = document.getElementById("root");

const Status = {
  Open: "open",
  Blocked: "blocked",
  Empty: "empty"
};

/**
   1. 初始化一个 N x N 的 grid, 每一格的状态是 Blocked
   2. 随机改变一格的状态到 Empty
      TODO:    随机时, 不重复置空 
      每一行中使用的是 quick-sort 算法, 
       先拿到上一层的 root status, union 到 root 
       再拿到左右两边的 root status ,
       检查 哪一个优先级高, union 到优先级高的 root
   3. 如果这一格和顶部有联通, 则状态变为 Open
       联通:  
            同级相连的 cell 有和顶部相通
   4. 当 top 联通到bottom 时, 即为完成
  */
function MonteCarlo(N) {
  const Max = N * N;
  const top = Max;
  const bottom = Max + 1;
  const ary = new Array(Max).fill(0).map((_, i) => ({
    status: Status.Blocked,
    i
  }));
  // top
  ary[top] = {
    i: top,
    status: Status.Open
  };
  // bottom
  ary[bottom] = {
    i: bottom,
    status: Status.Open
  };

  function union(p, t) {
    let p_r = get_root(p);
    let t_r = get_root(t);
    // console.log(p, t);
    // console.log(p_r, t_r);
    if (p_r[0].status === Status.Open) {
      ary[t_r[0].i] = p_r[0];
    }
    // if (t_r[0].status === Status.Open)
    else {
      ary[p_r[0].i] = t_r[0];
    }
    if (ary.some(item => typeof item !== "object")) {
      console.error(" item object changed");
    }
  }
  function get_root(p) {
    let next = ary[p];
    let weight = 0;
    while (next.i !== ary[next.i].i) {
      weight += 1;
      next = ary[next.i];
    }
    return [next, weight];
  }
  /**
   * @params q 第几个
   * @return [row, column]
   */
  function get_location(q) {}

  // 检查上, 左右, 下
  function go_union(p) {
    if (is_first_row(p)) {
      union(p, top);
    } else {
      // 检查上, 左右
      try_union(p, p - N);
      // 确定边界, 如果处于该行的 左右端点, 则另一边不 union
      if (Number.isInteger(p / N)) {
        try_union(p, p + 1);
      } else if (Number.isInteger((p + 1) / N)) {
        try_union(p, p - 1);
      } else {
        try_union(p, p - 1);
        try_union(p, p + 1);
      }
    }

    if (p + N < Max) {
      try_union(p, p + N);
    }
    // 下
  }
  function try_union(p, neibour) {
    if (p === 15) {
      console.log(get_root(p), ary[neibour]);
    }
    if (ary[neibour].status !== Status.Blocked) {
      union(p, neibour);
    }
  }
  function is_finished() {
    // return is_connected(top, bottom);
    return ary.slice(Max - N -2 , Max - 2).some(item => get_root(item.i)[0] === ary[top]);
  }

  function is_connected(p, q) {
    if (!q || !p) {
      console.error("is_connected error");
    }
    let p_r = get_root(p);
    let q_r = get_root(q);
    return p_r[0] == q_r[0];
  }
  function is_last_row(i) {
    return Max - N <= i < Max;
  }
  function is_first_row(i) {
    return i < N;
  }

  function next_Empty(index) {
    const next_position = index || Math.floor(Math.random() * Max);
    const item = ary[next_position];
    if (item.status === Status.Blocked) {
      return next_position;
    }
    return -1;
  }

  function run(index) {
    if (!is_finished()) {
      const next_position = next_Empty(index);
      if (next_position !== -1) {
        // 检查第一层的 root
        ary[next_position].status = Status.Empty;
        go_union(next_position);
      }
      // setTimeout(() => {
      //   run();
      // }, 200);
    }
  }
  function get_ary() {
    // console.log(ary.slice(0, 13 * 3).map(i => i.status));

    return ary.map(item => {
      return {
        ...item,
        status: get_root(item.i)[0].status
      };
    });
  }
  return {
    run,
    get_ary,
    is_finished
  };
}

const N = 13;
const t = MonteCarlo(N);
setInterval(() => {
  t.run();
  run();
}, 100);

function run() {
  t.run(3);
  t.run(3 + N);
  t.run(3 - 1 + 2 * N);
  t.run(3 - 1 + N);
  t.run(3 + 2 + 2 * N);
  ReactDOM.render(
    <App ary={t.get_ary()} isFinished={t.is_finished()} N={13} />,
    rootElement
  );
}

run();
