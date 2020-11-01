<template>
  <div align="center">
    <v-icon style="font-size: 3em;" class="test" :class="{active}" @click="toggleActive"
      >mdi-{{ active ? 'microphone' : 'microphone-off' }}</v-icon>
    <p>{{ mic.name }}</p>
  </div>
</template>

<script>
export default {
  props: {
    mic: Object
  },
  data: function () {
    return {
      active: true,
    };
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