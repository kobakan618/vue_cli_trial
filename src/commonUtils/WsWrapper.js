// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
var WsWrapper = {
  ws: null,
  wsOpen(wsname, usrname, onopen, onmessage, onclose) {
    if (this.ws == null) {
      var hostname = window.location.hostname
      var port = window.location.port
      var protocol = window.location.protocol
      var wsprotocol = 'ws://'
      if (protocol === 'https:') {
        wsprotocol = 'wss://'
      }
      this.ws = new WebSocket(wsprotocol + hostname + ':' + port + '/ws/' + wsname + '?username=' + usrname)

      this.ws.onopen = function () {
        onopen()
      }
      this.ws.onmessage = function (evt) {
        onmessage(evt)
      }
      this.ws.onclose = function (evt) {
        onclose()
        this.ws = null
        console.log('connection closed')
      }
    }
    else {
      console.log('websocket already opened ..')
    }
  },
  wsClose() {
    if (this.ws != null) {
      this.ws.close()
    }
    else {
      console.log('websocket already closed ..')
    }
  },

  purposeUpdate(purpose) {
    if (this.ws != null) {
      this.ws.send(JSON.stringify({ 'purpose': purpose }))
    }
    else {
      console.log('websocket not opened !!')
    }
  },

  msSend(name, message) {
    if (this.ws != null) {
      // メッセージをjson形式に変更
      this.ws.send(JSON.stringify({ 'messages': [{ 'name': name, 'message': message, 'tag': 'none' }] }))
    }
    else {
      console.log('websocket not opened !!')
    }
  },
  msUpdate(id, name, message, tag) {
    if (this.ws != null) {
      // メッセージをjson形式に変更
      this.ws.send(JSON.stringify({ 'messages': [{ 'id': id, 'name': name, 'message': message, 'tag': tag }] }))
    }
    else {
      console.log('websocket not opened !!')
    }
  }
}
export default WsWrapper


