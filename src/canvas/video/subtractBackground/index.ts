
// ​added eraser to the video, but it did not have help.​ It can only be used on currentFrame
// import { eraser } from "specialEffect/eraser";


let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d")!;


type colorType = {
  red: number,
  green: number,
  blue: number,
  color: string
}

type canvasObj = {
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  imageDatas: Uint8ClampedArray [],
  substractColors: colorType[]
}

let canvasObj:canvasObj = {
  canvas,
  ctx,
  width: canvas.width,
  height: canvas.height,
  imageDatas: [],
  substractColors: []
};

let setT: NodeJS.Timeout;

function drawVideo(video: HTMLVideoElement) {
  ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
  substract("");
  setT = setTimeout(() => {
    drawVideo(video);
  },0);
}

export function video2canvas (video: HTMLVideoElement) {
  
  video.onloadeddata = function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video!.parentElement!.append(canvas);
    console.log("load");
    drawVideo(video);
    clearTimeout(setT);
    // eraser(canvas, ctx);
  }
  video.onplay = function () {
    drawVideo(video);
  };
  video.onpause = function () {
    clearTimeout(setT);
  }
  return canvas;
}

export function transHEX2rRGBA(hex: string) {
  let subNo = hex.replace("#", "");
  let hexArr = subNo.split("");
  let red = "";
  let green = "";
  let blue = "";
  if (hexArr.length == 3) {
    hexArr = [hexArr[0], hexArr[0], hexArr[1], hexArr[1], hexArr[2], hexArr[2]];
  }
  red = hexArr[0] + hexArr[1] + "";
  green = hexArr[2] + hexArr[3] + "";
  blue = hexArr[4] + hexArr[5] + "";
  return {
    red: parseInt(red, 16),
    green: parseInt(green, 16),
    blue: parseInt(blue, 16),
    color:`rgba(${parseInt(red, 16)}, ${parseInt(green, 16)}, ${parseInt(blue, 16)}, 1)`
  }
}

export function pickerColors () {
  canvas.addEventListener("click", (e) => {
    console.log(e.offsetX,e.offsetY);
    const frame = ctx!.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;
    let point = 4 * ((e.offsetY - 1)*frame.width + e.offsetX);
    let red = data[point];
    let green = data[point + 1];
    let blue = data[point + 2];
    let opacity = data[point + 3];
    console.log(red, green, blue, opacity);
    if (opacity != 0 || (red + green + blue != 0)) {
      canvasObj.substractColors.push({
        red,
        green,
        blue,
        color:`rgba(${parseInt(red + "", 16)}, ${parseInt(green + "", 16)}, ${parseInt(blue + "", 16)}, 1)`
      })
    }
    // substract("");
  })
}


let COLORRANGE = 10;
export function substract (backgroundColor: string) {
  const frame = ctx!.getImageData(0, 0, canvas.width, canvas.height);
  const length = frame.data.length;
  const data = frame.data;
  console.log(frame);
 
  for (let i = 0; i < length; i += 4) {
    const red = data[i + 0];
    const green = data[i + 1];
    const blue = data[i + 2];
    const colors = canvasObj.substractColors;
    for (let c = 0; c < colors.length; c++) {
      if (red >= colors[c].red - COLORRANGE && red <= colors[c].red + COLORRANGE && green >= colors[c].green - COLORRANGE && green <= colors[c].green + COLORRANGE && blue >= colors[c].blue - COLORRANGE && blue <= colors[c].blue + COLORRANGE) {
        data[i + 3] = 0;
      }
    }
  }
  ctx!.putImageData(frame, 0, 0);
}