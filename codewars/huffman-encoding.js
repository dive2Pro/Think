
// takes: String; returns: [ [String,Int] ] (Strings in return value are single characters)
function frequencies(s) {
  return Object.entries(
    s.split("").reduce((p, c) => {
      p[c] = p[c] || 0;
      p[c]++;
      return p;
    }, {})
  );
}

// takes: [ [String,Int] ], String; returns: String (with "0" and "1")
/**
 *
 * TODO: 要将 freqs 和 s 共同构成一颗树, 这颗树的left 左边 为 0, 右边为 1
 *
 * @param freqs
 * @param s
 * @return string - 一棵树
 */
function encode(freqs, s) {}
// takes [ [String, Int] ], String (with "0" and "1"); returns: String
/**
 *
 * @param freqs
 * @param bits - encode 的返回对象
 * @return string - s
 */
function decode(freqs, bits) {}
