/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// @nodoc

var StatsManager = (function() {
  let instance = undefined;
  StatsManager = class StatsManager {
    static initClass() {
  
      instance = null;
  
      // Handles stats
      const Cls = (Singleton.StatsManager = class StatsManager {
        static initClass() {
          this.prototype.statsVisible = false;
        }
  
        // @nodoc
        constructor() {
          var fpsStats = new Stats()
          fpsStats.domElement.style['z-index'] = ''
          this.fpsStats = fpsStats
          this.rendererStats = new THREEx.RendererStats();

          this.container = document.createElement('div')
          this.container.style['z-index'] = Config.instance.ui.zIndex.stats
          this.container.style.position = 'absolute'
          this.container.style.top = '0px'
          this.container.style.left = '0px'

          this._showAll = this._showAll.bind(this)
          this.container.addEventListener('click', this._showAll)
          this._showAll()

          this.rendererStats.domElement.style.position = 'absolute';
          this.rendererStats.domElement.style.top = '144px';

          this.container.appendChild(this.fpsStats.domElement)
          this.container.appendChild(this.rendererStats.domElement)
        }

        _showAll() {
          Array.from(this.fpsStats.domElement.children).forEach(function (canvas) {
            canvas.style.display = 'block'
          })
        }
  
        // Toggles the visibility of the stats
        toggle() {
          this.statsVisible = !this.statsVisible;
          if (this.statsVisible) {
            document.body.appendChild(this.container)
          } else {
            document.body.removeChild(this.container)
          }
          return this.statsVisible;
        }
  
        // Set stat visibility
        setVisible(value) {
          if (value !== this.statsVisible) {
            return this.toggle();
          }
        }
  
        // @nodoc
        update(renderer) {
          if (!this.statsVisible) { return; }
          this.fpsStats.update()
          this.rendererStats.update(renderer)
        }
      });
      Cls.initClass();
    }

    static get() {
      return instance != null ? instance : (instance = new Singleton.StatsManager());
    }

    static toggle() {
      return this.get().toggle();
    }

    static setVisible() {
      return this.get().setVisible();
    }

    static update(renderer) {
      return this.get().update(renderer);
    }
  };
  StatsManager.initClass();
  return StatsManager;
})();
