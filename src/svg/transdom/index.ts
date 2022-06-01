
import { createDisDom } from "../../util/util"
import { img2canvas } from "../../canvas/image/index";
import "./index.scss"

//save button
function createLoadBtn () {
  let loadDom = document.createElement("a");
  loadDom.textContent = "保存";
  loadDom.download = "1.png";
  loadDom.classList.add("saveBtn");
  return loadDom;
}

//choice the dom which will be translated.
function choiceDom (e: Event) {
  let dom = e.target as HTMLElement;
  transDom2svg(dom).then((svg) => {
    let img = document.createElement("img");
    let svgString = encodeURIComponent(new XMLSerializer().serializeToString(svg));
    //this time, the image is a svg source,
    img.src = `data:image/svg+xml;charset=utf-8,${svgString}`;
    img.classList.add("exampleDom");
    let wrapDom = createDisDom();
    let loadBtn = createLoadBtn();
    //need after the img loaded then to canvas the img.
    img.onload = function () {
      let canvas = img2canvas(img);
      loadBtn.href = canvas.toDataURL();
      wrapDom.append(img);
      wrapDom.append(loadBtn);
      document.body.append(wrapDom);
    }
  });
} 

export function initTransDom2Svg () {
  document.addEventListener("dblclick", choiceDom);
}

export function closeTransDom2Svg() {
  document.removeEventListener("dblclick", choiceDom);
}


//parse image dom
async function parseImageDom (cloneDom: HTMLElement):Promise<HTMLElement> {
  let promiseArr: Promise<0>[] = [];
  //need switch the dom type image video and etc
  let images: HTMLImageElement[] = [];
  if (cloneDom.tagName.toLowerCase() == "img") {
    images.push(cloneDom as HTMLImageElement);
  } else {
    images = Array.from(cloneDom.querySelectorAll("img"));
  }
  images.forEach((item, idx) => {
    // need to clone the image dom, if not, the onload callback will be infinit called.
    let cloneImg = item.cloneNode(true) as HTMLImageElement;
    let pro: Promise<0> = new Promise((resolve, rejection) => {
      cloneImg.onload = function () {
        let canvas = img2canvas(item);
        item.src = canvas.toDataURL();
        //promise resolve needs an arguments
        resolve(0);
      }
    });
    promiseArr.push(pro);


  });
  return Promise.all(promiseArr).then(() => {
    return cloneDom;
  })
}

//parse dom
export async function parseDom (dom: HTMLElement):Promise<HTMLElement> {
  let cloneDom = dom.cloneNode(true) as HTMLElement;
  return Promise.all([parseImageDom(cloneDom)]).then(() => {
    return cloneDom;
  })
}

//get the styles from the document
export function getStylesFromDoc () {
  const allCSS = Array.from(document.styleSheets)
  .map(styleSheet => {
    try {
      return Array.from(styleSheet.cssRules) 
        .map(rule => rule.cssText)
        .join('');
    } catch (e) {
      console.log('Access to stylesheet %s is denied. Ignoring...', styleSheet.href);
    }
  })
  .filter(Boolean)
  .join(' ');
  //When we use style to img src attribute, we need to convert them.
  return allCSS.replace(/\n/g, '').replace(/\t/g, '').replace(/#/g, '%23');
}

function initSvgForeignObject(xmlNs: string) {
  let foreignObject = document.createElementNS(xmlNs, "foreignObject");
  //foreignObject needs to be set the under four settings.
  foreignObject.setAttribute("x", "0");
  foreignObject.setAttribute("y", "0");
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  return foreignObject;
}

function substractTheMarginPaddingAffect(dom: HTMLElement): HTMLElement {
  dom.style.margin = "0";
  dom.style.padding = "0";
  return dom;
}

export async function transDom2svg (dom: HTMLElement): Promise<Element> {
  return parseDom(dom).then((cloneDom) => {
    //svg needs to be set the xmlns attribute.
    let computeStyles = getComputedStyle(dom);
    console.log(document.styleSheets);
    let xmlNs = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(xmlNs, "svg");
    svg.setAttribute("width", computeStyles.getPropertyValue("width"));
    svg.setAttribute("height", computeStyles.getPropertyValue("height"));
    let foreignObject = initSvgForeignObject(xmlNs);
    let style = document.createElement("style");
    const sytleContent = document.createTextNode(getStylesFromDoc());
    style.appendChild(sytleContent);
    //the margin and padding if they added on the dom, it will affect the result.
    substractTheMarginPaddingAffect(cloneDom);
    // could use the style to the cloneDom or foreignObject, the destination is inline the outer style to svg.
    foreignObject.appendChild(style);
    foreignObject.append(cloneDom);
    svg.append(foreignObject);
    return svg;
  })
  
}