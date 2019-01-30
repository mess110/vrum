/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 *
 * Example:
 *
 *   SoundManager.play('orchestra.wav')
 *   SoundManager.pause('orchestra.wav')
 *   SoundManager.stop('orchestra.wav')
 *   SoundManager.fadeIn('orchestra.wav', 1)
 *   SoundManager.fadeOut('orchestra.wav', 0)
 *   SoundManager.volume('orchestra.wav', 0.5)
 *   SoundManager.volumeAll('orchestra.wav', 0.5)
 *   SoundManager.looping('orchestra.wav', true)
 *
 */
// @nodoc
var SoundManager = (function() {
  let instance = undefined;
  SoundManager = class SoundManager {
    static initClass() {
  
      instance = null;
  
      // Class used to manage sounds
      //
      // Can be accessed through the singleton class SoundManager
      const Cls = (Singleton.SoundManager = class SoundManager {
        static initClass() {
          this.prototype.items = {};
        }
  
        // generic cmd for Howler
        cmd(options) {
          if (options == null) { options = {}; }
          if (options.type == null) { throw new Error('options.type missing'); }
          if (options.key == null) { throw new Error('options.key missing'); }

          if (!(options.key in this.items)) {
            throw new Error(`Sound with key: ${options.key} not found!`);
            return;
          }

          switch (options.type) {
            case 'play': case 'pause': case 'stop':
              this.items[options.key][options.type]();
              break;
            case 'fadeIn': case 'fadeOut':
              if (options.to == null) { options.to = 1; }
              if (options.duration == null) { options.duration = 1000; }
              this.items[options.key][options.type](options.to, options.duration);
              break;
            case 'volume': case 'volumeAll':
              if (options.volume == null) { options.volume = 1; }
              if (options.type === 'volume') {
                this.items[options.key][options.type](options.volume);
              } else {
                this.volumeAll(options.volume);
              }
              break;
            case 'loop':
              if (options.loop == null) { options.loop = false; }
              this.items[options.key][options.type](options.loop);
              break;
            default:
              throw new Error(`unknown options.type ${options.type}`);
          }
  
          return this.items[options.key];
        }
  
        // Play a sound by key
        play(key) {
          return this.cmd({type: 'play', key});
        }
  
        // Pause a sound by key
        pause(key) {
          return this.cmd({type: 'pause', key});
        }
  
        stop(key) {
          return this.cmd({type: 'stop', key});
        }
  
        // fadeIn a sound by key
        fadeIn(key, to) {
          return this.cmd({type: 'fadeIn', key, to, duration});
        }
  
        // fadeOut a sound by key
        fadeOut(key, to) {
          return this.cmd({type: 'fadeOut', key, to, duration});
        }
  
        // set volume
        volume(key, volume) {
          return this.cmd({type: 'volume', key, volume});
        }
  
        // set looping
        looping(key, looping) {
          return this.cmd({type: 'loop', key, loop: looping});
        }
  
        // Update the volume of all the loaded sounds
        volumeAll(i) {
          if (i < 0) { i = 0; }
          if (i > 1) { i = 1; }
  
          for (let key in this.items) {
            this.volume(key, i);
          }
  
          return i;
        }
  
        has(key) {
          return (this.items[key] != null);
        }
      });
      Cls.initClass();
    }

    static get() {
      return instance != null ? instance : (instance = new Singleton.SoundManager());
    }

    static has(key) {
      return this.get().has(key);
    }

    static play(key) {
      return this.get().play(key);
    }

    static pause(key) {
      return this.get().pause(key);
    }

    static stop(key) {
      return this.get().stop(key);
    }

    static fadeIn(key, to) {
      return this.get().fadeIn(key, to);
    }

    static fadeOut(key, to) {
      return this.get().fadeOut(key, to);
    }

    static volume(key, volume) {
      return this.get().volume(key, volume);
    }

    static looping(key, looping) {
      return this.get().looping(key, looping);
    }

    static volumeAll(i) {
      return this.get().volumeAll(i);
    }

    static load(key, url) {
      return this.get().load(key, url);
    }

    static cmd(options) {
      return this.get().cmd(options);
    }
  };
  SoundManager.initClass();
  return SoundManager;
})();
