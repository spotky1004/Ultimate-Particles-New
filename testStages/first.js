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
    interval: 1
  }
);

export default JSON.stringify(stageData, null, 2);
