# Assets

Please follow [the previous tutorial](/tutorials/SCENES.md) if you want to know how
to navigate scenes.

vrum.js supports all the asset types supported by THREE.JS but it has a helper
for only a subet of them:

* images
* sounds
* json objects
* gltf/glb/json models

## AssetManager

Assets can be loaded though the `AssetManager` class.

```
AssetManager.loadAssets([
  { type: 'model', path: '/workspace/assets/models/chicken.json' },
  { type: 'model', path: '/workspace/assets/models/panda.glb' },
  { type: 'image', path: '/workspace/assets/models/chicken.png' },
  { type: 'image', path: '/workspace/assets/textures/heightmap3.png' },
  { type: 'image', path: '/workspace/assets/textures/waternormals.jpg' },
  { type: 'json',  path: '/workspace/assets/particles/particle.json' },
  { type: 'json',  path: '/workspace/assets/graffiti/majestic-frog-cover.json' },
  { type: 'json',  path: '/workspace/assets/shaders/basic_shader.json' },
  { type: 'json',  path: '/workspace/assets/shaders/dissolve_shader.json' },
  { type: 'json',  path: '/workspace/assets/terrains/terrain.json' },
  { type: 'sound', path: '/workspace/assets/sounds/hit.wav' },
  { type: 'sound', path: '/workspace/assets/sounds/SuperHero_original.ogg' },
], function () {
  Engine.switchScene(otherScene)
})
```

In `otherScene`, 3D Models should be cloned `let chicken = AssetManager.clone('chicken.json')`,
you can get models/images/json/sound with `let texture = AssetManager.get('chicken.png')` and
play sounds though [SoundManager](/tutorials/CHEATSHEET.md#Sound).

```
let hat = AssetManager.clone('hat.gltf')
hat.position.set(0, 0.9, 0)

let model = AssetManager.clone('mole.gltf')
model.position.set(0, 0.5, 4)
model.attachToBone('mole-skeleton_Head', hat)

model.animations.play('taunt3', { stopAll: true})
console.log(model.animations)

model.animations.fadeAnimation('hit', 'idle')

model.animations.from = 'idle'
model.animations.play('idle', { stopAll: false })
model.animations.play('walk', { stopAll: false, weight: 0 })
model.animations.play('wiggle', { stopAll: false })
model.animations.play('tongue', { stopAll: false })
```

For the core of our game we need:

* hat model - with interchangable skin
* player model - with walk, chop and carry animations
* table - to chop on
* sink - to wash in
* fryer - to cook in
* trashcan
* food source - with different skins for different food
* food
* plate
* floor

Once all assets are loaded we switch to the main scene. The game should not start
right away. That might surprise the player. Instead, lets show some text and wait
for input. We can store the state of the game in a variable which we change
if the correct key is pressed in `doKeyboardEvent`. We could also show an image
which gives the user information about keybindings. We add our assets as well.

```
let text = new BaseText({
  text: 'Press <Enter> to start', fillStyle: 'blue',
  canvasW: 1024, canvasH: 1024,
  font: '64px Helvetica'})
text.position.set(0, 0, 4)
this.add(text)

let player = AssetManager.clone('player.gltf')
this.add(player)
```
