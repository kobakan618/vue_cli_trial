// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
var PropertyStore = {
  setUserName(name) {
    localStorage.setItem('userName', name)
  },
  getUserName() {
    var txt = localStorage.getItem('userName')
    if (txt === null) {
      txt = ''
    }
    return txt
  },
  deleteUserName() {
    localStorage.removeItem(localStorage.userName)
  }
}
export default PropertyStore
