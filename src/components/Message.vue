// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
<template>
  <div>
    <select v-model="tag" options="tagOptions" v-on:change="update()">
      <option v-for="option in tagOptions" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
    <templete v-if="chat_view">
      <p v-bind:class="chatStyleClass">
        <span class="talk-icon">{{ name }}</span>
        <span class="talk-content" v-if="!edit" v-on:click="edit = true">{{ message }} ({{ time }})</span>
      </p>
    </templete>
    <templete v-else>
      &nbsp;&gt;&nbsp;
      <span v-if="!edit" v-on:click="edit = true">{{ name }} : {{ message }} ({{ time }}) </span>
    </templete>
    <div class="form-group" v-if="edit">
      <input type="text" v-focus class="form-control input-sm" v-model="message" v-on:blur="update()">
    </div>
  </div>
</template>

<script>
import { msUpdate } from './WsWrapper.js'
// メッセージタグ種別
const MSG_TAG = {
  none: 'none',
  actionItem: 'actionItem',
  decision: 'decision'
}
const focus = {
  inserted(el) {
    el.focus()
  }
}
export default {
  name: 'Message',
  directives: { focus },
  props: {
    my_name: {
      type: String,
      required: true
    },
    chat_view: {
      type: Boolean,
      default: true
    },
    key: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: MSG_TAG.none
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tagOptions: [
        { text: '-', value: MSG_TAG.none },
        { text: '決定事項', value: MSG_TAG.decision },
        { text: 'A.I', value: MSG_TAG.actionItem }
      ]
    }
  },
  computed: {
    chatStyleClass: function() {
      return {
        'chat-talk': this.chat_view,
        'mytalk': (this.name === this.my_name)
      }
    }
  },
  methods: {
    update() {
      this.edit = false
      msUpdate(this.key, this.name, this.message, this.tag)
    }
  }
}
</script>

<style scoped>
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
</style>
