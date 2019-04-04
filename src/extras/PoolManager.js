/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Handle object pooling for BaseModel classes
//
// @example
//
//   PoolManager.on('spawn', Pillar, (item, options) => {
//     item.position.set(0, 0, 0)
//     Hodler.get('scene').add(item)
//   })
//
//   PoolManager.on('release', Pillar, (item, options) => {
//     Hodler.get('scene').remove(item)
//   })
//
//   item = PoolManager.spawn(Card)
//   PoolManager.release(item)
//
//   PoolManager.releaseAll()
//
//   PoolManager.spawn Card, {}
//   PoolManager.onSpawn Card, (item, options) ->
//     # do stuff
//
//
var PoolManager = (function() {
  let instance = undefined;
  PoolManager = class PoolManager {
    static initClass() {

      instance = null;

      const Cls = (Singleton.PoolManager = class PoolManager {
        static initClass() {
          this.prototype.validEvents = ['spawn', 'release'];

          this.prototype.items = {};
          this.prototype.itemsInUse = {};

          this.prototype.spawnEvents = {};
          this.prototype.releaseEvents = {};
        }

        // @param [BaseModel Class] type
        spawn(type, options) {
          let item;
          if (isBlank(options)) { options = {} }
          this._validation(type);

          if (this.items[type].isEmpty()) {
            item = new type();
          } else {
            item = this.items[type].shift();
          }

          this.itemsInUse[type].push(item);
          if (this.spawnEvents[type] != null) { this.spawnEvents[type](item, options); }
          return item;
        }

        spawnSpecific(item, options) {
          if (options == null) { options = {}; }
          const type = item.constructor;
          this._validation(type);

          if (!this.itemsInUse[type].includes(item)) {
            const removed = this.items[type].remove(item);
            if (removed === null) {
              throw 'item needs to be previously spawned by PoolManager';
            }
            this.itemsInUse[type].push(item);
          }

          if (this.spawnEvents[type] != null) { this.spawnEvents[type](item, options); }
          return item;
        }

        // @param [BaseModel] item
        release(item, options) {
          if (options == null) { options = {}; }
          if ((typeof item !== 'object') || (item.constructor == null)) {
            throw new Error(`item ${item} can not be released. wront type`);
          }

          const type = this._validation(item.constructor);

          if (this.itemsInUse[type].indexOf(item) === -1) {
            if (this.items[type].indexOf(item) === -1) {
              throw new Error(`item (${type}) was not spawned from the pool`);
            }
          }

          if (this.itemsInUse[type].indexOf(item) !== -1) {
            this.itemsInUse[type].remove(item);
          }
          if (this.items[type].indexOf(item) === -1) {
            this.items[type].push(item);
          }
          if (this.releaseEvents[type] != null) { this.releaseEvents[type](item, options); }
        }

        on(which, type, func) {
          if (!(typeof this.validEvents.includes === 'function' ? this.validEvents.includes(which) : undefined)) {
            throw new Error(`${which} invalid. Allowed: ${this.validEvents.join(', ')}`);
          }
          return this[`${which}Events`][type] = func;
        }

        onSpawn(type, func) {
          return this.on('spawn', type, func);
        }

        onRelease(type, func) {
          return this.on('release', type, func);
        }

        _validation(type) {
          if (!isArray(this.items[type])) { this.items[type] = [] }
          if (!isArray(this.itemsInUse[type])) { this.itemsInUse[type] = [] }

          return type;
        }

        _count(items) {
          let count = 0;
          for (let key in items) {
            count += items[key].size();
          }
          return count;
        }

        toString() {
          const inUse = this._count(this.itemsInUse);
          const inPool = this._count(this.items);

          return `${inUse} items in use\n${inPool} items waiting in all pools\n${inUse + inPool} total items`;
        }

        stats() {
          let result = {}
          let itemTypes = Object.keys(this.items)
          itemTypes.forEach((itemType) => {
            let inPool = this.items[itemType].size()
            let inUse = this.itemsInUse[itemType].size()
            result[itemType.split(' ')[1]] = {
              total: inPool + inUse,
              inPool: inPool,
              inUse: inUse
            }
          })
          return result
        }

        releaseAll() {
          let item;
          const toRelease = [];

          for (let key in this.itemsInUse) {
            for (item of Array.from(this.itemsInUse[key])) {
              toRelease.push(item);
            }
          }
          for (item of Array.from(toRelease)) {
            this.release(item);
          }

          return toRelease;
        }

        getAll() {
          const allItems = [];
          for (let itemSet of [this.items, this.itemsInUse]) {
            for (let key in itemSet) {
              for (let item of Array.from(itemSet[key])) {
                allItems.push(item);
              }
            }
          }
          return allItems;
        }
      });
      Cls.initClass();
    }

    static get() {
      return instance != null ? instance : (instance = new Singleton.PoolManager());
    }

    static spawn(type, options) {
      if (options == null) { options = {}; }
      return this.get().spawn(type, options);
    }

    static release(item, options) {
      if (options == null) { options = {}; }
      return this.get().release(item, options);
    }

    static on(which, type, func) {
      return this.get().on(which, type, func);
    }

    static onSpawn(type, func) {
      return this.get().on('spawn', type, func);
    }

    static onRelease(type, func) {
      return this.get().on('release', type, func);
    }

    static releaseAll() {
      return this.get().releaseAll();
    }

    static items(type) {
      if (type != null) {
        return this.get().items[type] || [];
      } else {
        let results = [];
        for (let key in this.get().items) {
          results = results.concat(this.get().items[key]);
        }
        return results;
      }
    }

    static stats() {
      return this.get().stats()
    }

    static itemsInUse(targetType) {
      let results = [];
      if (targetType != null) {
        const type = [].concat(targetType);
        for (let theType of Array.from(type)) {
          results = results.concat(this.get().itemsInUse[theType] || []);
        }
        results;
      } else {
        for (let key in this.get().itemsInUse) {
          results = results.concat(this.get().itemsInUse[key]);
        }
      }
      return results;
    }
  };
  PoolManager.initClass();
  return PoolManager;
})();
