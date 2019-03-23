Config.instance.window.showStatsOnStart = true
Config.instance.engine.debug = true

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    let contents = e.target.result;
    let json = JSON.parse(contents)
    let cinematic = new Cinematic(json)
    Hodler.add('cinematic', cinematic)

    Engine.switch(new GameScene(), cinematic.getAssets())

  };
  reader.readAsText(file);
}

document.querySelector('#scene-input')
  .addEventListener('change', readSingleFile, false);

Hodler.add('cinematic', new Cinematic({
  assets: [
    { type: 'font', path: '/workspace/assets/fonts/luckiest-guy' },
  ],
  items: []
}))

Engine.start(new GameScene(), Hodler.get('cinematic').getAssets())
