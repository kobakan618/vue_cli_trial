// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
var ws = null
/**
 * WebSocket接続関数
 */
export var wsOpen = function (wsname, usrname, onopen, onmessage, onclose) {
  if (ws == null) {
    var hostname = window.location.hostname
    var port = window.location.port
    var protocol = window.location.protocol
    var wsprotocol = 'ws://'
    if (protocol === 'https:') {
      wsprotocol = 'wss://'
    }
    ws = new WebSocket(wsprotocol + hostname + ':' + port + '/' + wsname + '?username=' + usrname)

    ws.onopen = function () {
      onopen()
    }
    ws.onmessage = function (evt) {
      onmessage(evt)
    }
    ws.onclose = function (evt) {
      onclose()
      ws = null
      console.log('connection closed')
    }
  }
  else {
    console.log('websocket already opened ..')
  }
}
/**
* WebSocket切断関数
*/
export function wsClose (name) {
  if (ws != null) {
    ws.close()
  }
  else {
    console.log('websocket already closed ..')
  }
};
/**
* WebSocket送信関数
*/
export var msSend = function (name, message) {
  if (ws != null) {
    // メッセージをjson形式に変更
    ws.send(JSON.stringify({ 'messages': [{ 'name': name, 'message': message, 'tag': 'none' }] }))
  }
  else {
    console.log('websocket not opened !!')
  }
}
export var msUpdate = function (id, name, message, tag) {
  if (ws != null) {
    // メッセージをjson形式に変更
    ws.send(JSON.stringify({ 'messages': [{ 'id': id, 'name': name, 'message': message, 'tag': tag }] }))
  }
  else {
    console.log('websocket not opened !!')
  }
}
