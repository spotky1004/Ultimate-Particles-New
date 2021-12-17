import Stage from "../src/class/Stage.js";
import Action from "../src/class/Action.js";

let stageData = {
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
  250,
  {
    group: "test",
    position: {
      x: "sin($t/20*(1+$i/10))*0.99^$i*50 + 50",
      y: "-1*cos($t/20*(1+$i/10))*0.99^$i*50 + 50"
    },
    size: {
      width: "max(3*0.99^$i, 0.2)",
      height: "max(3*0.99^$i, 0.2)"
    },
    color: "hsl($i*20, 50, 50)"
  },
  {
    loopCount: 2000,
    interval: 10
  }
);
addAction(
  "ParticleGroupEvent",
  10000,
  {
    name: "test",
    type: "DestroyAll",
    data: {}
  }
);

stageData.actions = actionDatas.map(data => new Action(...data));
let stage = new Stage(stageData);
console.log(stage.toString());
export default stage;
