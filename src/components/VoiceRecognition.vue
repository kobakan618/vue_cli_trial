// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
<template>
  <div>
    <select class="form-control input-sm" v-model="selected_lang" options="langOptions" v-on:change="reset()">
      <option v-for="option in langOptions" :key="option.key" :value="option.value">
        {{ option.text }}
      </option>
    </select>
    <p class="text-center" v-bind:class="statusClass">{{status}}</p>
    <textarea readonly contenteditable="false" class="form-control input-sm" v-model="voiceText" placeholder="自分の音声認識結果が表示されます" rows="1"></textarea>
  </div>
</template>

<script>
import WsWrapper from '../commonUtils/WsWrapper.js'
import PropertyStore from '../commonUtils/PropertyStore.js'
import Vue from 'vue'
import VueSweetAlert from 'vue-sweetalert'
Vue.use(VueSweetAlert)
/**
 * 音声認識ステータス定義
 */
const VR_STATUS = {
  stopped: '停止中',
  waiting: '入力待ち',
  recognizing: '認識中',
  not_support_error: '未サポート',
  mic_error: 'マイクエラー',
  other_error: 'エラー'
}
export default {
  name: 'VoiceRecognition',
  data() {
    return {
      my_name: '',
      status: VR_STATUS.stopped,
      selected_lang: '',
      langOptions: [
        { key: 1, text: '音声認識-利用しない', value: '' },
        { key: 2, text: '音声認識-日本語', value: 'ja-JP' },
        { key: 3, text: '音声認識-英語', value: 'en-US' }
      ],
      voiceText: '',
      recognitionObj: null,
      resetTimer: 0
    }
  },
  computed: {
    isActive: function() {
      return (this.selected_lang !== '') && (this.my_name !== '')
    },
    statusClass: function() {
      return {
        'vr-disable': (this.status === VR_STATUS.stopped),
        'vr-active': (this.status === VR_STATUS.waiting) || (this.status === VR_STATUS.recognizing),
        'vr-error': (this.status === VR_STATUS.not_support_error) || (this.status === VR_STATUS.mic_error) || (this.status === VR_STATUS.other_error)
      }
    }
  },
  mounted() {
    this.start()
  },
  beforeRouteUpdate(to, from, next) {
    this.stop()
    this.start()
    next()
  },
  beforeRouteLeave(to, from, next) {
    this.stop()
    next()
  },
  methods: {
    start() {
      this.my_name = PropertyStore.getUserName()
      if (!this.isActive) {
        return
      }
      var self = this
      if (!('webkitSpeechRecognition' in window)) {
        this.status = VR_STATUS.not_support_error
        this.$swal('Oops...', 'Chrome以外のブラウザは音声認識機能は使えません\nテキスト入力のみ利用できます', 'error')
        return
      }
      console.log(this.selected_lang)
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (this.recognitionObj == null) {
        this.recognitionObj = new window.webkitSpeechRecognition()
      }
      this.recognitionObj.lang = this.selected_lang
      this.recognitionObj.interimResults = true
      this.recognitionObj.continuous = true
      this.recognitionObj.onsoundstart = function() {
        console.log('soundstart')
        self.status = VR_STATUS.waiting
        // 10秒間無声期間が続いた場合のリセットタイマーを張る(フリーズ防止)
        self.resetTimer = setTimeout(function() {
          self.recognitionObj.stop()
        }, 10000)
      }
      this.recognitionObj.onsoundend = function() {
        console.log('soundend')
        clearTimeout(self.resetTimer)
      }
      this.recognitionObj.onnomatch = function() {
        console.log('nomatch')
      }
      this.recognitionObj.onerror = function(event) {
        console.log('error' + event.error)
        switch (event.error) {
          case 'no-speech':
            self.status = VR_STATUS.waiting
            break
          case 'not-allowed':
            self.status = VR_STATUS.mic_error
            break
          default:
            self.status = VR_STATUS.other_error
            break
        }
        self.recognitionObj.stop()
      }
      this.recognitionObj.onend = function() {
        console.log('end')
        clearTimeout(self.resetTimer)
        if (self.isActive) {
          self.recognitionObj.start()
        }
        else {
          self.status = VR_STATUS.stopped
        }
      }
      this.recognitionObj.onresult = function(event) {
        var results = event.results
        let speechStr = ''
        clearTimeout(self.resetTimer)
        console.log('result')
        for (var i = event.resultIndex; i < results.length; i++) {
          if (results[i].isFinal) {
            speechStr = results[i][0].transcript
            self.voiceText = speechStr
            WsWrapper.msSend(self.my_name, speechStr)
            self.status = VR_STATUS.waiting
          }
          else {
            speechStr = '[途中経過] ' + results[i][0].transcript
            self.voiceText = speechStr
            self.status = VR_STATUS.recognizing
          }
        }
        if (self.status === VR_STATUS.waiting) {
          // 10秒間無声期間が続いた場合のリセットタイマーを張る(フリーズ防止)
          self.resetTimer = setTimeout(function() {
            self.recognitionObj.stop()
          }, 10000)
        }
        else {
          // 2秒の間が空いた場合に認識結果を確定させるためのタイマーを張る(遅延防止)
          self.resetTimer = setTimeout(function() {
            self.recognitionObj.stop()
          }, 2000)
        }
      }
      this.staus = VR_STATUS.waiting
      this.recognitionObj.start()
    },
    stop() {
      if (this.recognitionObj != null) {
        this.recognitionObj.stop()
      }
      this.my_name = ''
      this.status = VR_STATUS.stopped
    },
    reset() {
      var tmp = this.my_name
      this.stop()
      this.start(tmp)
    }
  }
}
</script>
<style>
.vr-disable {
  width: auto;
  color: white;
  background-color: black;
}

.vr-active {
  width: auto;
  color: white;
  background-color: blue;
}

.vr-error {
  width: auto;
  color: white;
  background-color: red;
}
</style>
