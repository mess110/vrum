// Used for continously looping sounds from the SoundManager
class Playlist {
  // @param [Array] keys
  constructor(keys) {
    if (!(keys instanceof Array)) { throw new Error('keys needs to be an array') }
    for (let key of Array.from(keys)) {
      if (!SoundManager.has(key)) {
        throw new Error(`key '${key}' not loaded in SoundManager`)
      }
    }
    this.items = new CyclicArray(keys)
  }

  // start playing the playlist
  //
  // @example
  //   playlist = new Playlist(['shotgun', 'hit'])
  //   playlist.play()
  //
  // @see getPlayingKey
  cmd(options){
    let audio
    options.key = this.items.get()
    if (options.type === 'volumeAll') {
      options.type = 'volume'
      for (let item of Array.from(this.items.items)) {
        options.key = item
        SoundManager.cmd(options)
      }
    } else {
      audio = SoundManager.cmd(options)
    }
    if (['play', 'fadeIn'].includes(options.type)) {
      audio._onend = []
      return audio.on('end', data => {
        this.items.next()
        return this.cmd(options)
      })
    } else if (['volume', 'volumeAll'].includes(options.type)) {
      // do nothing
    } else {
      return audio._onend = []
    }
  }

  // Get the key of the sound currently playing
  //
  // @example
  //   playlist = new Playlist(['shotgun', 'hit'])
  //   playlist.play()
  //   SoundManager.pause(playlist.getPlayingKey())
  getPlayingKey() {
    return this.items.get()
  }

  // Get the audio object which is currently playing
  getPlayingAudio() {
    return SoundManager.get().items[this.getPlayingKey()]
  }
}
