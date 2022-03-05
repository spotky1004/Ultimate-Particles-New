/**
 * @template T
 * @template {keyof T} P
 * @typedef {T extends readonly any[] ? DeepPickValue<T[number], P> : { [K in keyof T]-? : K extends P ? T[K] : never | T[K] extends readonly any[] ? DeepPickValue<T[K][number], P> : import("./IsObject.js").IsObject<T[K]> extends true ? DeepPickValue<T[K], P> : never }[keyof T]} DeepPickValue
 */

export default DeepPickValue;
