function querySelectorArray(target, selector) {
  return Array.from(target.querySelectorAll(selector));
}

function dedupe(xs) {
  return [...new Set(xs)];
}

function normalize(s) {
  return s.replace(/\s+/g, ' ').trim();
}

module.exports = {
  querySelectorArray: querySelectorArray,
  dedupe: dedupe,
  normalize: normalize
};
