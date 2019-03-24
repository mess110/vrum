// this file is included in the build process to offer the same behaviour
// as dependencies.dev.js
//
// This allows switching from vrum.min.js to depedencies.dev.js easily
let VRUM_DEPENDS = [
]

const loadVrumScriptsWithDepends = (items, finishedCallback) => {
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
  loadScript(items.pop(), () => {
    loadVrumScriptsWithDepends(items.reverse(), finishedCallback)
  })
}

const loadVrumScripts = (items, finishedCallback) => {
  depends = VRUM_DEPENDS.concat(items)
  loadVrumScriptsWithDepends(depends, finishedCallback)
}
