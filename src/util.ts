
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