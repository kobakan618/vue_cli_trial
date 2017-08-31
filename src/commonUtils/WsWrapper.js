// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
var WsWrapper = {
  ws: null,
  wsOpen(wsname, usrname, onopen, onmessage, onclose) {
    if (self.ws == null) {
      var hostname = window.location.hostname
      var port = window.location.port
      var protocol = window.location.protocol
      var wsprotocol = 'ws://'
      if (protocol === 'https:') {
        wsprotocol = 'wss://'
      }
      self.ws = new WebSocket(wsprotocol + hostname + ':' + port + '/ws/' + wsname + '?username=' + usrname)

      self.ws.onopen = function () {
        onopen()
      }
      self.ws.onmessage = function (evt) {
        onmessage(evt)
      }
      self.ws.onclose = function (evt) {
        onclose()
        self.ws = null
        console.log('connection closed')
      }
    }
    else {
      console.log('websocket already opened ..')
    }
  },
  wsClose() {
    if (self.ws != null) {
      self.ws.close()
    }
    else {
      console.log('websocket already closed ..')
    }
  },

  purposeUpdate(purpose) {
    if (self.ws != null) {
      self.ws.send(JSON.stringify({ 'purpose': purpose }))
    }
    else {
      console.log('websocket not opened !!')
    }
  },

  msSend(name, message) {
    if (self.ws != null) {
      // メッセージをjson形式に変更
      self.ws.send(JSON.stringify({ 'messages': [{ 'name': name, 'message': message, 'tag': 'none' }] }))
    }
    else {
      console.log('websocket not opened !!')
    }
  },
  msUpdate(id, name, message, tag) {
    if (self.ws != null) {
      // メッセージをjson形式に変更
      self.ws.send(JSON.stringify({ 'messages': [{ 'id': id, 'name': name, 'message': message, 'tag': tag }] }))
    }
    else {
      console.log('websocket not opened !!')
    }
  }
}
export default WsWrapper


