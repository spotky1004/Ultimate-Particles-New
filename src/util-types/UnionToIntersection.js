/**
 * From https://stackoverflow.com/a/50375286/13817471
 * @template U
 * @typedef {(U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never} UnionToIntersection
 */

export default UnionToIntersection;
