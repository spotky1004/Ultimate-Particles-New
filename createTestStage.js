import Stage from "./src/Stage.js";
import Action from "./src/Action.js";

let stageData = {
  actions: []
};

/** @type {[keyof import("./src/Action.js").ActionDatas, number, import("./src/Particle").ParticleOptions, import("./src/Action.js").ActionLooper]} */
let actionData = [
  "CreateParticle",
  500,
  {
    id: "\"testParticle\"+$i",
    position: {
      x: "sin($t/20)*0.92^$i*50 + 50",
      y: "-1*cos($t/20)*0.92^$i*50 + 50"
    },
    size: {
      width: "3*0.95^$i",
      height: "3*0.95^$i"
    },
    color: "hsl($i*20, 50, 50)"
  },
  {
    loopCount: 10,
    interval: "100*sqrt($i)"
  }
];
stageData.actions.push(new Action(...actionData));

let stage = new Stage(stageData);
// console.log(stage.toString());
export default stage;
