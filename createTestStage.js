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
];
stageData.actions.push(new Action(...actionData));

let stage = new Stage(stageData);
// console.log(stage.toString());
export default stage;
