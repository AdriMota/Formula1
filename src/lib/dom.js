export function domForEach(selector, callback) {
  document.querySelectorAll(selector).forEach(callback);
}

export function domOn(selector, event, callback, options) {
  console.log("FDVRFVERVVRVR");
  domForEach(selector, ele => ele.addEventListener(event, callback, options));
}