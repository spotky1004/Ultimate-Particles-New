// from https://stackoverflow.com/a/32922084/13817471
/**
 * @param {object} x 
 * @param {object} y 
 * @returns {boolean}
 */
export function deepEqual(x, y) {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
      ok(x).every(key => deepEqual(x[key], y[key]))
  ) : (x === y);
}
