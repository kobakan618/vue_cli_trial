<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-4">
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">目的</h3>
            </div>
            <div class="panel-body">
              <div id="purposeView">
                <textarea v-model="purpose" class="form-control" placeholder="会議の目的を入力(Tabで確定)" rows="2" v-on:blur="update()"></textarea>
              </div>
            </div>
          </div>
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">決定事項</h3>
            </div>
            <div class="panel-body">
            </div>
          </div>
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">アクションアイテム</h3>
            </div>
            <div class="panel-body">
            </div>
          </div>
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">参加者</h3>
            </div>
            <div class="panel-body">
              <!--参加者表示コンポーネント-->
              <div id="attendeesView">
                <ul v-for="attendee in attendeesList">
                  <span v-bind:data-badge-top-right="attendee.commentNum">{{attendee.name}}</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-8">
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">ディスカッションエリア</h3>
            </div>
            <div class="panel-body">
              <!--音声認識コンポーネント-->
              <div id="voiceRecognition">
                音声認識利用設定
                <select class="form-control" v-model="selected_lang" options="langOptions" v-on:change="reset()">
                  <option v-for="option in langOptions" v-bind:value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                <p class="text-center" v-model="status" v-bind:class="statusClass">{{status}}</p>
                <textarea readonly contenteditable="false" class="form-control" v-model="voiceText" placeholder="自分の音声認識結果が表示されます" rows="2"></textarea>
              </div>
              <br>
              <!--チャットコンポーネント-->
              <div id="chatApp">
                チャット風表示
                <input type="checkbox" v-model="chat_view"> </input>
                <div class="chat-timeline">
                  <message v-for="chat in chatLogs" :my_name="my_name" :chat_view="chat_view" :id="chat.id" :time="chat.time" :name="chat.name" :message="chat.message" :tag="chat.tag">
                  </message>
                </div>
                <textarea v-model="input_message" class="form-control" placeholder="発言・議事メモ等の手動入力(Enterで確定)" rows="2" v-on:keyup.enter="send_message()"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*以下、①背景色など*/

.attendee-list {
  height: 20px;
  border: solid #008080;
  background-color: #D8F3F0;
}

.chat-timeline {
  height: 400px;
  overflow-y: scroll;
  overflow-x: visible;
  border: solid #008080;
  background-color: #D8F3F0;
}

.chat-talk {
  overflow: hidden;
  margin: 0 0 1em 0;
  padding: 0;
}

.chat-talk span {
  display: block;
  margin: 0;
  padding: 0;
}

.chat-talk .talk-icon {
  float: left;
  width: 50px;
  text-align: center;
}

.chat-talk .talk-content {
  position: relative;
  box-sizing: border-box;
  width: auto;
  min-height: 30px;
  border-radius: 10px;
  background-color: #fff;
  margin: 0 auto 0 70px;
  padding: 1em;
}

.chat-talk .talk-icon img {
  max-width: 100%;
  height: auto;
  vertical-align: bottom;
  border: 2px solid #fff;
  border-radius: 50%;
}

.chat-talk .talk-content:before {
  position: absolute;
  top: 15px;
  left: -20px;
  display: block;
  width: 0;
  height: 0;
  content: '';
  border: 10px solid transparent;
  border-right-color: #fff;
}

.chat-talk.mytalk .talk-icon {
  float: right;
  width: 50px;
  text-align: center;
}

.chat-talk.mytalk .talk-content {
  margin: 0 70px 0 auto;
  color: #000;
  background: #30e852;
}

.chat-talk.mytalk .talk-content:before {
  right: -20px;
  left: auto;
  border-color: transparent;
  border-left-color: #30e852;
}












































































































































/* ブロック要素にアイコンバッジを表示 */

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












































































































































/* アイコン部 */

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
