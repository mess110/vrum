## Exporting from Blender

To export to glTF, the recommended format by three.js, you need to install the
[glTF-Blender-Exporter](https://github.com/KhronosGroup/glTF-Blender-Exporter)
blender addon.

* [Download the exporter](https://github.com/KhronosGroup/glTF-Blender-Exporter/archive/master.zip)
* unzip `scripts/addons/io_scene_gltf2` to `~/.config/blender/VERSION/scripts/addons/`
* enable the addon from Blender User Preferences
* export to glb as it packs all the resources in 1 file

## Export many script

```
blender ../path/to.blend --python export_all_glb.py
```

```
import bpy
import os
from time import sleep

def clear_selection():
    for obj in bpy.context.scene.objects:
        obj.select = False

def export_all_fbx():
    filepath = bpy.data.filepath
    outputFolder = os.path.dirname(filepath)

    objects = bpy.data.objects
    for object in objects:
        clear_selection()
        object.select = True
        object.location = (0, 0, 0)
        exportPath = "%s/%s.glb" % (outputFolder, object.name)
        bpy.ops.export_scene.glb(filepath=exportPath,
                                 export_selected=True,
                                 export_apply=True)

export_all_fbx()
bpy.ops.wm.quit_blender()
```
