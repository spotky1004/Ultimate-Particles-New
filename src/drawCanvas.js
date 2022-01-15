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
  const viewSize = {
    height: gameScreen.offsetHeight,
    width: gameScreen.offsetWidth
  };
  const stageAttribute = stage.state.stageAttribute;
  
  const canvasSize = Math.min(viewSize.width, viewSize.height) * 0.9;
  canvas.width = Math.max(1, canvasSize * stageAttribute.screenSize.width/100);
  canvas.height = Math.max(90, canvasSize * stageAttribute.screenSize.height/100);
  const s = canvasSize/100;

  ctx.fillStyle = stageAttribute.bgColor || "#ffc966";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const particleGroups = stage.state.particleGroups.groups;
  const groupNames = Object.keys(particleGroups);
  for (let i = groupNames.length-1; i >= 0; i--) {
    const particleGroup = particleGroups[groupNames[i]].particles;
    for (let i = 0; i < particleGroup.length; i++) {
      const drawingData = stageAttribute.getParticleDrawData(particleGroup[i]);
      ctx.fillStyle = drawingData.color || "#000";
      ctx.fillRect(
        s * drawingData.position.x,
        s * drawingData.position.y,
        s * drawingData.size.width,
        s * drawingData.size.height
      );
    }
  }

  displayCanvas.width = canvas.width;
  displayCanvas.height = canvas.height;
  displayCanvas.style.transform = `translate(${canvasSize * stageAttribute.screenX/100}px, ${canvasSize * stageAttribute.screenY/100}px)`;
  displayCtx.drawImage(canvas, 0, 0);
}

export default drawCanvas;
