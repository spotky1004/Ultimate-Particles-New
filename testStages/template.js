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

addAction(
  "CreateParticle",
  0,
  {
    group: "player",
    color: "#f00",
    position: {
      x: 50,
      y: 50
    },
    speed: 40,
    size: {
      height: 2,
      width: 2
    }
  }
);
addAction(
  "AddStatus",
  0,
  {
    name: "Life",
    type: "Progress",
    data: {
      barStartCol: "#cf4646",
      barEndCol: "#ff8888",
      max: "$maxLife",
      value: "$life"
    }
  }
);

stageData.actions = actionDatas.map(data => new Action(...data));
let stage = new Stage(stageData);
console.log(stage.toString());
export default stage;
