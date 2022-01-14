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
 * @param {string} group
 */
function addAction(type, startTime, data, looperData, groupName) {
  const actionData = {type, startTime, data, looperData, groupName};
  stageData.actions.push(actionData);
}

addAction(
  "CreateParticle",
  0,
  {
    group: "player",
    color: "#f00",
    position: {
      x: 0,
      y: 0
    },
    speed: 80,
    size: {
      height: 4,
      width: 4
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
      value: "$life",
      max: "$maxLife"
    }
  }
);
addAction(
  "SetGlobalVariable",
  0,
  {
    name: "life",
    value: "min($maxLife, $life + $dt/150)"
  },
  {
    loopCount: Infinity
  }
);
addAction(
  "SetGlobalVariable",
  0,
  {
    name: "maxLife",
    value: "$maxLife + $dt/3000"
  },
  {
    loopCount: Infinity
  }
);


addAction(
  "SetGlobalVariable",
  0,
  {
    name: "climbSpeed",
    value: "min(64, 3+$stageTime/2)"
  },
  {
    loopCount: Infinity
  }
);
addAction(
  "AddStatus",
  0,
  {
    name: "Climb Speed",
    type: "TextProgress",
    data: {
      barStartCol: "#9e0606",
      barEndCol: "#2ff7e3",
      value: "$climbSpeed",
      max: "64"
    }
  }
);
addAction(
  "SetGlobalVariable",
  0,
  {
    name: "climbSpeed",
    value: "min(64, 3+$stageTime/1.15)"
  },
  {
    loopCount: Infinity
  }
);
addAction(
  "SetGlobalVariable",
  0,
  {
    name: "mainHue",
    value: "10+170/3*log(-$stageY/10+1, 6)"
  },
  {
    loopCount: Infinity
  }
);
addAction(
  "ChangeStageAttribute",
  0,
  {
    name: "bgColor",
    value: "hsl($mainHue, 50, 30)"
  },
  {
    loopCount: Infinity
  }
);
addAction(
  "AddStatus",
  0,
  {
    name: "Height",
    type: "Text",
    data: {
      color: "hsl($mainHue, 100, 50)",
      content: "fix(-$stageY, 1)+\"m\""
    }
  }
);
addAction(
  "ChangeStageAttribute",
  0,
  {
    name: "stageY",
    value: "$stageY - $dt * $climbSpeed",
  },
  {
    loopCount: Infinity,
  }
);



addAction(
  "ChangeStageAttribute",
  0,
  {
    name: "screenWidth",
    value: "95+2.5*(sin($stageTime*250)^2)"
  },
  {
    loopCount: Infinity,
  }
);



addAction(
  "CreateParticle",
  0,
  {
    constants: {
      hue: "$mainHue+40",
      posX: "randr(-100, 100)",
      posY: "$stageY - 150",
      speed: "randr(0, 12)",
      deg: "170+randr(0, 20)",
      size: "randr(2, 3)"
    },
    color: "hsl($hue, 100, 50)",
    position: {
      x: "$posX",
      y: "$posY"
    },
    speed: "$speed+$t/1000",
    deg: "$deg",
    size: {
      height: "$size",
      width: "$size"
    }
  },
  {
    interval: 300,
    innerLoop: "min(20, $i/20+1)",
    loopCount: Infinity,
  }
);

const stageToExport = JSON.stringify(stageData, null, 2);
console.log(stageToExport);
export default stageToExport;
