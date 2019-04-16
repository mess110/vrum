let isMaster = true || MeshNetwork.isMaster()
let room = Utils.guid()

new QRCode("qrcode", { text: room, width: 128, height: 128 })
document.querySelector('#qrcode-text').innerHTML = room
document.querySelector('#client-link').href = `/workspace/games/controller/?room=${room}`

let mn = new MeshNetwork()
mn.setSignalingDebug(true)
let socket = mn.connect('https://mesh.opinie-publica.ro', room, { audio: false, video: false })

mn.onConnect = (peer) => {
  let element = document.createElement('div')
  element.setAttribute('id', `peer-${peer.cmKey}`)

  let elementKey = document.createElement('p')
  elementKey.innerHTML = peer.cmKey
  element.appendChild(elementKey)

  let elementAction = document.createElement('p')
  element.appendChild(elementAction)

  document.querySelector('#peers').appendChild(element)
}

mn.onData = (peer, data) => {
  element = document.querySelector(`#peer-${peer.cmKey}`)
  if (isBlank(element)) {
    console.error(`Could not find #peer-${peer.cmKey}`)
    return
  }

  element.children[1].innerHTML = JSON.stringify(data)
}

mn.onError = (peer, error) => {
  console.error(error)
}

mn.onClose = (peer) => {
  let row = document.querySelector(`#peer-${peer.cmKey}`)
  document.querySelector('#peers').removeChild(row)
}
