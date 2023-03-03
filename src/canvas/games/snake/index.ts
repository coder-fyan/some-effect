import { createCanvas } from "$canvas/util";

const BOUNDERY = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};

export enum Direction {
  Up = -1,
  Down = 1,
  Left = -1,
  Right = 1,
}

export var SNAKEITEM = 5; // the step and the snakeItem length must be same.

var FOODITEM = 5;

interface initType{
  wrapDom: HTMLDivElement,
  width: number,
  height: number
}

interface posType {
  x: number,
  y: number
}

let gameIsOver:boolean = false;
var snake: posType[] = [];
export var nextStep: posType;

function isCollusion (nextPos: posType) {
  return snake.some(item => {
    return item.x == nextPos.x && item.y == nextPos.y;
  })
}

//the boundery test
function isOUtBoundery (nextPos: posType) {
  return (nextPos.y > BOUNDERY.right || nextPos.y >  BOUNDERY.bottom || nextPos.x < BOUNDERY.left || nextPos.y < BOUNDERY.top)
}

export function changeNextStep(step: posType) {
  nextStep = step;
}

function getSnakeHeadNextPos () {
  return {
    x: snake[0].x + nextStep.x,
    y: snake[0].y + nextStep.y
  }
}

export function changeGameState(state: boolean) {
  gameIsOver = state;
}

function gameOver () {
  console.log("game over");
}

var food: posType;
//we need three canvas layer to build the bluttonous snake.
//main layer
var mainctx: CanvasRenderingContext2D;
// snake layer
var snakectx: CanvasRenderingContext2D;
// food layer
var foodCtx: CanvasRenderingContext2D;

// when init the game,init a rect to as the snake head.
function initSnakeHead () {
  var x = Math.floor(Math.random() * BOUNDERY.right);
  var y = Math.floor(Math.random() * BOUNDERY.bottom);
  snake.unshift({x, y});
  snakectx.fillRect(x * SNAKEITEM, y * SNAKEITEM, SNAKEITEM, SNAKEITEM);
  // generateNextStep();
}

//init the food rect, We need to exclude some pos which is included in snake someday.
function initFood () {
  if (food) {
    foodCtx.clearRect(food.x * FOODITEM, food.y * FOODITEM, FOODITEM, FOODITEM);
  }
  var x = Math.floor(Math.random() * BOUNDERY.right); 
  var y = Math.floor(Math.random() * BOUNDERY.bottom);
  food = {x,y};
  foodCtx.fillRect(x * FOODITEM, y * FOODITEM, FOODITEM, FOODITEM);
}

// init the game
export function initGame(option: initType) {
  BOUNDERY.right = Math.floor(option.width / SNAKEITEM);
  BOUNDERY.bottom = Math.floor(option.height / SNAKEITEM);
  mainctx = createCanvas(option.wrapDom, {width: option.width, height: option.height}, "static");
  snakectx = createCanvas(option.wrapDom, {width: option.width, height: option.height}, "absolute");
  foodCtx = createCanvas(option.wrapDom, {width: option.width, height: option.height}, "absolute");
  foodCtx.fillStyle="blue";
  initFood();
  initSnakeHead();
}

export function move () {
  var nextPos: posType = getSnakeHeadNextPos();
  if (isCollusion(nextPos) || isOUtBoundery(nextPos) || gameIsOver) {
    gameOver();
    return;
  }
  if (nextPos.x === food.x && nextPos.y === food.y) {
    initFood();
  } else {
    let lastPoint = snake.pop();
    snakectx.clearRect(lastPoint!.x * SNAKEITEM, lastPoint!.y * SNAKEITEM, SNAKEITEM, SNAKEITEM);
  }
  snake.unshift(nextPos);
  snakectx.fillRect(nextPos.x * SNAKEITEM, nextPos.y * SNAKEITEM, SNAKEITEM, SNAKEITEM);
}

//add keyboard events.
window.addEventListener("keydown", event => {
  switch (event.key) {
    case "ArrowUp":
      changeNextStep({x: 0, y: Direction["Up"]});
      break;
    case "ArrowRight":
      changeNextStep({x: Direction["Right"], y: 0});
      break;
    case "ArrowDown":
      changeNextStep({x: 0, y: Direction["Down"]});
      break;
    case "ArrowLeft":
      changeNextStep({x: Direction["Left"], y: 0});
      break;
  }
  move();
})