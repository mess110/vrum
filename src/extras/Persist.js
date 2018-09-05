/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Persist data on the client
//
// Features:
//
// * prefix (default: 'ce')
// * default values
// * clear storage with exceptions
// * auto converts number and boolean values
//
// @example
//   Persist.PREFIX = 'coffee.engine'
//   Persist.set('hello', 'dear')
//   Persist.get('hello') # returns dear
//
// @example
//   Persist.set('hello', 'dear', 'world') # world is default value
//
// @example
//   persist = new Persist()
//   persist.default('hello', 'world')
//   persist.get('hello') # returns world
class Persist {
  static initClass() {
    this.PREFIX = 'ce';
    this.DEFAULT_SUFFIX = 'default';
  }

  // chooses storage type. By default, it uses localStorage
  //
  // @see https://developer.mozilla.org/en/docs/Web/API/Window/localStorage
  constructor() {
    this.storage = localStorage;
  }

  // sets a json value to the storage
  //
  // @see set
  setJson(key, value, def) {
    if (def == null) { def = undefined; }
    value = JSON.stringify(value);
    if (def != null) { def = JSON.stringify(def); }
    return this.set(key, value, def);
  }

  // set a value in the storage
  //
  // @param [String] key
  // @param [Object] value
  set(key, value, def) {
    if (def == null) { def = undefined; }
    if (key == null) { throw 'key missing'; }
    this.storage[`${Persist.PREFIX}.${key}`] = value;
    if (def != null) { return this.default(key, def); }
  }

  // set the default json for a key
  defaultJson(key, value) {
    value = JSON.stringify(value);
    return this.default(key, value);
  }

  // set the default value for a key
  //
  // The default value is stored in the same storage and has the suffix DEFAULT_SUFFIX
  //
  // @param [String] key
  // @param [Object] value
  //
  // @see DEFAULT_SUFFIX
  default(key, value) {
    return this.set(`${key}.${Persist.DEFAULT_SUFFIX}`, value);
  }

  // Get a json value from the storage.
  //
  // @see get
  getJson(key) {
    const item = this.get(key);
    if (item != null) {
      return JSON.parse(item);
    }
  }

  // Get a value in the storage. If the value does not exist,
  // it checks for the default value
  //
  // automatically convers to the correct type
  //
  // @param [String] key
  get(key) {
    const value = this._get(key);
    if ((value == null)) { return this._get(`${key}.${Persist.DEFAULT_SUFFIX}`); } else { return value; }
  }

  // Get a value in the storage
  _get(key) {
    if (key == null) { throw 'key missing'; }
    const value = this.storage[`${Persist.PREFIX}.${key}`];
    if (isNumeric(value)) { return Number(value); }
    if (value === 'true') { return true; }
    if (value === 'false') { return false; }
    if (value === 'undefined') { return undefined; }
    return value;
  }

  // Removes item from storage
  //
  // @param [String] key
  rm(key) {
    if (key == null) { throw 'key missing'; }
    return this.storage.removeItem(`${Persist.PREFIX}.${key}`);
  }

  // clear storage with exceptions
  //
  // @param [Array] exceptions
  // @param [Boolean] withDefaults also include defaults in the deletion
  clear(exceptions, withDefaults) {
    if (exceptions == null) { exceptions = []; }
    if (withDefaults == null) { withDefaults = false; }
    if (!(exceptions instanceof Array)) { exceptions = [exceptions]; }
    return (() => {
      const result = [];
      for (let storage in this.storage) {
        if (storage.endsWith(`.${Persist.DEFAULT_SUFFIX}`) && (withDefaults === false)) { continue; }
        if (!exceptions.includes(storage)) {
          result.push(this.rm(storage));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  static sessionStorage() {
    const persist = new Persist();
    persist.storage = sessionStorage;
    return persist;
  }

  // @see get
  static getJson(key) {
    return new Persist().getJson(key);
  }

  // @see get
  static get(key) {
    return new Persist().get(key);
  }

  // @see set
  static setJson(key, value, def) {
    return new Persist().setJson(key, value, def);
  }

  // @see set
  static set(key, value, def) {
    return new Persist().set(key, value, def);
  }

  // @see default
  static default(key, value) {
    return new Persist().default(key, value);
  }

  // @see defaultJson
  static defaultJson(key, value) {
    return new Persist().defaultJson(key, value);
  }

  // @see rm
  static rm(key) {
    return new Persist().rm(key);
  }

  // @see clear
  static clear(exceptions, withDefaults) {
    return new Persist().clear(exceptions, withDefaults);
  }
}
Persist.initClass();
