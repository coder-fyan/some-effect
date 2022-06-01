
import "./util.scss"


export function fetchSource (resource: RequestInfo, init?: RequestInit) {
  return fetch(resource, init).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${ res.status }`);
    }

    return res.blob();
  }).then((res) => {
    return res;
  })
}

//close btn
export function createCloseBtn (wrapDom: HTMLElement): HTMLElement {
  let closeDom = document.createElement("buttom");
  closeDom.textContent = "X";
  closeDom.classList.add("closeBtn");
  closeDom.addEventListener("click", () =>  {
    document.body.removeChild(wrapDom);
  })
  return closeDom;
}

//display dom
export function createDisDom () {
  let wrapDom = document.createElement("div");
  let closeBtn = createCloseBtn(wrapDom);
  wrapDom.classList.add("wraper");
  wrapDom.append(closeBtn);
  document.body.append(wrapDom);
  return wrapDom;
}