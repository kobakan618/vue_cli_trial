// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
<template>
  <section class="main">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-3">
          <div class="panel panel-danger">
            <div class="panel-heading">
              <h3 class="panel-title">会議ID:{{ $route.params.id }}</h3>
            </div>
          </div>
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">目的</h3>
            </div>
            <div class="panel-body">
              <textarea v-model="purpose" class="form-control input-sm" placeholder="会議の目的を入力(Tabで確定)" rows="2" v-on:blur="purposeUpdate()"></textarea>
            </div>
          </div>
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">参加者</h3>
            </div>
            <div class="panel-body">
              <div id="attendeesView">
                <ul v-for="attendee in attendees">
                  <span v-bind:data-badge-top-right="attendee.commentNum">{{attendee.name}}</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-9">
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">ディスカッションエリア (チャット風表示
                <input type="checkbox" v-model="chat_view">)
              </h3>
            </div>
            <div class="panel-body">
              <!--音声認識子コンポーネント描画
                                                                                                                                -->
              <voiceRecognition></voiceRecognition>
              <br>
              <div class="chat-timeline">
                <!--メッセージ子コンポーネント描画-->
                <message v-for="chat in chatLogs" :my_name="my_name" :chat_view="chat_view" :key="chat.id" :time="chat.time" :name="chat.name" :message="chat.message" :tag="chat.tag">
                </message>
              </div>
              <textarea v-model="input_message" class="form-control input-sm" placeholder="発言・議事メモ等の手動入力(Enterで確定)" rows="2" v-on:keyup.enter="send_message()"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Message from './Message.vue'
import VoiceRecognition from './VoiceRecognition.vue'
import WsWrapper from '../commonUtils/WsWrapper.js'
import PropertyStore from '../commonUtils/PropertyStore.js'
export default {
  name: 'Meething',
  components: {
    message: Message,
    voiceRecognition: VoiceRecognition
  },
  data() {
    return {
      meetingName: '',
      myName: '',
      chat_view: true,
      input_message: '',
      chatLogs: [],
      purpose: '',
      attendees: []
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
      this.meetingName = this.$route.params.id
      this.my_name = PropertyStore.userInfo.name
      this.chatLogs = []
      this.attendees = []
      this.purpose = ''
      WsWrapper.wsOpen(this.meetingName, this.my_name, this.post_ws_onopen, this.post_ws_onmessage, this.post_ws_onclose)
    },
    stop() {
      WsWrapper.wsClose(this.my_name)
    },
    send_message() {
      if (this.input_message.length > 1) {
        WsWrapper.msSend(this.my_name, this.input_message)
      }
      this.input_message = ''
    },
    purposeUpdate() {
      WsWrapper.purposeUpdate(this.purpose)
    },
    post_ws_onopen() {
      // 何もしない
    },
    post_ws_onmessage(evt) {
      var receiveMsg = eval('(' + evt.data + ')')
      // 参加者更新通知
      if (receiveMsg.attendees != null) {
        console.log('参加者更新')
        this.attendees = []
        receiveMsg.attendees.clientsData.forEach(function(element) {
          if (element.isAlive) {
            this.attendees.push({ name: element.name, commentNum: element.messageCounter })
          }
        })
      }
      // 目的更新通知
      if (receiveMsg.purpose != null) {
        console.log('目的更新')
        this.purpose = receiveMsg.purpose
      }
      // メッセージ更新通知
      if (receiveMsg.messages != null) {
        console.log('メッセージ更新')
        receiveMsg.messages.forEach(function(element) {
          // メッセージ編集の場合はメッセージ内容変更して終了
          for (var i = 0; i < this.chatLogs.length; ++i) {
            if (this.chatLogs[i].id === element.id) {
              this.chatLogs[i].message = element.message
              this.chatLogs[i].tag = element.tag
              return
            }
          }
          // 新規メッセージ追加
          this.chatLogs.push({
            id: element.id,
            time: element.when.split('T')[1].split('.')[0],
            name: element.name,
            message: element.message,
            tag: element.tag
          })
        }, this)
        this.scrollDown()
      }
    },
    post_ws_onclose() {
      // 何もしない
    },
    scrollDown() {
      const target = this.$el.querySelector('.chat-timeline')
      setTimeout(() => {
        const height = target.scrollHeight - target.offsetHeight
        target.scrollTop += 10
        if (height > target.scrollTop) {
          this.scrollDown()
        }
      }, 0)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  position: absolute;
  padding-top: 60px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}

.chat-timeline {
  height: 300px;
  overflow-y: scroll;
  overflow-x: visible;
  border: solid #008080;
  background-color: #D8F3F0;
}

span[data-badge-top-left],
span[data-badge-top-right],
span[data-badge-bottom-left],
span[data-badge-bottom-right] {
  display: block;
  position: relative;
  padding: 1em;
  background-color: black;
  border-radius: 6px;
  color: #fff;
}

span[data-badge-top-left]:before,
span[data-badge-top-right]:before,
span[data-badge-bottom-left]:before,
span[data-badge-bottom-right]:before {
  position: absolute;
  display: inline-block;
  font-weight: bold;
  background-color: red;
  border-radius: 50%;
  font-size: 1em;
  line-height: 1;
  min-width: 1em;
  padding: 5px;
  border: 2px solid #fff;
  box-shadow: 0px 0px 3px #999;
}

span[data-badge-top-left]:before {
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  content: attr(data-badge-top-left)"";
}

span[data-badge-top-right]:before {
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  content: attr(data-badge-top-right)"";
}

span[data-badge-bottom-left]:before {
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);
  content: attr(data-badge-bottom-left)"";
}

span[data-badge-bottom-right]:before {
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%);
  content: attr(data-badge-bottom-right)"";
}

.panel-heading {
  height: 20px;
  padding: 0;
}

.container-fluid {
  background-color: #f0f0f0;
}
</style>
