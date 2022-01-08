export { default as CreateParticle } from "./CreateParticle.js";
export { default as ParticleGroupEvent } from "./ParticleGroupEvent.js";
export { default as ChangeStageAttribute } from "./ChangeStageAttribute.js";
export { default as SetGlobalVariable } from "./SetGlobalVariable.js";
export { default as AddStatus } from "./AddStatus.js";

const ActionTypeEnum = {
  CreateParticle: 0,
  ParticleGroupEvent: 1,
  ChangeStageAttribute: 2,
  SetGlobalVariable: 3,
  AddStatus: 4,
}

/**
 * @typedef {keyof ActionTypeEnum} ActionType
 */

/**
 * @typedef ActionDatas
 * @property {import("./CreateParticle.js").ActionData} CreateParticle
 * @property {import("./ParticleGroupEvent.js").ActionData} ParticleGroupEvent
 * @property {import("./ChangeStageAttribute.js").ActionData} ChangeStageAttribute
 * @property {import("./SetGlobalVariable.js").ActionData} SetGlobalVariable
 * @property {import("./AddStatus.js").ActionData} AddStatus
 */
/**
 * @typedef OptimizationDatas
 * @property {import("./CreateParticle.js").OptimizationData} CreateParticle
 * @property {import("./ParticleGroupEvent.js").OptimizationData} ParticleGroupEvent
 * @property {import("./ChangeStageAttribute.js").OptimizationData} ChangeStageAttribute
 * @property {import("./SetGlobalVariable.js").OptimizationData} SetGlobalVariable
 * @property {import("./AddStatus.js").OptimizationData} AddStatus
 */
