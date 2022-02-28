// export to ../class/StagePlayer.js

const gameScreen = document.getElementById("game-screen");

/** @type {Object.<string, boolean>} */
export const keyPressed = {};
/** @type {boolean} */
let mouseDown = false;
// keep immutability
const screenDragStartPos = { x: null, y: null };
const screenDragLength = { x: 0, y: 0 };
export const screenDragPower = { x: 0, y: 0, arc: Math.PI/2, power: 0 };
document.addEventListener("keydown", function (e) {
  keyPressed[e.code] = true;
});
document.addEventListener("keyup", function (e) {
  keyPressed[e.code] = false;
});
// PC
gameScreen.addEventListener("mousedown", function(e) {
  resetDrag(e.clientX, e.clientY);
  mouseDown = true;
});
document.addEventListener("mousemove", function(e) {
  if (!mouseDown) return;
  updateDrag(e.clientX, e.clientY);
});
document.addEventListener("mouseup", function(e) {
  resetDrag();
});
// Mobile
gameScreen.addEventListener("touchstart", function(e) {
  const touch = e.touches[e.touches.length - 1];
  if (touch.identifier === 0) resetDrag(touch.clientX, touch.clientY);
}, { passive: true });
document.addEventListener("touchmove", function(e) {
  const changedItems = e.changedTouches;
  for (let i = 0; i < changedItems.length; i++) {
    const changedItem = changedItems[i];
    if (changedItem.identifier === 0) updateDrag(changedItem.clientX, changedItem.clientY);
  }
}, { passive: true });
document.addEventListener("touchend", function(e) {
  if (e.changedTouches[0].identifier === 0) resetDrag();
});
document.addEventListener("blur", function (e) {
  resetDrag();
  for (const code in keyPressed) {
    keyPressed[code] = false;
  }
});

/**
 * @param {number} clientX 
 * @param {number} clientY 
 */
function updateDrag(clientX, clientY) {
  const canvasSize = Math.max(10, Math.min(gameScreen.offsetWidth, gameScreen.offsetHeight) * 0.9);
  const maxVecAt = canvasSize/5;

  screenDragLength.x = clientX - screenDragStartPos.x;
  screenDragLength.y = clientY - screenDragStartPos.y;
  const dragLength = Math.sqrt(screenDragLength.x**2 + screenDragLength.y**2);
  const dragPower = Math.min(1, dragLength/maxVecAt);
  const dragDeg = (Math.atan2(screenDragLength.y, screenDragLength.x)+Math.PI*2+Math.PI/2)%(Math.PI*2);
  screenDragPower.x = Math.sin(dragDeg) * dragPower;
  screenDragPower.y = -Math.cos(dragDeg) * dragPower;
  screenDragPower.arc = dragDeg;
  screenDragPower.power = dragPower;
}
function resetDrag(clientX=null, clientY=null) {
  mouseDown = false;
  screenDragStartPos.x = clientX;
  screenDragStartPos.y = clientY;
  screenDragLength.x = 0;
  screenDragLength.y = 0;
  screenDragPower.x = 0;
  screenDragPower.y = 0;
  screenDragPower.power = 0;
  screenDragPower.arc = Math.PI/2;
}

/** @type {HTMLDivElement} */
const dragDisplay = document.getElementById("drag-display");
/** @type {HTMLDivElement} */
const dragPowerDisplay = document.getElementById("drag-power-display");
export function renderDrag() {
  if (screenDragStartPos.x !== null) {
    dragDisplay.style.display = "";
    dragDisplay.style.left = (screenDragStartPos.x - dragDisplay.offsetWidth/2) + "px";
    dragDisplay.style.top = (screenDragStartPos.y - dragDisplay.offsetHeight/2) + "px";
    dragDisplay.style.filter = `grayscale(${(1-screenDragPower.power)**2})`;
    const deg = (screenDragPower.arc*180/Math.PI)%360 + 45;
    dragDisplay.style.transform = `scale(${1+screenDragPower.power}) rotate(${deg}deg)`;
    dragPowerDisplay.style.transform = `rotate(-${deg}deg)`;
    dragPowerDisplay.innerText = "x" + screenDragPower.power.toFixed(1);
  } else {
    dragDisplay.style.display = "none";
  }
}

const isMobile = navigator?.userAgentData?.mobile;
const fullScreenBtn = document.getElementById("full-screen-btn");
if (isMobile === true || typeof isMobile === "undefined") {
  fullScreenBtn.style.display = "";
}
fullScreenBtn.addEventListener("click", function() {
  document.documentElement.requestFullscreen();
  fullScreenBtn.style.display = "none";
});
