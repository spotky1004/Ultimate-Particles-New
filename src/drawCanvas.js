const gameScreen = document.getElementById("game-screen");
const canvas = document.getElementById("draw-canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d", { alpha: false });
const displayCanvas = document.getElementById('display-canvas');
/** @type {CanvasRenderingContext2D} */
const displayCtx = displayCanvas.getContext("2d");

/**
 * @param {import("./class/Stage.js").default} stage 
 */
function drawCanvas(stage) {
  const screenSize = {
    height: gameScreen.offsetHeight,
    width: gameScreen.offsetWidth
  };
  
  const canvasSize = Math.max(10, Math.min(screenSize.width, screenSize.height) * 0.9);
  canvas.width = canvasSize * stage.playingData.stageAttribute.stageWidth/100;
  canvas.height = canvasSize * stage.playingData.stageAttribute.stageHeight/100;
  const s = canvasSize/100;

  ctx.fillStyle = stage.playingData.stageAttribute.bgColor || "#ffc966";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { stageX, stageY } = stage.playingData.stageAttribute;
  const particleGroups = stage.playingData.particleGroups.groups;
  const groupNames = Object.keys(particleGroups);
  for (let i = groupNames.length-1; i >= 0; i--) {
    const particleGroup = particleGroups[groupNames[i]].particles;
    for (let i = 0; i < particleGroup.length; i++) {
      const particle = particleGroup[i].values;
      let { width: w, height: h } = particle.size;
      let { x, y } = particle.position;
      x -= stageX;
      y -= stageY;

      ctx.fillStyle = particle.color || "#000";
      ctx.fillRect(
        s * (x - h/2),
        s * (y - w/2),
        s * w,
        s * h
      );
    }
  }

  displayCanvas.width = canvasSize * stage.playingData.stageAttribute.stageWidth/100;
  displayCanvas.height = canvasSize * stage.playingData.stageAttribute.stageHeight/100;
  displayCtx.drawImage(canvas, 0, 0);
}

export default drawCanvas;
