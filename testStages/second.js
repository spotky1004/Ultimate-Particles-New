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
  0,
  {
    variables: {
      xPos: "randr(-20, 120)",
      deg: "160+20*rand()",
    },
    color: "hsl($i, 50, 50)",
    speed: "$i/50+10",
    size: {
      width: "max(1, 5-$t/(max(500, 3000-$i*1.2)))",
      height: "max(1, 5-$t/(max(500, 3000-$i*1.2)))"
    },
    deg: "$deg",
    group: "drops",
    position: {
      x: "$xPos",
      y: -20
    }
  },
  {
    loopCount: 1500,
    interval: "100/sqrt($i/50+1)",
  }
)

stageData.actions = actionDatas.map(data => new Action(...data));
let stage = new Stage(stageData);
console.log(stage.toString());
export default stage;
