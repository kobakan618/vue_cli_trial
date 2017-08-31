// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
<template>
  <div class="main">
    <div class="middlePage">
      <div class="page-header">
        <h1 class="logo">Umayado
          <small>Welcome to our place!</small>
        </h1>
      </div>

      <div class="panel panel-info">
        <div class="panel-heading">
          <h3 class="panel-title">Please Sign In</h3>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-xs-6">
              <a href="/auth/login/slack"><img src="../assets/sign_in_with_slack.png" /></a>
            </div>
            <div class="col-xs-6" style="border-left:1px solid #ccc;height:130px">
              <h2 class="panel-title">For Guest User</h2> <br>
              <fieldset>
                <input class="form-control" v-model="guestName" placeholder="名前を入力してください">
                <button class="btn btn-primary" v-on:click="loginAsGuest">Enter</button>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <p>
        <a href="https://github.com/ricohsimfp/zetakc-umayado">About</a> Umayado
      </p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios' // Ajax通信ライブラリ
import VueSweetAlert from 'vue-sweetalert'
import PropertyStore from '../commonUtils/PropertyStore.js'
import Bus from '../commonUtils/Bus.js'
Vue.use(VueSweetAlert)

export default {
  name: 'Login',
  data() {
    return {
      guestName: ''
    }
  },
  methods: {
    loginAsGuest() {
      axios.get('/guest')
        .then(response => { console.log(response) })
        .catch(error => { console.log(error) })
      PropertyStore.setUserName(this.guestName)
      Bus.$emit('login-success', 'Login.vue')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.about:hover {
  text-decoration: none;
}

.main {
  position: absolute;
  padding-top: 60px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}

.middlePage {
  width: 680px;
  height: 500px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.logo {
  color: darkblue;
}
</style>
