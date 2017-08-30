// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
<template>
  <div id="app">
    <!--ナビゲーションバー-->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">
            UMAYADORY
          </a>
        </div>
        <ul class="nav pull-right">
          <template v-if="userName === ''">
            <button type="button" class="btn btn-default navbar-btn" v-on:click="logout">Login</button>
          </template>
          <template v-else>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                {{userName}}
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu dropdown-menu-right">
                <li>
                  <a @click="logout">Logout</a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </nav>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getUserInfo, initUserInfo } from './components/UserInfo.js'
export default {
  name: 'app',
  data() {
    return {
      userName: getUserInfo()
    }
  },
  mounted() {

  },
  methods: {
    logout() {
      // ログアウトAPIを呼び出す
      initUserInfo()
      this.userName = getUserInfo()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
