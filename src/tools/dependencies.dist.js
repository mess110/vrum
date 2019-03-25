// this file is included in the build process to offer the same behaviour
// as dependencies.dev.js
//
// This allows switching from vrum.min.js to depedencies.dev.js easily
let VRUM_DEPENDS = [
]

const loadVrumScriptsWithDepends = (items, finishedCallback, relativeTo) => {
  if (relativeTo === undefined || relativeTo === null) { relativeTo = '' }
  if (items.length == 0) {
    if (finishedCallback instanceof Function) {
      finishedCallback()
    }
    return
  }
  const loadScript = (url, callback) => {
    var element = document.body;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    element.appendChild(script);
  }

  items.reverse()
  let url = items.pop()
  if (url.startsWith("../") && relativeTo !== '') {
    url = `${relativeTo}/${url}`
  }
  url = new URL(url, window.location.href).href
  loadScript(url, () => {
    loadVrumScriptsWithDepends(items.reverse(), finishedCallback, relativeTo)
  })
}

const loadVrumScripts = (items, finishedCallback, relativeTo) => {
  let depends = VRUM_DEPENDS.concat(items)
  loadVrumScriptsWithDepends(depends, finishedCallback, relativeTo)
}
