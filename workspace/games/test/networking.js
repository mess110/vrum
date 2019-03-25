let isMaster = true || MeshNetwork.isMaster()
let room = Utils.guid()

new QRCode("qrcode", { text: room, width: 128, height: 128 })
document.querySelector('#qrcode-text').innerHTML = room
document.querySelector('#client-link').href = `/workspace/games/controller/?room=${room}`

let mn = MeshNetwork.instance
let socket = mn.connect('https://mesh.opinie-publica.ro', room, { audio: false, video: false })

mn.onData = function (peer, data) {
  element = document.querySelector(`#peer-${peer.cmKey}`)
  if (isBlank(element)) {
    console.error(`Could not find #peer-${peer.cmKey}`)
    return
  }

  if (data.action === 'stick') {
    var stickStatus = `${data.dX}:${data.dY} - ${data.isPressed} ${data.direction}`
    element.children[1].innerHTML = stickStatus
  }
  if (data.action === 'fire') {
    var fireStatus = `fire! ${data.isPressed}`
    element.children[3].innerHTML = fireStatus
  }
}

setInterval(function () {
  let content = ''
  let peers = MeshNetwork.instance.getPeers()
  peers.forEach(function (peer) {
    content += `<p id="peer-${peer.cmKey}">${peer.cmKey}<br /><span></span><br /><span></span></p>`
  })
  document.querySelector('#peers').innerHTML = content
}, 1000)
