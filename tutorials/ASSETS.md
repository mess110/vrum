# Assets

vrum.js supports all the asset types supported by THREE.JS but it has a helper
for only a subet of them:

* images
* sounds
* json objects (particles/shaders/terrain/paintings)
* gltf/glb/json models
* fonts

## AssetManager

Assets can be loaded though the `AssetManager` class.

```
AssetManager.loadAssets([
  { type: 'font', path: '/workspace/assets/fonts/luckies-guy' },
  { type: 'model', path: '/workspace/assets/models/panda.glb' },
  { type: 'image', path: '/workspace/assets/models/chicken.gltf' },
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
], callback)
```

`loadAssets` expects an array of dicts, each dict needs to have 2 keys:
type and path. Type `model` loads gltf/glb objects and instantiates
the correct THREE objects. Type `json` loads as a json object. Type `image`
is loaded and served as Texture. Type `sound` is added to `SoundManager`.
Type `font` adds the css to load the font-face

3D Models should be cloned so we can modify them independently.

`let chicken = AssetManager.clone('chicken.gltf')`

You can get models/images/json/sound with
`let texture = AssetManager.get('chicken.png')` and
play sounds though [SoundManager](/tutorials/CHEATSHEET.md#Sound).

## Models

Models should use the clone method so they can be moved independently.

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

## JSON

You can load JSON files. Some JSON files contain metadata to help you build
different objects like particles, shaders, terrain and paintings. Look into
[/workspace/assets/](/workspace/assets/) to check the sample objects out.

* [Terrain](/tutorials/CHEATSHEET.md#Terrain)
* [Particles](/tutorials/CHEATSHEET.md#Particles)
* [Shaders](/tutorials/CHEATSHEET.md#Shaders)
* [Graffiti](/tutorials/CHEATSHEET.md#Graffiti)

```
let json = AssetManager.clone('terrain.json')
// with
```

## EngineHelpers

2 helpers are provided for loading assets. They load the assets and once
they finish loading, they switch to the specified scene. This combo can
be used to create nice loading screens.

```
Engine.start(new GameScene(), [
  { type: 'font', path: 'assets/luckiest-guy' },
  { type: 'image', path: 'assets/vrum.png' },
])
```

```
Engine.switch(new MainScene(), [
  { type: 'image', path: 'assets/floor.png' },
])
```
