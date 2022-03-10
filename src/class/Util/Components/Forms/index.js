export { default as Input } from "./Input.js";
export { default as Select } from "./Select.js";
export { default as FormBundle } from "./FormBundle.js";

/**
 * @typedef FormOptions
 * @property {import("./Input.js").Options} Input
 * @property {import("./Select.js").Options} Select 
 * @property {import("./FormBundle.js").Options} FormBundle
 */

/**
 * @typedef Forms
 * @property {import("./Input.js").default} Input
 * @property {import("./Select.js").default} Select
 * @property {import("./FormBundle.js").default} FormBundle
 */

/**
 * @typedef {Forms[keyof Forms]} AnyForm
 */
