/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// @nodoc
var HighScoreManager = (function() {
  let instance = undefined;
  HighScoreManager = class HighScoreManager {
    static initClass() {
  
      instance = null;
  
      // Manages high scores
      //
      // @example
      //   # To register a new user/game
      //   jNorthPole.createUser('api_key', 'secret')
      //
      // @example
      //   hsm = HighScoreManager.get()
      //   hsm.api_key = 'api_key'
      //   hsm.secret = 'secret'
      //
      //   hsm.addScore('kiki', 210)
      //   hsm.getScores(20) # highest 20 scores
      //
      //   hsm.responseHandler = (data) ->
      //     # do something else
      const Cls = (Singleton.HighScoreManager = class HighScoreManager {
        static initClass() {
          this.prototype.apiKey = 'guest';
          this.prototype.secret = 'guest';
        }
  
        // Set apiKey and secret and attempt to register if tryRegister is true
        //
        // @param [String] apiKey
        // @param [String] secret
        // @param [Boolean] tryRegister default false
        auth(apiKey, secret, tryRegister) {
          if (tryRegister == null) { tryRegister = false; }
          if (tryRegister) {
            jNorthPole.createUser(apiKey, secret, data => console.log(`api key registered: ${apiKey}`));
          }
          this._setTokens(apiKey, secret);
          this._ensureTokenPresence();
          return this;
        }
  
        // Set apiKey and secret
        //
        // @param [String] apiKey
        // @param [String] secret
        _setTokens(apiKey, secret) {
          this.apiKey = apiKey;
          return this.secret = secret;
        }
  
        // add a score
        //
        // @param [String] name
        // @param [Number] score
        addScore(name, score) {
          this._ensureTokenPresence();
          if (name == null) { throw new Error('name required'); }
          if (!isNumeric(score)) { throw new Error('score needs to be a number'); }
  
          const json = {
            api_key: this.apiKey,
            secret: this.secret,
            type: 'highscore',
            name,
            score
          };
          return jNorthPole.createStorage(json, this.responseHandler, this.errorHandler);
        }
  
        // get scores
        //
        // @param [Number] limit
        getScores(limit, order) {
          if (limit == null) { limit = 10; }
          if (order == null) { order = 'desc'; }
          if (order == 'asc') { order = '1' }
          if (order == 'desc') { order = '-1' }
          this._ensureTokenPresence();
          const json = {
            api_key: this.apiKey,
            secret: this.secret,
            type: 'highscore',
            __limit: limit,
            __sort: { score: order }
          };
          return jNorthPole.getStorage(json, this.responseHandler, this.errorHandler);
        }
  
        // override this
        responseHandler(data) {
          return console.log(data);
        }
  
        // override this
        errorHandler(data, status) {
          return console.log(data);
        }
  
        _ensureTokenPresence() {
          if (this.apiKey == null) { throw new Error('apiKey missing'); }
          if (this.secret == null) { throw new Error('secret missing'); }
        }
      });
      Cls.initClass();
    }

    static get() {
      return instance != null ? instance : (instance = new Singleton.HighScoreManager());
    }

    static auth(apiKey, secret, tryRegister) {
      return this.get().auth(apiKey, secret, tryRegister);
    }

    static addScore(name, score) {
      return this.get().addScore(name, score);
    }

    static getScores(limit, order) {
      return this.get().getScores(limit, order);
    }
  };
  HighScoreManager.initClass();
  return HighScoreManager;
})();
