/*
 * This uses a discoveryServer
 * https://github.com/mess110/discoveryServer
 *
 * A sample server is hosted here:
 *
 * https://mesh.opinie-publica.ro/rooms.json
 *
 * Example usage:
 *
 *   let mn = new MeshNetwork()
 *
 *   mn.connect('https://mesh.opinie-publica.ro', 'room', { audio: false, video: false })
 *
 *   mn.onConnect = (peer) => {
 *     console.log(`connected with peer ${peer.cmKey}`)
 *   }
 *   mn.onData = (peer, data) => {
 *     console.log(`${data.from}: ${JSON.stringify(data)}`)
 *   }
 *   mn.onError = (peer, error) => {
 *     console.error(error)
 *   }
 *   mn.onClose = function (peer) => {
 *     console.log(`disconnected from peer ${peer.cmKey}`)
 *   }
 */
class MeshNetwork {
  constructor() {
    this.container = document.body
    this.cm = new discoveryClient.Mesh(
      this.handlePeer,
      [ { url: 'stun:stun.l.google.com:19302' } ],
      this
    )
  }

  connect(host, room, options) {
    this.host = host
    this.room = room
    if (isBlank(options)) { options = {} }
    if (isBlank(options.video)) { options.video = false }
    if (isBlank(options.audio)) { options.audio = false }
    if (isBlank(options.cCallback)) { options.cCallback = function () {} }
    if (isBlank(options.dcCallback)) { options.dcCallback = function () {} }
    this.options = options

    let mn = this

    if (options.video || options.audio) {
      navigator.mediaDevices.getUserMedia(options).then(function(stream) {
        let video = MeshNetwork.findOrCreateVideoStream('self', stream)
        mn.container.append(video)
        mn.socket = mn.cm.connect(host, room, stream, options.cCallback, options.dcCallback)
      }).catch(function (error) {
        mn.onError(undefined, error)
      })
    } else {
      mn.socket = mn.cm.connect(host, room, false, options.cCallback, options.dcCallback)
    }

    return this.socket
  }

  disconnect() {
    this.getPeers().forEach(function (peer) {
      peer.destroy()
    })
    this.cm.peers = []
    let video = document.querySelector(`#video-self`)
    if (!isBlank(video)) {
      video.pause()
      mn.container.removeChild(video)
    }
    this.socket.close()
  }

  reconnect() {
    this.disconnect()
    this.connect(this.host, this.room, this.options)
  }

  emit(data) {
    this.cm.emit(data)
  }

  send(data, peer) {
    this.cm.send(data, peer)
  }

  getPeers() {
    return this.cm.peers
  }

  getId() {
    if (isBlank(this.socket)) { throw 'Not connected. Must call connect() first.' }
    return this.socket.id
  }

  getAllIds() {
    let id = this.getId()
    let allIds = [id]
    this.getPeers().forEach(function (peer) {
      allIds.push(discoveryClient.parse({id: id}, peer, '{}').from)
    })
    return allIds
  }

  static findOrCreateVideoStream(id, stream) {
    let video = MeshNetwork.findOrCreateVideo(id)
    video.src = window.URL.createObjectURL(stream)
    video.play()
    return video
  }

  static findOrCreateVideo(id) {
    let v = document.querySelector(`#video-${id}`)
    if (isBlank(v)) {
      v = document.createElement('video')
      v.setAttribute('id', `video-${id}`)
      v.setAttribute('class', 'vrum-video')
    }
    return v
  }

  static isMaster() {
    return discoveryClient.getParameterByName('isMaster') == 'true'
  }

  static getRoomId(roomName) {
    if (isBlank(roomName)) { roomName = 'room' }
    return discoveryClient.getParameterByName(roomName)
  }

  handlePeer(peer, context) {
    let mn = context

    peer.on('connect', function () {
      mn.onConnect(peer)
    })
    peer.on('data', function (data) {
      var json = discoveryClient.parse(mn.socket, peer, data)
      mn.onData(peer, json)
    })
    peer.on('stream', function (stream) {
      let video = MeshNetwork.findOrCreateVideoStream(peer.cmKey, stream)
      mn.container.append(video)
      mn.onStream(peer, stream)
    })
    peer.on('error', function (error) {
      mn.onError(peer, error)
    })
    peer.on('close', function () {
      let video = document.querySelector(`#video-${peer.cmKey}`)
      if (!isBlank(video)) { mn.container.removeChild(video) }
      mn.onClose(peer)
    })
  }

  onConnect(peer) {
    console.log('Connected with cmKey ' + peer.cmKey)
  }

  onData(peer, data) {
    console.log(`${data.from}: ${JSON.stringify(data)}`)
  }

  onStream(peer, stream) {
  }

  // peer can be undefined
  onError(peer, error) {
    console.error(error)
  }

  onClose(peer) {
  }
}
