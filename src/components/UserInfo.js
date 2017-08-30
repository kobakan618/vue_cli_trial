// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
var name = 'test'

/**
 * ユーザ情報設定
 */
export var setUserInfo = function (usrName) {
  name = usrName
}
/**
 * ユーザ情報取得
 */
export var getUserInfo = function () {
  return name
}
/**
 * ユーザ情報初期化
 */
export var initUserInfo = function () {
  name = ''
}
