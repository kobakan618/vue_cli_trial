// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
<template>
  <section class="main" transition="main" v-cloak>
    <div class="container">
      <div class="card" v-for="list in filterItems">
        <div class="panel panel-default">
          <router-link :to="{ name: 'Meeting', params: { id: list.id }}">{{list.name}}</router-link>
        </div>
      </div>
    </div>
    <h2 class="no-result" v-show="!filterItems.length">
      <span>No results.</span><br />
      <span>\(^Д^)/</span>
    </h2>
  </section>
</template>

<script>
import imagesData from '../assets/list.json'
export default {
  data() {
    return {
      filterKey: '',
      lists: imagesData
    }
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

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 95%;
  margin: auto;
}

.container::before {
  display: block;
  content: "";
  order: 1;
  width: 22.75%;
}

container::after {
  display: block;
  content: "";
  width: 22.75%;
}
</style>
