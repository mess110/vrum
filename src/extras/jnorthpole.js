/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

function buildParam(prefix, obj, add) {
  if (Array.isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; ++i) {
      buildParam(prefix + '[]', obj[i], add);
    }
  } else if ( obj && typeof obj === "object" ) {
    for (var name in obj) {
      buildParam(prefix + '[' + name + ']', obj[name], add);
    }
  } else {
    add(prefix, obj);
  }
}

function obj2QueryString(object) {
  var pairs = [],
    add = function (key, value) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    };
  for (var name in object) {
    buildParam(name, object[name], add);
  }
  return pairs.join('&')
    .replace(/%20/g, '+');
};

window.jNorthPole = {

  BASE_URL: 'https://json.northpole.ro/',

  help: `\
NorthPole JS wrapper example usage:

responseHandler = function (data) {
  console.log(data);
};

jNorthPole.getStorage(json, responseHandler);

socket = jNorthPole.getNewRealtimeSocket(responseHandler)
jNorthPole.subscribe(socket, 'foo')
jNorthPole.publish(socket, 'foo', { message: 'hello' })\
`,

  genericRequest(jsonObj, method, endPoint, responseHandler, errorHandler) {
    if (errorHandler == null) { errorHandler = responseHandler; }
    if (responseHandler == null) { throw 'responseHandler function missing'; }

    const r = new XMLHttpRequest;
    var url = `${this.BASE_URL}${endPoint}.json`
    if (method === 'GET') {
      url += "?" + obj2QueryString(jsonObj)
    }
    r.open(method, url, true);

    r.onreadystatechange = function() {
      if (r.readyState !== 4) { return; }
      if (r.status === 200) {
        responseHandler(JSON.parse(r.responseText), r.status);
      } else {
        errorHandler(JSON.parse(r.responseText), r.status);
      }
    };
    r.send(JSON.stringify(jsonObj));
  },

  createUser(api_key, secret, success, failure) {
    const jsonObj = {'api_key': api_key, 'secret': secret};
    this.genericRequest(jsonObj, 'POST', 'user', success, failure);
  },

  getUser(jsonObj, responseHandler, errorHandler) {
    this.genericRequest(jsonObj, 'SEARCH', 'user', responseHandler, errorHandler);
  },

  createStorage(jsonObj, responseHandler, errorHandler) {
    this.genericRequest(jsonObj, 'POST', 'storage', responseHandler, errorHandler);
  },

  getStorage(jsonObj, responseHandler, errorHandler) {
    this.genericRequest(jsonObj, 'GET', 'storage', responseHandler, errorHandler);
  },

  putStorage(jsonObj, responseHandler, errorHandler) {
    this.genericRequest(jsonObj, 'PUT', 'storage', responseHandler, errorHandler);
  },

  deleteStorage(jsonObj, responseHandler, errorHandler) {
    this.genericRequest(jsonObj, 'DELETE', 'storage', responseHandler, errorHandler);
  },

  getNewRealtimeSocket(responseHandler, errorHandler) {
    if (errorHandler == null) { errorHandler = responseHandler; }
    const socketUrl = this.BASE_URL.replace('http', 'ws');
    const socket = new WebSocket(`${socketUrl}realtime`);
    socket.onmessage = responseHandler;
    socket.onclose = errorHandler;
    return socket;
  },

  subscribe(socket, channel_name) {
    return socket.send(JSON.stringify({
      type: 'subscribe',
      channel_name
    }));
  },

  unsubscribe(socket, channel_name) {
    return socket.send(JSON.stringify({
      type: 'unsubscribe',
      channel_name
    }));
  },

  publish(socket, channel_name, json) {
    return socket.send(JSON.stringify({
      type: 'publish',
      channel_name,
      content: json
    }));
  }
};
