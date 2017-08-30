// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
<template>
  <section class="main">
    <div class="container-fluid">
      <div align="left">
        <input v-model="createMeetingName" placeholder="会議名を入力してください">
        <button @click="createMeeting"> 会議作成</button>
      </div>
      <br>
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title">会議一覧</h3>
        </div>
        <div class="panel-body">
          <div class="card" v-for="list in filterItems">
            <div class="panel panel-default">
              <router-link :to="{ name: 'Meeting', params: { id: list.id }}">{{list.name}}</router-link>
            </div>
          </div>
          <h4 class="no-result" v-show="!filterItems.length">
            <span>参加可能な会議はありません</span><br />
            <span>会議を作成して下さい</span>
          </h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import MeetingList from '../assets/dummyMeetingList.json'
// Ajax通信ライブラリ
import axios from 'axios'
export default {
  data() {
    return {
      createMeetingName: '',
      filterKey: '',
      lists: MeetingList
    }
  },
  mounted() {
    this.getMeetingList()
  },
  computed: {
    filterItems: function() {
      return this.lists.filter((item) => {
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
        .then(response => { this.lists = response.data.results })
        .catch(function(error) { console.log(error) })
    },
    createMeeting() {
      axios.post('/meeting', { name: this.createMeetingName, promoter: 'test' })
        .then(response => {
          console.log(response)
          this.getMeetingList()
        })
        .catch(error => { console.log(error) })
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
  padding-top: 70px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}
</style>
