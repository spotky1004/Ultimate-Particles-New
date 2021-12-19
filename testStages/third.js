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
  200,
  {
    variables: {
      isVartical: "randbool()",
      isRightOrBottom: "randbool()",
      pos: "randr(0, 100)",
      posX: "not($isVartical)*$pos + $isVartical*100*$isRightOrBottom",
      posY: "$isVartical*$pos + not($isVartical)*100*$isRightOrBottom",
      deg: "$isVartical*(-90) + not($isRightOrBottom)*180"
    },
    color: "hsl($i, 80, 40-$t/150)",
    position: {
      x: "$posX",
      y: "$posY"
    },
    deg: "$deg",
    speed: "25*sqrt(sqrt($i+1))-$t*sqrt($i+1)/100",
    size: {
      width: "max(1, 5-$t*sqrt(sqrt($i+1))/2000)",
      height: "max(1, 5-$t*sqrt(sqrt($i+1))/2000)"
    }
  },
  {
    interval: "max(50, 100*(0.99^$i))",
    innerLoop: "15",
    loopCount: Infinity
  }
);
addAction(
  "ChangeStageAttributes",
  1000,
  {
    name: "bgColor",
    value: "hsl(39, 100-$i/10, 70-$i/1.6)"
  },
  {
    loopCount: 100,
    interval: 25,
  }
);

stageData.actions = actionDatas.map(data => new Action(...data));
let stage = new Stage(stageData);
console.log(stage.toString());
export default stage;
