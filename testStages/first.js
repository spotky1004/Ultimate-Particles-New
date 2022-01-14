/** @type {import("../src/class/Stage.js").StageOptions} */
let stageData = {
  maximumTickLength: 17,
  actions: []
};

/**
 * @template {import("../src/class/Actions/index.js").ActionTypes} T
 * @param {T} type 
 * @param {number} startTime 
 * @param {import("../src/class/Actions/index.js").ActionDatas[T]} data 
 * @param {import("../src/class/Actions/ActionBase.js").LooperData} looperData 
 */
function addAction(type, startTime, data, looperData) {
  const actionData = {type, startTime, data, looperData};
  stageData.actions.push(actionData);
}

// addAction(
//   "CreateParticle",
//   0,
//   {
//     group: "player",
//     color: "#f00",
//     position: {
//       x: 50,
//       y: 50
//     },
//     speed: 40,
//     size: {
//       height: 2,
//       width: 2
//     }
//   }
// );
addAction(
  "ChangeStageAttribute",
  0,
  {
    name: "bgColor",
    value: "#000"
  }
)
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
addAction(
  "CreateParticle",
  250,
  {
    position: {
      x: "sin($t/20*(1+$i/10))*0.99^$i*100",
      y: "-1*cos($t/20*(1+$i/10))*0.99^$i*100"
    },
    size: {
      width: "max(6*0.99^$i, 0.4)",
      height: "max(6*0.99^$i, 0.4)"
    },
    color: "hsl($i*20, 50, 50)"
  },
  {
    loopCount: 2000,
    interval: 1
  }
);

addAction(
  "ChangeStageAttribute",
  0,
  {
    name: "outOfBoundsFactor",
    value: "1000"
  },
  {
    loopCount: Infinity,
  }
);
addAction(
  "ChangeStageAttribute",
  0,
  {
    name: "stageHeightScale",
    value: "1 - sin($stageTime*25)/3"
  },
  {
    loopCount: Infinity,
  }
);
addAction(
  "ChangeStageAttribute",
  0,
  {
    name: "stageWidthScale",
    value: "1 - sin($stageTime*25)/3"
  },
  {
    loopCount: Infinity,
  }
);

export default JSON.stringify(stageData, null, 2);
