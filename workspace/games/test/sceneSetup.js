/*
 * This is an example sceen setup.
 *
 * Lets say you want a to make a tripple-A game, which shows some company logos,
 * plays a video, loads assets, switches to the menu. player presses start.
 * switches to a loading screen, loads game assets, switches to the game scene.
 * player input:
 *
 *  - player wins - switches to loading credits assets, once loaded switches
 *                  to credits scene
 *  - player looses - restarts the game scene
 *  - player presses esc - switches to menu scene
 *
 * on credits scene, shows credits, when finished switches to the menu scene
 */

/*
 * The scene where the main gameplay happens
 *
 * Press L   - loose the game
 * Press W   - win the game
 * Press Esc - back to menu
 */
class GameScene extends Scene {
  init(options) {
    let camera = this.getCamera()
    camera.position.set(0, 10, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.add(new THREE.AmbientLight())

    this.one = AssetManager.clone('chicken.gltf')
    this.add(this.one)
  }

  backToMenu() {
    if (this.finished) { return }
    console.log('back to menu')
    this.finished = true
    Engine.switch(Hodler.get('menuScene'))
  }

  win() {
    if (this.finished) { return }
    console.log('you win')
    this.finished = true
    Engine.switch(Hodler.get('creditsLoadingScene'))
  }

  loose() {
    if (this.finished) { return }
    console.log('you loose')
    this.finished = true
    Engine.switch(Hodler.get('gameScene'))
  }

  doKeyboardEvent(event) {
    if (event.type != 'keydown') { return }
    if (event.code == 'KeyW') {
      this.win()
    }
    if (event.code == 'KeyL') {
      this.loose()
    }
    if (event.code == 'Escape') {
      this.backToMenu()
    }
  }
}

/* The scene which holds the menu
 *
 * Click on the play button to start the game.
 */
class MenuScene extends Scene {
  init(options) {
    let camera = this.getCamera()
    camera.position.set(0, 10, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.playButton = Utils.plane({
      map: 'play.png',
      keepProportions: true,
      transparent: true,
    })
    this.add(this.playButton)
  }

  startGame() {
    if (this.finished) { return }
    this.finished = true
    Engine.switch(Hodler.get('gameLoadingScene'))
  }

  doMouseEvent(event, raycaster) {
    if (event.type != 'mousedown') { return }
    if (raycaster.intersectObject(this.playButton).any()) {
      this.startGame()
    }
  }
}

Config.instance.engine.debug = true

// shows the menu button and ability to interract with it
// Click play button create a loading scene, load game assets, once finished
// loading switch to gameScene
let menuScene = new MenuScene()
Hodler.add('menuScene', menuScene)

// shows credits, once done switch to menuScene
let creditsScene = new AddsScene(menuScene, ["credits.png"])
Hodler.add('creditsScene', creditsScene)

// loads credit assets, once finished switches to creditsScene
let creditsLoadingScene = new LoadingScene(creditsScene, [
  { type: 'image', path: '/workspace/assets/textures/credits.png' },
])
Hodler.add('creditsLoadingScene', creditsLoadingScene)

// main gameplay, shows a chicken
// W   - win, switch to creditsLoadingScene
// L   - reload the current scene
// Esc - switch to the menu, menu assets already loaded
let gameScene = new GameScene()
Hodler.add('gameScene', gameScene)

let gameLoadingScene = new LoadingScene(gameScene, [
  { type: 'model', path: '/workspace/assets/models/chicken.gltf' },
])
Hodler.add('gameLoadingScene', gameLoadingScene)

// load assets needed for menu and switch to menu when finished
let loadingScene = new LoadingScene(menuScene, [
  { type: 'image', path: '/workspace/assets/textures/play.png' },
])

// play video and switch to loadingScene when finished
let videoScene = new VideoScene(loadingScene, "/workspace/assets/textures/sintel.mp4")

// go to video once logos are finished
let logosScene = new AddsScene(videoScene, ["vrum.png", "vrum-screenshot.png"])

// start with the logos scene, load logo assets
Engine.start(logosScene, [
  { type: 'image', path: '/workspace/assets/textures/vrum.png' },
  { type: 'image', path: '/workspace/assets/textures/vrum-screenshot.png' },
])
