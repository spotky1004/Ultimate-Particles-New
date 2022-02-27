export { default as CreateParticle } from "./CreateParticle.js";
export { default as ParticleGroupEvent } from "./ParticleGroupEvent.js";
export { default as ChangeStageAttribute } from "./ChangeStageAttribute.js";
export { default as SetGlobalVariable } from "./SetGlobalVariable.js";
export { default as AddStatus } from "./AddStatus.js";
export { default as ActivateActionGroup } from "./ActivateActionGroup.js";
export { default as CancelActionGroup } from "./CancelActionGroup.js";

/**
 * @typedef Actions
 * @property {import("./CreateParticle.js").default} CreateParticle
 * @property {import("./ParticleGroupEvent.js").default} ParticleGroupEvent
 * @property {import("./ChangeStageAttribute.js").default} ChangeStageAttribute
 * @property {import("./SetGlobalVariable.js").default} SetGlobalVariable
 * @property {import("./AddStatus.js").default} AddStatus
 * @property {import("./ActivateActionGroup.js").default} ActivateActionGroup
 * @property {import("./CancelActionGroup.js").default} CancelActionGroup
 */
/**
 * @typedef {keyof Actions} ActionTypes
 * @typedef {Actions[ActionTypes]} AnyAction
 */

/**
 * @typedef ActionDatas
 * @property {import("./CreateParticle.js").ActionData} CreateParticle
 * @property {import("./ParticleGroupEvent.js").ActionData} ParticleGroupEvent
 * @property {import("./ChangeStageAttribute.js").ActionData} ChangeStageAttribute
 * @property {import("./SetGlobalVariable.js").ActionData} SetGlobalVariable
 * @property {import("./AddStatus.js").ActionData} AddStatus
 * @property {import("./ActivateActionGroup.js").ActionData} ActivateActionGroup
 * @property {import("./CancelActionGroup.js").ActionData} CancelActionGroup
 */
/**
 * @typedef OptimizationDatas
 * @property {import("./CreateParticle.js").OptimizationData} CreateParticle
 * @property {import("./ParticleGroupEvent.js").OptimizationData} ParticleGroupEvent
 * @property {import("./ChangeStageAttribute.js").OptimizationData} ChangeStageAttribute
 * @property {import("./SetGlobalVariable.js").OptimizationData} SetGlobalVariable
 * @property {import("./AddStatus.js").OptimizationData} AddStatus
 * @property {import("./ActivateActionGroup.js").OptimizationData} ActivateActionGroup
 * @property {import("./CancelActionGroup.js").OptimizationData} CancelActionGroup
 */
