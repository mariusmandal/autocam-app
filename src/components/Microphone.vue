<template>
  <div align="center">
    <Camera :id="mic.id" :active="false" />
    <v-icon style="font-size: 3em" :class="{ active: mic.active }"
      >mdi-microphone</v-icon>
    <p>{{ mic.name }}</p>
  </div>
</template>

<script>

import Camera from './Camera';

export default {
  components: {
    Camera
  },
  props: {
    mic: Object,
  },
  data: function () {
    return {};
  },
  methods: {
    toggleActive: function () {
      console.log("ToggleMic", this);
      console.log(this.active);
      this.active = !this.active;
      console.log(this.active);
    },
    getState: function () {
      var state = "N/A atm";
      console.log("This is my state atm", state);
      return state;
    },
  },
};
</script>

<style scoped>
.v-icon.active {
  /*color: #ff0000 !important;*/
}
</style>