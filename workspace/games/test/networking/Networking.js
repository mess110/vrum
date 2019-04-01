let isMaster = true || MeshNetwork.isMaster()
let room = Utils.guid()

new QRCode("qrcode", { text: room, width: 128, height: 128 })
document.querySelector('#qrcode-text').innerHTML = room
document.querySelector('#client-link').href = `/workspace/games/controller/?room=${room}`

discoveryClient.Mesh.DEBUG = true
let mn = new MeshNetwork()
let socket = mn.connect('https://mesh.opinie-publica.ro', room, { audio: false, video: false })

mn.onConnect = (peer) => {
  let element = document.createElement('p')
  element.setAttribute('id', `peer-${peer.cmKey}`)
  element.innerHTML = peer.cmKey
  element.appendChild(document.createElement('br'))
  element.appendChild(document.createElement('span'))
  element.appendChild(document.createElement('br'))
  element.appendChild(document.createElement('span'))

  document.querySelector('#peers').appendChild(element)
}

mn.onData = (peer, data) => {
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

mn.onError = (peer, error) => {
  console.error(error)
}

mn.onClose = (peer) => {
  let row = document.querySelector(`#peer-${peer.cmKey}`)
  document.querySelector('#peers').removeChild(row)
}
