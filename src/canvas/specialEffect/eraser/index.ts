export function eraser (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx!.globalCompositeOperation = 'destination-out';
  let flag = false;
  ctx!.strokeStyle = "rgba(51, 170, 51, 1)";
  ctx!.lineWidth = 10;
  //if we have some callback function,it can be located at there
  canvas.addEventListener("mousedown", (e) => {
    //we need use moveto to restart the path start point
    ctx!.moveTo(e.offsetX, e.offsetY);
    flag = true;
  });
  canvas.addEventListener("mousemove", (e) => {
    if (flag) {
      ctx!.lineTo(e.offsetX, e.offsetY);
      ctx!.stroke();
    }
  })
  document.addEventListener("mouseup", () => {
    flag = false;
  })
}