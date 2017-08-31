// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
<template>
  <section class="main">
    <div class="container-fluid">
      <form align="left" class="form-inline">
        <input class="form-control" v-model="createMeetingName" placeholder="会議名を入力してください">
        <button class="btn btn-primary" v-on:click="createMeeting"> 会議作成</button>
      </form>
      <br>
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title">会議一覧</h3>
        </div>
        <div class="panel-body">
          <ul class="list-group">
            <div class="card" v-for="list in filterItems">
              <li class="list-group-item">
                ID:{{list.id}}&emsp;会議名:{{list.name}}&emsp;作成者:{{list.promoter}}&emsp;作成日:{{list.when.split(".")[0] }}&emsp;
                <br>
                <button type="button" class="btn btn-info btn-xs" @click="joinMeeting(list.id)">Join</button>
                <button type="button" class="btn btn-danger btn-xs" @click="deleteMeeting(list.id)">Delete</button>
              </li>
            </div>
          </ul>
          <h4 class="no-result" v-show="!filterItems.length">
            <span>参加可能な会議はありません</span><br />
            <span>会議を作成して下さい</span>
          </h4>
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import MeetingList from '../assets/dummyMeetingList.json'
import axios from 'axios' // Ajax通信ライブラリ
import VueSweetAlert from 'vue-sweetalert'
Vue.use(VueSweetAlert)

export default {
  name: 'Home',
  data() {
    return {
      createMeetingName: '',
      filterKey: '',
      meetingList: MeetingList
    }
  },
  mounted() {
    this.getMeetingList()
  },
  computed: {
    filterItems: function() {
      return this.meetingList.filter((item) => {
        const searchRegex = new RegExp(this.filterKey, 'i')
        return (
          searchRegex.test(item.id)
        )
      })
    }
  },
  methods: {
    getMeetingList() {
      axios.get('/meetingList')
        .then(response => { this.meetingList = response.data.results })
        .catch(function(error) { console.log(error) })
    },
    createMeeting() {
      if (this.createMeetingName === '') {
        alert('test')
      }
      else {
        axios.post('/meeting', { name: this.createMeetingName, promoter: 'test' })
          .then(response => {
            console.log(response)
            this.getMeetingList()
          })
          .catch(error => { console.log(error) })
      }
    },
    joinMeeting(id) {
      this.$router.push('meetings/' + id)
    },
    deleteMeeting(id) {
      console.log('delete Meeting (Dummy)')
      this.getMeetingList()
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
</style>
