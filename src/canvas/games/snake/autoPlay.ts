import { Direction, changeNextStep, move, changeGameState } from "./index"

var dirArr = ["Up", "Right", "Down", "Left"];
function generateNextStep () {
  var idx = Math.floor(Math.random() * 4);
  var dir = dirArr[idx];
  if (dir === "Up" || dir === "Down") {
    changeNextStep({x: 0, y: Direction[dir]});
  } else if (dir === "Right" || dir === "Left") {
    changeNextStep({x: Direction[dir], y: 0});
  }
}

var MOVEGAP = 1000;
var kms: NodeJS.Timeout;

//the snake autoMove utill to be pause or game over.
export function start () {
  generateNextStep();
  move();
  kms = setTimeout (start, MOVEGAP);
}

//pause the game
export function stop () {
  changeGameState(true);
  clearTimeout(kms);
}