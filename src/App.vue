<template>
  <div style="background: rgb(255, 255, 255);
      height: 900px;
      margin: 30px;
      padding: 30px;">
    <VueJsonEditor :on-change="getJson"></VueJsonEditor>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import VueJsonEditor from "./components/VueJsonEditor/index.jsx"
  export default defineComponent({
    name: 'App',
    components: {
      VueJsonEditor
    },
    methods: {
      getJson(json) {
        console.log('change: ' + json)
      }
    },
  })

</script>

<style>

</style>