
import { img2canvas } from "../canvas/image/index";


function choiceDom (e: Event) {
  let dom = e.target as HTMLElement;
  transDom2svg(dom).then((svg) => {
    let img = document.createElement("img");
    // let svgString = encodeURIComponent(new XMLSerializer().serializeToString(svg));
    let svgString = new XMLSerializer().serializeToString(svg);
    img.src = `data:image/svg+xml;charset=utf-8,${svgString}`;
    document.body.append(img);
  });
} 

export function initTransDom2Svg () {
  document.addEventListener("click", choiceDom);
}

export function closeTransDom2Svg() {
  document.removeEventListener("click", choiceDom);
}

export async function parseDom (dom: HTMLElement):Promise<HTMLElement> {
  let cloneDom = dom.cloneNode(true) as HTMLElement;
  let promiseArr: Promise<0>[] = [];
  //need switch the dom type image video and etc
  let images: HTMLImageElement[] = [];
  if (dom.tagName.toLowerCase() == "img") {
    images.push(cloneDom as HTMLImageElement);
  } else {
    images = Array.from(cloneDom.querySelectorAll("img"));
  }
  images.forEach((item, idx) => {
    let cloneImg = item.cloneNode(true) as HTMLImageElement;
    let pro: Promise<0> = new Promise((resolve, rejection) => {
      cloneImg.onload = function () {
        let canvas = img2canvas(item);
        item.src = canvas.toDataURL();
        //promise resolve needs an arguments
        resolve(0);
      }
    });
    promiseArr.push(pro)
  });
  return Promise.all(promiseArr).then(() => {
    return cloneDom;
  })
}

//
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
  return allCSS.replace(/\n/g, '').replace(/\t/g, '').replace(/#/g, '%23');;
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
    let foreignObject = document.createElementNS(xmlNs, "foreignObject");
    //foreignObject needs to be set the under four settings.
    foreignObject.setAttribute("x", "0");
    foreignObject.setAttribute("y", "0");
    foreignObject.setAttribute("width", "100%");
    foreignObject.setAttribute("height", "100%");
    let style = document.createElement("style");
    const sytleContent = document.createTextNode(getStylesFromDoc());
    console.log(sytleContent);
    style.appendChild(sytleContent);
    foreignObject.appendChild(style);
    foreignObject.append(cloneDom);
    svg.append(foreignObject);
    return svg;
  })
  
}