import Stage from "../src/class/Stage.js";
import Action from "../src/class/Action.js";

/** @type {import("../src/class/Stage.js").StageOptions} */
let stageData = {
  maximumTickLength: 17,
  actions: []
};

let actionDatas = [];

/**
 * @template {keyof import("../src/class/Action.js").ActionDatas} T
 * @param {T} type 
 * @param {number} time 
 * @param {import("../src/class/Action.js").ActionDatas[T]} data 
 * @param {import("../src/class/Action.js").ActionLooper} looperData 
 */
function addAction(type, time, data, looperData) {
  actionDatas.push([...arguments])
}

stageData.actions = actionDatas.map(data => new Action(...data));
let stage = new Stage(stageData);
console.log(stage.toString());
export default stage;
