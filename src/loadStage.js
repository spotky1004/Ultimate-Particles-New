import Stage from "./class/Stage.js";
import Action from "./class/Action.js";

function loadJSON(link) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest;
    request.open("GET", link, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        resolve(JSON.parse(request.responseText));
      } else {
        reject(Error("Failed to load JSON: " + request.responseText));
      }
    };

    request.onerror = function() {
      reject(Error("Failed to load JSON: " + request.response));
    };

    request.send();
  });
}

async function loadStage(link) {
  const levelData = await loadJSON(link);
  return new Stage({
    actions: levelData.actions.map(actionData => new Action(...actionData))
  });
}

export default loadStage;
