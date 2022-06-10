import "../css/common.scss";
import "../images/1.png";
import "../images/video.mp4";

function mouseoverEffect (this: any, event:Event) {
  let dom = event.target as Element;
  if (dom != this) {
    dom.classList.add("outline");
  }
}

function cancelMouseoutEffect (event: Event) {
  let dom = event.target as Element;
  dom.classList.remove("outline");
}

export function addHoverEvent(){
  document.addEventListener("mouseover", mouseoverEffect);
  document.addEventListener("mouseout", cancelMouseoutEffect);
}

export function removeHoverEvent () {
  document.removeEventListener("mouseover", mouseoverEffect);
  document.removeEventListener("mouseout", cancelMouseoutEffect);
}

