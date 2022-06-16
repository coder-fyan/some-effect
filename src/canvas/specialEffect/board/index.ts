import { createDisDom } from "util/domWidget";

import { deletePx } from "../../util";

import "./index.scss";

let canvasDom = document.createElement("canvas"); //sketchboard
let ctx = canvasDom.getContext("2d"); //canvas context
let curColor = "black"; // canvas color
let curWidth = 1; // line width
let loadDom:HTMLAnchorElement;

//draw canvas to white
function clear() {
  ctx!.fillStyle = "white";
  ctx?.fillRect(0, 0, canvasDom.width, canvasDom.height);
}

//save btn
function createLoadBtn () {
  let a = document.createElement("a");
  a.classList.add("a");
  a.download = "1.png"
  a.textContent = "保存";
  return a;
}


//let isEraser = false;
function createCleanBtn () {
  let btnDom = document.createElement("input");
  btnDom.setAttribute("type", "bottom");
  btnDom.classList.add("clean");
  btnDom.value = "清除";
  btnDom.addEventListener("click", () => {
    // If we use the clearRect method, it will clear all of it which is drawn on the canvas.
    // ctx?.clearRect(0, 0, canvasDom.width, canvasDom.height);
    clear();
  })
  return btnDom;
}

//create a color picker
function createColorPicker () {
  let inputDom = document.createElement("input");
  inputDom.setAttribute("type", "color");
  inputDom.classList.add("colorPicker");
  inputDom.addEventListener("change", (e) => {
    curColor = (e!.target!as HTMLInputElement).value;
    console.log(curColor);
  })
  return inputDom;
}

//create width setting
function createWidthSetting() {
  let inputDom = document.createElement("input");
  inputDom.setAttribute("type", "number");
  inputDom.setAttribute("value", "1");
  inputDom.classList.add("widthSetting");
  inputDom.addEventListener("change", (e) => {
    curWidth = +(e!.target!as HTMLInputElement).value;
    console.log(curWidth);
  })
  return inputDom;
}


let flag = false;
function initDraw () {
  let point: Array<number> = [];
  canvasDom.addEventListener("mousedown", (e) => {
    flag = true;
    ctx!.moveTo(e.offsetX, e.offsetY);
    ctx!.strokeStyle = curColor;
    ctx!.lineWidth = curWidth;
    ctx!.beginPath();
  })
  canvasDom.addEventListener("mouseup", () => {
    loadDom.setAttribute("href", canvasDom.toDataURL());
  })
  canvasDom.addEventListener("mousemove", (e) => {
    if(flag) {
      // ctx!.lineTo(e.offsetX, e.offsetY);
      // ctx?.stroke();
      point.push(e.offsetX, e.offsetY);
      if(point.length === 6) {
        ctx!.bezierCurveTo(point[0], point[1], point[2], point[3], point[4], point[5]);
        ctx?.stroke();
        point.splice(0, 2);
      }
      
    }
  })
}


//init board
export function createBoard() {
  let disDom = createDisDom();
  disDom.addEventListener("mouseup", (e) => {
    flag = false;
  })
  let compStyle = getComputedStyle(disDom);
  let disDomHgh = deletePx(compStyle.getPropertyValue("height"));
  let disDomWid = deletePx(compStyle.getPropertyValue("width"));
  canvasDom.width = disDomWid * 0.6;
  canvasDom.height = disDomHgh * 0.6;
  canvasDom.classList.add("canvas");
  clear();
  initDraw();
  let colorPicker = createColorPicker();
  let widthSetting = createWidthSetting();
  let cleanBtn = createCleanBtn();
  loadDom = createLoadBtn();
  disDom.append(loadDom);
  disDom.append(cleanBtn);
  disDom.append(canvasDom);
  disDom.append(colorPicker);
  disDom.append(widthSetting);
  console.log(disDomHgh, disDomWid);
}