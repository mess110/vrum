/*
 * This uses a discoveryServer
 * https://github.com/mess110/discoveryServer
 *
 * A sample server is hosted here:
 *
 * https://46.101.185.106/rooms.json
 *
 * Example usage:
 *
 *    let mn = MeshNetwork.instance
 *
 *    mn.connect('https://46.101.185.106', 'room')
 *    mn.onClose = function () {
 *        console.log('closed')
 *    }
 *
 */
class MeshNetwork {
  constructor() {
    this.cm = new discoveryClient.Mesh(
      this.handlePeer,
      [ { url: 'stun:stun.l.google.com:19302' } ]
    )
  }

  connect(host, room) {
    this.host = host
    this.room = room
    this.socket = this.cm.connect(this.host, this.room)
    return this.socket
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

  handlePeer(peer) {
    peer.on('connect', function () {
      MeshNetwork.instance.onConnect(peer)
    })
    peer.on('data', function (data) {
      var json = discoveryClient.parse(MeshNetwork.instance.socket, peer, data)
      MeshNetwork.instance.onData(json)
    })
    peer.on('error', function (error) {
      MeshNetwork.instance.onError(error)
    })
    peer.on('close', function () {
      MeshNetwork.instance.onClose()
    })
  }

  onConnect(peer) {
    console.log('Connected with cmKey ' + peer.cmKey)
  }

  onData(data) {
    console.log(`${data.from}: ${JSON.stringify(data)}`)
  }

  onError(error) {
    console.error(error)
  }

  onClose() {
  }
}

MeshNetwork.instance = new MeshNetwork()
