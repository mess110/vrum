// this file is included in the build process to offer the same behaviour
// as dependencies.dev.js
//
// This allows switching from vrum.min.js to depedencies.dev.js easily
let VRUM_DEPENDS = [
]

const loadVrumScriptsWithDepends = (items) => {
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
    if (items.length != 0) {
      loadVrumScriptsWithDepends(items.reverse())
    }
  })
}

const loadVrumScripts = (items) => {
  loadVrumScriptsWithDepends(VRUM_DEPENDS.concat(items))
}
