import "./index.scss";

import { deletePx } from "$canvas/util";
import { eraser } from "$canvasSpecialEffect/eraser";

export function createCoverCanvas (wrapDom: HTMLElement) {
  wrapDom.classList.add("wrapDom");
  let comstyle = getComputedStyle(wrapDom);
  let canvas = document.createElement("canvas");
  canvas.classList.add("coverCanvas");
  let ctx = canvas.getContext("2d")!;
  canvas.width = deletePx(comstyle.getPropertyValue("width"));
  canvas.height = deletePx(comstyle.getPropertyValue("height"));
  ctx!.fillStyle = "#999";
  ctx!.fillRect(0, 0, canvas.width, canvas.height);
  wrapDom.append(canvas);
  eraser(canvas, ctx);
}