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
    value: "min(32, 3+$stageTime/2)"
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
      max: "32"
    }
  }
);
addAction(
  "SetGlobalVariable",
  0,
  {
    name: "climbSpeed",
    value: "min(32, 3+$stageTime/2.3)"
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
  "ChangeStageAttributes",
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
  "ChangeStageAttributes",
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
  "ChangeStageAttributes",
  0,
  {
    name: "stageWidth",
    value: "95+2.5*(sin($stageTime*250)^2)"
  },
  {
    loopCount: Infinity,
  }
);
addAction(
  "ChangeStageAttributes",
  0,
  {
    name: "stageX",
    value: "-1.25*(sin($stageTime*250)^2)"
  },
  {
    loopCount: Infinity,
  }
);



addAction(
  "CreateParticle",
  0,
  {
    variables: {
      hue: "$mainHue+40",
      posX: "randr(0, 100)",
      posY: "$stageY - 50",
      speed: "randr(0, 6)",
      deg: "170+randr(0, 20)",
      size: "randr(1, 1.5)"
    },
    color: "hsl($hue, 100, 50)",
    position: {
      x: "$posX",
      y: "$posY"
    },
    speed: "$speed",
    deg: "$deg",
    size: {
      height: "$size",
      width: "$size"
    }
  },
  {
    interval: 300,
    innerLoop: "min(20, $i/20)",
    loopCount: Infinity,
  }
)

stageData.actions = actionDatas.map(data => new Action(...data));
let stage = new Stage(stageData);
console.log(stage.toString());
export default stage;
